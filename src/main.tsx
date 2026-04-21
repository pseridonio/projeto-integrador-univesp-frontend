import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";


import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Elemento raiz "root" não encontrado.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

