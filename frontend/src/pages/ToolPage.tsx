import { Outlet } from "react-router";
import AnnotationBox from "../components/AnnotationBox";
import ImageCanvas from "../components/ImageCanvas";
import ToolSideBar from "../components/ToolSideBar";

function ToolPage() {
  return (
    <div className="h-full w-full flex">
      <ToolSideBar />
      <Outlet />
      <ImageCanvas />
    </div>
  );
}

export default ToolPage;
