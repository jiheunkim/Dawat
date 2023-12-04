import React, { useEffect, useState } from "react";
import { MdEdit, MdClose, MdDraw } from "react-icons/md";
import { useRecoilState } from "recoil";
import {
  activeToolState,
  editState,
  masksInfoState,
  reDrawState,
  selectedAnnotState,
} from "../atoms";
import { Button, CustomFlowbiteTheme, Label, TextInput } from "flowbite-react";
import { postNewTags, postNewTitle } from "../api/dawatAxios";
import { HiOutlineArrowRight } from "react-icons/hi";
import { ToolList } from "./Tools";

function AnnotationEditor() {
  //
  const [isRedraw, setIsRedraw] = useRecoilState(reDrawState);
  // 선택한 anntation
  const [selectedAnnot, setSelectedAnnot] = useRecoilState(selectedAnnotState);
  // 전체 annotation 정보
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);
  // title input
  const [titleInput, setTitleInput] = useState<string>("");
  // tag input
  const [tagInput, setTagInput] = useState<string>("");
  // 선택된 annotation의 전체 태그
  const [tags, setTags] = useState<string[]>([]);
  const [editMode, setEditMode] = useRecoilState(editState);
  // tag input focus 여부
  const [activeTagInput, setActiveTagInput] = useState<boolean>(false);
  // editor의 위치
  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });
  // 선택된 툴 상태
  const [activeTool, setActiveTool] = useRecoilState(activeToolState);

  useEffect(() => {
    if (masksInfo && selectedAnnot) {
      const updatedAnnot =
        masksInfo.annotation[`annotation_${selectedAnnot.id}`];
      setSelectedAnnot(updatedAnnot);
      console.log(updatedAnnot);
    }
  }, [masksInfo]);

  useEffect(() => {
    if (selectedAnnot) {
      const title = selectedAnnot.title;
      let tagsArr: string[] = [];
      if (Array.isArray(selectedAnnot.tag)) {
        tagsArr = selectedAnnot.tag;
      }

      setTags(tagsArr.filter((tag: string) => tag !== ""));
      setTitleInput(title);
    }
  }, [selectedAnnot]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (selectedAnnot && masksInfo) {
      let reqSucess = false;
      // 제목이 바뀐 경우
      if (titleInput !== selectedAnnot.title) {
        const titleUpdateResult = await postNewTitle(
          masksInfo.Image.file_name,
          titleInput,
          selectedAnnot.id
        );
        if (titleUpdateResult) {
          reqSucess = true;
          console.log("Annotation title 업데이트 성공");
          setMasksInfo(titleUpdateResult.data);
          setTitleInput("");
        }
      }
      // 태그가 있는 경우
      if (tags) {
        const tagsUpdateResult = await postNewTags(
          masksInfo.Image.file_name,
          selectedAnnot.id,
          tags
        );
        if (tagsUpdateResult) {
          reqSucess = true;
          console.log("Annotation tags 업데이트 성공");
          setMasksInfo(tagsUpdateResult.data);
          setTagInput("");
        }
      }

      if (reqSucess) {
        setEditMode(false);
        setActiveTagInput(false);
      }
    }
  };

  // 태그 관련 이벤트 핸들러
  // 태그 UI 생성
  const handleTagInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (selectedAnnot && event.key === "Enter" && tagInput.trim() !== "") {
      event.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
      setTagInput("");
    }
  };

  // 태그 UI 삭제
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((item) => item !== tag));
  };

  const closeEditor = () => {
    setSelectedAnnot(null);
  };

  return (
    <aside
      id="editorbox"
      className={`z-30 bg-gray-100 transition-width rounded-lg overflow-hidden ${
        selectedAnnot ? "absolute" : "hidden"
      }`}
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
      <form className="py-6 px-7" onSubmit={handleSave}>
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-bold">Annotation Editor</p>
          <div className="cursor-pointer p-1 hover:bg-gray-300 rounded-full transition-all">
            <MdClose size={20} className="text-base" onClick={closeEditor} />
          </div>
        </div>
        {selectedAnnot && (
          <>
            {/* annotation title */}
            <div className="flex items-center justify-between mb-1 ml-1">
              <Label className="font-semibold text-base" htmlFor="title">
                Title
              </Label>
              {/* 수정 아이콘 */}
              <MdEdit
                className={`mr-1 cursor-pointer ${
                  editMode ? "text-blue-700" : ""
                }`}
                onClick={handleEditToggle}
              />
            </div>
            <TextInput
              name="title"
              theme={titleInputTheme}
              className="mb-3"
              type="text"
              id="title"
              onChange={(e) => setTitleInput(e.target.value)}
              value={titleInput}
              placeholder="title"
              disabled={!editMode}
            />
            {/* 태그 input */}
            <div className="flex items-center mb-1 ml-1">
              <Label className="font-semibold text-base mr-2" htmlFor="tag">
                Tags
              </Label>
            </div>
            <div
              className={`box-border border ring-blue-700 mb-3 flex flex-wrap items-center w-full p-2.5 text-gray-900 rounded-lg bg-gray-50 sm:text-xs
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
              ${
                activeTagInput
                  ? "ring-1 ring-blue-700 border-blue-700"
                  : "border-gray-300"
              } ${editMode ? null : "cursor-not-allowed opacity-50"}`}
            >
              {tags.length !== 0 &&
                tags.map((tagContent, index) => (
                  <Tag
                    key={index}
                    editMode={editMode}
                    content={tagContent}
                    removeHandler={handleRemoveTag}
                  />
                ))}
              <input
                id="tag"
                size={tagInput.length !== 0 ? tagInput.length : 10}
                className={`max-w-full focus:outline-none text-sm px-2 bg-transparent ${
                  tags.length !== 0 && "mb-2"
                }`}
                placeholder="Add a tag..."
                onFocus={() => {
                  setActiveTagInput(true);
                }}
                onBlur={() => {
                  setActiveTagInput(false);
                }}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                disabled={!editMode}
              />
            </div>
            {/* 마스크 수정 아이콘 */}
            <div className="flex items-center justify-between mb-1 ml-1">
              <Label className="font-semibold text-base" htmlFor="title">
                Mask
              </Label>
              <Button
                disabled={!editMode}
                color="light"
                className="text-sm p-0.1 focus:ring-2 focus:ring-blue-600"
                size="xs"
                onClick={(e) => {
                  setIsRedraw(true);
                  setActiveTool(ToolList[3]);
                }}
              >
                Redraw
                <MdDraw className="ml-1 text-sm" />
              </Button>
            </div>

            {editMode && (
              <div className="mt-5 flex justify-end">
                <Button
                  className="text-sm p-0.1"
                  size="sm"
                  color="blue"
                  pill
                  type="submit"
                >
                  Save
                </Button>
              </div>
            )}
          </>
        )}
      </form>
    </aside>
  );
}

// Tag 컴포넌트

interface TagProps {
  editMode: boolean;
  content: string;
  removeHandler: (tag: string) => void;
}

const titleInputTheme: CustomFlowbiteTheme["textInput"] = {
  field: {
    input: {
      colors: {
        gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-700 foucus:ring-blue-700",
      },
    },
  },
};

function Tag({ editMode, content, removeHandler }: TagProps) {
  return (
    <div className="mb-2 inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
      <span style={{ wordWrap: "break-word", maxWidth: "90%" }}>{content}</span>
      <button
        type="button"
        className={`inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm ${
          editMode &&
          "hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
        }`}
        aria-label="Remove"
        onClick={() => {
          if (editMode) removeHandler(content);
        }}
      >
        <svg
          className="w-2 h-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Remove badge</span>
      </button>
    </div>
  );
}

export default AnnotationEditor;
