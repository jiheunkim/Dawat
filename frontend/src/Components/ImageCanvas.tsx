import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  colorPaletteState,
  imageState,
  isEditorVisibleState,
  masksInfoState,
  selectedAnnotState,
} from "../atoms";
import { handleImageScaleForCanvas } from "../helpers/scaleHelper";
import {
  Annotation,
  ImgSize,
  MaskColor,
  MasksInfo,
  OriginalImg,
} from "../interfaces/Interfaces";
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
import _ from "underscore";

function rleDecode(segmentation: string, width: number, height: number) {
  // 이건 RLE를 디코딩해서 1과 0으로 만드는 코드임
  const mask = new Uint8Array(width * height);
  const segments = segmentation.split(" ").map(Number);
  for (let i = 0; i < segments.length; i += 2) {
    mask.fill(1, segments[i], segments[i] + segments[i + 1]);
  }

  return mask;
}

function rletoImageData(
  ctx: CanvasRenderingContext2D,
  segmentation: string,
  imageInfo: OriginalImg,
  color: MaskColor
): ImageData {
  const decodedMask = rleDecode(
    //캔버스 가로 및 세로 길이로 마스크 디코딩 진행
    segmentation,
    imageInfo.width,
    imageInfo.height
  );

  // ImageData 생성
  const imageData = ctx.createImageData(imageInfo.width, imageInfo.height);

  // Image 데이터에 색상, 투명도 반영하기
  for (let i = 0; i < decodedMask.length; i++) {
    if (decodedMask[i] === 1) {
      const index = i * 4;
      imageData.data[index] = color.r;
      imageData.data[index + 1] = color.g;
      imageData.data[index + 2] = color.b;
      imageData.data[index + 3] = color.a;
    }
  }

  return imageData;
}

function getRandomColor() {
  // 랜덤 마스크 색상 설정하는 코드
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  // mask opacity는 0.3
  const a = Math.floor(0.3 * 255);
  return { r, g, b, a };
}

function ImageCanvas() {
  const bboxCanvasRef = useRef<HTMLCanvasElement>(null);
  function getImagePosition() {
    const imageTopLeft = applyToPoint(inverse(matrix), { x: 0, y: 0 });
    const imageBottomRight = applyToPoint(inverse(matrix), {
      x: imgSize.width,
      y: imgSize.height,
    });

    return {
      x: imageTopLeft.x,
      y: imageTopLeft.y,
      width: imageBottomRight.x - imageTopLeft.x,
      height: imageBottomRight.y - imageTopLeft.y,
    };
  }

  // 캔버스에서의 마우스 위치
  const mousePosition = useRef({ x: 0, y: 0 });
  const [bboxStart, setBboxStart] = useState({ x: 0, y: 0 });
  const [bboxEnd, setBboxEnd] = useState({ x: 0, y: 0 });
  const [bboxToolActive, setBboxToolActive] = useState(false);
  // 이미지에서의 마우스 위치
  const imgCoord = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useRecoilState(imageState);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  const [matrix, setMatrix] = useState<Matrix>(
    compose(translate(-10, -10), scale(1, 1))
  );
  const [imgSize, setImgSize] = useState<ImgSize>({
    width: 0,
    height: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const validCanvasRef = useRef<HTMLCanvasElement>(null);
  // 현재 마스크를 그리는 캔버스
  const currentMaskRef = useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowSize();
  const [activeToolButton, setActiveToolButton] = useState("FaHandPaper");
  const [isDragging, setIsDragging] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");

  const [selectedAnnots, setSelectedAnnots] =
    useRecoilState(selectedAnnotState);
  const [isEditorVisible, setIsEditorVisible] =
    useRecoilState(isEditorVisibleState);

  // 이미지 마스크 색상 팔레트
  const [colorPalette, setColorPalette] = useRecoilState(colorPaletteState);

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
  const handleBboxEnd = () => {
    setIsDragging(false);

    if (canvasRef.current && bboxToolActive) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.beginPath();
        ctx.rect(
          bboxStart.x,
          bboxStart.y,
          bboxEnd.x - bboxStart.x,
          bboxEnd.y - bboxStart.y
        );
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
      console.log("BBOX Start:", bboxStart, "BBOX End:", bboxEnd);
    }
  };

  useEffect(() => {
    const { width, height } = handleImageScaleForCanvas(
      image,
      canvasRef.current
    );
    setImgSize({ width, height });
    const canvas = canvasRef.current!!;
    const ctx = canvas.getContext("2d")!!;
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [image, windowSize, masksInfo, matrix]);

  useEffect(() => {
    const { width, height } = handleImageScaleForCanvas(
      image,
      canvasRef.current
    );
    if (validCanvasRef.current) {
      const canvas = validCanvasRef.current;
      const ctx = canvas.getContext("2d")!!;

      // 마스크 그리는 함수
      const maskDrawing = (masksInfo: MasksInfo) => {
        const annotations = masksInfo.annotation;
        const imageInfo = masksInfo.Image;

        canvas.width = stylePosition.width;
        canvas.height = stylePosition.height;

        Object.keys(annotations).forEach((id) => {
          const annotation = annotations[id];
          const segmentation = annotation.segmentation;

          //마스크 랜덤 색상 지정
          const randomColor = getRandomColor();
          setColorPalette((prev) => [
            ...prev,
            { id: annotation.id, ...randomColor },
          ]);

          const imageData = rletoImageData(
            ctx,
            segmentation,
            imageInfo,
            randomColor
          );

          createImageBitmap(imageData).then(function (imgBitmap) {
            ctx.drawImage(
              imgBitmap,
              0,
              0,
              stylePosition.width,
              stylePosition.height
            );
          });
        });
      };
      // API에서 받아온 masksInfo 정보가 있으면 마스크 그리기
      if (masksInfo) {
        maskDrawing(masksInfo);
      }
      if (currentMaskRef.current) {
        const currentMaskCanvas = currentMaskRef.current;
        const currentMaskCtx = currentMaskCanvas.getContext("2d")!!;
        currentMaskCanvas.width = stylePosition.width;
        currentMaskCanvas.height = stylePosition.height;

        currentMaskCtx.lineWidth = 3;
        currentMaskCtx.strokeStyle = "red";
        currentMaskCtx.save();
      }
    }
  }, [image, masksInfo]);

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

    // Check if the active tool is FaVectorSquare
    if (activeToolButton === "FaVectorSquare") {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setBboxStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true); // Start dragging for bbox
      }
    } else if (activeToolButton === "FaHandPaper") {
      setIsDragging(true);
      setCursorStyle("grabbing");

      if (!isImageClick) {
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
    } else if (activeToolButton === "FaMousePointer") {
      setCursorStyle("default");
      // FaMousePointer인 경우 좌표 출력
      const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      const inverseMatrix = inverse(matrix);
      const imageCoord = applyToPoint(inverseMatrix, { x: mouseX, y: mouseY });
      const imageStartX = 0;
      const imageStartY = 0;
      const imageEndX = imgSize.width;
      const imageEndY = imgSize.height;
      const relativeCoord = {
        x: (imageCoord.x - imageStartX) / (imageEndX - imageStartX),
        y: (imageCoord.y - imageStartY) / (imageEndY - imageStartY),
      };

      console.log("Clicked at (FaMousePointer):", relativeCoord);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = canvasRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Update BBOX if the active tool is FaVectorSquare and dragging is true
    if (
      isDragging &&
      activeToolButton === "FaVectorSquare" &&
      canvasRef.current
    ) {
      setBboxEnd({
        x: mouseX,
        y: mouseY,
      });

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.beginPath();
        ctx.rect(
          bboxStart.x,
          bboxStart.y,
          mouseX - bboxStart.x,
          mouseY - bboxStart.y
        );
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
    }

    // Handle other tool (FaHandPaper) logic for panning the image
    if (isDragging && activeToolButton === "FaHandPaper" && canvasRef.current) {
      // Only move the image if dragging and FaHandPaper is active
      const { left, top } = canvasRef.current.getBoundingClientRect();
      const deltaX = imgCoord.current.x - (e.clientX - left);
      const deltaY = imgCoord.current.y - (e.clientY - top);

      setMatrix((prevMatrix) => compose(prevMatrix, translate(deltaX, deltaY)));

      imgCoord.current.x = e.clientX - left;
      imgCoord.current.y = e.clientY - top;
    }
  };

  const handleMouseUp = () => {
    handleBboxEnd(); // BBOX end
    setIsDragging(false);
    setCursorStyle("grab");
  };

  // 현재 선택된 마스크 타입
  interface CurrentMask {
    id: number;
    mask: Annotation;
    color: MaskColor;
  }

  const currentMask = useRef<CurrentMask | null>(null);
  useEffect(() => {
    if (cursorStyle === "crosshair") {
      document.body.style.cursor = "crosshair";
    } else {
      document.body.style.cursor = "default";
    }
  }, [cursorStyle]);

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
        <>
          <img
            style={stylePosition}
            className="absolute"
            alt="document"
            src={image.src}
            ref={imageRef}
          />
          <canvas
            style={stylePosition}
            className="absolute"
            ref={currentMaskRef}
          ></canvas>
          <canvas
            onClick={(e) => {
              const mask = currentMask.current;

              if (mask) {
                // console.log("current mask : ", mask);
                setSelectedAnnots(mask.mask);
                setIsEditorVisible(true);
              }
            }}
            onMouseMove={(e) => {
              if (currentMaskRef.current) {
                const currentMaskCanvas = currentMaskRef.current;
                const currentMaskCtx = currentMaskCanvas.getContext("2d")!!;

                const { left, top } =
                  currentMaskRef.current.getBoundingClientRect();

                // 마스크 캔버스에서의 마우스 상대 좌표
                const mouseX =
                  ((e.clientX - left) / stylePosition.width) *
                  image.naturalWidth;
                const mouseY =
                  ((e.clientY - top) / stylePosition.height) *
                  image.naturalHeight;

                const annotations = masksInfo?.annotation;
                if (annotations) {
                  let smallestMask: Annotation | null = null;
                  Object.keys(annotations).forEach((id) => {
                    const maskData = annotations[id];
                    const bbox = maskData.bbox;

                    // 클릭된 좌표가 bbox 내부에 있는지 확인
                    if (
                      mouseX >= bbox[0] &&
                      mouseX <= bbox[0] + bbox[2] &&
                      mouseY >= bbox[1] &&
                      mouseY <= bbox[1] + bbox[3]
                    ) {
                      // 가장 작은 마스크 선택
                      if (!smallestMask || maskData.area < smallestMask.area) {
                        smallestMask = maskData;
                      }
                    }
                  });
                  if (smallestMask !== null) {
                    const finalMask: Annotation = smallestMask; // Assertion
                    if (currentMask.current?.mask === finalMask) {
                      // console.log("이전과 똑같은 마스크");
                      return;
                    } else {
                      // console.log("final mask: ", finalMask);
                      if (validCanvasRef.current) {
                        const canvas = validCanvasRef.current;
                        const ctx = canvas.getContext("2d")!!;
                        const pixelData = ctx.getImageData(
                          mouseX,
                          mouseY,
                          1,
                          1
                        ).data;
                        const prevMask = currentMask.current;

                        // 이전 마스크가 있다면 현재 마스크 표시 지우고, 이전 색으로 다시 마스크 그리기
                        if (prevMask) {
                          // 현재 마스크 자리에 그려져 있던 색 지우기
                          const [x, y, segWidth, segHeight] =
                            prevMask.mask.bbox;
                          currentMaskCtx.clearRect(
                            (x / masksInfo.Image.width) *
                              currentMaskCanvas.width,
                            (y / masksInfo.Image.height) *
                              currentMaskCanvas.height,
                            (segWidth * currentMaskCanvas.width) /
                              masksInfo.Image.width,
                            (segHeight * currentMaskCanvas.height) /
                              masksInfo.Image.height
                          );
                        }
                        // 현재 마스크 설정
                        currentMask.current = {
                          id: finalMask.id,
                          mask: finalMask,
                          color: {
                            r: pixelData[0],
                            g: pixelData[1],
                            b: pixelData[2],
                            a: pixelData[3],
                          },
                        };

                        // 파란색으로 현재 마스크 이미지 데이터 만들기
                        const currentImageData = rletoImageData(
                          currentMaskCtx,
                          finalMask.segmentation,
                          masksInfo.Image,
                          {
                            r: 26,
                            g: 86,
                            b: 219,
                            a: 0.8 * 255,
                          }
                        );

                        // 파란색으로 현재 마스크 표시하기
                        createImageBitmap(currentImageData).then(function (
                          imgBitmap
                        ) {
                          currentMaskCtx.drawImage(
                            imgBitmap,
                            0,
                            0,
                            currentMaskCanvas.width,
                            currentMaskCanvas.height
                          );
                        });
                      }
                    }
                  }
                }

                // console.log(mouseX, mouseY);
              }
            }}
            style={stylePosition}
            className="absolute"
            ref={validCanvasRef}
          ></canvas>
        </>
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
