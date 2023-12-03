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

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const imageArray = Object.values(images);

  // 다음 이미지 페이지로 이동
  const goToNextPage = () => {
    if (currentPageIndex < imageArray.length - 1) {
      const nextImage = imageArray[currentPageIndex + 1];
      handleImageClick(nextImage);
      setCurrentPageIndex(currentPageIndex + 1);
    }
    
  };
  // 이전 이미지 페이지로 이동
  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      const previousImage = imageArray[currentPageIndex - 1];
      handleImageClick(previousImage);
      setCurrentPageIndex(currentPageIndex - 1);
    }
    
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