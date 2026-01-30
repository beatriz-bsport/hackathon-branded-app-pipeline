import { FC } from "react";

import { toDateTime } from "@bsport/datetime-manipulation";
import { useFormContext } from "@bsport/form";
import { Alert, Body } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";
import {
  ADD_ON_WELLHUB_INTEGRATION,
  UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

const MAX_WELLHUB_SESSION_DURATION_MINUTES = 200;

export const AggregatorWarning: FC = () => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const hasWellhubIntegration = useCheckCompanyAddOn(
    ADD_ON_WELLHUB_INTEGRATION,
  );

  const hasUSCIntegration = useCheckCompanyAddOn(
    UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
  );

  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const sessionDuration = watch("duration_minute");

  const startDateTime = watch("startDateTime");

  const isSessionAvailableOnPartnership = watch("available_on_partnership");

  const startDT = toDateTime(startDateTime, companyTimeZone);

  const datetimeEnd = startDT.plus({
    minute: sessionDuration,
  });

  const offerSpreadOnTwoDays = !startDT.hasSame(datetimeEnd, "day");

  const showWellhubWarning =
    hasWellhubIntegration &&
    isSessionAvailableOnPartnership &&
    sessionDuration > MAX_WELLHUB_SESSION_DURATION_MINUTES;

  const showUSCWarning = hasUSCIntegration && offerSpreadOnTwoDays;

  if (!showWellhubWarning && !showUSCWarning) return null;

  return (
    <Alert status="info">
      {showWellhubWarning && (
        <Body>
          {t(
            "addSessionModal.steps.configureSession.timeAndDate.wellhubWarning",
          )}
        </Body>
      )}
      {showUSCWarning && (
        <Body>
          {t("addSessionModal.steps.configureSession.timeAndDate.uscWarning")}
        </Body>
      )}
    </Alert>
  );
};
