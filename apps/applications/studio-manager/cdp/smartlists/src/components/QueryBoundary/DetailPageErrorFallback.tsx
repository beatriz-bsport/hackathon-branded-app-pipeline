import { useNavigate } from "react-router";

import { HTTPException } from "@bsport/fetch";
import { ErrorFallback } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type DetailPageErrorFallbackProps = {
  error: Error;
  onRetry: () => void;
};

export const DetailPageErrorFallback = ({
  error,
  onRetry,
}: DetailPageErrorFallbackProps) => {
  const { t } = useTranslation("details");
  const navigate = useNavigate();

  const isHttpError = error instanceof HTTPException;
  const is404 = isHttpError && error.statusCode === 404;
  const isServerError = isHttpError && error.type === "ServerError";

  if (is404) {
    return (
      <div className="grid place-content-center h-screen">
        <ErrorFallback
          title={t("error.notFound.title")}
          subtitle={t("error.notFound.subtitle")}
          description={t("error.notFound.description")}
          actionProps={{
            label: t("error.notFound.backToListLabel"),
            onClick: () => navigate(URLS.INDEX),
          }}
        />
      </div>
    );
  }

  if (isServerError) {
    return (
      <div className="grid place-content-center h-screen">
        <ErrorFallback
          title={t("error.serverError.title")}
          subtitle={t("error.serverError.subtitle")}
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
    <div className="grid place-content-center h-screen">
      <ErrorFallback actionProps={ErrorFallback.DEFAULT_ACTION_PROPS} />
    </div>
  );
};
