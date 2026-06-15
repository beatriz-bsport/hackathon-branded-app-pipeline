import { Route, Routes } from "react-router-dom";

import { DocsThemeProvider } from "#src/components/layout/docs-theme-provider";
import { DocRoute } from "#src/src/doc-route";
import { DocsLayout } from "#src/src/docs-layout";

export function App() {
  return (
    <DocsThemeProvider>
      <Routes>
        <Route element={<DocsLayout />}>
          <Route index element={<DocRoute slug={["welcome"]} />} />
          <Route path="*" element={<DocRoute catchAll />} />
        </Route>
      </Routes>
    </DocsThemeProvider>
  );
}
