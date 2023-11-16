import React from "react";
import { Outlet } from "react-router-dom";
import ToolHeader from "./components/ToolHeader";

function App() {
  return (
    <>
      <ToolHeader />
      <Outlet />
    </>
  );
}

export default App;
