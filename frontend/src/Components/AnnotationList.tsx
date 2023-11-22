import { MdCircle, MdDelete } from "react-icons/md";
import { useEffect, useState } from 'react';
import axios from 'axios';
import './AnnotationList.css';
import { useRecoilState } from "recoil";
import { masksInfoState } from "../atoms";
import { Segment } from "../interfaces/Interfaces";


interface AnnotationListProps {
    onAnnotationClick: (selectedSegment: Segment, annotationText: string) => void;
}

function AnnotationList({ onAnnotationClick }: AnnotationListProps) {
    const colors = ['pink', 'orange', 'green', 'blue', 'yellow', 'purple'];
    const [annotationInfo, setAnnotationInfo] = useState<Segment[]>([]);
    const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
    const [fileName, setFileName] = useState('');
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

    useEffect(() => {
        if (masksInfo) {
          const annotationData = masksInfo.annotation;
          const file_name = masksInfo.Image.file_name;
          const segmentsArray: Segment[] = [];

          Object.keys(annotationData).forEach((key) => {
            const segmentData = annotationData[key];
        
            const segment: Segment = {
                id: segmentData.id,
                bbox: segmentData.bbox,
                area: segmentData.area,
                crop_box: segmentData.crop_box,
                point_coords: segmentData.point_coords,
                title: segmentData.title,
                tag: segmentData.tag,
            };
        
            segmentsArray.push(segment);
          });
          setAnnotationInfo(segmentsArray);
          console.log(annotationInfo);
          setFileName(file_name);
        }
    }, [masksInfo]);

    // segments 객체의 key를 순회하며 Annotation 항목 렌더링
    const renderAnnotations = () => {
        return annotationInfo.map((segment, index) => {
            const annotationText = segment.title;

            return (
                <div
                    className={`flex items-center mb-3`}
                    key={index}
                >
                    <MdCircle className={`text-sm mr-2 ${colors[index % colors.length]}`} onClick={() => handleItemClick(segment)}/>
                    <p className="text-m font-seminold mb-0 flex-grow" onClick={() => handleItemClick(segment)}>{annotationText}</p>
                    <MdDelete className="text-xl darkgray" onClick={() => handleDelete(segment.id)} />
                </div>
            );
        });
    };

    // Annotation 항목 클릭 이벤트 핸들러
    const handleItemClick = (segment: Segment) => {
        setSelectedSegment(segment);
        onAnnotationClick(segment, segment.title);
        console.log(`Annotation ${segment.id} clicked`);
    };

    // Annotation 항목 삭제 이벤트 핸들러
    const handleDelete = async (id: number) => {
        console.log(fileName, id.toString());
            try {
              // 백엔드 API로 삭제 요청 보내기
              const response = await axios.post('http://norispaceserver.iptime.org:8000/delete_key', {
                image_name: fileName,
                id: id,
              });
      
              // 백엔드로부터 받은 데이터를 이용하여 상태 업데이트
              setMasksInfo(response.data);
              console.log(response.data);
            } catch (error) {
              console.error('Error deleting annotation:', error);
            }
    };

    return (
        <aside id="annotationlist" className="annotationlist">
            <div className="flex flex-col">
                {renderAnnotations()}
            </div>
        </aside>
    );
}

export default AnnotationList;