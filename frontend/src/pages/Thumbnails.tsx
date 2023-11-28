import { useRecoilState } from "recoil";
import { imageState, pdfImageState } from "../atoms";
import ToolSideBar from "../components/ToolSideBar";
import ThumbnailsBox from "../components/ThumbnailsBox";

function Thumbnails() {
  const [image, setImage] = useRecoilState(imageState);
  const [pdfImage, setPdfImage] = useRecoilState(pdfImageState);

  return (
    <div className="h-full w-full flex">
      <ToolSideBar />
      <ThumbnailsBox />
      <div
        className="mt-16 w-full relative overflow-hidden"
      >
        <img
          alt=""
          className=""
          src={image?.src || (pdfImage && Object.values(pdfImage)[0]?.url) || ''}
        />
      </div>
    </div>
  );
}

export default Thumbnails;
