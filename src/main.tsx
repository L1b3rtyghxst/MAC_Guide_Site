import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { YMaps } from "@pbe/react-yandex-maps";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <YMaps query={{ apikey: "028cc64e-282c-42f8-a42a-c7c6694e920f" }}>
      <App />
    </YMaps>
  </StrictMode>
);