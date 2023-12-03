import { useRecoilState } from "recoil";
import { imageState, pdfImageState } from "../atoms";

function ThumbnailsBox() {
  const [image, setImage] = useRecoilState(imageState);
  const [pdfImage, setPdfImage] = useRecoilState(pdfImageState);

  // pdfImage가 null이면 빈 객체로 초기화
  const images = pdfImage || {};

  const handleImageClick = (selectedImage: { title?: string; url: any; }) => {
    const newImage = new Image();
    newImage.src = selectedImage.url;
    setImage(newImage);
  };


  // 다음 이미지 페이지로 이동
  const goToNextPage = () => {
    const imageKeys = Object.keys(images);
    const currentIndex = imageKeys.findIndex((key) => images[key].url === image?.src);

    if (currentIndex !== -1 && currentIndex < imageKeys.length - 1) {
      const nextImageKey = imageKeys[currentIndex + 1];
      const nextImage = images[nextImageKey];
      setImage((prevImage) => ({ ...prevImage, src: nextImage.url } as HTMLImageElement));
    }
  };
  // 이전 이미지 페이지로 이동
  const goToPreviousPage = () => {
    const imageKeys = Object.keys(images);
    const currentIndex = imageKeys.findIndex((key) => images[key].url === image?.src);

    if (currentIndex !== -1 && currentIndex > 0) {
      const previousImageKey = imageKeys[currentIndex - 1];
      const previousImage = images[previousImageKey];
      setImage((prevImage) => ({ ...prevImage, src: previousImage.url } as HTMLImageElement));
    }
  };


  return (
    <>
      <aside
        id="sidebar"
        className="flex flex-none h-full z-30 w-72 md:w-75 bg-gray-50 transition-width"
      >
        <div className="h-screen w-full overflow-y-auto pt-20 px-5">
          <p className="text-xl font-bold mb-3">Thumbnails</p>
          {Object.values(images).map((image, index) => (
            <img
              key={index}
              alt={image.title}
              className="border-2 border-zinc-600 mt-5 mb-3"
              src={image.url}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default ThumbnailsBox;