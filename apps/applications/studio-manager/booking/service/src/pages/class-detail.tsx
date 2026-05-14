import { Navigate, useLocation, useParams } from "react-router";

import { Loader } from "@bsport/kaizen-primitive-core";

import { ClassDetailShell } from "#src/components/class-detail/class-detail-shell";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useRetrieveClass } from "#src/hooks/use-retrieve-class";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const ClassDetailContent = ({ id }: { id: number }) => {
  const { data: metaActivity } = useRetrieveClass(id);
  const { pathname } = useLocation();

  if (
    !metaActivity.customer_enabled &&
    pathname === ABSOLUTE_ROUTES.DETAIL(id)
  ) {
    return <Navigate to={ABSOLUTE_ROUTES.ARCHIVED_DETAIL(id)} replace />;
  }
  if (
    metaActivity.customer_enabled &&
    pathname === ABSOLUTE_ROUTES.ARCHIVED_DETAIL(id)
  ) {
    return <Navigate to={ABSOLUTE_ROUTES.DETAIL(id)} replace />;
  }

  return <ClassDetailShell metaActivity={metaActivity} />;
};

const ClassDetailPage = () => {
  const { metaActivityId } = useParams<{ metaActivityId: string }>();
  const { t } = useTranslation("class-detail");
  const id = Number(metaActivityId);

  // Redirect to listing if id is not a valid number or is not positive
  if (!Number.isFinite(id) || id <= 0) {
    return <Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />;
  }

  return (
    <QueryBoundary
      loadingFallback={
        <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
          <Loader size="xl" />
          <span>{t("classDetail.loading")}</span>
        </div>
      }
    >
      <ClassDetailContent id={id} />
    </QueryBoundary>
  );
};

export default ClassDetailPage;
