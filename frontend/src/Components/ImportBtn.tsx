import { Button } from "flowbite-react";
import React, { useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { useRecoilState } from "recoil";
import { docImgSrcState } from "../atoms";

type OnImageUploadFunction = (imageFile: File) => void;

const ImportBtn = ({
  onImageUpload,
}: {
  onImageUpload: OnImageUploadFunction;
}) => {
  const [docImgSrc, setDocImgSrc] = useRecoilState(docImgSrcState);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDocImgSrc(reader.result as string | null);
        onImageUpload(file);
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
      <input
        ref={fileInputRef}
        id="file-input"
        accept="image/*"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => onUpload(e)}
      />
    </>
  );
};

export default ImportBtn;
