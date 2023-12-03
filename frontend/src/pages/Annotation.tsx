import AnnotationBox from "../components/AnnotationBox";
import ImageCanvas from "../components/ImageCanvas";
import ToolSideBar from "../components/ToolSideBar";

function Annotation() {

  return (
    <div className="h-full w-full flex">
      <ToolSideBar />
      <AnnotationBox />
      <ImageCanvas />
    </div>
  );
}

export default Annotation;
