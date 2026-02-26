import { lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import { URLS } from "#src/urls";

const GiftcardArchivedListPage = lazy(
  () => import("#src/pages/GiftcardArchivedList"),
);
const GiftcardListPage = lazy(() => import("#src/pages/GiftcardList"));
const GiftcardEditorPage = lazy(() => import("#src/pages/giftcard-editor"));
const GiftcardPurchasesPage = lazy(
  () => import("#src/pages/giftcard-purchases"),
);

const RedirectToDetails = () => {
  const { id } = useParams();

  const finalUrl =
    id && !isNaN(parseInt(id))
      ? `${URLS.INDEX}/${URLS.EDITOR(parseInt(id))}`
      : URLS.INDEX;

  return <Navigate to={finalUrl} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/** List pages */}
      <Route element={<GiftcardListPage />} index />
      <Route element={<GiftcardArchivedListPage />} path={URLS.ARCHIVED} />

      {/** Details pages */}
      <Route element={<GiftcardEditorPage />} path={URLS.EDITOR_SLUG} />
      <Route element={<GiftcardPurchasesPage />} path={URLS.PURCHASES_SLUG} />

      {/** Fallback to details page */}
      <Route element={<RedirectToDetails />} path={`${URLS.EDITOR_SLUG}/*`} />

      {/** Global fallback */}
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
