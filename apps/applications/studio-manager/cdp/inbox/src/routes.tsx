import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ThreadPlaceholder } from "#src/features/thread-placeholder/thread-placeholder";
import { ROUTES } from "#src/urls";

const ThreadsPage = lazy(() => import("#src/pages/threads-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ThreadsPage />} path={ROUTES.THREADS}>
        <Route element={<ThreadPlaceholder />} index />
        {/* future: <Route element={<ThreadMessagesPage />} path="thread/:id/messages" /> */}
      </Route>
      <Route element={<Navigate replace to={ROUTES.THREADS} />} path="*" />
    </Routes>
  );
};
