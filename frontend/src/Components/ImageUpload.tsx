import React, { useState } from "react";
import { LuUpload } from "react-icons/lu";

type OnImageUploadFunction = (imageFile: File) => void;

const ImageUpload = ({ onImageUpload }: { onImageUpload: OnImageUploadFunction }) => {
    const [imageSrc, setImageSrc] = useState<null | string>(null);
  const linkTailwind =
    "px-2 py-5 flex flex-col justify-center items-center hover-bg-gray-700 rounded-lg transition-all";

    const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result as string | null);
            onImageUpload(file);
          };
          reader.readAsDataURL(file);
        }
    };

  const handleUploadClick = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <>
      <div className={linkTailwind} onClick={handleUploadClick}>
        <LuUpload className="text-3xl md-text-4xl" />
        <p className="text-xs md-block">Upload</p>
        <input
          id="file-input"
          accept="image/*"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => onUpload(e)}
        />
      </div>
      {/* 나중에 주석 처리 */}
      {imageSrc && <img width="100%" src={imageSrc} alt="Uploaded" />}
    </>
  );
};

export default ImageUpload;