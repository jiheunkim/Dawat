import AnnotationList from "./AnnotationList";
import AnnotationEditor from "./AnnotationEditor";

function AnnotationBox() {
  return (
    <>
      <aside
        id="sidebar"
        className="flex flex-none h-full z-30 w-72 md:w-75 bg-gray-50 transition-width"
      >
        <div className="h-screen w-full pt-20 px-5 pb-3 overflow-hidden">
          <AnnotationList />
        </div>
      </aside>
      <AnnotationEditor />
    </>
  );
}

export default AnnotationBox;
