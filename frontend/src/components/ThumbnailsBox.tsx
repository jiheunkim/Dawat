import { useRecoilState } from "recoil";
import { imageState, pdfImageState } from "../atoms";
import { useState } from "react";

function ThumbnailsBox() {
  const [image, setImage] = useRecoilState(imageState);
  const [pdfImage, setPdfImage] = useRecoilState(pdfImageState);

  // pdfImage가 null이면 빈 객체로 초기화
  const images = pdfImage || {};

  const handleImageClick = (selectedImage: { title?: string; url: any; }) => {
    const newImage = new Image();
    newImage.src = selectedImage.url;
    setImage(newImage);
  };

  return (
    <>
      <aside
        id="sidebar"
        className="flex flex-none h-full z-30 w-72 md:w-75 bg-gray-50 transition-width"
      >
        <div className="h-screen w-full overflow-y-auto pt-20 px-5">
          <p className="text-xl font-bold mb-3">Thumbnails</p>
          {Object.values(images).map((image, index) => (
            <img
              key={index}
              alt={image.title}
              className="border-2 border-zinc-600 mt-5 mb-3"
              src={image.url}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default ThumbnailsBox;