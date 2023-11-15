import { MdCircle, MdDelete } from "react-icons/md";
import { useState } from 'react';
import './AnnotationList.css';

interface Segment {
    id: number;
    segmentation_image_url: string;
}

interface AnnotationListProps {
    onAnnotationClick: (selectedSegment: Segment, annotationText: string) => void;
}

function AnnotationList({ onAnnotationClick }: AnnotationListProps) {
    const colors = ['pink', 'orange', 'green', 'blue', 'yellow', 'purple'];

    // 실제로는 백엔드 api 연결해서 받아오는 데이터
    const [segments, setSegments] = useState<Segment[]>([
        { id: 0, segmentation_image_url: "./mask_0.png" },
        { id: 1, segmentation_image_url: "./mask_1.png" },
        { id: 2, segmentation_image_url: "./mask_10.png" },
        { id: 3, segmentation_image_url: "./mask_19.png" },
        { id: 4, segmentation_image_url: "./mask_2.png" },
        { id: 5, segmentation_image_url: "./mask_12.png" },
        { id: 6, segmentation_image_url: "./mask_21.png" },
        // ... 추가적인 세그먼트 ...
    ]);
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    // segments 객체의 key를 순회하며 Annotation 항목 렌더링
    const renderAnnotations = () => {
        return segments.map((segment, index) => {
            if (deletedIds.includes(segment.id)) {
                return null; // 삭제된 항목은 렌더링하지 않음
            }

            const annotationText = `Annotation${index + 1}`;

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
        onAnnotationClick(segment, `Annotation${segment.id + 1}`);
        console.log(`Annotation ${segment.id} clicked`);
    };

    // Annotation 항목 삭제 이벤트 핸들러
    const handleDelete = (id: number) => {
        if (!deletedIds.includes(id)) {
            setDeletedIds((prevIds) => [...prevIds, id]);
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