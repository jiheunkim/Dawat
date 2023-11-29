import { Button } from "flowbite-react";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

function GuideAnnotationAdd() {

    const navigate = useNavigate();

    const backPage = () => {
        navigate('/howtouse');
    }

  return (
    <>
    <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-blue-100 text-gray-700'>
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='comp_summary  text-center mx-auto md:w-[80%]'>
                    <div>
                        <h2 className='text-4xl font-semibold font-mono pt-10 pb-5'>Annotation Add</h2>
                        <p className='text-lg font-light'>If you have an annotation list you want to register, you can add it!</p>
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
                            <video playsInline muted autoPlay loop className='m-0'>
                                <source src="/video/AnnotationAddVideo.mp4" type="video/mp4" />
                                "Sorry, your browser doesn't support embedded videos."
                            </video>
                            <div className='text-gray-600 text-sm mt-3 md:mt-4'>
                            </div>
                            <Button className="mt-7 ml-auto mb-5" color="blue"
                                onClick={backPage}>
                                <p className="text-lg">Go Back</p>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <Footer />
    </>
  );
}

export default GuideAnnotationAdd;