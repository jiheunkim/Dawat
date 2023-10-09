import React from "react";
import { useRecoilState } from "recoil";
import { Region, regionsState } from "../atoms";

type LabelProp = {
  region: Region;
};

function Label({ region }: LabelProp) {
  return (
    <li className="flex items-center">
      <span
        style={{ backgroundColor: `${region.color}` }}
        className="w-3 h-3 mr-1 rounded-full"
      ></span>
      <span className="font-medium">Label {region.id}</span>
    </li>
  );
}

function RegionsList() {
  const [regions, setRegions] = useRecoilState(regionsState);
  return (
    <ul className="space-y-2">
      {regions.map((region) => (
        <Label key={region.id} region={region} />
      ))}
    </ul>
  );
}

export default RegionsList;
