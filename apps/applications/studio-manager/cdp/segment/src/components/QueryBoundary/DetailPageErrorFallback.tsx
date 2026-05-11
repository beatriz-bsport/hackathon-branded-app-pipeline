import { HTTPException } from "@bsport/fetch";
import { ErrorFallback } from "@bsport/kaizen-primitive-core";

import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
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
  const { navigateToSmartlistList } = useSmartlistNavigation();

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
            onClick: () => navigateToSmartlistList(),
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
