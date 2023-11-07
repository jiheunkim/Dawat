import { Button } from "flowbite-react";
import React, { useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { modelScaleProps } from "../interfaces/Interfaces";
import { handleImageScaleForSam } from "../helpers/scaleHelper";
import { imageState } from "../atoms";

type OnImageUploadFunction = (imageFile: File) => void;

const ImportBtn = ({
  onImageUpload,
}: {
  onImageUpload: OnImageUploadFunction;
}) => {
  const [image, setImage] = useRecoilState(imageState);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // The ONNX model expects the input to be rescaled to 1024.
  // The modelScale state variable keeps track of the scale values.
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const formData = new FormData();
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();
        img.src = result;

        img.onload = () => {
          setIsLoading(true);

          const { height, width, samScale } = handleImageScaleForSam(img);

          setModelScale({
            height: height,
            width: width,
            samScale: samScale,
          });

          console.log("width:" + width);
          console.log("height:" + height);
          console.log("file_name:" + file.name);

          formData.append("file", file); // 이미지 파일

          const fileData = {
            file_name: file.name,
            width: width,
            height: height,
          };

          const endpointUrl =
            "http://norispaceserver.iptime.org:8000/upload/image";
          const endpointUrl2 =
            "http://norispaceserver.iptime.org:8000/process_stored_image";

          // POST 요청 보내기
          fetch(endpointUrl, {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("네트워크 오류");
              }
              return response.json();
            })
            .then((responseData) => {
              // 성공적인 응답 처리
              console.log("POST 요청 성공:", responseData);

              // 2차 POST 요청 보내기
              fetch(endpointUrl2, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(fileData), // 데이터를 JSON 문자열로 변환하여 전송
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("네트워크 오류");
                  }
                  return response.json();
                })
                .then((responseData) => {
                  // 성공적인 응답 처리
                  console.log("POST 요청 성공2:", responseData);
                  setIsLoading(false);
                })
                .catch((error) => {
                  // 오류 처리
                  console.error("POST 요청 실패:", error);
                  setIsLoading(false);
                });
            })
            .catch((error) => {
              // 오류 처리
              console.error("POST 요청 실패:", error);
              setIsLoading(false);
            });

          setImage(img);
          onImageUpload(file);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button color="light" onClick={handleUploadClick}>
        <BiImport className="mr-2 h-5 w-5" />
        <p>Import</p>
      </Button>
      {isLoading ? (
        <div className="fixed top-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <h2 className="text-center text-white text-xl font-semibold">
            Loading...
          </h2>
          <br></br>
          <p className="text-center text-white">
            This may take a few seconds, please don't close this page.
          </p>
        </div>
      ) : (
        <input
          ref={fileInputRef}
          id="file-input"
          accept="image/*"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => onUpload(e)}
        />
      )}
    </>
  );
};

export default ImportBtn;
