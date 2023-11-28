import { atom } from "recoil";
import {
  Annotation,
  MaskColorWithID,
  MasksInfo,
  PDFToPNGResponse,
} from "./interfaces/Interfaces";

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

export const pdfImageState = atom<PDFToPNGResponse | null>({
  key: "pdfImageState",
  default: null,
});

export const imageState = atom<HTMLImageElement | null>({
  key: "imageState",
  default: null,
});

export const masksInfoState = atom<MasksInfo | null>({
  key: "masksInfoState",
  default: null,
});

export const selectedAnnotState = atom<Annotation | null>({
  key: "selectedAnnotState",
  default: null,
});

export const isEditorVisibleState = atom<Boolean>({
  key: "isEditorVisibleState",
  default: false,
});

export const colorPaletteState = atom<MaskColorWithID[]>({
  key: "colorPaletteState",
  default: [],
});
