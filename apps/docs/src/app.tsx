import { Route, Routes } from "react-router-dom";

import { DocRoute } from "#src/src/doc-route";
import { DocsLayout } from "#src/src/docs-layout";

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
