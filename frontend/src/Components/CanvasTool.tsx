import React from "react";
import Konva from "konva";
import { Stage } from "react-konva";

import Regions from "./Regions";
import BaseImage from "./BaseImage";

import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isDrawingState,
  regionsState,
  scaleState,
  selectedRegionIdState,
  sizeSate,
} from "../atoms";
import { Button, TextInput } from "flowbite-react";

let id = 1;

function getRelativePointerPosition(node: any) {
  // the function will return pointer position relative to the passed node
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we find relative point
  return transform.point(pos);
}

function zoomStage(stage: any, scaleBy: any) {
  const oldScale = stage.scaleX();

  const pos = {
    x: stage.width() / 2,
    y: stage.height() / 2,
  };
  const mousePointTo = {
    x: pos.x / oldScale - stage.x() / oldScale,
    y: pos.y / oldScale - stage.y() / oldScale,
  };

  const newScale = Math.max(0.05, oldScale * scaleBy);

  const newPos = {
    x: -(mousePointTo.x - pos.x / newScale) * newScale,
    y: -(mousePointTo.y - pos.y / newScale) * newScale,
  };

  const newAttrs = limitAttributes(stage, { ...newPos, scale: newScale });

  stage.to({
    x: newAttrs.x,
    y: newAttrs.y,
    scaleX: newAttrs.scale,
    scaleY: newAttrs.scale,
    duration: 0.1,
  });
  return newScale;
}

function limitAttributes(stage: any, newAttrs: any) {
  const box = stage.findOne("Image").getClientRect();
  const minX = -box.width + stage.width() / 2;
  const maxX = stage.width() / 2;

  const x = Math.max(minX, Math.min(newAttrs.x, maxX));

  const minY = -box.height + stage.height() / 2;
  const maxY = stage.height() / 2;

  const y = Math.max(minY, Math.min(newAttrs.y, maxY));

  const scale = Math.max(0.05, newAttrs.scale);

  return { x, y, scale };
}

function CanvasTool() {
  const stageRef = React.useRef<Konva.Stage>(null);

  const [size, setSize] = useRecoilState(sizeSate);
  const [scale, setScale] = useRecoilState(scaleState);
  const [isDrawing, setIsDrawing] = useRecoilState(isDrawingState);
  const [regions, setRegions] = useRecoilState(regionsState);
  const [selectedRegionId, setSelectedRegionId] = useRecoilState(
    selectedRegionIdState
  );

  React.useEffect(() => {
    function checkSize() {
      const container = document.querySelector(
        "#canvasToolContainer"
      )!! as HTMLElement;
      const sidebar = document.querySelector("#sidebar") as HTMLElement;
      setSize({
        width: window.innerWidth - sidebar.offsetWidth,
        height: container.offsetHeight,
      });
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        scaleX={scale}
        scaleY={scale}
        className="canvas"
        onClick={(e) => {
          const clickedNotOnRegion = e.target.name() !== "region";
          if (clickedNotOnRegion) {
            setSelectedRegionId(null);
          }
        }}
        onWheel={(e) => {
          e.evt.preventDefault();
          const stage = stageRef.current!!;
          const dx = -e.evt.deltaX;
          const dy = -e.evt.deltaY;
          const pos = limitAttributes(stage, {
            x: stage.x() + dx,
            y: stage.y() + dy,
            scale: stage.scaleX(),
          });
          stageRef.current!!.position(pos);
        }}
        onMouseDown={(e) => {
          setIsDrawing(true);
          const point = getRelativePointerPosition(e.target.getStage());
          const region = {
            id: id++,
            color: Konva.Util.getRandomColor(),
            points: [point],
          };
          setRegions((prev) => prev.concat([region]));
        }}
        onMouseMove={(e) => {
          if (!isDrawing) {
            return;
          }
          const lastRegion = { ...regions[regions.length - 1] };
          const point = getRelativePointerPosition(e.target.getStage());
          lastRegion.points = lastRegion.points.concat([point]);
          // const updateRegions = [...regions];
          // updateRegions.pop();
          setRegions((prev) => [...prev.slice(0, -1), lastRegion]);
        }}
        onMouseUp={(e) => {
          if (!isDrawing) {
            return;
          }
          const lastRegion = regions[regions.length - 1];
          if (lastRegion.points.length < 3) {
            setRegions((prev) => prev.slice(0, -1));
          }
          setIsDrawing((prev) => !prev);
        }}
      >
        <BaseImage />
        <Regions />
      </Stage>
      <Button.Group className="absolute zoom-container bottom-5 left-10">
        <Button
          color="gray"
          onClick={() => {
            const newScale = zoomStage(stageRef.current, 1.2);
            setScale(newScale);
          }}
        >
          +
        </Button>
        {/* input 구현해야 함 */}
        {/* <div className="px-2 rounded-none box-border border border-ls-0 flex items-center justify-center border-gray-200">
          <input
            onChange={() => {}}
            value={Math.round(scale * 100)}
            defaultValue={"100"}
            className="w-12 py-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          ></input>
          <div> %</div>
        </div> */}
        <Button
          color="gray"
          onClick={() => {
            const newScale = zoomStage(stageRef.current, 0.8);
            setScale(newScale);
          }}
        >
          -
        </Button>
      </Button.Group>
    </>
  );
}

export default CanvasTool;
