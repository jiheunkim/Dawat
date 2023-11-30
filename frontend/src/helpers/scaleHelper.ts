// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

import { Matrix, compose, scale, translate } from "transformation-matrix";
import { ImgSize } from "../interfaces/Interfaces";

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

// Helper function for handling image scaling needed for SAM
const handleImageScaleForSam = (image: HTMLImageElement) => {
  // Input images to SAM must be resized so the longest side is 1024
  const LONG_SIDE_LENGTH = 1024;
  let w = image.naturalWidth;
  let h = image.naturalHeight;
  const samScale = LONG_SIDE_LENGTH / Math.max(h, w);
  return { height: h, width: w, samScale };
};

const handleImageScaleForCanvas = (
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null
) => {
  if (image && canvas) {
    const { clientWidth, clientHeight } = canvas;

    const fitScale = Math.max(
      image.naturalWidth / (clientWidth - 20),
      image.naturalHeight / (clientHeight - 20)
    );

    const [width, height] = [
      image.naturalWidth / fitScale,
      image.naturalHeight / fitScale,
    ];

    return {
      width,
      height,
    };
  }
  return { width: 0, height: 0 };
};

const handleZoom = (matrix: Matrix, direction: any, point: any) => {
  const [mx, my] = [point.x, point.y];
  const copyMatrix = { ...matrix };
  let ratio =
    typeof direction === "object"
      ? direction.to / copyMatrix.a
      : 1 + 0.2 * direction;
  // NOTE: We're mutating matrix here
  let updateMatrix = compose(copyMatrix, translate(mx, my), scale(ratio));
  updateMatrix = compose(updateMatrix, translate(-mx, -my));
  return updateMatrix;
};

export { handleImageScaleForSam, handleImageScaleForCanvas, handleZoom };
