import { Image, Layer } from "react-konva";
import { useRecoilState } from "recoil";
import { imageSizeState, scaleState, sizeSate } from "../atoms";
import { useContext, useEffect } from "react";
import AppContext from "../hooks/createContext";
import { modelInputProps } from "../helpers/Interfaces";
import * as _ from "underscore";

function BaseImage() {
  const [size, setSize] = useRecoilState(sizeSate);
  const [imageSize, setImageSize] = useRecoilState(imageSizeState);
  const [scale, setScale] = useRecoilState(scaleState);

  const {
    maskImg: [maskImg, setMaskImg],
    clicks: [, setClicks],
    image: [image],
  } = useContext(AppContext)!;

  const getClick = (x: number, y: number): modelInputProps => {
    const clickType = 1;
    return { x, y, clickType };
  };

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.evt;
    let x = el.offsetX;
    let y = el.offsetY;
    const click = getClick(x, y);
    if (click) setClicks([click]);
  }, 10);

  useEffect(() => {
    if (!image) {
      return;
    }
    setImageSize({ width: image.width, height: image.height });
    const ratio = image.width / image.height;

    // const scale = Math.min(
    //   size.width / imageObj.width,
    //   size.height / imageObj.height
    // );
    // setScale(scale);

    // setSize({
    //   width: size.width,
    //   height: size.width / ratio,
    // });
  }, [image]);

  return (
    <>
      <Layer>
        <Image
          onMouseMove={handleMouseMove}
          onMouseOut={() => _.defer(() => setMaskImg(null))}
          onTouchStart={handleMouseMove}
          x={image ? size.width / 2 - image.width / 2 : 0}
          y={image ? size.height / 2 - image!!.height / 2 : 0}
          image={image!!}
        />
      </Layer>
      <Layer>
        <Image
          opacity={0.4}
          x={maskImg ? size.width / 2 - maskImg.width / 2 : 0}
          y={maskImg ? size.height / 2 - maskImg!!.height / 2 : 0}
          image={maskImg!!}
        />
      </Layer>
    </>
  );
}

export default BaseImage;
