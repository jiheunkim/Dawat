import React, { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { MdEdit, MdClose } from "react-icons/md";
import { Segment } from '../interfaces/Interfaces';
import { useRecoilState } from 'recoil';
import { masksInfoState } from '../atoms';
import axios from 'axios';


interface AnnotationEditorProps {
    selectedSegment: Segment | null;
    annotationText: string;
    onAnnotationUpdate: (oldKey: string, newKey: string) => void;
    annotationTag: string[];
    onTagUpdate: (newTag: string[]) => void;
}

function AnnotationEditor({ selectedSegment, annotationText, onAnnotationUpdate, annotationTag, onTagUpdate }: AnnotationEditorProps) {
  const [annotationInfo, setAnnotationInfo] = useState<Segment[]>([]);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  const [fileName, setFileName] = useState('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<{ [key: number]: string[] }>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<{ [key: number]: string }>({});
  const [xValue, setXValue] = useState<string>("0.2");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
      if (selectedSegment) {
        setEditedText((prevEditedText) => {
            const updatedTexts = { ...prevEditedText };
            updatedTexts[selectedSegment.id] = annotationText;
            return updatedTexts;
        });

        setTags((prevTags) => ({
          ...prevTags,
          [selectedSegment.id]: annotationTag,
        }));
      }

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
      
      setIsVisible(!!selectedSegment);
  }, [selectedSegment, annotationText, masksInfo, annotationTag]);

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };
  
  const handleTagInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedSegment && event.key === 'Enter' && tagInput.trim() !== '') {
      const newTag = tagInput.trim();
      if (!tags[selectedSegment.id]?.includes(newTag)) {
        setTags((prevTags) => ({
          ...prevTags,
          [selectedSegment.id]: [...(prevTags[selectedSegment.id] || []), newTag],
        }));
      }
      setTagInput('');
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveEdit = async () => {
    if (selectedSegment) {
      const oldText = annotationText;
      const newText = editedText[selectedSegment.id];

      // 수정된 내용이 원래의 내용과 다르면 서버에 업데이트 요청 보냄
      if (newText && newText !== oldText) {
          try {
              const response = await axios.post('http://norispaceserver.iptime.org:8000/update_key', {
                  image_name: fileName,
                  old_key: oldText,
                  new_key: newText,
              });

              // 업데이트 성공하면 부모 컴포넌트에도 알림
              onAnnotationUpdate(oldText, newText);
              setMasksInfo(response.data);
              
              console.log(oldText, " ", newText);
          } catch (error) {
              console.error('Error updating annotation:', error);
          }
      }

      setEditMode(false);
    }
  };

  const handleSaveTag = async () => {
    if (selectedSegment) {
      const tagsString = tags[selectedSegment.id]?.join(',') || '';
      try {
        const response = await axios.post('http://norispaceserver.iptime.org:8000/update_tags', {
          image_name: fileName,
          id: selectedSegment.id,
          tags: tagsString
        });
  
        // 업데이트 성공하면 부모 컴포넌트에도 알림
        onTagUpdate(tags[selectedSegment.id]);
        setMasksInfo(response.data);
  
        
      } catch (error) {
        console.error('Error updating annotation:', error);
      }
      console.log(tagsString);
    }
  };

  const handleRemoveTag = (index: number) => {
    if (selectedSegment) {
      const updatedTags = { ...tags };
      if (updatedTags[selectedSegment.id]) {
        updatedTags[selectedSegment.id] = updatedTags[selectedSegment.id].filter((_, i) => i !== index);
        setTags(updatedTags);
      }
    }
  };

  const closeEditor = () => {
    setIsVisible(false);
  }

  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <aside
      id="editorbox"
      className={`absolute z-30 bg-gray-100 transition-width rounded-lg overflow-hidden ${isVisible ? 'visible' : 'hidden'}`}
      style={{
        top: 80,
        left: 400,
        width: 305,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      onMouseDown={(clickEvent: React.MouseEvent<Element, MouseEvent>) => {
        const mouseMoveHandler = (moveEvent: MouseEvent) => {
          const deltaX = moveEvent.screenX - clickEvent.screenX;
          const deltaY = moveEvent.screenY - clickEvent.screenY;

          setPosition({
            x: x + deltaX,
            y: y + deltaY,
          });
        };

        const mouseUpHandler = () => {
          document.removeEventListener("mousemove", mouseMoveHandler);
        };

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler, {
          once: true,
        });
      }}
    >
      <div className="pt-5 px-5">
        <p className="text-xl font-bold ml-2 mb-3">Annotation Editor</p>
        <MdClose
          className="absolute top-4 right-5"
          onClick={closeEditor}
        />
        {selectedSegment && (
          <>
            <div className="flex items-center mb-3">
              <p className="font-semibold mb-2 ml-4 mr-1">Title</p>
              <MdEdit
                className={`text-sm mb-2 cursor-pointer ${editMode ? 'text-green-500' : ''}`}
                onClick={handleEditToggle}
              />
            </div>
            {editMode ? (
              // Edit 모드일 때 수정 가능한 입력 상자
              <div className="rounded-lg bg-white p-4 mb-4">
                <textarea
                  value={editedText[selectedSegment.id]}
                  onChange={(e) =>
                    setEditedText((prevEditedText) => ({
                      ...prevEditedText,
                      [selectedSegment.id]: e.target.value,
                    }))
                  }
                  className="w-full h-18 p-2 border border-dashed outline-none focus:border-solid focus:border-black rounded-md"
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                  Save
                </button>
              </div>
            ) : (
              // Edit 모드가 아닐 때 표시되는 내용
              <div className="rounded-lg bg-white p-4 mb-4">
                <p>{editedText[selectedSegment.id] || annotationText}</p>
              </div>
            )}
            {/* <p className="font-semibold mb-2 ml-4">Point</p>
            <div className="rounded-lg bg-white p-4 mb-4">
              <p>
                <div className="inline-block font-semibold bg-gray-200 rounded-full px-3 py-1 text-sm m-1">
                  X
                </div>: 
                <div className="inline-block font-semibold bg-pink-200 rounded-full px-3 py-1 text-sm m-1 ml-2 mr-10">
                  {`0.3`}
                </div>
                <div className="inline-block font-semibold bg-pink-200 rounded-full px-3 py-1 text-sm m-1 ml-2 mr-10">
                <input
                    type="number"
                    value={xValue}
                    onChange={(e) => setXValue(e.target.value)}
                    onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        setXValue(xValue);
                    }
                    }}
                    className="bg-pink-200 border-none"
                />
                </div>
                <div className="inline-block font-semibold bg-gray-200 rounded-full px-3 py-1 text-sm m-1">
                  Y
                </div>: 
                <div className="inline-block font-semibold bg-blue-200 rounded-full px-3 py-1 text-sm m-1 ml-2">
                  {`0.3`}
                </div>
              </p>
            </div> */}
            <div className="flex items-center">
                <p className="font-semibold mb-2 ml-4 mr-1">Tag</p>
                <FaPlusCircle className="text-sm mb-1" />
            </div>
            <input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyPress={handleTagInputKeyPress}
                className="text-sm border-2 border-dashed p-2 outline-none focus:border-solid focus:border-black rounded-md ml-3 mb-3"
            />
            <button
                onClick={handleSaveTag}
                className="bg-black text-white px-4 py-2 rounded-md ml-1 mt-2"
              >
                Save
              </button>
              <div className="rounded-lg mb-4">
                {tags[selectedSegment.id]?.map((tag, index) => (
                  <div key={index} className="inline-block font-semibold bg-gray-200 rounded-full px-3 py-1 text-sm m-1">
                    {tag}
                    <span className='cursor-pointer font-light' onClick={() => handleRemoveTag(index)}>&nbsp;&nbsp;X</span>
                  </div>
                ))}
              </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default AnnotationEditor;