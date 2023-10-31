import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import NotFound from "./components/NotFound";
import Start from "./components/pages/Start";
import Guide from "./components/pages/Guide";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "", // 기본 시작 페이지는 빈 문자열 경로 ("/")로 설정
        element: <Start />, // Start 페이지 연결
      },
      {
        path: "tool", // "Tool" 페이지 경로 설정
        element: <Home />, // "Home" 페이지 연결
      },
      {
        path: "howtouse", // "HowtoUse" 페이지 경로 설정
        element: <Guide />, // "Guide" 페이지 연결
      },
    ],
  },
]);

export default router;
