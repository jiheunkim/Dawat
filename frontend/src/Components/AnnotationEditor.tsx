import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";

interface Segment {
    id: number;  // 각 Annotation의 고유한 식별자
    segmentation_image_url: string;
}

interface AnnotationEditorProps {
    selectedSegment: Segment | null;
    annotationText: string;
    onUpdateTitle: (id: number, title: string) => void;
}

function AnnotationEditor({ selectedSegment, annotationText, onUpdateTitle }: AnnotationEditorProps) {
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(annotationText);
  const [xValue, setXValue] = useState<string>("0.2");

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput.trim() !== '') {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveEdit = () => {
    // 여기서 수정된 내용을 저장하고 서버에 전송하는 기능 추가
    setEditMode(false);
    // 저장 후 필요한 처리
    onUpdateTitle(selectedSegment?.id || 0, editedText);  // onUpdateTitle을 호출하여 제목 업데이트
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };


  return (
    <aside
      id="editorbox"
      className="flex flex-none z-40 bg-gray-100 transition-width rounded-lg overflow-hidden"
    >
      <div className="pt-20 px-5">
        <p className="text-xl font-bold ml-2 mb-3">Annotation Editor</p>
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
                  value={editedText || annotationText}
                  onChange={(e) => setEditedText(e.target.value)}
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
                <p>{editedText || annotationText}</p>
              </div>
            )}
            <p className="font-semibold mb-2 ml-4">Point</p>
            <div className="rounded-lg bg-white p-4 mb-4">
              <p>
                <div className="inline-block font-semibold bg-gray-200 rounded-full px-3 py-1 text-sm m-1">
                  X
                </div>: 
                <div className="inline-block font-semibold bg-pink-200 rounded-full px-3 py-1 text-sm m-1 ml-2 mr-10">
                  {`0.3`}
                </div>
                {/* <div className="inline-block font-semibold bg-pink-200 rounded-full px-3 py-1 text-sm m-1 ml-2 mr-10">
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
                </div> */}
                <div className="inline-block font-semibold bg-gray-200 rounded-full px-3 py-1 text-sm m-1">
                  Y
                </div>: 
                <div className="inline-block font-semibold bg-blue-200 rounded-full px-3 py-1 text-sm m-1 ml-2">
                  {`0.3`}
                </div>
              </p>
            </div>
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
                className="text-sm border-2 border-dashed p-2 outline-none focus:border-solid focus:border-black rounded-md ml-2 mb-3"
            />
            <div className="rounded-lg mb-4">
              {tags.map((tag, index) => (
                <div key={index} className="inline-block font-semibold bg-gray-200 rounded-full px-3 py-1 text-sm m-1">
                  {tag}
                  <span className='cursor-pointer font-light' onClick={() => handleRemoveTag(index)}>&nbsp;&nbsp;X</span>
                </div>
              ))}
            </div>
            <p className="font-semibold mb-2 ml-4">Check</p>
            <div className="rounded-lg bg-white p-4 mb-4">
              <p>{`Selected Annotation: ${selectedSegment.segmentation_image_url}`}</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default AnnotationEditor;