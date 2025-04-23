import { BrowserRouter, Route, Routes, useParams } from "react-router";

import { Select } from "@bsport/kaizen-primitive-core";
import "@bsport/kaizen-primitive-core/styles";

import NavigationSidebar from "#src/components/NavigationSidebar";
import { i18nInstance } from "#src/utils/i18n";

import "./index.css";

const Home = () => {
  const { slug } = useParams();

  return (
    <div className="flex flex-col flex-grow items-center justify-center h-screen w-full sticky top-0 gap-xs">
      <p>
        You are running{" "}
        <code className="bg-luna-grey-200 p-xs">navigation-sidebar</code> in{" "}
        <b>{slug ? `federation mode: ${slug}` : "standalone mode"}</b>.
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
          defaultValue={
            i18nInstance.resolvedLanguage?.toLocaleUpperCase() ||
            "Select language"
          }
          onSelect={(lng) => {
            i18nInstance.changeLanguage(lng.toLowerCase());
          }}
        />
      </div>
    </div>
  );
};

const basename = __NAVIGATION_SIDEBAR__.__BASENAME__;

const App = () => (
  <BrowserRouter basename={basename}>
    <div className="flex">
      <NavigationSidebar />
      <div className="flex flex-col flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:slug" element={<Home />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
