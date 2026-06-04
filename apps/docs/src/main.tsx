import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "#src/globals.css";
import { App } from "#src/src/app";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>,
);
