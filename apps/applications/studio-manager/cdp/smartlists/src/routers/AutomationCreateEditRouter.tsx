import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const AutomationPushCreationPage = lazy(
  () => import("#src/pages/AutomationPushCreationPage"),
);
const AutomationSmsCreationPage = lazy(
  () => import("#src/pages/AutomationSmsCreationPage"),
);
const AutomationPushEditPage = lazy(
  () => import("#src/pages/AutomationPushEditPage"),
);
const AutomationMessagePage = lazy(
  () => import("#src/pages/AutomationMessagePage"),
);

export function AutomationCreateEditRouter() {
  return (
    <Routes>
      <Route path="push/new" element={<AutomationPushCreationPage />} />
      <Route path="sms/new" element={<AutomationSmsCreationPage />} />
      <Route path="push/:entityId/edit" element={<AutomationPushEditPage />} />
      <Route path="push/:messageId" element={<AutomationMessagePage />} />
      <Route path="*" element={<Navigate to={".."} replace />} />
    </Routes>
  );
}
