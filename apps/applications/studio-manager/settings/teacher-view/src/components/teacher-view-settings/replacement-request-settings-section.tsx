import { type FC, useMemo } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Alert,
  Body,
  Button,
  Select,
  type SelectProps,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  type ReplacementRequestLimitationPeriodType,
  replacementRequestLimitationPeriodItems,
} from "#src/constants";
import { type ReplacementRequestSettingsFormValues } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { ToggleFormField } from "../toggle-form-field";

const ReplacementRequestNumberField = ({
  name,
  id,
  label,
  helperText,
}: {
  name: Exclude<
    keyof ReplacementRequestSettingsFormValues,
    "has_coach_access_to_replacement_request"
  >;
  id: string;
  label?: string;
  helperText?: string;
}) => {
  const { getFieldState, watch, setValue, formState } =
    useFormContext<ReplacementRequestSettingsFormValues>();
  const { error } = getFieldState(name, formState);
  const value = watch(name);
  return (
    <TextField
      id={id}
      type="number"
      min={1}
      label={label}
      helperText={helperText}
      fullWidth
      value={String(value ?? "")}
      onChange={(e) => {
        const raw = e.target.value;
        const next =
          raw === "" || Number.isNaN(e.target.valueAsNumber)
            ? undefined
            : e.target.valueAsNumber;
        // `name` union includes boolean fields so setValue rejects `number | undefined` — zod handles the undefined case at validation time
        setValue(name, next as never, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }}
      status={error ? "error" : "default"}
      statusText={error?.message}
    />
  );
};

type ReplacementRequestSettingsSectionProps = {
  hasSubteacherUpsell: boolean;
  isSaving: boolean;
};

export const ReplacementRequestSettingsSection: FC<
  ReplacementRequestSettingsSectionProps
> = ({ hasSubteacherUpsell, isSaving }) => {
  const { t } = useTranslation("common");
  const {
    watch,
    formState: { isDirty, isValid },
  } = useFormContext<ReplacementRequestSettingsFormValues>();
  const hasReplacementRequest = watch(
    "has_coach_access_to_replacement_request",
  );
  const isLateReplacementRequestLimited = watch(
    "is_late_replacement_request_limited",
  );
  const lateRequestDays = watch(
    "days_before_offer_replacement_request_is_late",
  );
  const closingDays = watch(
    "days_before_offer_replacement_request_closing_date",
  );
  const maxLateRequests = watch("max_late_requests_per_limitation_period");
  const periodNb = watch("late_request_limitation_period_nb");
  const selectedPeriodType = watch("late_request_limitation_period_type");

  const periodItems = useMemo(() => {
    const labelsByValue: Record<
      ReplacementRequestLimitationPeriodType,
      string
    > = {
      1: t("teacherViewSettings.replacementRequest.periodTypes.1"),
      2: t("teacherViewSettings.replacementRequest.periodTypes.2"),
      3: t("teacherViewSettings.replacementRequest.periodTypes.3"),
    };

    return [
      {
        id: "",
        label: t(
          "teacherViewSettings.replacementRequest.periodTypes.placeholder",
        ),
        disabled: true,
      },
      ...replacementRequestLimitationPeriodItems.map((item) => ({
        id: item.id,
        label:
          labelsByValue[
            Number(item.id) as ReplacementRequestLimitationPeriodType
          ],
      })),
    ];
  }, [t]);

  const selectedPeriodWord = useMemo(
    () => ({
      1: t("teacherViewSettings.replacementRequest.periodWordWeek", {
        count: periodNb,
      }),
      2: t("teacherViewSettings.replacementRequest.periodWordMonth", {
        count: periodNb,
      }),
      3: t("teacherViewSettings.replacementRequest.periodWordYear", {
        count: periodNb,
      }),
    }),
    [periodNb, t],
  );

  const recapPeriod =
    selectedPeriodType != null
      ? selectedPeriodWord[selectedPeriodType]
      : undefined;
  const shouldShowLimitsRecap =
    selectedPeriodType != null &&
    maxLateRequests != null &&
    periodNb != null &&
    recapPeriod != null;

  return (
    <div className="flex flex-col gap-lg items-start">
      <div className="flex flex-col gap-md items-start">
        <div className="flex flex-col">
          <Title htmlVariant="h2">
            {t("teacherViewSettings.replacementRequest.title")}
          </Title>
          <Body htmlVariant="p" color="weak" size="sm">
            {t("teacherViewSettings.replacementRequest.description")}
          </Body>
        </div>

        <ToggleFormField<ReplacementRequestSettingsFormValues>
          name="has_coach_access_to_replacement_request"
          id="teacher-view-replacement-access-toggle"
          checked={hasReplacementRequest}
          disabled={!hasSubteacherUpsell}
          label={t("teacherViewSettings.replacementRequest.enable")}
        />
      </div>

      {!hasSubteacherUpsell ? (
        <Body htmlVariant="p" color="weak" size="sm">
          {t("teacherViewSettings.restrictions.substitutionDisabledHelper")}
        </Body>
      ) : null}

      {hasSubteacherUpsell && hasReplacementRequest ? (
        <div className="flex flex-col gap-lg items-start">
          <div className="flex flex-col gap-md items-start">
            <Title htmlVariant="h3">
              {t("teacherViewSettings.replacementRequest.lateRequestSection")}
            </Title>

            <ReplacementRequestNumberField
              name="days_before_offer_replacement_request_is_late"
              id="teacher-view-replacement-late-days"
              label={t("teacherViewSettings.replacementRequest.daysLate.label")}
              helperText={t(
                "teacherViewSettings.replacementRequest.daysLate.helper",
                { count: lateRequestDays },
              )}
            />

            <div className="flex flex-col gap-sm items-start">
              <ToggleFormField<ReplacementRequestSettingsFormValues>
                name="is_late_replacement_request_limited"
                id="teacher-view-replacement-limit-toggle"
                checked={isLateReplacementRequestLimited}
                label={t(
                  "teacherViewSettings.replacementRequest.limits.toggle",
                )}
              />

              {isLateReplacementRequestLimited ? (
                <div className="ml-sm flex flex-col items-start gap-sm pl-lg">
                  <div className="grid grid-cols-2 items-end gap-2xs">
                    <div className="col-span-2">
                      <ReplacementRequestNumberField
                        name="max_late_requests_per_limitation_period"
                        id="teacher-view-replacement-max-late-requests"
                        label={t(
                          "teacherViewSettings.replacementRequest.limits.maxRequestsLabel",
                        )}
                      />
                    </div>
                    <ReplacementRequestNumberField
                      label={t(
                        "teacherViewSettings.replacementRequest.limits.every",
                      )}
                      name="late_request_limitation_period_nb"
                      id="teacher-view-replacement-period-count"
                    />
                    <FormField<
                      ReplacementRequestSettingsFormValues,
                      "late_request_limitation_period_type",
                      SelectProps
                    >
                      name="late_request_limitation_period_type"
                      mapProps={({ fieldState, field, form }) => ({
                        value: field.value != null ? String(field.value) : "",
                        onChange: (id) => {
                          const next = Number(
                            id,
                          ) as ReplacementRequestLimitationPeriodType;
                          form.setValue(
                            "late_request_limitation_period_type",
                            next,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          );
                        },
                        status: fieldState.error ? "error" : "default",
                        errorText: fieldState.error?.message,
                      })}
                    >
                      <Select
                        id="teacher-view-replacement-period-type"
                        items={periodItems}
                        fullWidth
                      />
                    </FormField>
                  </div>

                  {shouldShowLimitsRecap ? (
                    <Alert status="info" type="weak" layout="inline">
                      {t(
                        "teacherViewSettings.replacementRequest.limits.recap",
                        {
                          maxRequests: maxLateRequests,
                          periodNb,
                          period: recapPeriod,
                        },
                      )}
                    </Alert>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-md items-start">
            <Title htmlVariant="h3">
              {t("teacherViewSettings.replacementRequest.closingSection")}
            </Title>

            <ReplacementRequestNumberField
              name="days_before_offer_replacement_request_closing_date"
              id="teacher-view-replacement-closing-days"
              label={t(
                "teacherViewSettings.replacementRequest.closingDays.label",
              )}
              helperText={t(
                "teacherViewSettings.replacementRequest.closingDays.helper",
                { count: closingDays },
              )}
            />
          </div>
        </div>
      ) : null}

      <Button
        id="teacher-view-replacement-request-submit-button"
        type="submit"
        size="md"
        color="main"
        intent="call-to-action"
        label={t("teacherViewSettings.save")}
        disabled={!isDirty || !isValid || isSaving}
        loading={isSaving}
      />
    </div>
  );
};
