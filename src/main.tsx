import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RGLApp } from "./RGLApp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RGLApp />
  </React.StrictMode>
);
