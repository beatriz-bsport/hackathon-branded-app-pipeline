import { FC } from "react";
import { useParams } from "react-router";

import {
  DetailsLayout,
  useDetailsLayout,
  useLoadingState,
} from "@bsport/kaizen-primitive-core";

import { Header } from "#src/components/session-details/header";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useTranslation } from "#src/utils/i18n";

export const DetailsPage: FC = () => {
  const { t } = useTranslation("sessionDetails");
  const { detailsLayoutProps } = useDetailsLayout();

  const { id } = useParams();
  const parsedId = id ? Number(id) : undefined;
  const sessionId = Number.isFinite(parsedId) ? parsedId : undefined;

  const { data: session, isLoading } = useRetrieveSession(sessionId);

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

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel>
      <Header session={session} />
      <DetailsLayout.Content></DetailsLayout.Content>
      <DetailsLayout.Panel></DetailsLayout.Panel>
    </DetailsLayout>
  );
};
