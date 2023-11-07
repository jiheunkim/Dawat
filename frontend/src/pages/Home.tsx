import ImageCanvas from "../components/ImageCanvas";
import ToolSideBar from "../components/ToolSideBar";

function Home() {
  return <div className="h-full w-full flex">
    <ToolSideBar />
    <ImageCanvas />
  </div>
}

export default Home;
