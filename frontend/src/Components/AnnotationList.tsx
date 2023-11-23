import { MdCircle, MdDelete } from "react-icons/md";
import { SetStateAction, useEffect, useState } from 'react';
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
    const [search, setSearch] = useState('');
    const [originalAnnotationInfo, setOriginalAnnotationInfo] = useState<Segment[]>([]);
    const [annotationInfo, setAnnotationInfo] = useState<Segment[]>([]);
    const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
    const [fileName, setFileName] = useState('');
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

    const handleSearchChange = (e: { target: { value: string; }; }) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);

        const filteredAnnotations = originalAnnotationInfo.filter((segment: { title: string; }) =>
            segment.title.toLowerCase().includes(searchTerm)
        );

        // 필터링된 결과를 state에 업데이트
        setAnnotationInfo(filteredAnnotations);
    };

    const handleSearchButtonClick = () => {
        // 검색어를 기반으로 annotationInfo를 필터링
        const filteredAnnotations = originalAnnotationInfo.filter((segment) =>
            segment.title.toLowerCase().includes(search.toLowerCase())
        );
        
        setAnnotationInfo(filteredAnnotations);
    };      

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

            setOriginalAnnotationInfo(segmentsArray);
            setAnnotationInfo(segmentsArray);
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
            <div className="relative">
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={search}
                    onChange={handleSearchChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search annotation list"
                />
                <button
                    className="absolute right-2 top-2"
                    onClick={handleSearchButtonClick}
                >
                    <img
                        className="w-5 h-5 mt-1 mr-1"
                        src="/image/icon_search.png"
                        alt="Search"
                    />
                </button>
            </div>
            <br></br>
            <div className="flex flex-col">
                {renderAnnotations()}
            </div>
        </aside>
    );
}

export default AnnotationList;