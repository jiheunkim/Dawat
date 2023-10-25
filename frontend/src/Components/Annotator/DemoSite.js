//
import React, { useState } from "react";
import Annotator from "../components/Annotator";

const loadSavedInput = () => {
  try {
    return JSON.parse(window.localStorage.getItem("customInput") || "{}");
  } catch (e) {
    return {};
  }
};

const examples = {
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

const DemoSite = () => {
  const [annotatorProps, changeAnnotatorProps] = useState(
    examples["Simple Bounding Box"]()
  );
  const [lastOutput, changeLastOutput] = useState();

  return (
    <Annotator
      {...annotatorProps}
      onExit={(output) => {
        delete output["lastAction"];
        changeLastOutput(output);
      }}
    />
  );
};

export default DemoSite;
