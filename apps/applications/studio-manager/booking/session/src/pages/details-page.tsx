import { FC } from "react";
import { useParams } from "react-router";

import { useLoadingState } from "@bsport/kaizen-primitive-core";

import UpdateSessionForm from "#src/components/update-session-form/update-session-form";
import { useRetrieveSessionWithActivity } from "#src/hooks/session-api/fetch/use-retrieve-session-with-activity";
import { useTranslation } from "#src/utils/i18n";

export const DetailsPage: FC = () => {
  const { t } = useTranslation("sessionDetails");

  const { id } = useParams();
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
    // TODO: handle session not found / error case
    return <div>Session not found</div>;
  }

  return <UpdateSessionForm session={session} />;
};

export default DetailsPage;
