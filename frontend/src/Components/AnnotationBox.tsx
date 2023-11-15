import React, { useState } from 'react';
import AnnotationEditor from "./AnnotationEditor";
import AnnotationList from "./AnnotationList";

interface Segment {
    id: number;
    segmentation_image_url: string;
}

function AnnotationBox() {
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
    const [selectedAnnotationText, setSelectedAnnotationText] = useState<string>('');
    const [selectedOnUpdateTitle, setSelectedOnUpdateTitle] = useState<(id: number, title: string) => void>(() => () => {});

    const handleAnnotationClick = (selectedSegment: Segment, annotationText: string) => {
        setSelectedSegment(selectedSegment);
        setSelectedAnnotationText(annotationText);
        
        setSelectedOnUpdateTitle(() => (id: number, title: string) => {
            console.log(`Update title for id ${id}: ${title}`);
        });
    };

    return (
        <>
            <aside
                id="sidebar"
                className="flex flex-none h-full z-40 w-72 md:w-75 bg-gray-50 transition-width"
            >
                <div className="h-screen w-full overflow-y-auto pt-20 px-5">
                    <p className="text-xl font-bold mb-3">Annotation</p>
                    <AnnotationList onAnnotationClick={handleAnnotationClick} />
                </div>
            </aside>
            <AnnotationEditor
                selectedSegment={selectedSegment}
                annotationText={selectedAnnotationText}
                onUpdateTitle={selectedOnUpdateTitle}
            />
        </>
    );
}

export default AnnotationBox;