import { MdCircle, MdDelete } from "react-icons/md";

function AnnotationListDemo() {
  return (
    <div
        style={{ height: "calc(100% - 94px)" }}
        className="flex flex-col relative overflow-y-scroll scrollbar-hide"
    >
        
        <div
            className={`flex items-center my-1 cursor-pointer py-2 px-3 hover:bg-gray-200 rounded-lg`}
            onClick={(e) => {
                
            }}
            >
            <MdCircle
                className="text-sm mr-2"
                color="pink"
            />
            <p className="text-m font-seminold mb-0 flex-grow">Annotation1</p>
            <MdDelete
                className="text-xl darkgray hover:text-red-700 transition-colors"
            />
        </div>
        <div
            className={`flex items-center my-1 cursor-pointer py-2 px-3 hover:bg-gray-200 rounded-lg`}
            onClick={(e) => {
            }}
            >
            <MdCircle
                className="text-sm mr-2"
                color="skyblue"
            />
            <p className="text-m font-seminold mb-0 flex-grow">Annotation2</p>
            <MdDelete
                className="text-xl darkgray hover:text-red-700 transition-colors"
            />
        </div>
        <div
            className={`flex items-center my-1 cursor-pointer py-2 px-3 hover:bg-gray-200 rounded-lg`}
            onClick={(e) => {
            }}
            >
            <MdCircle
                className="text-sm mr-2"
                color="#C8A2C8"
            />
            <p className="text-m font-seminold mb-0 flex-grow">Annotation3</p>
            <MdDelete
                className="text-xl darkgray hover:text-red-700 transition-colors"
            />
        </div>
        <div
            className={`flex items-center my-1 cursor-pointer py-2 px-3 hover:bg-gray-200 rounded-lg`}
            onClick={(e) => {
            }}
            >
            <MdCircle
                className="text-sm mr-2"
                color="#AEEA30"
            />
            <p className="text-m font-seminold mb-0 flex-grow">Annotation4</p>
            <MdDelete
                className="text-xl darkgray hover:text-red-700 transition-colors"
            />
        </div>
    </div>
  );
}

export default AnnotationListDemo;