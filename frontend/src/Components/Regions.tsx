import React from "react";
import { Layer, Line } from "react-konva";
import { useRecoilState } from "recoil";
import { regionsState, selectedRegionIdState } from "../atoms";

function Regions() {
  const [regions, setRegions] = useRecoilState(regionsState);
  const [selectedRegionId, setSelectedRegionId] = useRecoilState(
    selectedRegionIdState
  );
  const layerRef = React.useRef(null);

  return (
    <Layer ref={layerRef}>
      {regions.map((region) => {
        const isSelected = region.id === selectedRegionId;
        return (
          <React.Fragment key={region.id}>
            {/* first we need to erase previous drawings */}
            {/* we can do it with  destination-out blend mode */}
            <Line
              globalCompositeOperation="destination-out"
              points={region.points.flatMap((p) => [p.x, p.y])}
              fill="black"
              listening={false}
              closed
            />
            {/* then we just draw new region */}
            <Line
              name="region"
              points={region.points.flatMap((p) => [p.x, p.y])}
              fill={region.color}
              closed
              opacity={isSelected ? 1 : 0.8}
              onClick={() => {
                setSelectedRegionId(region.id);
              }}
            />
          </React.Fragment>
        );
      })}
    </Layer>
  );
}

export default Regions;
