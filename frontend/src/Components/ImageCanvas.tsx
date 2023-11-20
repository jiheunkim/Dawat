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
  const [activeToolButton, setActiveToolButton] = useState("FaHandPaper");
  const [isDragging, setIsDragging] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("");

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

  const handleMouseDown = (e: React.MouseEvent) => {
    const { target } = e;
    const isImageClick =
      target instanceof HTMLImageElement && target === imageRef.current;
  
      if (activeToolButton === "FaHandPaper") {
        setIsDragging(true);
        setCursorStyle("grabbing");

        if (!isImageClick) {
          // 마우스 다운이 이미지 위에서 발생하지 않았을 때만 위치 업데이트
          const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
          imgCoord.current.x = e.clientX - left;
          imgCoord.current.y = e.clientY - top;
        }
      } else if (activeToolButton === "FaMousePointer" && isImageClick) {
        setIsDragging(true);
        setCursorStyle("grabbing");

        if (isDragging) {
          const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
          imgCoord.current.x = e.clientX - left;
          imgCoord.current.y = e.clientY - top;
        }
    } else if (activeToolButton === "FaMousePointer" && isImageClick) {
      setCursorStyle("default");
      // FaMousePointer인 경우 좌표 출력
      const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      // 이미지 좌표로 변환
      const inverseMatrix = inverse(matrix);
      const imageCoord = applyToPoint(inverseMatrix, { x: mouseX, y: mouseY });

      // 이미지 시작점과 끝점의 좌표 구하기
      const imageStartX = 0;
      const imageStartY = 0;
      const imageEndX = imgSize.width;
      const imageEndY = imgSize.height;

      // 이미지 시작점으로부터의 상대 좌표로 변환
      const relativeCoord = {
        x: (imageCoord.x - imageStartX) / (imageEndX - imageStartX),
        y: (imageCoord.y - imageStartY) / (imageEndY - imageStartY),
      };

      console.log("Clicked at (FaMousePointer):", relativeCoord);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeToolButton !== "FaHandPaper") return;
  
    const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
  
    const deltaX = mousePosition.current.x - mouseX;
    const deltaY = mousePosition.current.y - mouseY;
  
    mousePosition.current.x = mouseX;
    mousePosition.current.y = mouseY;
  
    setMatrix((prevMatrix) => compose(prevMatrix, translate(deltaX, deltaY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onWheel={(e) => {
        const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
        zoomIn(direction, mousePosition.current);
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: cursorStyle }}
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
      <Tools
        mousePosition={mousePosition.current}
        setActiveToolButton={setActiveToolButton}
        setCursorStyle={setCursorStyle}
      />
    </div>
  );
}

export default ImageCanvas;
