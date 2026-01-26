import { Alert, Body, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  PASS_SUBSCRIPTION_FILTERING_IN,
  PASS_SUBSCRIPTION_FILTERING_OUT,
} from "./types";

type PassSubscriptionFilteringFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PassSubscriptionFilteringField = ({
  value,
  onChange,
}: PassSubscriptionFilteringFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <div className="flex flex-col gap-md">
      <RadioGroup
        required
        id="pass-notification-subscription-filtering-radio-field"
        label={t("steps.notificationRules.pass.includedInContract.label")}
        options={[
          {
            value: PASS_SUBSCRIPTION_FILTERING_IN,
            label: t(
              "steps.notificationRules.pass.includedInContract.options.everyPass",
            ),
          },
          {
            value: PASS_SUBSCRIPTION_FILTERING_OUT,
            label: t(
              "steps.notificationRules.pass.includedInContract.options.outsideSubscription",
            ),
          },
        ]}
        value={value}
        onChange={onChange}
      />
      <Alert type="weak" status="info">
        <Body htmlVariant="p" size="md">
          {t("steps.notificationRules.pass.includedInContract.infos")}
        </Body>
      </Alert>
    </div>
  );
};
