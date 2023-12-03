import { useRecoilState } from "recoil";
import { imageState, pdfImageState } from "../atoms";
import ToolSideBar from "../components/ToolSideBar";
import ThumbnailsBox from "../components/ThumbnailsBox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Thumbnails() {
  const [image, setImage] = useRecoilState(imageState);
  const [pdfImage, setPdfImage] = useRecoilState(pdfImageState);
  const navigate = useNavigate();

  // 화살표 이미지의 hover 여부를 관리하는 상태
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  // 화살표 이미지의 hover 여부를 관리하는 상태
  const [isHovered, setIsHovered] = useState(false);

  //명시적으로 handler추가 
  // 명시적으로 handler 추가
  const handleMouseEnterLeft = () => {
    setIsHoveredLeft(true);
  };

  const handleMouseLeaveLeft = () => {
    setIsHoveredLeft(false);
  };

  const handleMouseEnterRight = () => {
    setIsHoveredRight(true);
  };

  const handleMouseLeaveRight = () => {
    setIsHoveredRight(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 이미지 또는 pdfImage에 유효한 src가 있는지 확인
  const hasValidSrc = image?.src || (pdfImage && Object.values(pdfImage)[0]?.url);


  return (
    <div className="h-full w-full flex relative">
      <ToolSideBar />
      <ThumbnailsBox />


      <div className="h-screen w-full overflow-y-auto bg-slate-700 relative flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        <div
          className="flex items-center justify-center"

          style={{ position: "relative" }}>


          <div className="mt-32 relative flex flex-col">
            {/* 조건부 렌더링 사용 */}
            {hasValidSrc && (
              <img
                alt=""
                className="w-full h-full flex border-2 border-zinc-600"
                src={hasValidSrc}
                style={{ position: "relative", zIndex: 1 }} // 이미지의 위치와 z-index 설정
              />
            )}
          </div>
        </div>

        {/* 화살표 이미지 */}
        {(
          isHovered && <div
            className={`mx-auto flex w-full h-auto items-center justify-between absolute top-1/2 transform -translate-y-1/2 right-0 left-0 z-50 ${hasValidSrc ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}

          >

            {/* 화살표1 왼 */}
            <img
              src="/img/arrow_right.png"
              className="rotate-180 justify-self-start"
              style={{
                width: "50px", // 이미지의 너비
                height: "50px", // 이미지의 높이
                filter: "brightness(100%)", // 밝기를 100%로 조절 (원본의 100%)
                marginLeft: "40px",
              }}
            />

            {/* 화살표1 오 */}
            < img
              src="/img/arrow_right.png"
              style={{
                width: "50px", // 이미지의 너비
                height: "50px", // 이미지의 높이
                filter: "brightness(100%)", // 밝기를 100%로 조절 (원본의 100%)
                marginRight: "40px",
              }}
            //onClick={goToNextPage}
            />

          </div>

        )}


      </div>
    </div>

  );
}

export default Thumbnails;
