import { NavLink } from "react-router-dom";
import { MdNewLabel } from "react-icons/md";
import { LuGalleryThumbnails } from "react-icons/lu";

function ToolSideBar() {
  const linkTailwind =
    "px-2 py-5 flex flex-col justify-center items-center hover:bg-gray-700 rounded-lg transition-all";
  const activeLinkTailwind = "bg-gray-700";

  return (
    <aside id="sidebar" className="flex flex-none h-full transition-width">
      <div className="w-14 md:w-24 h-screen overflow-y-auto text-white pt-20 px-1 md:px-3 bg-gray-900 dark:bg-gray-800 transition-width">
        <ul className="space-y-3">
          <li>
            <NavLink
              className={`${linkTailwind} ${window.location.pathname === '/tool-thumbnails' ? activeLinkTailwind : ''}`}
              to={"/tool-thumbnails"}
            >
              <LuGalleryThumbnails className="text-3xl md:text-4xl" />
              <p className="hidden text-xs md:block">Thumbnails</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={`${linkTailwind} ${window.location.pathname === '/tool-annotation' ? activeLinkTailwind : ''}`}
              to={"/tool-annotation"}
            >
              <MdNewLabel className="text-3xl md:text-4xl" />
              <p className="hidden text-xs md:block">Annotation</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default ToolSideBar;