import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "@bsport/kaizen-primitive-core/styles";

import NavigationSidebar from "#src/components/NavigationSidebar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex">
      <NavigationSidebar />
      <div className="flex flex-col flex-grow items-center justify-center h-screen w-full sticky top-0 gap-xs">
        <p>You are running <code className="bg-luna-grey-200 p-xs">navigation-sidebar</code> in <b>standalone mode</b>.</p>
        <p>It is intended for use in a federation context.</p>
      </div>
    </div>
  </StrictMode>,
);
