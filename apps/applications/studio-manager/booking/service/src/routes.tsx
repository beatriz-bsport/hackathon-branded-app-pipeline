import { lazy, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import { Loader } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useRetrieveClass } from "#src/hooks/use-retrieve-class";
import { ABSOLUTE_ROUTES, ROUTES, getLegacyDetailUrl } from "#src/urls";
import { ClassFlags, useClassFlag } from "#src/utils/featureFlags";

const ListPage = lazy(() => import("./pages/classes-list"));
const ArchivedListPage = lazy(() => import("./pages/archived-classes-list"));
const ClassDetailPage = lazy(() => import("./pages/class-detail"));

const LegacyClassDetailRedirectInner = ({ id }: { id: number }) => {
  const { data: metaActivity } = useRetrieveClass(id);

  useEffect(() => {
    window.location.assign(
      getLegacyDetailUrl(metaActivity.id, metaActivity.is_workshop),
    );
  }, [metaActivity.id, metaActivity.is_workshop]);

  return null;
};

const LegacyClassDetailRedirect = () => {
  const { metaActivityId } = useParams<{ metaActivityId: string }>();
  const id = metaActivityId ? Number(metaActivityId) : NaN;

  if (!Number.isFinite(id)) {
    return <Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />;
  }

  return (
    <QueryBoundary
      loadingFallback={<Loader className="w-full h-full" size="xl" />}
    >
      <LegacyClassDetailRedirectInner id={id} />
    </QueryBoundary>
  );
};

export const AppRoutes = () => {
  const detailEnabled = useClassFlag(ClassFlags.CLASSES_DETAIL_PAGE);

  const detailElement = detailEnabled ? (
    <ClassDetailPage />
  ) : (
    <LegacyClassDetailRedirect />
  );

  return (
    <Routes>
      <Route
        element={<Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />}
        path="/"
      />
      <Route element={<ListPage />} path={ROUTES.ACTIVE} />
      <Route element={<ArchivedListPage />} path={ROUTES.ARCHIVED} />
      <Route element={detailElement} path={ROUTES.DETAIL} />
      <Route element={detailElement} path={ROUTES.ARCHIVED_DETAIL} />
      <Route
        element={<Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />}
        path="*"
      />
    </Routes>
  );
};
