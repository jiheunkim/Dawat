import { useEffect, useRef, useState } from "react";
import { editAnnot, plusAnnot } from "../api/dawatAxios";
import { useRecoilState } from "recoil";
import {
  imageState,
  isEditorVisibleState,
  masksInfoState,
  selectedAnnotState,
  activeToolState,
  reDrawState,
  editState,
  docListState,
} from "../atoms";
import { handleImageScaleForCanvas, handleZoom } from "../helpers/scaleHelper";
import { Annotation, ImgSize, MasksInfo } from "../interfaces/Interfaces";
import { useWindowSize } from "react-use";
import {
  scale,
  translate,
  compose,
  applyToPoint,
  Matrix,
  inverse,
} from "transformation-matrix";
import Tools, { ToolList } from "./Tools";
import { getRandomColor } from "../helpers/colorGenerator";
import {
  createBinaryMaskAndRLEEncode,
  encodeRLE,
  rleDecode,
  rletoImageData,
} from "../helpers/rleHelpers";
import { FaHandPaper } from "react-icons/fa";

function ImageCanvas() {
  // const [addButtonClicked, setAddButtonClicked] = useRecoilState(
  //   addButtonClickedState
  // ); //이거 마스크 추가 때문에 add 버튼 클릭 유무 확인 용

  //밑에 useEffect는 add 버튼 클릭하면 콘솔에 출력하는건데 set(false)를 bbox 그리고 false로 바꿔줘야 할듯
  // useEffect(() => {
  //   if (addButtonClicked) {
  //     console.log("add 클릭 확인!");
  //     //setAddButtonClicked(false); //여기 수정 필요
  //   }
  // }, [addButtonClicked]);
  // 문서 전체 리스트
  const [docList, setDocList] = useRecoilState(docListState);
  // Annotation Edit 모드 여부
  const [editMode, setEditMode] = useRecoilState(editState);
  // 마스크 수정 상태 여부
  const [isRedraw, setIsRedraw] = useRecoilState(reDrawState);

  // 캔버스에서의 마우스 위치
  const [selectedMask, setSelectedMask] = useState(0); //마스크 선택된거
  const mousePosition = useRef({ x: 0, y: 0 });
  const [bboxStart, setBboxStart] = useState({ x: 0, y: 0 });
  const [bboxEEnd, setBboxEend] = useState({ x: 0, y: 0 });
  // const [bboxrealstart, setBboxrealstart] = useState({ x: 0, y: 0 });
  const [bboxEnd, setBboxEnd] = useState({ x: 0, y: 0 });
  const [bboxToolActive, setBboxToolActive] = useState(false);
  // 이미지에서의 마우스 위치
  const imgCoord = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useRecoilState(imageState); //이거 쓰려면 image.naturalWidth, image.naturalHeight
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  const imageWidth = masksInfo?.Image.width ?? 0; //이미지 전체 가로 크기
  const imageHeight = masksInfo?.Image.height ?? 0; //이미지 전체 세로 크기
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
  // 선택된 툴 상태
  const [activeTool, setActiveTool] = useRecoilState(activeToolState);
  const [isDragging, setIsDragging] = useState(false);
  // const [cursorStyle, setCursorStyle] = useState("default");
  // const [selectedFile, setSelectedFile] = useRecoilState(uploadedFileNameState);
  const [selectedAnnot, setSelectedAnnot] = useRecoilState(selectedAnnotState);
  // const [isEditorVisible, setIsEditorVisible] =
  //   useRecoilState(isEditorVisibleState);

  // 현재 선택된 마스크 타입
  interface CurrentMask {
    id: number;
    mask: Annotation;
    color: number[];
  }

  const currentMask = useRef<CurrentMask | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!!;
    const ctx = canvas.getContext("2d")!!;
    ctx.fillStyle = "#9ca3af";
    // 캔버스 크기의 사각형으로 채우기
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const { width, height } = handleImageScaleForCanvas(
      image,
      canvasRef.current
    );
    setImgSize({ width, height });
  }, [image, windowSize, masksInfo, matrix]);

  useEffect(() => {
    console.log("validCanvasRef.current: ", validCanvasRef.current);
    if (validCanvasRef.current) {
      const canvas = validCanvasRef.current;
      const ctx = canvas.getContext("2d")!!;

      const { width, height } = handleImageScaleForCanvas(
        image,
        canvasRef.current
      );

      // 마스크 그리는 함수
      const maskDrawing = (masksInfo: MasksInfo) => {
        const annotations = masksInfo.annotation;
        const imageInfo = masksInfo.Image;

        // console.log("stylePosition.width : ", stylePosition.width);
        // console.log("stylePosition.height : ", stylePosition.height);

        console.log("size info: ", width, height);

        // canvas.width = stylePosition.width;
        // canvas.height = stylePosition.height;

        canvas.width = width;
        canvas.height = height;

        Object.keys(annotations).forEach((id) => {
          const annotation = annotations[id];
          const randomColor = [...annotation.color, Math.floor(0.3 * 255)];
          const segmentation = annotation.segmentation;

          const imageData = rletoImageData(
            ctx,
            segmentation,
            imageInfo,
            randomColor
          );

          createImageBitmap(imageData).then(function (imgBitmap) {
            ctx.drawImage(imgBitmap, 0, 0, width, height);
          });
        });
      };
      // API에서 받아온 masksInfo 정보가 있으면 마스크 그리기
      if (masksInfo) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        maskDrawing(masksInfo);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      if (currentMaskRef.current) {
        const currentMaskCanvas = currentMaskRef.current;
        const currentMaskCtx = currentMaskCanvas.getContext("2d")!!;
        currentMaskCanvas.width = width;
        currentMaskCanvas.height = height;

        currentMaskCtx.lineWidth = 1.5;
        currentMaskCtx.strokeStyle = "red";
        currentMaskCtx.save();
      }
    }
  }, [image, masksInfo]);

  const zoomIn = (matrix: Matrix, direction: any, point: any) => {
    const updateMatrix = handleZoom(matrix, direction, point);
    setMatrix(updateMatrix);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { target } = e;
    const isImageClick =
      target instanceof HTMLImageElement && target === imageRef.current;
    const { left, top } = canvasRef!!.current!!.getBoundingClientRect();

    switch (activeTool.name) {
      case "FaHandPaper":
        setIsDragging(true);
        setActiveTool((prev) => {
          return { ...prev, cursor: "grabbing" };
        });

        if (!isImageClick) {
          imgCoord.current.x = e.clientX - left;
          imgCoord.current.y = e.clientY - top;
        }
        break;
      case "FaMousePointer":
        if (isImageClick) {
          setIsDragging(true);
          setActiveTool((prev) => {
            return { ...prev, cursor: "grabbing" };
          });

          if (isDragging) {
            imgCoord.current.x = e.clientX - left;
            imgCoord.current.y = e.clientY - top;
          }
        }
        break;
      case "FaVectorSquare":
        if (image && currentMaskRef.current) {
          const { left: maskLeft, top: maskTop } =
            currentMaskRef.current.getBoundingClientRect();

          // 마스크 캔버스에서의 마우스 상대 좌표
          const mouseX =
            ((e.clientX - maskLeft) / stylePosition.width) * image.naturalWidth;
          const mouseY =
            ((e.clientY - maskTop) / stylePosition.height) *
            image.naturalHeight;

          setBboxStart({
            x: mouseX,
            y: mouseY,
          });
          setIsDragging(true); // Start dragging for bbox
        }
        break;
    }

    // Check if the active tool is FaVectorSquare
    // if (activeTool.name === "FaVectorSquare") {
    //   if (image && currentMaskRef.current) {
    //     const { left, top } = currentMaskRef.current.getBoundingClientRect();

    //     // 마스크 캔버스에서의 마우스 상대 좌표
    //     const mouseX =
    //       ((e.clientX - left) / stylePosition.width) * image.naturalWidth;
    //     const mouseY =
    //       ((e.clientY - top) / stylePosition.height) * image.naturalHeight;

    //     setBboxStart({
    //       x: mouseX,
    //       y: mouseY,
    //     });
    //     setIsDragging(true); // Start dragging for bbox
    //   }
    // } else if (activeTool.name === "FaHandPaper") {
    //   setIsDragging(true);
    //   setActiveTool((prev) => {
    //     return { ...prev, cursor: "grabbing" };
    //   });

    //   if (!isImageClick) {
    //     const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
    //     imgCoord.current.x = e.clientX - left;
    //     imgCoord.current.y = e.clientY - top;
    //   }
    // } else if (activeTool.name === "FaMousePointer" && isImageClick) {
    //   setIsDragging(true);
    //   setActiveTool((prev) => {
    //     return { ...prev, cursor: "grabbing" };
    //   });

    //   if (isDragging) {
    //     const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
    //     imgCoord.current.x = e.clientX - left;
    //     imgCoord.current.y = e.clientY - top;
    //   }
    // } else if (activeTool.name === "FaMousePointer") {
    //   //이거 이전에 클릭된 마스크 id가 출력되는데 이거 이대로 놔둬도 되나 모르겠네...
    //   // FaMousePointer인 경우 좌표 출력
    //   const { left, top } = canvasRef!!.current!!.getBoundingClientRect();
    //   const mouseX = e.clientX - left;
    //   const mouseY = e.clientY - top;

    //   const inverseMatrix = inverse(matrix);
    //   const imageCoord = applyToPoint(inverseMatrix, { x: mouseX, y: mouseY });
    //   const imageStartX = 0;
    //   const imageStartY = 0;
    //   const imageEndX = imgSize.width;
    //   const imageEndY = imgSize.height;
    //   const relativeCoord = {
    //     x: (imageCoord.x - imageStartX) / (imageEndX - imageStartX),
    //     y: (imageCoord.y - imageStartY) / (imageEndY - imageStartY),
    //   };

    //   console.log("Clicked at (FaMousePointer):", relativeCoord);
    // }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) {
      return;
    }
    if (isDragging && canvasRef.current) {
      switch (activeTool.name) {
        case "FaHandPaper":
          // Only move the image if dragging and FaHandPaper is active
          const { left, top } = canvasRef.current.getBoundingClientRect();
          const deltaX = imgCoord.current.x - (e.clientX - left);
          const deltaY = imgCoord.current.y - (e.clientY - top);

          setMatrix((prevMatrix) =>
            compose(prevMatrix, translate(deltaX, deltaY))
          );

          imgCoord.current.x = e.clientX - left;
          imgCoord.current.y = e.clientY - top;
          break;
        case "FaVectorSquare":
          if (currentMaskRef.current && image && masksInfo) {
            const currentMaskCanvas = currentMaskRef.current;
            const currentMaskCtx = currentMaskCanvas.getContext("2d")!!;
            const { left, top } =
              currentMaskRef.current.getBoundingClientRect();

            // 마스크 캔버스에서의 마우스 상대 좌표
            const mouseX =
              ((e.clientX - left) / stylePosition.width) * image.naturalWidth;
            const mouseY =
              ((e.clientY - top) / stylePosition.height) * image.naturalHeight;

            // Clear previous drawing
            currentMaskCtx.clearRect(
              0,
              0,
              currentMaskCanvas.width,
              currentMaskCanvas.height
            );
            const rectX =
              (Math.min(bboxStart.x, mouseX) / masksInfo.Image.width) *
              currentMaskCanvas.width;
            const rectY =
              (Math.min(bboxStart.y, mouseY) / masksInfo.Image.height) *
              currentMaskCanvas.height;

            const scaledRectWidth =
              (Math.abs(mouseX - bboxStart.x) / masksInfo.Image.width) *
              currentMaskCanvas.width;
            const scaledRectHeight =
              (Math.abs(mouseY - bboxStart.y) / masksInfo.Image.height) *
              currentMaskCanvas.height;

            const rectWidth = Math.abs(mouseX - bboxStart.x);
            const rectHeight = Math.abs(mouseY - bboxStart.y);

            // Draw the rectangle
            currentMaskCtx.strokeRect(
              rectX,
              rectY,
              scaledRectWidth,
              scaledRectHeight
            );

            //console.log(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
            setBboxEnd({
              x: bboxStart.x + rectWidth,
              y: bboxStart.y + rectHeight,
            });
          }
          break;
      }
    }
    // if (
    //   activeTool.name === "FaVectorSquare" &&
    //   currentMaskRef.current &&
    //   image &&
    //   masksInfo
    // ) {
    //   const currentMaskCanvas = currentMaskRef.current;
    //   const currentMaskCtx = currentMaskCanvas.getContext("2d")!!;
    //   const { left, top } = currentMaskRef.current.getBoundingClientRect();

    //   // 마스크 캔버스에서의 마우스 상대 좌표
    //   const mouseX =
    //     ((e.clientX - left) / stylePosition.width) * image.naturalWidth;
    //   const mouseY =
    //     ((e.clientY - top) / stylePosition.height) * image.naturalHeight;

    //   // Clear previous drawing
    //   currentMaskCtx.clearRect(
    //     0,
    //     0,
    //     currentMaskCanvas.width,
    //     currentMaskCanvas.height
    //   );

    //   // Calculate top-left corner and dimensions for the bbox
    //   // const rectX =
    //   //   (Math.min(bboxStart.x, mouseX) / masksInfo.Image.width) *
    //   //   image.naturalWidth;
    //   // const rectY =
    //   //   (Math.min(bboxStart.y, mouseY) / masksInfo.Image.height) *
    //   //   image.naturalHeight;
    //   const rectX =
    //     (Math.min(bboxStart.x, mouseX) / masksInfo.Image.width) *
    //     currentMaskCanvas.width;
    //   const rectY =
    //     (Math.min(bboxStart.y, mouseY) / masksInfo.Image.height) *
    //     currentMaskCanvas.height;

    //   const scaledRectWidth =
    //     (Math.abs(mouseX - bboxStart.x) / masksInfo.Image.width) *
    //     currentMaskCanvas.width;
    //   const scaledRectHeight =
    //     (Math.abs(mouseY - bboxStart.y) / masksInfo.Image.height) *
    //     currentMaskCanvas.height;

    //   const rectWidth = Math.abs(mouseX - bboxStart.x);
    //   const rectHeight = Math.abs(mouseY - bboxStart.y);

    //   // Draw the rectangle
    //   currentMaskCtx.strokeRect(
    //     rectX,
    //     rectY,
    //     scaledRectWidth,
    //     scaledRectHeight
    //   );

    //   //console.log(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
    //   setBboxEnd({
    //     x: bboxStart.x + rectWidth,
    //     y: bboxStart.y + rectHeight,
    //   });

    //   // setBboxrealstart({
    //   //   x: bboxStart.x,
    //   //   y: bboxStart.y,
    //   // });
    // }

    // // Handle other tool (FaHandPaper) logic for panning the image
    // if (isDragging && activeTool.name === "FaHandPaper" && canvasRef.current) {
    //   // Only move the image if dragging and FaHandPaper is active
    //   const { left, top } = canvasRef.current.getBoundingClientRect();
    //   const deltaX = imgCoord.current.x - (e.clientX - left);
    //   const deltaY = imgCoord.current.y - (e.clientY - top);

    //   setMatrix((prevMatrix) => compose(prevMatrix, translate(deltaX, deltaY)));

    //   imgCoord.current.x = e.clientX - left;
    //   imgCoord.current.y = e.clientY - top;
    // }
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    //handleBboxEnd(); // BBOX end
    setIsDragging(false);
    switch (activeTool.name) {
      case "FaHandPaper":
        setActiveTool((prev) => {
          return { ...prev, cursor: "grab" };
        });
        break;
      case "FaVectorSquare":
        if (
          isDragging &&
          activeTool.name === "FaVectorSquare" &&
          currentMaskRef.current &&
          image &&
          canvasRef.current &&
          masksInfo
        ) {
          const { left, top } = canvasRef.current.getBoundingClientRect();
          const mouseX =
            ((e.clientX - left) / stylePosition.width) * image.naturalWidth;
          const mouseY =
            ((e.clientY - top) / stylePosition.height) * image.naturalHeight;

          setBboxEend({
            x: mouseX,
            y: mouseY,
          });
        }
        const rleEncodedMask = createBinaryMaskAndRLEEncode(
          bboxStart,
          bboxEnd,
          imageWidth,
          imageHeight
        );
        // 여기가 BBOX 왼쪽 상단 좌표랑 오른쪽 하단 좌표야!! 이걸 수정할때 민재한테 넘겨야 함.
        // 마스크 수정?
        // if (editState && selectedAnnot) {
        // TODO Edit mode 추가해야함!!!!
        if (isRedraw && selectedAnnot) {
          console.log("편집할 ID:", selectedAnnot?.id);
          // console.log(bboxrealstart, bboxEnd);

          const decodedArray = rleDecode(
            rleEncodedMask,
            imageWidth,
            imageHeight
          );
          console.log(decodedArray);
          const area = decodedArray.reduce(
            (acc, cur) => acc + (cur === 1 ? 1 : 0),
            0
          );

          console.log("Area:", area);
          // console.log("file 이름:", selectedFile);
          const bbox_coordinates = [
            bboxStart.x,
            bboxStart.y,
            bboxEnd.x - bboxStart.x,
            bboxEnd.y - bboxStart.y,
          ];
          try {
            const response = await editAnnot(
              docList!!.find((item) => item.src === image!!.src)!!.file_name, // file_name
              selectedAnnot!!.id, // annotation_id
              rleEncodedMask, // segmentation
              bbox_coordinates, // bbox_coordinates
              area
            );

            if (response) {
              console.log("마스크 수정 요청 성공:", response);
              console.log(bbox_coordinates);
              setMasksInfo(response.data);
            }
          } catch (error) {
            console.error("마스크 수정 요청 실패:", error);
          }
          setIsRedraw(false);
          setEditMode(false);
          setActiveTool(ToolList[1]);

          // setEditState(false);
        } else {
          // 마스크 추가;
          //여기가 마스크 추가 부분인데 바꿀 필요가 있음요
          console.log("마스크 추가");

          const decodedArray = rleDecode(
            rleEncodedMask,
            imageWidth,
            imageHeight
          );
          console.log(decodedArray);
          const area = decodedArray.reduce(
            (acc, cur) => acc + (cur === 1 ? 1 : 0),
            0
          );

          console.log("Area:", area);
          // console.log("file 이름:", selectedFile);
          const bbox_coordinates = [
            bboxStart.x,
            bboxStart.y,
            bboxEnd.x - bboxStart.x,
            bboxEnd.y - bboxStart.y,
          ];
          const point_coords = [0, 0];
          try {
            const response = await plusAnnot(
              docList!!.find((item) => item.src === image!!.src)!!.file_name, // file_name
              rleEncodedMask, // segmentation
              bbox_coordinates, // bbox_coordinates
              point_coords,
              area
            );

            if (response) {
              console.log("마스크 추가 요청 성공:", response);
              console.log(bbox_coordinates);
              const { data } = response;
              setMasksInfo(data);
              // setSelectedAnnot(
              //   data.annotation[`annotation_${data.Image.annotation_index + 1}`]
              // );
            }
          } catch (error) {
            console.error("마스크 추가 요청 실패:", error);
          }
          setActiveTool(ToolList[1]);
        }
        break;
    }
    // if (activeTool.name === "FaHandPaper") {
    //   setActiveTool((prev) => {
    //     return { ...prev, cursor: "grab" };
    //   });
    // } else if (activeTool.name === "FaVectorSquare") {
    //   if (
    //     isDragging &&
    //     activeTool.name === "FaVectorSquare" &&
    //     currentMaskRef.current &&
    //     image &&
    //     canvasRef.current &&
    //     masksInfo
    //   ) {
    //     // canvasRef.current가 null이 아닌지 확인

    //     const { left, top } = canvasRef.current.getBoundingClientRect();
    //     const mouseX =
    //       ((e.clientX - left) / stylePosition.width) * image.naturalWidth;
    //     const mouseY =
    //       ((e.clientY - top) / stylePosition.height) * image.naturalHeight;

    //     setBboxEend({
    //       x: mouseX,
    //       y: mouseY,
    //     });
    //   }

    //   const rleEncodedMask = createBinaryMaskAndRLEEncode(
    //     bboxStart,
    //     bboxEnd,
    //     imageWidth,
    //     imageHeight
    //   );

    //   // setBboxToolActive(false);
    //   // 여기가 BBOX 왼쪽 상단 좌표랑 오른쪽 하단 좌표야!! 이걸 수정할때 민재한테 넘겨야 함.
    //   // 마스크 수정?
    //   if (editState === true && !addButtonClicked && selectedAnnot) {
    //     console.log("편집할 ID:", selectedAnnot.id);
    //     // console.log(bboxrealstart, bboxEnd);

    //     console.log(rleEncodedMask);
    //     const decodedArray = rleDecode(rleEncodedMask, imageWidth, imageHeight);
    //     console.log(decodedArray);
    //     const area = decodedArray.reduce(
    //       (acc, cur) => acc + (cur === 1 ? 1 : 0),
    //       0
    //     );

    //     console.log("Area:", area);
    //     console.log("file 이름:", selectedFile);
    //     const bbox_coordinates = [
    //       bboxStart.x,
    //       bboxStart.y,
    //       bboxEnd.x - bboxStart.x,
    //       bboxEnd.y - bboxStart.y,
    //     ];
    //     try {
    //       const response = await editAnnot(
    //         selectedFile, // file_name
    //         selectedAnnot.id, // annotation_id
    //         rleEncodedMask, // segmentation
    //         bbox_coordinates, // bbox_coordinates
    //         area
    //       );

    //       if (response) {
    //         console.log("마스크 수정 요청 성공:", response);
    //         console.log(bbox_coordinates);
    //         setMasksInfo(response.data);
    //       }
    //     } catch (error) {
    //       console.error("마스크 수정 요청 실패:", error);
    //     }

    //     setEditState(false);
    //   } else {
    //     // 마스크 추가
    //     setAddButtonClicked(false);
    //     //여기가 마스크 추가 부분인데 바꿀 필요가 있음요
    //     console.log("헬로우! 당신은 이제 add를 할거에요!");

    //     const decodedArray = rleDecode(rleEncodedMask, imageWidth, imageHeight);
    //     console.log(decodedArray);
    //     const area = decodedArray.reduce(
    //       (acc, cur) => acc + (cur === 1 ? 1 : 0),
    //       0
    //     );

    //     console.log("Area:", area);
    //     console.log("file 이름:", selectedFile);
    //     const bbox_coordinates = [
    //       bboxStart.x,
    //       bboxStart.y,
    //       bboxEnd.x - bboxStart.x,
    //       bboxEnd.y - bboxStart.y,
    //     ];
    //     const point_coords = [0, 0];
    //     try {
    //       const response = await plusAnnot(
    //         selectedFile, // file_name
    //         rleEncodedMask, // segmentation
    //         bbox_coordinates, // bbox_coordinates
    //         point_coords,
    //         area
    //       );

    //       if (response) {
    //         console.log("마스크 추가 요청 성공:", response);
    //         console.log(bbox_coordinates);
    //         setMasksInfo(response.data);
    //       }
    //     } catch (error) {
    //       console.error("마스크 추가 요청 실패:", error);
    //     }
    //     setEditState(false);
    //   }
    // }
  };

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

  return (
    <div
      onWheel={(e) => {
        const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
        zoomIn(matrix, direction, mousePosition.current);
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: activeTool.cursor }}
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
              if (activeTool.name === "FaMousePointer") {
                const mask = currentMask.current;

                if (mask) {
                  //console.log("current mask : ", mask);
                  setSelectedMask(mask.id);
                  setSelectedAnnot(mask.mask);
                }
              }
            }}
            onMouseMove={(e) => {
              if (
                currentMaskRef.current &&
                activeTool.name === "FaMousePointer"
              ) {
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
                          color: [
                            pixelData[0],
                            pixelData[1],
                            pixelData[2],
                            pixelData[3],
                          ],
                        };

                        // 파란색으로 현재 마스크 이미지 데이터 만들기
                        // const currentImageData = rletoImageData(
                        //   currentMaskCtx,
                        //   finalMask.segmentation,
                        //   masksInfo.Image,
                        //   {
                        //     r: 26,
                        //     g: 86,
                        //     b: 219,
                        //     a: 0.8 * 255,
                        //   }
                        // );

                        // // 파란색으로 현재 마스크 표시하기
                        // createImageBitmap(currentImageData).then(function (
                        //   imgBitmap
                        // ) {
                        //   currentMaskCtx.drawImage(
                        //     imgBitmap,
                        //     0,
                        //     0,
                        //     currentMaskCanvas.width,
                        //     currentMaskCanvas.height
                        //   );
                        // });
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
      <Tools />
    </div>
  );
}

export default ImageCanvas;
