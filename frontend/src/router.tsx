import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Guide from "./pages/Guide";
import Thumbnails from "./pages/Thumbnails";
import Annotation from "./pages/Annotation";
import GuideImport from "./guides/GuideImport";
import GuideExport from "./guides/GuideExport";
import GuideDrag from "./guides/GuideDrag";
import GuideSelect from "./guides/GuideSelect";
import GuideEverything from "./guides/GuideEverything";
import GuideBBox from "./guides/GuideBBox";
import GuideAnnotationList from "./guides/GuideAnnotationList";
import GuideAnnotationSearch from "./guides/GuideAnnotationSearch";
import GuideAnnotationAdd from "./guides/GuideAnnotationAdd";

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
        path: "tool-thumbnails", // "Tool" 페이지 경로 설정
        element: <Thumbnails />, // "Thumbnails" 페이지 연결
      },
      {
        path: "tool-annotation", // "Tool" 페이지 경로 설정
        element: <Annotation />, // "Annotation" 페이지 연결
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
      {
        path: "learn-more/annotation-add",
        element: <GuideAnnotationAdd />,
      },
    ],
  },
]);

export default router;
