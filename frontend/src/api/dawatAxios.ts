import axios, { AxiosResponse, isAxiosError } from "axios";
import {
  ImageUploadResponse,
  MasksInfo,
  PDFToPNGResponse,
} from "../interfaces/Interfaces";

const dawatAxios = axios.create({
  baseURL: "http://norispaceserver.iptime.org:8000",
});

// 이미지 업로드
export const postImageUpload = async (
  file: File
): Promise<AxiosResponse<ImageUploadResponse, any> | null> => {
  try {
    const response = await dawatAxios.post(
      "upload/image/dawat",
      {
        file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    if (isAxiosError<ImageUploadResponse>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

// pdf to png
export const ChangePdfToPng = async (
  file: File
): Promise<AxiosResponse<PDFToPNGResponse, any> | null> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await dawatAxios.post("upload/pdf/dawat", formData);
    return response;
  } catch (error) {
    if (isAxiosError<PDFToPNGResponse>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

// Export
export const exportFile = async (file_name: string): Promise<string | null> => {
  try {
    const response = await dawatAxios.get("download/" + file_name);
    // 여기서 성공적인 응답 여부를 확인하고 메시지를 반환
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`Error: ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    // 에러 발생 시 콘솔에 로그 출력 및 null 반환
    console.log(`Error: ${error}`);
    return null;
  }
};

// Annotation 생성
export const postAutoAnnotReq = async (
  file_name: string
): Promise<AxiosResponse<MasksInfo, any> | null> => {
  try {
    const response = await dawatAxios.post("process_stored_image/dawat", {
      file_name,
    });
    return response;
  } catch (error) {
    if (isAxiosError<MasksInfo>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

// Annotation Title 변경
export const postNewTitle = async (
  image_name: string,
  new_key: string,
  id: number
): Promise<AxiosResponse<MasksInfo, any> | null> => {
  try {
    const response = await dawatAxios.post("update_key", {
      image_name,
      new_key,
      id,
    });
    return response;
  } catch (error) {
    if (isAxiosError<MasksInfo>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

// Tag 업데이트
export const postNewTags = async (
  image_name: string,
  id: number,
  tags: string[]
): Promise<AxiosResponse<MasksInfo, any> | null> => {
  try {
    const response = await dawatAxios.post("update_tags", {
      image_name,
      id,
      tags,
    });
    return response;
  } catch (error) {
    if (isAxiosError<MasksInfo>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

// Annotation 삭제
export const deleteAnnot = async (
  file_name: string
): Promise<AxiosResponse<MasksInfo, any> | null> => {
  try {
    const response = await dawatAxios.post("delete_key", {
      file_name,
    });
    return response;
  } catch (error) {
    if (isAxiosError<MasksInfo>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

export const editAnnot = async (
  file_name: string,
  annotation_id: number,
  segmentation: string,
  bbox_coordinates: number[],
  area: number
): Promise<AxiosResponse<MasksInfo, any> | null> => {
  try {
    const response = await dawatAxios.post("modify_annotation", {
      file_name,
      annotation_id,
      segmentation,
      bbox_coordinates,
      area,
    });
    return response;
  } catch (error) {
    if (isAxiosError<MasksInfo>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};

export const plusAnnot = async (
  file_name: string,
  segmentation: string,
  bbox_coordinates: number[],
  point_coords: number[],
  area: number
): Promise<AxiosResponse<MasksInfo, any> | null> => {
  try {
    const response = await dawatAxios.post("plus_annotation", {
      file_name,
      segmentation,
      bbox_coordinates,
      point_coords,
      area,
    });
    return response;
  } catch (error) {
    if (isAxiosError<MasksInfo>(error)) {
      console.log(`Error: ${error.response?.status} ${error.message}`);
      return null;
    } else {
      return null;
    }
  }
};
