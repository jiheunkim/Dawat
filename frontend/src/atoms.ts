import { atom } from "recoil";
import {
  Annotation,
  MasksInfo,
  PDFToPNGResponse,
  ToolInfo,
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

export const uploadedFileNameState = atom<string>({
  key: "uploadedFileNameState",
  default: "",
});

export const masksInfoState = atom<MasksInfo | null>({
  key: "masksInfoState",
  default: null,
});

export const selectedAnnotState = atom<Annotation | null>({
  key: "selectedAnnotState",
  default: null,
});

export const isEditorVisibleState = atom<boolean>({
  key: "isEditorVisibleState",
  default: false,
});

// 선택한 툴
export const activeToolState = atom<ToolInfo>({
  key: "activeToolState",
  default: { name: "FaHandPaper", cursor: "grab" },
});

// 마스크 그리기 수정 모드
export const reDrawState = atom<boolean>({
  key: "reDrawState",
  default: false,
});

// Annotation Edit Mode

export const editState = atom<boolean>({
  key: "editState",
  default: false,
});
