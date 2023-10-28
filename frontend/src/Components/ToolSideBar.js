"use client";

import { Link } from "react-router-dom";
import { MdNewLabel } from "react-icons/md";
import { LuGalleryThumbnails, LuUpload } from "react-icons/lu";
import Regions from "./Regions";
import RegionsList from "./RegionsList";
import RegionSelectorSidebarBox from "./Annotator/RegionSelectorSidebarBox";
import getActiveImage from "../reducers/get-active-image";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImportBtn";

function ToolSideBar({ state, dispatch }) {
  const { activeImage } = getActiveImage(state);
  const memoizedActionFns = useRef({});
  const action = (type, ...params) => {
    const fnKey = `${type}(${params.join(",")})`;
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey];

    const fn = (...args) =>
      params.length > 0
        ? dispatch({
            type,
            ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
          })
        : dispatch({ type, ...args[0] });
    memoizedActionFns.current[fnKey] = fn;
    return fn;
  };

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
        <RegionSelectorSidebarBox
          regions={activeImage ? activeImage.regions : []}
          onSelectRegion={action("SELECT_REGION", "region")}
          onDeleteRegion={action("DELETE_REGION", "region")}
          onChangeRegion={action("CHANGE_REGION", "region")}
        />
        {/* <RegionsList /> */}
      </div>
    </aside>
  );
}

export default ToolSideBar;
