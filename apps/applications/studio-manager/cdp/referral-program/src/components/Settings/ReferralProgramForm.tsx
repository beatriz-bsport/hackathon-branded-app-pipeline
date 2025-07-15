import { useEffect, useId } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { TextField, Toggle } from "@bsport/kaizen-primitive-core";
import type { Tag } from "@bsport/store-cdp-tag";

import { ReferralRewardField } from "#src/components/Settings/FormFields/ReferralRewardField";
import { ReferredRewardField } from "#src/components/Settings/FormFields/ReferredRewardField";
import { RewardExpirationTimeField } from "#src/components/Settings/FormFields/RewardExpirationTimeField";
import { TagSelector } from "#src/components/Settings/FormFields/TagSelector";
import { useFetchTag } from "#src/hooks/api/use-fetch-tags";
import {
  AMOUNT_REFERRING_REWARD_DEFAULT,
  APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT,
  APPLICATION_TIME_LIMIT_UNIT_DEFAULT,
  BASKET_MINIMAL_AMOUNT_DEFAULT,
  MAX_REFERRING_USAGE_DEFAULT,
  REFERRING_REWARD_AMOUNT_DEFAULT,
  REFERRING_REWARD_PERCENTAGE_DEFAULT,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { referralProgramSchema } from "#src/utils/schema";
import {
  ReferralProgramFormData,
  referringRewardTypeValues,
} from "#src/utils/types";

type ReferralProgramFormProps = {
  companyCurrency: string;
};

export const ReferralProgramForm: React.FC<ReferralProgramFormProps> = ({
  companyCurrency,
}: ReferralProgramFormProps) => {
  const fieldIdPrefix = useId();
  const { t } = useTranslation("settings");
  const { tags, tagGroups, fetchTagGroups, fetchTags } = useFetchTag();

  const defaultValues: ReferralProgramFormData = {
    basketMinimalAmount: BASKET_MINIMAL_AMOUNT_DEFAULT,
    amountReferringReward: AMOUNT_REFERRING_REWARD_DEFAULT,
    maxReferringUsage: MAX_REFERRING_USAGE_DEFAULT,
    referringRewardType: referringRewardTypeValues.amount,
    referringRewardAmount: REFERRING_REWARD_AMOUNT_DEFAULT,
    referringRewardPercentage: REFERRING_REWARD_PERCENTAGE_DEFAULT,
    applicationTimeLimitInterval: APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT,
    applicationTimeLimitUnit: APPLICATION_TIME_LIMIT_UNIT_DEFAULT,
    toggleTagReferredMember: false,
    tagReferredMember: null,
    toggleLinkRedirection: false,
    redirectLink: null,
  };
  const methods = useFormController({
    mode: "onBlur",
    schema: referralProgramSchema,
    defaultValues,
  });
  const { watch } = methods;

  const watchedToggleTagReferredMember = watch("toggleTagReferredMember");
  const watchedToggleLinkRedirection = watch("toggleLinkRedirection");

  useEffect(() => {
    fetchTags();
    fetchTagGroups();
  }, [fetchTags, fetchTagGroups]);

  return (
    <ControlledForm
      id="referral-program-form"
      onSubmit={(data) => console.log("lol", data)}
      className="flex flex-col gap-lg"
      {...methods}
    >
      <FormField<ReferralProgramFormData, "basketMinimalAmount">
        name="basketMinimalAmount"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          type: "number",
          value: String(field.value),
        })}
      >
        <TextField
          type="number"
          id={`${fieldIdPrefix}-referral-program-basket-minimal-amount`}
          label={t("active.form.basketMinimalAmount.label")}
          helperText={t("active.form.basketMinimalAmount.helper")}
          suffix={{
            type: "text",
            value: companyCurrency,
          }}
        />
      </FormField>
      <ReferralRewardField companyCurrency={companyCurrency} />
      <ReferredRewardField companyCurrency={companyCurrency} {...methods} />
      <RewardExpirationTimeField fieldIdPrefix={fieldIdPrefix} {...methods} />
      <div
        id="referral-program-tag-toggle-container"
        className="flex flex-col gap-sm"
      >
        <FormField<
          ReferralProgramFormData,
          "toggleTagReferredMember"
        > name="toggleTagReferredMember">
          <Toggle
            id="referral-program-tag-toggle"
            label={t("active.form.tagSelector.label")}
            checked={watchedToggleTagReferredMember}
            helperText={
              watchedToggleTagReferredMember
                ? t("active.form.tagSelector.helper")
                : undefined
            }
            onChange={(checked) => {
              methods.setValue("toggleTagReferredMember", checked as boolean);
            }}
          />
        </FormField>
        <div className="flex flex-row">
          <Toggle
            className="invisible"
            id="spacer-tag-selector"
            label=""
            checked={false}
          />
          {watchedToggleTagReferredMember && tags && tagGroups ? (
            <TagSelector
              tagGroups={tagGroups}
              tags={tags}
              searchInputProps={{
                id: `${fieldIdPrefix}-referral-program-tag-selector-input`,
                placeholder: t("active.form.tagSelector.placeholder"),
                iconRight: "chevron-down",
                helperText: methods.formState.errors.tagReferredMember?.message,
                status: methods.formState.errors.tagReferredMember?.message
                  ? "error"
                  : "default",
              }}
              onDismissTagChip={() => {
                methods.setValue("tagReferredMember", null);
                methods.trigger("tagReferredMember");
              }}
              onSelectTag={(tag: Tag) => {
                methods.setValue("tagReferredMember", tag.id);
                methods.trigger("tagReferredMember");
              }}
              onSearchBlur={() => {
                methods.trigger("tagReferredMember");
              }}
            />
          ) : null}
        </div>
      </div>
      <div
        id="referral-program-redirect-link-toggle-container"
        className="flex flex-col gap-sm"
      >
        <FormField<
          ReferralProgramFormData,
          "toggleLinkRedirection"
        > name="toggleLinkRedirection">
          <Toggle
            id="referral-program-redirect-link-toggle"
            label={t("active.form.redirectLink.switch.label")}
            checked={watchedToggleLinkRedirection}
            helperText={t("active.form.redirectLink.switch.helper")}
            onChange={(checked) => {
              if (typeof checked !== "boolean") return;
              methods.setValue("toggleLinkRedirection", checked);
            }}
          />
        </FormField>
        {watchedToggleLinkRedirection ? (
          <div className="flex flex-row">
            <Toggle className="invisible" checked={false} label="" id="" />
            <FormField<ReferralProgramFormData, "redirectLink">
              name="redirectLink"
              mapProps={({ defaultProps, field }) => ({
                ...defaultProps,
                value: field.value ?? "",
                onClear: () => {
                  methods.setValue("redirectLink", null);
                  methods.trigger("redirectLink");
                },
              })}
            >
              <TextField
                className="min-w-[490px]"
                id={`${fieldIdPrefix}-referral-program-redirect-link`}
                label={t("active.form.redirectLink.textfield.label")}
                placeholder={t(
                  "active.form.redirectLink.textfield.placeholder",
                )}
              />
            </FormField>
          </div>
        ) : null}
      </div>
    </ControlledForm>
  );
};
