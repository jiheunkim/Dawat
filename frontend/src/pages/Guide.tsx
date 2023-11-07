// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useEffect, useState } from "react";
import { FaMousePointer, FaHandPaper, FaSearch, FaTag, FaCrosshairs, FaVectorSquare } from "react-icons/fa"
import { FaWandMagicSparkles } from "react-icons/fa6"

const Guide = () => {

    const faStyle = { marginTop: 4, width: 35, height: 35, marginBottom: 4, marginRight: 20 };
  
    return (
        <>
        <div className="comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700">
            <div className="flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20">
                <div className="flex-1  self-start max-w-none prose-lg mx-4 text-gray-700">
                    <p className="text-4xl font-semibold font-mono pt-10 pb-1">STEP1</p>
                    <p>Please select the document you want to proceed with auto-labeling. Click the&nbsp;
                        <span className="font-semibold">'Import'</span> button to upload the desired document.
                    </p>
                    <br></br>
                    <video playsInline autoPlay loop muted className='m-0' width="720">
                        <source src="/video/upload.mp4" type="video/mp4" />
                        "Sorry, your browser doesn't support embedded videos."
                    </video>
                </div>
            </div>
        </div>
        <div className="comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700">
            <div className="flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20">
                <div className="flex-1  self-start max-w-none prose-lg mx-4 text-gray-700">
                    <p className="text-4xl font-semibold font-mono pt-10 pb-1">STEP2</p>
                    <p>Choose a tool that allows you to perform the task you desire.</p>
                    <br></br>
                    <div className="">
                        <FaMousePointer />
                        <FaHandPaper />
                        <FaSearch />
                        <FaTag />
                        <FaCrosshairs />
                        <FaVectorSquare />
                        <FaWandMagicSparkles />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Guide;
