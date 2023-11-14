import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Guide from "./pages/Guide";
import Thumbnails from "./pages/Thumbnails";
import Annotation from "./pages/Annotation";

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
    ],
  },
]);

export default router;
