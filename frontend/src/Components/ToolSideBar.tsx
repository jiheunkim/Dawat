"use client";

import { Link } from "react-router-dom";
import { MdNewLabel } from "react-icons/md";
import { LuGalleryThumbnails } from "react-icons/lu";
import Regions from "./Regions";
import RegionsList from "./RegionsList";

function ToolSideBar() {
  const linkTailwind =
    "px-2 py-5 flex flex-col justify-center items-center hover:bg-gray-700 rounded-lg transition-all";
  return (
    <aside
      id="sidebar"
      className="flex flex-none h-full z-40 w-80 md:w-96 bg-gray-50 transition-width"
    >
      <div className="w-14 md:w-28 h-screen overflow-y-auto text-white pt-20 px-1 md:px-3 bg-gray-900 dark:bg-gray-800 transition-width">
        <ul className="space-y-3">
          <li>
            <Link className={linkTailwind} to={"#"}>
              <MdNewLabel className="text-3xl md:text-4xl" />
              <p className="hidden text-xs md:block">Annotation</p>
            </Link>
          </li>
          <li>
            <Link className={linkTailwind} to={"#"}>
              <LuGalleryThumbnails className="text-3xl md:text-4xl" />
              <p className="hidden text-xs md:block">Thumbnails</p>
            </Link>
          </li>
        </ul>
      </div>
      <div className="h-screen w-full overflow-y-auto pt-20 px-5">
        <p className="text-xl font-bold mb-3">Annotations</p>
        <div className="pl-2">
          <RegionsList />
        </div>
      </div>
    </aside>
  );
}

export default ToolSideBar;
