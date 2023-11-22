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
  image_id: number;
  width: number;
  height: number;
  file_name: string;
}

export interface Annotation {
  title: string;
  bbox: number[];
  area: number;
  predicted_iou: number;
  point_coords: Array<number[]>;
  crop_box: number[];
  id: number;
  stability_score: number;
  segmentation_image_url: string;
  color: number[];
  tag: string;
}

export interface Segment {
  id: number;
  bbox: number[];
  area: number;
  point_coords: Array<number[]>;
  crop_box: number[];
  title: string;
  tag: string;
}