import { FC } from "react";
import { Navigate, useParams } from "react-router";

import { useLoadingState } from "@bsport/kaizen-primitive-core";

import UpdateSessionForm from "#src/components/update-session-form/update-session-form";
import { useRetrieveSessionWithActivity } from "#src/hooks/session-api/fetch/use-retrieve-session-with-activity";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const DetailsPage: FC = () => {
  const { t } = useTranslation("sessionDetails");

  const { getIndexUrl } = useUrls();

  const { sessionId: id } = useParams<{ sessionId: string }>();
  const sessionId = id ? Number(id) : undefined;

  const { data: session, isLoading } =
    useRetrieveSessionWithActivity(sessionId);

  const { LoadingState, shouldRenderLoadingState } = useLoadingState({
    isLoading: isLoading,
    message: t("loading"),
  });

  if (shouldRenderLoadingState) {
    return <LoadingState />;
  }

  if (!session) {
    return <Navigate to={getIndexUrl()} replace />;
  }

  return <UpdateSessionForm session={session} />;
};

export default DetailsPage;
