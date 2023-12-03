// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "flowbite-react";
import { BiImport, BiSolidFileExport, BiNavigation } from "react-icons/bi";
import Footer from "../components/Footer";
import AnnotationListDemo from "../components/AnnotationListDemo";
import { FaEllipsis, FaWandMagicSparkles } from "react-icons/fa6";
import { FaHandPaper, FaMousePointer, FaVectorSquare } from "react-icons/fa";
const buttonTailwind =
  "m-1 p-2 hover:bg-gray-700 rounded-lg transition-all text-white text-lg";
const activebuttonTailwind = "bg-gray-700";

const Guide = () => {
    const [activeButton, setActiveButton] = useState("");
    const handleButtonClick = (buttonName: string) => {
        console.log(`${buttonName} 클릭됨`);
        setActiveButton(buttonName);
    };
    const [showVideo, setShowVideo] = useState(false);
    const [videoInfo, setVideoInfo] = useState({
      src: "",
      title: "",
      description: "",
    });
    const [videoBoxPosition, setVideoBoxPosition] = useState({
        top: 0,
        right: 0,
    });
    const navigate = useNavigate();
  
    const showDemoVideo = (videoSrc: string, pageTitle: string, description: string, buttonRect: DOMRect) => {
        setVideoInfo({
            src: videoSrc,
            title: pageTitle,
            description: description,
        });
    
        // 계산된 위치
        const top = buttonRect.bottom + window.scrollY + 20;
        const right = window.innerWidth - buttonRect.right;
    
        setShowVideo(!showVideo);
        setVideoBoxPosition({ top, right });
    };
    
  
    const moveToolPage = () => {
      navigate("/tool-thumbnails");
    };
  
    const moveLearnMore = (path: string) => {
      navigate(`/learn-more/${path}`);
    };
  
    return (
        <>
        <div className="comp_content w-screen justify-center self-stretch bg-blue-100 text-gray-700">
            <div className="md:flex-row box-border max-w-screen-xl items-center justify-center m-auto px-5 md:px-20 xl:px-10 pt-20">
                <div className="flex flex-col items-center justify-center max-w-none prose-lg text-gray-700">
                    <p className="text-4xl font-semibold self-start font-sans pt-10 pb-1">Learn How to Use<br></br>
                        <span className="text-blue-700">DAWAT</span> Auto Labelling Tool</p>
                    <p className="self-start text-xl mt-4">Discover the features you're curious about with a simple click!</p>
                <br></br>
                </div>
                <div className="bg-white">
                    <div className="flex ml-auto justify-end space-x-3 mr-3">
                        <Button
                            className="mt-3 mb-3"
                            color="light"
                            onMouseEnter={(event) => {
                                const targetElement = event.target as HTMLElement;
                                showDemoVideo(
                                    "/video/ImportVideo.mp4",
                                    "import",
                                    "Press the button and select the desired file!",
                                    targetElement.getBoundingClientRect()
                                );
                            }}
                        >
                            <BiImport className="mr-2 h-5 w-5" />
                            <p>Import</p>
                        </Button>
                        <Button
                            className="mt-3 mb-3"
                            color="blue"
                            onMouseEnter={(event) => {
                                const targetElement = event.target as HTMLElement;
                                showDemoVideo(
                                    "/video/ExportVideo.mp4",
                                    "export",
                                    "Press the Export button to download the json file containing the Annotation information!",
                                    targetElement.getBoundingClientRect()
                                );
                            }}
                        >
                            <BiSolidFileExport className="mr-2 h-5 w-5" />
                            <p>Export</p>
                        </Button>
                    </div>
                    <div className="flex">
                        {/* white-box */}
                        {showVideo && (
                        <aside
                            id="videobox"
                            className={`absolute z-40 bg-gray-100 rounded-lg overflow-hidden`}
                            style={{
                                top: `${videoBoxPosition.top}px`,
                                right: `${videoBoxPosition.right}px`,
                                width: 250,
                            }}
                        >
                            {/* 비디오 재생 컴포넌트 */}
                            <video
                                muted
                                autoPlay
                                loop
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                >
                                <source src={videoInfo.src} type="video/mp4" />
                            </video>
                            <div className="bg-black px-3 py-3 pt-2 pb-2">
                                <p className="text-white">{videoInfo.description}</p>
                                <br></br>
                                <p
                                    className="text-blue-300 text-right mr-2"
                                    onClick={() => moveLearnMore(videoInfo.title)}
                                >
                                    → Learn More
                                </p>
                            </div>
                        </aside>
                        )}
                    </div>
                </div>
                <div className="flex">
                    <aside
                        id="sidebar"
                        className="flex flex-none h-100 z-30 w-72 md:w-75 bg-gray-50"
                    >
                        <div className="h-100 w-full pt-20 px-5 pb-3 overflow-hidden">
                            <div id="annotationlist" className="h-full">
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-3">
                                    <p className="text-xl font-bold">Annotation</p>
                                    </div>
                                    <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search annotation list"
                                    onClick={(event) => {
                                        const targetElement = event.target as HTMLElement;
                                        showDemoVideo(
                                            "/video/AnnotationSearchVideo.mp4",
                                            "annotation-search",
                                            "If you have an annotation list you want to find, you can easily locate it by entering a search query!",
                                            targetElement.getBoundingClientRect()
                                        );
                                    }}
                                    />
                                </div>
                                <div
                                    onMouseEnter={(event) => {
                                        const targetElement = event.target as HTMLElement;
                                        showDemoVideo(
                                            "/video/AnnotationListVideo.mp4",
                                            "annotation-list",
                                            "You can easily check the results of everything on the image document through the annotation list!",
                                            targetElement.getBoundingClientRect()
                                        );
                                    }}
                                >
                                    <AnnotationListDemo />
                                </div>
                            </div>
                        </div>
                    </aside>
                    <div
                        className="w-full h-full flex items-center justify-center bg-gray-200 overflow-hidden"
                    >
                        <img
                            className="flex mt-5 mb-5 ml-20"
                            alt="document"
                            src={process.env.PUBLIC_URL + '/image/dawat_example.png'}
                            width='300'
                        />
                        <canvas className="w-full h-full relative"></canvas>
                        <div
                            className="flex mr-4"
                            style={{
                                top: "calc((100% - 100px)/2)",
                            }}
                        >
                            <div
                                className="pb-2 flex flex-col bg-gray-900 dark:bg-gray-800 transition-all"
                                style={{
                                borderRadius: "12px",
                                }}
                            >
                                <div className="cursor-pointer py-1 flex justify-center items-center text-white">
                                    <FaEllipsis />
                                </div>
                                <button
                                    className={`${buttonTailwind} ${
                                        activeButton === "FaHandPaper" ? activebuttonTailwind : ""
                                    }`}
                                    onMouseEnter={(event) => {
                                        handleButtonClick("FaHandPaper");
                                        const targetElement = event.target as HTMLElement;
                                        showDemoVideo(
                                            "/video/DragVideo.mp4",
                                            "drag",
                                            "Drag the image to where you want it!",
                                            targetElement.getBoundingClientRect()
                                        );
                                    }}
                                >
                                    <FaHandPaper />
                                </button>
                                <button
                                    className={`${buttonTailwind} ${
                                        activeButton === "FaMousePointer" ? activebuttonTailwind : ""
                                    }`}
                                    onMouseEnter={(event) => {
                                        handleButtonClick("FaMousePointer");
                                        const targetElement = event.target as HTMLElement;
                                        showDemoVideo(
                                            "/video/SelectVideo.mp4",
                                            "select",
                                            "Click on the part you want in the image to see more information about annotiation!",
                                            targetElement.getBoundingClientRect()
                                        );
                                    }}
                                >
                                    <FaMousePointer />
                                </button>
                                <button
                                    className={`${buttonTailwind} ${
                                        activeButton === "FaWandMagicSparkles" ? activebuttonTailwind : ""
                                    }`}
                                    onMouseEnter={(event) => {
                                        handleButtonClick("FaWandMagicSparkles");
                                        const targetElement = event.target as HTMLElement;
                                        showDemoVideo(
                                            "/video/EverythingVideo.mp4",
                                            "everything",
                                            "You can instantly see the masked results for everything in the uploaded image!",
                                            targetElement.getBoundingClientRect()
                                        );
                                    }}
                                >
                                    <FaWandMagicSparkles />
                                </button>
                                <button
                                    className={`${buttonTailwind} ${
                                        activeButton === "FaVectorSquare" ? activebuttonTailwind : ""
                                    }`}
                                    onMouseEnter={(event) => {
                                        handleButtonClick("FaVectorSquare");
                                        const targetElement = event.target as HTMLElement;
                                        showDemoVideo(
                                            "/video/BBOXVideo.mp4",
                                            "bbox",
                                            "Draw bounding boxes to add the annotations you want!",
                                            targetElement.getBoundingClientRect()
                                        );
                                    }}
                                >
                                    <FaVectorSquare />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="h-20 bg-blue-100 text-gray-700">
            <br></br>
            <div className="md:flex-row box-border max-w-screen-xl items-center justify-center m-auto px-5 xl:px-10">
                <Button className="ml-auto" color="blue"
                    onClick={moveToolPage}>
                    <BiNavigation className="mr-2 h-5 w-5" />
                    <p className="text-xl">Get Started!</p>
                </Button>
            </div>
        </div>
        <div className="bg-blue-100">
            <br></br><br></br>
            <Footer />
        </div>
        </>
    );
  };
  
  export default Guide;