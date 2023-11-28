// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import { Tensor } from "onnxruntime-web";

export interface ImgSize {
  width: number;
  height: number;
}

export interface modelScaleProps {
  samScale: number;
  height: number;
  width: number;
}

export interface modelInputProps {
  x: number;
  y: number;
  clickType: number;
}

export interface modeDataProps {
  clicks?: Array<modelInputProps>;
  tensor: Tensor;
  modelScale: modelScaleProps;
}

export interface ToolProps {
  handleMouseMove: (e: any) => void;
}

// Mask 관련 interface
export interface MasksInfo {
  Image: OriginalImg;
  annotation: { [key: string]: Annotation };
}

export interface OriginalImg {
  image_id: string;
  width: number;
  height: number;
  file_name: string;
}

export interface Annotation {
  title: string;
  bbox: number[];
  area: number;
  segmentation: string;
  point_coords: Array<number[]>;
  crop_box: number[];
  id: number;
  tag?: string;
}

// Canvas
// 마스크 색상 인터페이스
export interface MaskColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface MaskColorWithID extends MaskColor {
  id: number;
}

// 이미지 업로드 요청 결과
export interface ImageUploadResponse {
  status: string;
  file_name: string;
  message: string;
}

// PdfToPng 변환 요청 결과
export interface PDFToPNGResponse {
  [key: string]: {
    title: string;
    url: string;
  };
}