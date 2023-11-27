import axios, { AxiosResponse, isAxiosError } from "axios";
import { ImageUploadResponse, MasksInfo } from "../interfaces/Interfaces";

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
  tags: string
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

// Annotation 추가
