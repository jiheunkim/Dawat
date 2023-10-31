// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React from 'react';

const Start = () => {
  return (
    <>
    <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-blue-100 text-gray-700'>
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='comp_summary  text-center mx-auto md:w-[80%]'>
                    <div>
                        <h2 className='text-4xl font-semibold font-mono pt-10 pb-5'>Norispace X MYLC</h2>
                        <p className='text-lg font-light'>A service that utilizes Norispace's SAM Model to segment image documents and perform automatic labeling</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700'>
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='comp_summary  text-center mx-auto md:w-[80%]'>
                    <div>
                        <h2 className='text-3xl font-semibold pt-10 pb-5'>What is the SAM Model?</h2>
                        <br></br>
                        <p className='text-2xl font-semibold pt-10 pb-5'>SAM uses a variety of input prompts</p>
                        <p>Prompts specifying what to segment in an image allow for a wide range of<br></br>segmentation tasks without the need for additional training.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className='comp_gallery flex w-screen justify-center self-stretch bg-white text-gray-700'>
        <div className='max-w-screen-xl flex flex-1 flex-row items-center justify-start px-5 md:px-20 xl:px-10 pt-4 pb-4'>
            <div className='flex flex-col md:flex-row flex-1 flex-grow-4 self-start max-w-none'>
                <div className='flex-col flex-1'>
                    <div className='p-1 md:p-3 aspect-auto'>
                        <div className='comp_video w-full relative flex flex-col aspect-w-16 aspect-h-9 mb-4 lg:mb-0'>
                            <video playsInline autoPlay loop className='m-0'>
                                <source src="https://segment-anything.com/assets/section-1.1a.mp4" type="video/mp4" />
                                "Sorry, your browser doesn't support embedded videos."
                            </video>
                            <div className='text-gray-600 text-sm mt-3 md:mt-4'>
                            Prompt it with interactive points and boxes.
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-col flex-1'>
                    <div className='p-1 md:p-3 aspect-auto'>
                        <div className='comp_video w-full relative flex flex-col aspect-w-16 aspect-h-9 mb-4 lg:mb-0'>
                            <video playsInline autoPlay loop className='m-0'>
                                <source src="https://segment-anything.com/assets/section-1.1b.mp4" type="video/mp4" />
                                "Sorry, your browser doesn't support embedded videos."
                            </video>
                            <div className='text-gray-600 text-sm mt-3 md:mt-4'>
                            Automatically segment everything in an image.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700">
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-col mr-4 pt-2 items-start justify-start h-full text-sm'>
                <div className='aspect-w-4 aspect-h-4'>
                    <div className='comp_video w-full relative flex flex-col absolute object-cover right-0 bottom-0 min-w-full min-h-full h-full undefined'>
                        <video playsInline autoPlay loop className='m-0 w-full h-full object-cover object-center'>
                            <source src="https://segment-anything.com/assets/section-3.1c.mp4" type="video/mp4" />
                            "Sorry, your browser doesn't support embedded videos."
                        </video>
                    </div>
                </div>
            </div>
            <div className='flex-1  self-centered max-w-none prose-lg mx-4'>
                <div className='comp_summary  text-left undefined'>
                    <div>
                        <h2 className='text-3xl font-semibold'>Efficient & flexible model design</h2>
                        <br></br>
                        <h6 className='text-gray-600'>
                            "SAM is designed to be efficient enough to power its data engine. We decoupled the model into 1) a one-time image encoder and 2) a lightweight mask decoder that can run in a web-browser in just a few milliseconds per prompt."
                        </h6>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
      
    </>
  );
};

export default Start;
