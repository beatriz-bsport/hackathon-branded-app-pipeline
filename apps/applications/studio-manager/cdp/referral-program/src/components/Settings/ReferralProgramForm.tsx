import { useEffect, useMemo } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import {
  Button,
  TextField,
  Toggle,
  ToggleProps,
} from "@bsport/kaizen-primitive-core";
import type { ReferralSettings } from "@bsport/store-cdp-referral";
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
import { referringRewardTypeValues } from "#src/utils/types";
import { ReferralProgramFormData } from "#src/utils/types";

type ReferralProgramFormProps = {
  companyCurrency: string;
  referralProgram: ReferralSettings;
  onSaveProgram: (data: ReferralProgramFormData) => void;
};

export const ReferralProgramForm: React.FC<ReferralProgramFormProps> = ({
  companyCurrency,
  referralProgram,
  onSaveProgram,
}: ReferralProgramFormProps) => {
  const { t } = useTranslation("settings");
  const { tags, tagGroups, tagsMappedByTagId, fetchTags, fetchTagGroups } =
    useFetchTag();

  const defaultValues: ReferralProgramFormData = useMemo(
    () => ({
      basketMinimalAmount:
        referralProgram?.minimum_basket_amount ?? BASKET_MINIMAL_AMOUNT_DEFAULT,
      amountReferringReward:
        referralProgram?.amount_reward_referring ??
        AMOUNT_REFERRING_REWARD_DEFAULT,
      maxReferringUsage:
        referralProgram?.maximum_referral_uses ?? MAX_REFERRING_USAGE_DEFAULT,
      referringRewardType:
        referralProgram?.referred_voucher_type === "amount_off"
          ? referringRewardTypeValues.amount
          : referringRewardTypeValues.percentage,
      referringRewardAmount:
        referralProgram?.amount_off_referred ?? REFERRING_REWARD_AMOUNT_DEFAULT,
      referringRewardPercentage:
        referralProgram?.percent_off_referred ??
        REFERRING_REWARD_PERCENTAGE_DEFAULT,
      applicationTimeLimitInterval:
        referralProgram?.application_time_limit_intervals ??
        APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT,
      applicationTimeLimitUnit:
        referralProgram?.application_time_limit_unit ??
        APPLICATION_TIME_LIMIT_UNIT_DEFAULT,
      toggleTagReferredMember: !!referralProgram?.tag_referred_member,
      tagReferredMember: referralProgram?.tag_referred_member ?? null,
      toggleLinkRedirection: !!referralProgram?.redirect_link,
      redirectLink: referralProgram?.redirect_link ?? null,
    }),
    [referralProgram],
  );

  const methods = useFormController({
    mode: "onBlur",
    schema: referralProgramSchema,
    defaultValues,
  });
  const { watch } = methods;

  const watchedToggleTagReferredMember = watch("toggleTagReferredMember");
  const watchedToggleLinkRedirection = watch("toggleLinkRedirection");
  useEffect(() => {
    if (referralProgram?.tag_referred_member && tags?.length > 0) {
      const tag =
        tagsMappedByTagId[referralProgram.tag_referred_member] ?? null;
      if (tag) {
        methods.setValue("toggleTagReferredMember", true);
        methods.setValue("tagReferredMember", tag.id);
      } else {
        methods.setValue("toggleTagReferredMember", false);
        methods.setValue("tagReferredMember", null);
      }
    }
  }, [referralProgram, tags, tagsMappedByTagId, methods]);

  useEffect(() => {
    if (watchedToggleLinkRedirection && referralProgram?.redirect_link) {
      methods.setValue("toggleLinkRedirection", true);
      methods.setValue("redirectLink", referralProgram.redirect_link);
    }
  }, [watchedToggleLinkRedirection, methods, referralProgram?.redirect_link]);

  useEffect(() => {
    fetchTags();
    fetchTagGroups();
  }, []);

  return (
    <ControlledForm
      id="referral-program-form"
      onSubmit={(data: ReferralProgramFormData) => onSaveProgram(data)}
      className="flex flex-col gap-lg"
      {...methods}
    >
      <FormField<ReferralProgramFormData, "basketMinimalAmount">
        name="basketMinimalAmount"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          type: "number",
          value: String(field.value),
          min: 0,
        })}
      >
        <TextField
          type="number"
          id="referral-program-basket-minimal-amount"
          label={t("active.form.basketMinimalAmount.label")}
          helperText={t("active.form.basketMinimalAmount.helper")}
          suffix={{
            type: "text",
            value: companyCurrency,
          }}
        />
      </FormField>
      <ReferralRewardField companyCurrency={companyCurrency} {...methods} />
      <ReferredRewardField companyCurrency={companyCurrency} {...methods} />
      <RewardExpirationTimeField {...methods} />
      <div className="flex flex-col gap-xs">
        <div
          id="referral-program-tag-toggle-container"
          className="flex flex-col gap-sm"
        >
          <FormField<
            ReferralProgramFormData,
            "toggleTagReferredMember",
            ToggleProps
          >
            name="toggleTagReferredMember"
            mapProps={({ defaultProps, field }) => ({
              ...defaultProps,
              value: String(field.value),
              onChange: () => {
                const checked = !field.value;
                methods.setValue("toggleTagReferredMember", checked);
                if (!checked) {
                  methods.setValue("tagReferredMember", null);
                }
              },
            })}
          >
            <Toggle
              id="referral-program-tag-toggle"
              label={t("active.form.tagSelector.label")}
              checked={watchedToggleTagReferredMember}
              helperText={
                watchedToggleTagReferredMember
                  ? t("active.form.tagSelector.helper")
                  : undefined
              }
            />
          </FormField>
          {watchedToggleTagReferredMember && tags && tagGroups ? (
            <div className="flex flex-row">
              <Toggle
                className="invisible"
                id="spacer-tag-selector"
                label=""
                checked={false}
              />
              <TagSelector
                initialTag={
                  referralProgram?.tag_referred_member
                    ? tagsMappedByTagId[referralProgram.tag_referred_member]
                    : null
                }
                tagGroups={tagGroups}
                tags={tags}
                searchInputProps={{
                  id: "referral-program-tag-selector-input",
                  placeholder: t("active.form.tagSelector.placeholder"),
                  iconRight: "chevron-down",
                  statusText:
                    methods.formState.errors.tagReferredMember?.message,
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
            </div>
          ) : null}
        </div>
        <div
          id="referral-program-redirect-link-toggle-container"
          className="flex flex-col gap-sm"
        >
          <FormField<
            ReferralProgramFormData,
            "toggleLinkRedirection",
            ToggleProps
          >
            name="toggleLinkRedirection"
            mapProps={({ defaultProps, field }) => ({
              ...defaultProps,
              value: String(field.value),
              onChange: () => {
                const checked = !field.value;
                methods.setValue("toggleLinkRedirection", checked);
                if (!checked) {
                  methods.setValue("redirectLink", null);
                }
              },
            })}
          >
            <Toggle
              id="referral-program-redirect-link-toggle"
              label={t("active.form.redirectLink.switch.label")}
              checked={watchedToggleLinkRedirection}
              helperText={t("active.form.redirectLink.switch.helper")}
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
                  id="referral-program-redirect-link"
                  label={t("active.form.redirectLink.textfield.label")}
                  placeholder={t(
                    "active.form.redirectLink.textfield.placeholder",
                  )}
                />
              </FormField>
            </div>
          ) : null}
        </div>
      </div>

      <Button
        id="referral-program-form-submit-button"
        className="w-fit"
        type="submit"
        size="md"
        color="main"
        intent="call-to-action"
        label={t("active.form.saveSettings.buttonLabel")}
      />
    </ControlledForm>
  );
};
