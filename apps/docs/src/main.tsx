import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import { App } from "#src/src/app";
import "#src/globals.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>,
);
