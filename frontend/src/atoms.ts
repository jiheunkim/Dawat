import { atom } from "recoil";

export interface Region {
  id: number;
  color: string;
  points: any[];
}
export interface Size {
  width: number;
  height: number;
}
// Recoil atoms
// export const sizeSate = atom<Size>({
//   key: "sizeSate",
//   default: { width: window.innerWidth, height: window.innerHeight },
// });

// export const imageSizeState = atom<Size>({
//   key: "imageSizeState",
//   default: { width: 100, height: 100 },
// });

// export const scaleState = atom({
//   key: "scaleState",
//   default: 1,
// });

// export const isDrawingState = atom({
//   key: "isDrawingState",
//   default: false,
// });

// export const regionsState = atom<Region[]>({
//   key: "regionsState",
//   default: [],
// });

// export const selectedRegionIdState = atom<number | null>({
//   key: "selectedRegionIdState",
//   default: null,
// });

// export const docImgSrcState = atom<string | null>({
//   key: "docImgSrcState",
//   default: null,
// });

export const imageState = atom<HTMLImageElement | null>({
  key: "imageState",
  default: null,
});
