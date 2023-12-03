import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { imageState, pdfImageState } from "../atoms";
import ToolSideBar from "../components/ToolSideBar";
import ThumbnailsBox from "../components/ThumbnailsBox";

function Thumbnails() {
  const [image, setImage] = useRecoilState(imageState);
  const [pdfImage, setPdfImage] = useRecoilState(pdfImageState);
  // pdfImage가 null이면 빈 객체로 초기화
  const images = pdfImage || {};
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const imageArray = Object.values(images);

  const handleImageClick = (selectedImage: { title?: string; url: any; }) => {
    const newImage = new Image();
    newImage.src = selectedImage.url;
    setImage(newImage);
  };

  const goToNextPage = () => {
    if (currentPageIndex < imageArray.length - 1) {
      const nextImage = imageArray[currentPageIndex + 1];
      handleImageClick(nextImage);
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      const previousImage = imageArray[currentPageIndex - 1];
      handleImageClick(previousImage);
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const [isHovered, setIsHovered] = useState(false);


  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const hasValidSrc =
    image?.src || (pdfImage && Object.values(pdfImage)[0]?.url);

  return (
    <div className="h-full w-full flex relative">
      <ToolSideBar />
      <ThumbnailsBox />

      <div
        className="h-screen w-full overflow-y-auto bg-slate-700 relative flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center" style={{ position: "relative" }}>
          <div className="mt-32 relative flex flex-col">
            {hasValidSrc && (
              <img
                alt=""
                className="w-full h-full flex border-2 border-zinc-600"
                src={hasValidSrc}
                style={{ position: "relative", zIndex: 1 }}
              />
            )}
          </div>
        </div>

        {isHovered && (
          <div
            className={`mx-auto flex w-full h-auto items-center justify-between absolute top-1/2 transform -translate-y-1/2 right-0 left-0 z-50 ${hasValidSrc ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            <img
              src="/img/angle-arrow-pointing-right.png"
              className="rotate-180 justify-self-start"
              style={{
                width: "50px",
                height: "50px",
                filter: "brightness(100%)",
                marginLeft: "40px",
                cursor: "pointer",
              }}
              onClick={goToPreviousPage}
            />

            <img
              src="/img/angle-arrow-pointing-right.png"
              style={{
                width: "50px",
                height: "50px",
                filter: "brightness(100%)",
                marginRight: "40px",
                cursor: "pointer",
              }}
              onClick={goToNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Thumbnails;