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
function Tools({ mousePosition, setActiveToolButton }: any) {
  const toolDivRef = useRef<HTMLDivElement>(null);
  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [toolPosition, setToolPosition] = useState({
    right: 20,
    top: "calc((100% - 1100px)/2)",
  });
  const [activeButton, setActiveButton] = useState("FaHandPaper");
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} 클릭됨`);
    setActiveButton(buttonName);
  };

  return (
    <div style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
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
          document.removeEventListener('mousemove', mouseMoveHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler, { once: true });
      }}
    >
      <div
        className="pb-2 flex flex-col absolute bg-gray-900 dark:bg-gray-800 transition-all"
        style={{ ...toolPosition, borderRadius: "12px" }}
      >
        <div   
          // onMouseDown={(e) => {
          //   setToolPosition({
          //     left: mousePosition.x,
          //     top: mousePosition.y,
          //   });
          // }}
          // onMouseUp={(e) => {
          //   setToolPosition({
          //     left: mousePosition.x,
          //     top: mousePosition.y,
          //   });
          // }}
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
          }}
        >
          <FaWandMagicSparkles />
        </button>
      </div>
    </div>
  );
}

export default Tools;
