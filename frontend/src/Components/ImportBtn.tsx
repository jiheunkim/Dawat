import { Button } from "flowbite-react";
import React, { useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { useRecoilState } from "recoil";
import {
  colorPaletteState,
  imageState,
  masksInfoState,
  selectedAnnotState,
} from "../atoms";
import { postAutoAnnotReq, postImageUpload } from "../api/dawatAxios";

const ImportBtn = () => {
  const [image, setImage] = useRecoilState(imageState);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  const [selectedAnnot, setSelectedAnnot] = useRecoilState(selectedAnnotState);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 이미지 마스크 색상 팔레트
  const [colorPalette, setColorPalette] = useRecoilState(colorPaletteState);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasksInfo(null);
    setSelectedAnnot(null);
    setColorPalette([]);
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();

      if (file.type === "application/pdf") {
        // PDF 파일인 경우
        // formData.append("file", file);
        // const endpointUrl =
        //   "http://norispaceserver.iptime.org:8000/upload/pdf/dawat";
        // try {
        //   const response = await fetch(endpointUrl, {
        //     method: "POST",
        //     body: formData,
        //   });
        //   if (!response.ok) {
        //     throw new Error("네트워크 오류");
        //   }
        //   const responseData = await response.json();
        //   console.log(responseData);
        //   // 맨 첫 장의 이미지 URL을 사용하여 이미지 처리
        //   const firstPageImageUrl = responseData["0"]?.url;
        //   const firstPageImageTitle = responseData["0"]?.title;
        //   if (firstPageImageUrl) {
        //     // 맨 첫 장의 이미지를 저장하고 setImage() 함수에 전달
        //     const firstPageImage = new Image();
        //     firstPageImage.src = firstPageImageUrl;
        //     firstPageImage.onload = () => {
        //       const fileData = {
        //         file_name: firstPageImageTitle,
        //       };
        //       // 2차 POST 요청 보내기
        //       fetch(endpointUrl2, {
        //         method: "POST",
        //         headers: {
        //           "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(fileData), // 데이터를 JSON 문자열로 변환하여 전송
        //       })
        //         .then((response) => {
        //           if (!response.ok) {
        //             throw new Error("네트워크 오류");
        //           }
        //           return response.json();
        //         })
        //         .then((responseData) => {
        //           // 성공적인 응답 처리
        //           console.log("POST 요청 성공2:", responseData);
        //           setMasksInfo(responseData);
        //           setIsLoading(false);
        //         })
        //         .catch((error) => {
        //           // 오류 처리
        //           console.error("POST 요청 실패:", error);
        //           setIsLoading(false);
        //         });
        //       setImage(firstPageImage);
        //       onImageUpload(file);
        //     };
        //   }
        // } catch (error) {
        //   console.error("PDF 업로드 및 처리 실패:", error);
        // }
      } else if (file.type.startsWith("image/")) {
        // 이미지 파일인 경우
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const img = new Image();
          img.src = result;

          img.onload = async () => {
            setIsLoading(true);

            // POST 요청 보내기
            const fileUploadResult = await postImageUpload(file);
            if (fileUploadResult) {
              console.log("POST 요청 성공:", fileUploadResult.data);
              const fetchedMaskInfo = await postAutoAnnotReq(file.name);
              if (fetchedMaskInfo) {
                console.log("POST 요청 성공2:", fetchedMaskInfo.data);
                setMasksInfo(fetchedMaskInfo.data);
                setIsLoading(false);
              } else {
                console.log("POST 요청 성공2 실패");
                setIsLoading(false);
              }
            } else {
              console.error("POST 요청 최종 실패");
              setIsLoading(false);
            }
            // fetch(endpointUrl, {
            //   method: "POST",
            //   body: formData,
            // })
            //   .then((response) => {
            //     if (!response.ok) {
            //       throw new Error("네트워크 오류");
            //     }
            //     return response.json();
            //   })
            //   .then((responseData) => {
            //     // 성공적인 응답 처리
            //     console.log("POST 요청 성공:", responseData);

            //     // 2차 POST 요청 보내기
            //     fetch(endpointUrl2, {
            //       method: "POST",
            //       headers: {
            //         "Content-Type": "application/json",
            //       },
            //       body: JSON.stringify(fileData), // 데이터를 JSON 문자열로 변환하여 전송
            //     })
            //       .then((response) => {
            //         if (!response.ok) {
            //           throw new Error("네트워크 오류");
            //         }
            //         return response.json();
            //       })
            //       .then((responseData) => {
            //         // 성공적인 응답 처리
            //         console.log("POST 요청 성공2:", responseData);

            //         setMasksInfo(responseData);
            //         setIsLoading(false);
            //       })
            //       .catch((error) => {
            //         // 오류 처리
            //         console.error("POST 요청 실패:", error);
            //         setIsLoading(false);
            //       });
            //   })
            //   .catch((error) => {
            //     // 오류 처리
            //     console.error("POST 요청 실패:", error);
            //     setIsLoading(false);
            //   });
            setImage(img);
          };
        };
        reader.readAsDataURL(file);
      }
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
          accept=".pdf, image/*"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => onUpload(e)}
        />
      )}
    </>
  );
};

export default ImportBtn;
