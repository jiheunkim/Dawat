import { MdCircle, MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { masksInfoState, selectedAnnotState } from "../atoms";
import { Annotation } from "../interfaces/Interfaces";

function AnnotationList() {
  // 검색어 설정하는 useState
  const [search, setSearch] = useState("");
  // 원본 annotaion에 대한 배열
  const [originalAnnots, setOriginalAnnots] = useState<Annotation[]>([]);
  // 검색어가 적용되어 필터링된 annotation 배열
  const [filteredAnnots, setFilteredAnnots] = useState<Annotation[]>([]);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);

  const handleSearchChange = (e: { target: { value: string } }) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    if (searchTerm === "" || searchTerm.length === 0) {
      return setFilteredAnnots(originalAnnots);
    }

    const filteredAnnotations = originalAnnots.filter(
      (annotation: Annotation) => {
        // 검색어가 title 또는 tag 중 하나에 포함되어 있는 경우 필터링
        return (
          annotation.title.toLowerCase().includes(searchTerm) ||
          annotation.tag?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }
    );

    // 필터링된 결과를 state에 업데이트
    setFilteredAnnots(filteredAnnotations);
  };

  useEffect(() => {
    if (masksInfo) {
      const annotationData = masksInfo.annotation;
      const annotsArray: Annotation[] = [];
      Object.values(annotationData).forEach((item) => {
        annotsArray.push(item);
      });
      setOriginalAnnots(annotsArray);
      setFilteredAnnots(annotsArray);
    } else {
      setOriginalAnnots([]);
      setFilteredAnnots([]);
    }
  }, [masksInfo]);

  return (
    <div id="annotationlist" className="annotationlist h-full">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xl font-bold">Annotation</p>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          onChange={handleSearchChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search annotation list"
        />
      </div>
      <div
        style={{ height: "calc(100% - 94px)" }}
        className="flex flex-col relative overflow-y-scroll scrollbar-hide"
      >
        {filteredAnnots.map((item) => {
          return <AnnotComponent {...item} key={item.id} />;
        })}
      </div>
    </div>
  );
}

// segments 객체의 key를 순회하며 Annotation 항목 렌더링
function AnnotComponent(props: Annotation) {
  const { title, id, color } = props;
  const currentAnnotRef = useRef<HTMLDivElement>(null);
  const [selectedAnnot, setSelectedAnnot] = useRecoilState(selectedAnnotState);
  const [masksInfo, setMasksInfo] = useRecoilState(masksInfoState);

  // 마스크 클릭시 해당 annotation이 스크롤해서 가운데 위치하도록 조정
  useEffect(() => {
    if (selectedAnnot && selectedAnnot.id === id && currentAnnotRef.current) {
      const annotationListHeight =
        currentAnnotRef.current.parentElement!!.clientHeight;
      const annotationOffsetTop = currentAnnotRef.current.offsetTop;
      const annotationScrolled =
        currentAnnotRef.current.parentElement!!.scrollTop;

      // annotation이 스크롤 뷰 박스에서 벗어낫을 때
      if (
        annotationScrolled >= annotationOffsetTop ||
        annotationScrolled + annotationListHeight <= annotationOffsetTop
      ) {
        if (annotationOffsetTop > annotationListHeight / 2 + 48) {
          // 해당 annotation를 가운데 위치시킬 수 있을 때
          currentAnnotRef.current.parentElement!!.scrollTo(
            0,
            annotationOffsetTop - annotationListHeight / 2 + 48
          );
        } else {
          // 해당 annotation을 최상단으로 올린다
          currentAnnotRef.current.parentElement!!.scrollTo(
            0,
            annotationOffsetTop
          );
        }
      }
    }
  }, [selectedAnnot]);

  // Annotation 항목 삭제 이벤트 핸들러
  const handleDelete = async (id: number) => {
    try {
      // 백엔드 API로 삭제 요청 보내기
      const response = await axios.post(
        "http://norispaceserver.iptime.org:8000/delete_key",
        {
          image_name: masksInfo?.Image.file_name,
          id: id,
        }
      );

      // 백엔드로부터 받은 데이터를 이용하여 상태 업데이트
      setMasksInfo(response.data);
    } catch (error) {
      console.error("Error deleting annotation:", error);
    }
  };

  return (
    <div
      ref={currentAnnotRef}
      id={`annotation_${id}`}
      className={`flex items-center my-1 cursor-pointer py-2 px-3 hover:bg-gray-200 rounded-lg transition-colors ${
        selectedAnnot?.id === id ? "bg-gray-300" : ""
      }`}
      onClick={(e) => {
        if (masksInfo) {
          setSelectedAnnot(masksInfo.annotation[e.currentTarget.id]);
          console.log(`Annotation ${e.currentTarget.id} clicked`);
        }
      }}
    >
      <MdCircle
        className="text-sm mr-2"
        style={
          color && {
            color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.3})`,
          }
        }
      />
      <p className="text-m font-seminold mb-0 flex-grow">{title}</p>
      <MdDelete
        className="text-xl darkgray hover:text-red-700 transition-colors"
        onClick={(e) => handleDelete(id)}
      />
    </div>
  );
}

export default AnnotationList;
