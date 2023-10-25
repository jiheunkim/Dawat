import { useContext, useEffect, useState } from "react";
import { InferenceSession, Tensor } from "onnxruntime-web";
import { handleImageScale } from "./helpers/scaleHelper";
import { modelScaleProps } from "./helpers/Interfaces";
import { onnxMaskToImage } from "./helpers/maskUtils";

import { modelData } from "./helpers/onnxModelAPI";

import AppContext from "./hooks/createContext";

/* @ts-ignore */
import npyjs from "npyjs";
/* @ts-ignore */
import Annotator from "./components/Annotator";
const ort = require("onnxruntime-web");

// Define image, embedding and model paths
export const IMAGE_PATH = "/assets/data/dogs.jpg";
const IMAGE_EMBEDDING = "/assets/data/dogs_embedding.npy";
const MODEL_DIR = "./model/sam_onnx_quantized_example.onnx";

const loadSavedInput = () => {
  try {
    return JSON.parse(window.localStorage.getItem("customInput") || "{}");
  } catch (e) {
    return {};
  }
};

export const examples = {
  "Simple Bounding Box": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    // regionTagList: [],
    // regionClsList: ["hotdog"],
    regionTagList: ["has-bun"],
    regionClsList: ["hotdog", "not-hotdog"],
    enabledTools: ["select", "create-box"],
    // showTags: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1496905583330-eb54c7e5915a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        name: "hot-dogs-1",
      },
      {
        src: "https://www.bianchi.com/wp-content/uploads/2019/07/YPB17I555K.jpg",
        name: "bianchi-oltre-xr4",
      },
    ],
    allowComments: true,
  }),
  "Simple Segmentation": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    regionClsList: ["car", "truck"],
    enabledTools: ["select", "create-polygon"],
    images: [
      {
        src: "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        name: "car-image-1",
      },
    ],
  }),
  Custom: () => {
    return loadSavedInput();
  },
};

function Home() {
  const {
    clicks: [clicks],
    image: [, setImage],
    maskImg: [, setMaskImg],
  } = useContext(AppContext)!;
  const [model, setModel] = useState<InferenceSession | null>(null); // ONNX model
  const [tensor, setTensor] = useState<Tensor | null>(null); // Image embedding tensor

  // The ONNX model expects the input to be rescaled to 1024.
  // The modelScale state variable keeps track of the scale values.
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);

  // Initialize the ONNX model. load the image, and load the SAM
  // pre-computed image embedding
  useEffect(() => {
    // Initialize the ONNX model
    const initModel = async () => {
      try {
        if (MODEL_DIR === undefined) return;
        const URL: string = MODEL_DIR;
        const model = await InferenceSession.create(URL);
        setModel(model);
      } catch (e) {
        console.log(e);
      }
    };
    initModel();

    // Load the image
    const url = new URL(IMAGE_PATH, window.location.origin);
    loadImage(url);

    // Load the Segment Anything pre-computed embedding
    Promise.resolve(loadNpyTensor(IMAGE_EMBEDDING, "float32")).then(
      (embedding) => setTensor(embedding)
    );
  }, []);

  const loadImage = async (url: URL) => {
    try {
      const img = new Image();
      img.src = url.href;
      img.onload = () => {
        const { height, width, samScale } = handleImageScale(img);
        setModelScale({
          height: height, // original image height
          width: width, // original image width
          samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        });
        img.width = width;
        img.height = height;
        setImage(img);
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Decode a Numpy file into a tensor.
  const loadNpyTensor = async (tensorFile: string, dType: string) => {
    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };

  // Run the ONNX model every time clicks has changed
  useEffect(() => {
    runONNX();
  }, [clicks]);

  const runONNX = async () => {
    try {
      if (
        model === null ||
        clicks === null ||
        tensor === null ||
        modelScale === null
      )
        return;
      else {
        // Preapre the model input in the correct format for SAM.
        // The modelData function is from onnxModelAPI.tsx.
        const feeds = modelData({
          clicks,
          tensor,
          modelScale,
        });
        if (feeds === undefined) return;
        // Run the SAM ONNX model with the feeds returned from modelData()
        const results = await model.run(feeds);
        const output = results[model.outputNames[0]];
        // The predicted mask returned from the ONNX model is an array which is
        // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
        setMaskImg(
          onnxMaskToImage(output.data, output.dims[2], output.dims[3])
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [annotatorOpen, changeAnnotatorOpen] = useState(true);
  const [annotatorProps, changeAnnotatorProps] = useState(
    examples["Simple Bounding Box"]
  );
  const [lastOutput, changeLastOutput] = useState();

  return (
    <>
      {/* @ts-ignore */}
      <Annotator
        onExit={(output: any) => {
          delete output["lastAction"];
          changeLastOutput(output);
          changeAnnotatorOpen(false);
        }}
        {...annotatorProps}
      />
    </>
  );
}

export default Home;
