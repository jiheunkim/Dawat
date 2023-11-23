import React, { useState } from 'react';
import AnnotationEditor from "./AnnotationEditor";
import AnnotationList from "./AnnotationList";
import { Segment } from '../interfaces/Interfaces';


function AnnotationBox() {
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
    const [selectedAnnotationText, setSelectedAnnotationText] = useState<string>('');
    const [selectedAnnotationTag, setSelectedAnnotationTag] = useState<string[]>([]);
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    const handleAnnotationClick = (selectedSegment: Segment) => {
        setSelectedSegment(selectedSegment);
        setSelectedAnnotationText(selectedSegment.title);
        const tagArray = selectedSegment.tag ? selectedSegment.tag.split(',') : [];
        setSelectedAnnotationTag(tagArray);

        setIsEditorVisible(true);
    };

    const handleAnnotationUpdate = (oldKey: string, newKey: string) => {
        if (selectedSegment && selectedSegment.title === oldKey) {
            setSelectedAnnotationText(newKey);
        }
    };

    const handleTagUpdate = (newTag: string[]) => {
        setSelectedAnnotationTag(newTag);
    };

    return (
        <>
            <aside
                id="sidebar"
                className="flex flex-none h-full z-30 w-72 md:w-75 bg-gray-50 transition-width"
            >
                <div className="h-screen w-full overflow-y-auto pt-20 px-5">
                    <div className='flex justify-between items-center mb-3'>
                        <p className="text-xl font-bold">Annotation</p>
                        <button
                            // onClick={} // annotation list add 이벤트 추가
                            className="bg-black text-sm text-white px-4 py-1 rounded-md ml-1"
                        >
                            Add
                        </button>
                    </div>
                    <AnnotationList onAnnotationClick={handleAnnotationClick} />
                </div>
            </aside>
            <AnnotationEditor
                selectedSegment={selectedSegment}
                annotationText={selectedAnnotationText}
                onAnnotationUpdate={handleAnnotationUpdate}
                annotationTag={selectedAnnotationTag}
                onTagUpdate={handleTagUpdate}
            />
        </>
    );
}

export default AnnotationBox;