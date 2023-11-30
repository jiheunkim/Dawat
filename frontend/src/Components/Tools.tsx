import { useRef, useState } from "react";
import {
  FaMousePointer,
  FaHandPaper,
  FaSearch,
  FaTag,
  FaCrosshairs,
  FaVectorSquare,
} from "react-icons/fa";
import { FaWandMagicSparkles, FaEllipsis } from "react-icons/fa6";
import { activeToolState } from "../atoms";
import { useRecoilState } from "recoil";
import { ToolInfo } from "../interfaces/Interfaces";
const buttonTailwind =
  "m-1 p-2 hover:bg-gray-700 rounded-lg transition-all text-white text-lg";
const activebuttonTailwind = "bg-gray-700";

export const ToolList: ToolInfo[] = [
  { name: "FaHandPaper", cursor: "grab" },
  { name: "FaMousePointer", cursor: "default" },
  { name: "FaWandMagicSparkles", cursor: "default" },
  { name: "FaVectorSquare", cursor: "crosshair" },
];

// 전체 ToolsBox가 다 drag 가능한 형태여서 수정 필요
function Tools() {
  // 선택된 툴 상태
  const [activeTool, setActiveTool] = useRecoilState(activeToolState);
  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} 클릭됨`);
  };

  return (
    <div
      className="absolute"
      style={{
        top: "calc((100% - 158px)/2)",
        right: 20,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <div
        className="pb-2 flex flex-col bg-gray-900 dark:bg-gray-800 transition-all"
        style={{
          borderRadius: "12px",
        }}
      >
        <div
          onMouseDown={(clickEvent: React.MouseEvent<Element, MouseEvent>) => {
            const mouseMoveHandler = (moveEvent: MouseEvent) => {
              const deltaX = moveEvent.screenX - clickEvent.screenX;
              const deltaY = moveEvent.screenY - clickEvent.screenY;

              setPosition({
                x: x + deltaX,
                y: y + deltaY,
              });
            };

            const mouseUpHandler = () => {
              document.removeEventListener("mousemove", mouseMoveHandler);
            };

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler, {
              once: true,
            });
          }}
          className="cursor-pointer py-1 flex justify-center items-center text-white"
        >
          <FaEllipsis />
        </div>
        <button
          className={`${buttonTailwind} ${
            activeTool.name === "FaHandPaper" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaHandPaper");
            setActiveTool(ToolList[0]);
          }}
        >
          <FaHandPaper />
        </button>
        <button
          className={`${buttonTailwind} ${
            activeTool.name === "FaMousePointer" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaMousePointer");
            setActiveTool(ToolList[1]);
          }}
        >
          <FaMousePointer />
        </button>
        <button
          className={`${buttonTailwind} ${
            activeTool.name === "FaWandMagicSparkles"
              ? activebuttonTailwind
              : ""
          }`}
          onClick={() => {
            handleButtonClick("FaWandMagicSparkles");
            setActiveTool(ToolList[2]);
          }}
        >
          <FaWandMagicSparkles />
        </button>
        <button
          className={`${buttonTailwind} ${
            activeTool.name === "FaVectorSquare" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaVectorSquare");
            setActiveTool(ToolList[3]);
          }}
        >
          <FaVectorSquare />
        </button>
      </div>
    </div>
  );
}

export default Tools;
