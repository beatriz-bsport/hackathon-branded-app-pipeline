import type { FC } from "react";

import { HTTPException } from "@bsport/fetch";
import { ErrorFallback } from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type DetailPageErrorFallbackProps = {
  error: Error;
  onRetry: () => void;
};

export const DetailsFetchError: FC<DetailPageErrorFallbackProps> = ({
  error,
  onRetry,
}) => {
  const { t } = useTranslation("sessionDetails");
  const { navigateToIndex } = useUrls();

  const isHttpError = error instanceof HTTPException;
  const is404 = isHttpError && error.statusCode === 404;
  const isServerError = isHttpError && error.type === "ServerError";

  if (is404) {
    return (
      <div className="grid place-content-center h-full">
        <ErrorFallback
          title={t("error.canNotFindSession.title")}
          subtitle="" // Mandatory to remove default translations
          description={t("error.canNotFindSession.description")}
          className="mx-auto h-full"
          actionProps={{
            label: t("error.canNotFindSession.goBackButton"),
            iconLeft: "link-external-02",
            onClick: navigateToIndex,
          }}
        />
      </div>
    );
  }
  if (isServerError) {
    return (
      <div className="grid place-content-center h-full">
        <ErrorFallback
          title={t("error.serverError.title")}
          subtitle="" // Mandatory to remove default translations
          description={t("error.serverError.description")}
          actionProps={{
            label: t("error.serverError.retryLabel"),
            onClick: onRetry,
          }}
        />
      </div>
    );
  }
  return (
    <div className="grid place-content-center h-full">
      <ErrorFallback actionProps={ErrorFallback.DEFAULT_ACTION_PROPS} />
    </div>
  );
};
