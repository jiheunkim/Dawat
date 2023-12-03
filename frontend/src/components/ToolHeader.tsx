import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Navbar } from "flowbite-react";
import { BiImport, BiSolidFileExport } from "react-icons/bi";
import ImportBtn from "./ImportBtn";
import ExportBtn from "./ExportBtn";

const theme = {
  active: {
    on: "bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700",
    off: "border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white",
  },
};
function ToolHeader() {
  const location = useLocation();
  const isToolPage = location.pathname.includes("/tool-"); // '/tool-'로 시작하는 페이지 여부 판단
  const [activeLink, setActiveLink] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const getButtonStyle = (path: string) => {
    return path === activeLink ? theme.active.on : theme.active.off;
  };
  const getButtonStyle2 = (path1: string, path2: string) => {
    return path1 === activeLink || path2 === activeLink
      ? theme.active.on
      : theme.active.off;
  };

  return (
    <Navbar border fluid className="fixed left-0 right-0 top-0 z-50">
      <Navbar.Brand href="/">
        <img
          alt="Dawat Logo"
          className="mr-1 h-6 sm:h-9"
          src="/img/dawat_logo_0.png"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          DAWAT
        </span>
      </Navbar.Brand>
      <div className="flex items-center">
        <Navbar.Collapse className="mr-5">
          <Navbar.Link theme={theme} href="/" className={getButtonStyle("/")}>
            Home
          </Navbar.Link>
          <Navbar.Link
            theme={theme}
            href="/tool-thumbnails"
            className={getButtonStyle2("/tool-thumbnails", "/tool-annotation")}
          >
            Tool
          </Navbar.Link>
          <Navbar.Link
            theme={theme}
            href="/howtouse"
            className={getButtonStyle("/howtouse")}
          >
            How to Use
          </Navbar.Link>
        </Navbar.Collapse>
        {isToolPage && (
          <div className="flex space-x-3">
            <ImportBtn />
            <ExportBtn />
            {/* <Button color="blue">
              <BiSolidFileExport className="mr-2 h-5 w-5" />
              <p>Export</p>
            </Button> */}
          </div>
        )}
      </div>
    </Navbar>
  );
}

export default ToolHeader;