import { type FC, useId, useState } from "react";

import {
  Alert,
  Body,
  Loader,
  Modal,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import { useCancelSeriesMutation } from "#src/hooks/series/use-cancel-series-mutation";
import { useSeriesDetailsQuery } from "#src/hooks/series/use-series-details-query";
import { useTranslation } from "#src/utils/i18n";
import {
  getSeriesCancelClassCount,
  getSeriesCancelSubtitle,
} from "#src/utils/series-cancel-modal";

const FALLBACK_LOCALE = "en";

type SeriesCancelModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
  seriesId: number;
};

export const SeriesCancelModal: FC<SeriesCancelModalProps> = ({
  onClose,
  onSuccess,
  seriesId,
}) => {
  const { t, i18n } = useTranslation("series");

  const locale = i18n.language || FALLBACK_LOCALE;
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  const toggleId = `series-cancel-notification-${useId()}`;
  const [shouldNotifyClients, setShouldNotifyClients] = useState(true);

  const { classes, error, isLoading, refetch, series } =
    useSeriesDetailsQuery(seriesId);
  const cancelSeries = useCancelSeriesMutation();

  const isSubmitting = cancelSeries.isPending;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleConfirm = () => {
    cancelSeries.mutate(
      {
        notifyIfCancelled: shouldNotifyClients,
        seriesId,
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
            return;
          }

          onClose();
        },
      },
    );
  };

  const classCount = series
    ? getSeriesCancelClassCount({ classes, series })
    : 0;

  const subtitle = series
    ? getSeriesCancelSubtitle({
        classes,
        locale,
        series,
        timeZone: companyTimeZone,
      })
    : undefined;

  return (
    <Modal
      open
      size="md"
      title={t("seriesCancelModal.title")}
      description={subtitle}
      onClose={handleClose}
      disableClickOutsideClose={isSubmitting}
      confirmButton={{
        label: t("seriesCancelModal.confirmButton"),
        color: "critical",
        onClick: handleConfirm,
        loading: isSubmitting,
        disabled: isLoading || !!error || !series || isSubmitting,
      }}
      cancelButton={{
        label: t("seriesCancelModal.closeButton"),
        onClick: handleClose,
        disabled: isSubmitting,
      }}
    >
      {error ? (
        <SectionErrorFallback onRetry={refetch} />
      ) : isLoading || !series ? (
        <div className="grid place-content-center">
          <Loader size="md" />
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col gap-2xs">
            <Body htmlVariant="p" size="md" color="weak">
              {t("seriesCancelModal.description", { count: classCount })}
            </Body>
            <Body htmlVariant="p" size="md" weight="stronger">
              {t("seriesCancelModal.irreversibleWarning")}
            </Body>
          </div>
          <Alert status="critical" type="weak">
            <Body size="md" weight="weak" color="critical">
              {t("seriesCancelModal.refundAlert", { count: classCount })}
            </Body>
          </Alert>
          <Toggle
            checked={shouldNotifyClients}
            disabled={isSubmitting}
            id={toggleId}
            label={t("seriesCancelModal.notificationLabel")}
            onToggleChange={setShouldNotifyClients}
          />
        </div>
      )}
    </Modal>
  );
};
