import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Button, Navbar } from "flowbite-react";
import { BiImport, BiSolidFileExport } from "react-icons/bi";
import ImportBtn from "./ImportBtn";

const theme = {
  active: {
    on: "bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700",
    off: "border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white",
  },
};
function ToolHeader() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (imageFile: File) => {
    // 이미지 파일을 서버로 업로드하거나 상태 관리
    // 예: 서버로 이미지 업로드 후, 이미지 URL을 받아와서 상태로 저장
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <Navbar border fluid className="fixed left-0 right-0 top-0 z-50">
      <Navbar.Brand href="/">
        <img alt="Dawat Logo" className="mr-1 h-6 sm:h-9" src="/image/dawat_logo_p.png" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          DAWAT
        </span>
      </Navbar.Brand>
      <div className="flex items-center">
        <Navbar.Collapse className="mr-5">
          <Navbar.Link theme={theme} href="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Navbar.Link>
          <Navbar.Link theme={theme} href="/tool" className={location.pathname === '/tool' ? 'active' : ''}>
            Tool
          </Navbar.Link>
          <Navbar.Link theme={theme} href="/howtouse" className={location.pathname === '/howtouse' ? 'active' : ''}>
            How to Use
          </Navbar.Link>
        </Navbar.Collapse>
        <div className="flex space-x-3">
          <ImportBtn onImageUpload={handleImageUpload} />
          <Button color="blue">
            <BiSolidFileExport className="mr-2 h-5 w-5" />
            <p>Export</p>
          </Button>
        </div>
      </div>
    </Navbar>
  );
}

export default ToolHeader;
