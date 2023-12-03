import { useRecoilState } from "recoil";
import { imageState, pdfImageState } from "../atoms";
import ToolSideBar from "../components/ToolSideBar";
import ThumbnailsBox from "../components/ThumbnailsBox";

function Thumbnails() {
  const [image, setImage] = useRecoilState(imageState);
  const [pdfImage, setPdfImage] = useRecoilState(pdfImageState);

  // 이미지 또는 pdfImage에 유효한 src가 있는지 확인
  const hasValidSrc = image?.src || (pdfImage && Object.values(pdfImage)[0]?.url);

  return (
    <div className="h-full w-full flex relative">
      <ToolSideBar />
      <ThumbnailsBox />
      <div className="h-screen w-full overflow-y-auto bg-slate-700 mr-12 ">

        {/* arrow 이미지 */}
        <div className="flex items-center justify-end mt-32 z-10">
          <img src={process.env.PUBLIC_URL + '/img/angle-arrow-pointing-right.png'}
            style={{
              width: "50px", // 이미지의 너비
              height: "50px", // 이미지의 높이
              filter: "brightness(70%)", // 밝기 조절 (원본의 70%)
              marginRight: "4px"
            }}
          />
        </div>


        <div className="flex items-center justify-center z-0">
          <div className="mt-32 relative flex flex-col">

            {/* 조건부 렌더링 사용 */}
            {hasValidSrc ? (
              <img
                alt=""
                className="w-full h-full flex border-2 border-zinc-600"
                src={hasValidSrc} />

            ) : (
              null
            )}

            {/* 방향 조절 아이콘들 표시 */}
            {/* <div className="flex items-end justify-center">
              <div className="absolute">

                <div className="flex items-center justify-center w-[206px] h-[52px] mb-6 bg-gray-900 rounded-[20px]">

                  <div className="w-[43px] h-[43px] relative ">
                    <img src="/image/ic_round-skip-previous.png" />
                  </div>


                  <div className="w-[43px] h-[43px] relative flex items-center justify-center" >
                    <img src="/image/ellipse10.png" />
                  </div>

                  <div className="w-[43px] h-[43px] relative -rotate-180">
                    <img src="/image/ic_round-skip-previous.png" />
                  </div>

                </div>
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </div >
  );
}

export default Thumbnails;
