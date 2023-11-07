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

// Todo : 타입 수정해야 함, drag 구현
function Tools({ mousePosition }: any) {
  const toolDivRef = useRef<HTMLDivElement>(null);
  const [toolPosition, setToolPosition] = useState({
    right: 0,
    top: "calc((100% - 150px)/2)",
  });

  return (
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
      <button className={buttonTailwind}>
        <FaMousePointer />
      </button>

      <button className={buttonTailwind}>
        <FaHandPaper />
      </button>

      <button className={buttonTailwind}>
        <FaWandMagicSparkles />
      </button>
    </div>
  );
}

export default Tools;
