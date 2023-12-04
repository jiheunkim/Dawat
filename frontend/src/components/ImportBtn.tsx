import { Button } from "flowbite-react";
import React, { useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { useRecoilState } from "recoil";
import {
  docListState,
  imageState,
  masksInfoState,
  //pngImageState,
  selectedAnnotState,
} from "../atoms";
import {
  ChangePdfToPng,
  postAutoAnnotReq,
  postImageUpload,
} from "../api/dawatAxios";
import Loading from "./Loading";
import { PdfInfo } from "../interfaces/Interfaces";

type DocInfoEntry = [number, PdfInfo];

const ImportBtn = () => {
  const [image, setImage] = useRecoilState(imageState);
  // const [fileName, setFileName] = useRecoilState(uploadedFileNameState);
  const [docList, setDocList] = useRecoilState(docListState);
  //const [pngImage, setPngImage] = useRecoilState(pngImageState);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  const [selectedAnnot, setSelectedAnnot] = useRecoilState(selectedAnnotState);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Object.entries의 반환값에 대한 타입 정의
  type Entry = [string, PdfInfo];

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //setImage(null);
    setDocList(null);
    //setPngImage(null);
    setMasksInfo(null);
    setSelectedAnnot(null);
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();

      if (file.type === "application/pdf") {
        // PDF 파일인 경우
        const fileUploadResult = await ChangePdfToPng(file);
        if (fileUploadResult) {
          // 파일 리스트 생성
          setDocList(() => {
            const docList = Object.entries(fileUploadResult.data).map(
              ([key, value]: Entry) => {
                const docItem = {
                  file_name: value.title,
                  src: value.url,
                  id: parseInt(key),
                };
                return docItem;
              }
            );
            return [...docList];
          });
          console.log(fileUploadResult.data);

          const firstPageImageUrl = fileUploadResult.data["0"]?.url;
          const firstPageImageTitle = fileUploadResult.data["0"]?.title;
          // setFileName(firstPageImageTitle);

          if (firstPageImageUrl) {
            // 맨 첫 장의 이미지를 저장하고 setImage() 함수에 전달
            const firstPageImage = new Image();
            firstPageImage.src = firstPageImageUrl;
            // firstPageImage.onload = async () => {
            //   const fetchedMaskInfo = await postAutoAnnotReq(
            //     firstPageImageTitle
            //   );
            //   if (fetchedMaskInfo) {
            //     console.log("POST 요청 성공2:", fetchedMaskInfo.data);
            //     setMasksInfo(fetchedMaskInfo.data);
            //     setIsLoading(false);
            //   } else {
            //     console.log("POST 요청 성공2 실패");
            //     setIsLoading(false);
            //   }
            //   setImage(firstPageImage);
            // };
            setImage(firstPageImage);
          } else {
            console.error("POST 요청 최종 실패");
            // setIsLoading(false);
          }
        }
      } else if (
        file?.type.startsWith("image/") ||
        file?.name.toLowerCase().endsWith(".png")
      ) {
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
              // setFileName(file.name);

              const firstPageImage = new Image();
              firstPageImage.src = img.src;
              setDocList(() => [
                { file_name: file.name, src: firstPageImage.src, id: 0 },
              ]);
              // 맨 첫 장의 이미지를 저장하고 setImage() 함수에 전달
              setImage(firstPageImage);
              // firstPageImage.onload = async () => {
              //   const fetchedMaskInfo = await postAutoAnnotReq(file.name);
              //   if (fetchedMaskInfo) {
              //     console.log("POST 요청 성공2:", fetchedMaskInfo.data);
              //     setMasksInfo(fetchedMaskInfo.data);
              //     setIsLoading(false);
              //   } else {
              //     console.log("POST 요청 성공2 실패");
              //     setIsLoading(false);
              //   }
              // };
              setIsLoading(false);
            } else {
              console.error("POST 요청 최종 실패");
              setIsLoading(false);
            }

            //setImage(img);
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
        <Loading />
      ) : (
        <input
          ref={fileInputRef}
          id="file-input"
          accept=".pdf, image/*, .png"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => onUpload(e)}
        />
      )}
    </>
  );
};

export default ImportBtn;
