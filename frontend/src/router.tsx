import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Guide from "./pages/Guide";
import GuideImport from "./guides/GuideImport";
import GuideExport from "./guides/GuideExport";
import GuideDrag from "./guides/GuideDrag";
import GuideSelect from "./guides/GuideSelect";
import GuideEverything from "./guides/GuideEverything";
import GuideBBox from "./guides/GuideBBox";
import GuideAnnotationList from "./guides/GuideAnnotationList";
import GuideAnnotationSearch from "./guides/GuideAnnotationSearch";
import ToolPage from "./pages/ToolPage";
import AnnotationBox from "./components/AnnotationBox";
import ThumbnailsBox from "./components/ThumbnailsBox";
import ImageCanvas from "./components/ImageCanvas";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "", // 기본 시작 페이지는 빈 문자열 경로 ("/")로 설정
        element: <Home />, // "Home" 페이지 연결
      },
      {
        path: "tool",
        element: <ToolPage />,
        errorElement: <NotFound />,
        children: [
          {
            path: "annotation",
            element: <AnnotationBox />,
          },
          {
            path: "thumbnail", // "Tool" 페이지 경로 설정
            element: <ThumbnailsBox />, // "Thumbnails" 페이지 연결
          },
        ],
      },
      {
        path: "howtouse", // "HowtoUse" 페이지 경로 설정
        element: <Guide />, // "Guide" 페이지 연결
      },
      {
        path: "learn-more/import",
        element: <GuideImport />,
      },
      {
        path: "learn-more/export",
        element: <GuideExport />,
      },
      {
        path: "learn-more/drag",
        element: <GuideDrag />,
      },
      {
        path: "learn-more/select",
        element: <GuideSelect />,
      },
      {
        path: "learn-more/everything",
        element: <GuideEverything />,
      },
      {
        path: "learn-more/bbox",
        element: <GuideBBox />,
      },
      {
        path: "learn-more/annotation-list",
        element: <GuideAnnotationList />,
      },
      {
        path: "learn-more/annotation-search",
        element: <GuideAnnotationSearch />,
      },
    ],
  },
]);

export default router;
