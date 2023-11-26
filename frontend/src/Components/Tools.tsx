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
const buttonTailwind =
  "m-1 p-2 hover:bg-gray-700 rounded-lg transition-all text-white text-lg";
const activebuttonTailwind = "bg-gray-700";

// 전체 ToolsBox가 다 drag 가능한 형태여서 수정 필요
function Tools({ mousePosition, setActiveToolButton, setCursorStyle }: any) {
  const toolDivRef = useRef<HTMLDivElement>(null);
  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [activeButton, setActiveButton] = useState("FaHandPaper");
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} 클릭됨`);
    setActiveButton(buttonName);
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
            activeButton === "FaHandPaper" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaHandPaper");
            setActiveToolButton("FaHandPaper");
            setCursorStyle("grab");
          }}
        >
          <FaHandPaper />
        </button>
        <button
          className={`${buttonTailwind} ${
            activeButton === "FaMousePointer" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaMousePointer");
            setActiveToolButton("FaMousePointer");
            setCursorStyle("default");
          }}
        >
          <FaMousePointer />
        </button>
        <button
          className={`${buttonTailwind} ${
            activeButton === "FaWandMagicSparkles" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaWandMagicSparkles");
            setActiveToolButton("FaWandMagicSparkles");
            setCursorStyle("auto");
          }}
        >
          <FaWandMagicSparkles />
        </button>
        <button
          className={`${buttonTailwind} ${
            activeButton === "FaVectorSquare" ? activebuttonTailwind : ""
          }`}
          onClick={() => {
            handleButtonClick("FaVectorSquare");
            setActiveToolButton("FaVectorSquare");
            setCursorStyle("crosshair");
          }}
        >
          <FaVectorSquare />
        </button>
      </div>
    </div>
  );
}

export default Tools;
