import { OriginalImg } from "../interfaces/Interfaces";

export function rleDecode(segmentation: string, width: number, height: number) {
  if (segmentation === undefined || segmentation === "") {
    console.error("segmentation is undefined or empty");
    return new Uint8Array(width * height);
  }
  // 이건 RLE를 디코딩해서 1과 0으로 만드는 코드임
  const mask = new Uint8Array(width * height);
  const segments = segmentation.split(" ").map(Number);
  for (let i = 0; i < segments.length; i += 2) {
    mask.fill(1, segments[i], segments[i] + segments[i + 1]);
  }

  return mask;
}

export function rletoImageData(
  ctx: CanvasRenderingContext2D,
  segmentation: string,
  imageInfo: OriginalImg,
  color: number[]
): ImageData {
  const decodedMask = rleDecode(
    //캔버스 가로 및 세로 길이로 마스크 디코딩 진행
    segmentation,
    imageInfo.width,
    imageInfo.height
  );

  // ImageData 생성
  const imageData = ctx.createImageData(imageInfo.width, imageInfo.height);
  // Image 데이터에 색상, 투명도 반영하기
  for (let i = 0; i < decodedMask.length; i++) {
    if (decodedMask[i] === 1) {
      const index = i * 4;
      imageData.data[index] = color[0];
      imageData.data[index + 1] = color[1];
      imageData.data[index + 2] = color[2];
      imageData.data[index + 3] = color[3];
    }
  }

  return imageData;
}

export function encodeRLE(binaryMask: number[]): string {
  const extendedMask = [0, ...binaryMask, 0];
  const runs = [];

  for (let i = 1; i < extendedMask.length; i++) {
    if (extendedMask[i] !== extendedMask[i - 1]) {
      runs.push(i);
    }
  }

  for (let j = 1; j < runs.length; j += 2) {
    runs[j] -= runs[j - 1];
  }

  return runs.join(" ");
}

interface BBox {
  x: number;
  y: number;
}

export function createBinaryMaskAndRLEEncode(
  bboxrealstart: BBox,
  bboxEnd: BBox,
  imageWidth: number,
  imageHeight: number
): string {
  const binaryMask = new Uint8Array(imageWidth * imageHeight).fill(0);

  // 바운딩 박스 내 픽셀에 1 할당
  for (let y = Math.round(bboxrealstart.y); y < Math.round(bboxEnd.y); y++) {
    for (let x = Math.round(bboxrealstart.x); x < Math.round(bboxEnd.x); x++) {
      binaryMask[y * imageWidth + x] = 1;
    }
  }

  // 숫자 배열로 변환
  const binaryMaskArray = Array.from(binaryMask);

  // RLE 인코딩 수행
  const rleEncoded = encodeRLE(binaryMaskArray);

  return rleEncoded;
}
