import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/index.css";

import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </RecoilRoot>
);
