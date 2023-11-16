import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { imageState } from "../atoms";
import { handleImageScaleForCanvas } from "../helpers/scaleHelper";
import { ImgSize } from "../interfaces/Interfaces";
import { useRafState, useWindowSize } from "react-use";
import {
  scale,
  translate,
  compose,
  applyToPoint,
  Matrix,
  inverse,
} from "transformation-matrix";
import Tools from "./Tools";

function ImageCanvas() {
  // 캔버스에서의 마우스 위치
  const mousePosition = useRef({ x: 0, y: 0 });
  // 이미지에서의 마우스 위치
  const imgCoord = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useRecoilState(imageState);
  const [matrix, setMatrix] = useState<Matrix>(
    compose(translate(-10, -10), scale(1, 1))
  );
  const [imgSize, setImgSize] = useState<ImgSize>({
    width: 0,
    height: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowSize();
  useEffect(() => {
    const { width, height } = handleImageScaleForCanvas(
      image,
      canvasRef.current
    );
    setImgSize({ width, height });
  }, [image, windowSize]);

  const imagePosition = {
    topLeft: applyToPoint(inverse(matrix), { x: 0, y: 0 }),
    bottomRight: applyToPoint(inverse(matrix), {
      x: imgSize.width,
      y: imgSize.height,
    }),
  };

  const stylePosition = {
    // imageRendering: "pixelated",
    left: imagePosition.topLeft.x,
    top: imagePosition.topLeft.y,
    width: imagePosition.bottomRight.x - imagePosition.topLeft.x,
    height: imagePosition.bottomRight.y - imagePosition.topLeft.y,
    maxWidth: imagePosition.bottomRight.x - imagePosition.topLeft.x,
  };

  const zoomIn = (direction: any, point: any) => {
    const [mx, my] = [point.x, point.y];
    const copyMatrix = { ...matrix };
    let ratio =
      typeof direction === "object"
        ? direction.to / copyMatrix.a
        : 1 + 0.2 * direction;

    // NOTE: We're mutating matrix here
    let updateMatrix = compose(copyMatrix, translate(mx, my), scale(ratio));
    updateMatrix = compose(updateMatrix, translate(-mx, -my));

    setMatrix(updateMatrix);
  };

  return (
    <div
      onWheel={(e) => {
        const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
        zoomIn(direction, mousePosition.current);
      }}
      onMouseMove={(e) => {
        const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
        mousePosition.current.x = e.clientX - left;
        mousePosition.current.y = e.clientY - top;
      }}
      className="mt-16 w-full relative overflow-hidden"
    >
      <canvas className="w-full h-full relative" ref={canvasRef}></canvas>
      {image && (
        <img
          style={stylePosition}
          className="absolute"
          alt="doument"
          src={image.src}
          ref={imageRef}
        />
      )}
      <Tools mousePosition={mousePosition.current} />
    </div>
  );
}

export default ImageCanvas;
