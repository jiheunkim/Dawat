import { useRecoilState } from "recoil";
import {
  docListState,
  imageState,
  masksInfoState,
  selectedAnnotState,
} from "../atoms";
import { useEffect, useState } from "react";
import { DocumentInfo } from "../interfaces/Interfaces";

function ThumbnailsBox() {
  const [image, setImage] = useRecoilState(imageState);
  const [docList, setDocList] = useRecoilState(docListState);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  const [selectedAnnot, setSelectedAnnot] = useRecoilState(selectedAnnotState);

  useEffect(() => {
    console.log("test Image: ", image);
  }, [image]);

  // pdfImage가 null이면 빈 객체로 초기화
  // const images = pdfImage || {};

  const handleImageClick = (selectedImage: DocumentInfo) => {
    if (selectedImage.src !== image?.src) {
      const newImage = new Image();
      newImage.src = selectedImage.src;
      setMasksInfo(null);
      setSelectedAnnot(null);
      setImage(newImage);
    }
  };

  return (
    <>
      <aside
        id="sidebar"
        className="flex flex-none h-full z-30 w-72 md:w-75 bg-gray-50 transition-width"
      >
        <div className="h-screen w-full pt-20 px-5 pb-3 overflow-hidden">
          <div id="sidebar" className="h-full">
            <p className="mb-4 text-xl font-bold">Thumbnail</p>
            <div
              style={{ height: "calc(100% - 50px)" }}
              className="flex items-center flex-col relative overflow-y-scroll scrollbar-hide"
            >
              {docList &&
                docList.map((item, index) => {
                  return (
                    <img
                      key={index}
                      alt={item.file_name}
                      className={`border-2 box-border rounded-xl my-3 w-4/5 cursor-pointer ${
                        item.src === image?.src && "border-blue-600"
                      }`}
                      style={{
                        boxShadow:
                          "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
                      }}
                      src={item.src}
                      onClick={() => handleImageClick(item)}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </aside>

      {/* <aside
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
      </aside> */}
    </>
  );
}

export default ThumbnailsBox;
