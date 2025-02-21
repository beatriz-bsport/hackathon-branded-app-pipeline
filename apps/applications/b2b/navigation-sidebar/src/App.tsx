import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "@bsport/kaizen-primitive-core/styles";

import NavigationSidebar from "#src/components/NavigationSidebar";
import { i18nInstance } from "#src/utils/i18n";
import { Select } from "@bsport/kaizen-primitive-core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex">
      <NavigationSidebar />
      <div
        className={
          "flex flex-col flex-grow items-center " +
          "justify-center h-screen w-full sticky top-0 gap-xs"
        }
      >
        <p>
          You are running{" "}
          <code className="bg-luna-grey-200 p-xs">navigation-sidebar</code> in{" "}
          <b>standalone mode</b>.
        </p>
        <p>It is intended for use in a federation context.</p>
        <div className="h-fit">
          <Select
            id="language-selector"
            items={[
              { id: "en", label: "EN" },
              { id: "fr", label: "FR" },
            ]}
            name="language-selector"
            label={
              i18nInstance.resolvedLanguage?.toLocaleUpperCase() ||
              "Select language"
            }
            onSelect={(lng) => {
              i18nInstance.changeLanguage(lng);
            }}
          />
        </div>
      </div>
    </div>
  </StrictMode>,
);
