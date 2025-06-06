import { BrowserRouter, Route, Routes } from "react-router";

import "@bsport/kaizen-primitive-core/styles";

import NavigationSidebar from "#src/components/NavigationSidebar";
import { StandaloneHome } from "#src/components/StandaloneHome";

import "./index.css";

const basename = __NAVIGATION_SIDEBAR__.__BASENAME__;

const App = () => (
  <BrowserRouter basename={basename}>
    <div className="flex">
      <NavigationSidebar />
      <div className="flex flex-col flex-grow p-4">
        <Routes>
          <Route path="/" element={<StandaloneHome />} />
          <Route path="/:slug" element={<StandaloneHome />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
