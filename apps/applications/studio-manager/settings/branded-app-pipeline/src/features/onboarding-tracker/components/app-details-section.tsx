import { type FC, useId } from "react";

import { Accordion, Alert, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { AppDetails } from "../hooks/use-app-details-form";
import {
  getDaysRemaining,
  getDunsExpectedReadyDate,
  isValidDuns,
  isValidOptionalUrl,
} from "../utils/duns";

const APP_NAME_MAX_LENGTH = 30;

export interface AppDetailsSectionProps {
  details: AppDetails;
  onChangeField: <K extends keyof AppDetails>(
    field: K,
    value: AppDetails[K],
  ) => void;
}

export const AppDetailsSection: FC<AppDetailsSectionProps> = ({
  details,
  onChangeField,
}) => {
  const { t } = useTranslation("common");
  const appNameId = useId();
  const dunsId = useId();
  const dunsDateId = useId();
  const googlePlayId = useId();
  const appStoreId = useId();

  const isDunsValid = details.duns === "" || isValidDuns(details.duns);
  const isGooglePlayValid = isValidOptionalUrl(details.googlePlayUrl);
  const isAppStoreValid = isValidOptionalUrl(details.appStoreUrl);

  const dunsCountdown = details.dunsSubmittedAt
    ? (() => {
        const expectedDate = getDunsExpectedReadyDate(
          new Date(details.dunsSubmittedAt),
        );
        const daysRemaining = getDaysRemaining(expectedDate, new Date());
        return { expectedDate, daysRemaining };
      })()
    : undefined;

  return (
    <div className="rounded-md border-stroke-thin border-stroke-default bg-surface-default-elevated">
      <Accordion.Item
        ariaLabel={t("appDetails.sectionTitle")}
        header={t("appDetails.sectionTitle")}
        initiallyOpen
      >
        <div className="flex flex-col gap-md p-md pt-0">
          <TextField
            id={appNameId}
            label={t("appDetails.appName.label")}
            placeholder={t("appDetails.appName.placeholder")}
            value={details.appName}
            maxLength={APP_NAME_MAX_LENGTH}
            helperText={`${details.appName.length}/${APP_NAME_MAX_LENGTH} · ${t("appDetails.appName.counterSuffix")}`}
            onChange={(event) => onChangeField("appName", event.target.value)}
            fullWidth
          />
          <Alert status="warning" type="weak" layout="inline">
            {`${t("appDetails.appName.uniqueWarningTitle")} ${t("appDetails.appName.uniqueWarningDetail")}`}
          </Alert>

          <TextField
            id={dunsId}
            label={t("appDetails.duns.label")}
            placeholder={t("appDetails.duns.placeholder")}
            value={details.duns}
            status={
              details.duns === ""
                ? "default"
                : isDunsValid
                  ? "positive"
                  : "error"
            }
            statusText={
              details.duns === ""
                ? undefined
                : isDunsValid
                  ? t("appDetails.duns.valid")
                  : t("appDetails.duns.invalid")
            }
            onChange={(event) => onChangeField("duns", event.target.value)}
            fullWidth
          />
          <Alert status="info" type="weak" layout="inline">
            {t("appDetails.duns.timelineNote")}
          </Alert>

          <TextField
            id={dunsDateId}
            type="date"
            label={t("appDetails.dunsDate.label")}
            value={details.dunsSubmittedAt}
            onChange={(event) =>
              onChangeField("dunsSubmittedAt", event.target.value)
            }
            fullWidth
          />
          {dunsCountdown && (
            <Alert status="warning" type="weak" layout="inline">
              {`${t("appDetails.dunsDate.expectedReady", { date: dunsCountdown.expectedDate.toLocaleDateString() })} · ${t("appDetails.dunsDate.daysRemaining", { count: dunsCountdown.daysRemaining })}`}
            </Alert>
          )}

          <TextField
            id={googlePlayId}
            label={t("appDetails.googlePlay.label")}
            placeholder={t("appDetails.googlePlay.placeholder")}
            value={details.googlePlayUrl}
            status={isGooglePlayValid ? "default" : "error"}
            statusText={
              isGooglePlayValid ? undefined : t("appDetails.invalidUrl")
            }
            onChange={(event) =>
              onChangeField("googlePlayUrl", event.target.value)
            }
            fullWidth
          />

          <TextField
            id={appStoreId}
            label={t("appDetails.appStore.label")}
            placeholder={t("appDetails.appStore.placeholder")}
            value={details.appStoreUrl}
            status={isAppStoreValid ? "default" : "error"}
            statusText={
              isAppStoreValid ? undefined : t("appDetails.invalidUrl")
            }
            onChange={(event) =>
              onChangeField("appStoreUrl", event.target.value)
            }
            fullWidth
          />
        </div>
      </Accordion.Item>
    </div>
  );
};
