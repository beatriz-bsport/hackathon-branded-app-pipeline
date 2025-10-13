import { Route, Routes } from "react-router";

import "@bsport/kaizen-primitive-core/styles";

import { StandaloneHome } from "#src/components/StandaloneHome";

import "./index.css";

const App = () => (
  <div className="flex flex-col flex-grow p-4">
    <Routes>
      <Route path="/" element={<StandaloneHome />} />
      <Route path="/:slug" element={<StandaloneHome />} />
    </Routes>
  </div>
);

export default App;
