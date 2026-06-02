import { Route, Routes } from "react-router-dom";

import { DocsLayout } from "#src/src/docs-layout";
import { DocRoute } from "#src/src/doc-route";

export function App() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<DocRoute slug={["welcome"]} />} />
        <Route path="*" element={<DocRoute catchAll />} />
      </Route>
    </Routes>
  );
}
