import ImageCanvas from "../components/ImageCanvas";
import ToolSideBar from "../components/ToolSideBar";

function Annotation() {
  return <div className="h-full w-full flex">
    <ToolSideBar />
    <aside
      id="sidebar"
      className="flex flex-none h-full z-40 w-72 md:w-75 bg-gray-50 transition-width"
    >
      <div className="h-screen w-full overflow-y-auto pt-20 px-5">
        <p className="text-xl font-bold mb-3">Annotation</p>
      </div>
    </aside>
    <ImageCanvas />
  </div>
}

export default Annotation;
