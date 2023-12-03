import { Button } from "flowbite-react";
import { BiSolidFileExport } from "react-icons/bi";
import { useRecoilState } from "recoil";
import {
  masksInfoState,
} from "../atoms";
import { exportFile } from "../api/dawatAxios";

const ExportBtn = () => {
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);

  const handleExportClick = async () => {
    if (masksInfo) {
        const downloadLink = document.createElement('a');
        try {
            // exportFile 함수를 호출하여 파일 다운로드 URL을 가져옴
            const downloadUrl = await exportFile(masksInfo.Image.file_name);
      
            if (downloadUrl) {
              // 다운로드 링크 설정
              
              downloadLink.href = "http://norispaceserver.iptime.org:8000/download/"+masksInfo.Image.file_name;
              downloadLink.download = masksInfo.Image.file_name;
      
              // 링크를 생성하여 클릭
              document.body.appendChild(downloadLink);
              downloadLink.click();
      
              // 생성한 링크 제거
              document.body.removeChild(downloadLink);
            } else {
              console.error('Failed to get download URL.');
            }
          } catch (error) {
            console.error('Error during file download:', error);
          }
    }
  };

  return (
    <>
      <Button color="blue" onClick={handleExportClick}>
        <BiSolidFileExport className="mr-2 h-5 w-5" />
        <p>Export</p>
      </Button>
    </>
  );
};

export default ExportBtn;