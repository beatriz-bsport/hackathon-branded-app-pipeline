import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";
import {
  ADD_ON_WELLHUB_INTEGRATION,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

const MAX_WELLHUB_SESSION_DURATION_MINUTES = 200;

export const AggregatorWarning: FC = () => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();
  const sessionDuration = watch("duration_minute");

  const isSessionAvailableOnPartnership = watch("available_on_partnership");

  const hasWellhubIntegration = useCheckCompanyAddOn(
    ADD_ON_WELLHUB_INTEGRATION,
  );

  const showWellhubWarning =
    hasWellhubIntegration &&
    isSessionAvailableOnPartnership &&
    sessionDuration > MAX_WELLHUB_SESSION_DURATION_MINUTES;

  if (!showWellhubWarning) return null;

  return (
    <Alert status="info">
      {t("addSessionModal.steps.configureSession.timeAndDate.wellhubWarning")}
    </Alert>
  );
};
