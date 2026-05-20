import { type ChangeEvent, useId } from "react";

import { getLocalNow } from "@bsport/datetime-manipulation";
import { FormField, useFormContext } from "@bsport/form";
import {
  Accordion,
  Body,
  DatePicker,
  type DatePickerProps,
  type Item,
  List,
  type ListItemProps,
  Select,
  type SelectProps,
  type SelectedDate,
  TextField,
  type TextFieldProps,
  Title,
} from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import {
  INSTALLMENT_INTERVAL_IDS,
  type InstallmentIntervalId,
  type PaymentFlowFormValues,
  buildInstallmentFullCycleRows,
  getInstallmentSingleAnchorDate,
  installmentScheduleDetailSchema,
} from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-form";
import { TFunction, i18nInstance, useTranslation } from "#src/i18n";

const parseIntegerInput = (raw: string): number | null => {
  const value = raw.trim();
  if (value === "") return null;
  if (!/^\d+$/.test(value)) return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
};

type InstallmentsSectionProps = {
  installmentScheduleTotalCts: number;
};

const RECURRENCE_SUFFIX_KEY_BY_INTERVAL = {
  day: "paymentFlowModal.installments.unitDay",
  week: "paymentFlowModal.installments.unitWeek",
  month: "paymentFlowModal.installments.unitMonth",
  year: "paymentFlowModal.installments.unitYear",
} as const satisfies Record<InstallmentIntervalId, string>;

const getRecurrenceSuffix = (
  t: TFunction,
  interval: InstallmentIntervalId,
  count: number,
): string => t(RECURRENCE_SUFFIX_KEY_BY_INTERVAL[interval], { count });

export const InstallmentsSection = ({
  installmentScheduleTotalCts,
}: InstallmentsSectionProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const { watch } = useFormContext<PaymentFlowFormValues>();
  const baseId = useId();
  const ids = {
    intervalSelect: `${baseId}-interval-select`,
    repeatEvery: `${baseId}-repeat-every`,
    numberOfInvoices: `${baseId}-number-of-invoices`,
    firstInstallment: `${baseId}-first-installment`,
    fullCycleList: `${baseId}-full-cycle-list`,
  };

  const installmentNbInterval = watch("installmentNbInterval");
  const installmentRecurrenceBasis = watch("installmentRecurrenceBasis");
  const installmentInterval = watch("installmentInterval");
  const installmentAnchorDate = watch("installmentAnchorDate");
  const partialAmountCts = watch("partialAmountCts");

  const scheduleTotalCts =
    installmentScheduleTotalCts != null &&
    Number.isFinite(installmentScheduleTotalCts)
      ? installmentScheduleTotalCts
      : partialAmountCts;

  const intervalItems: Item[] = INSTALLMENT_INTERVAL_IDS.map((id) => ({
    id,
    label: t(`paymentFlowModal.installments.interval.${id}`),
  }));

  const count =
    installmentRecurrenceBasis >= 1 ? installmentRecurrenceBasis : 1;
  const recurrenceSuffix = getRecurrenceSuffix(t, installmentInterval, count);

  const fullCycleParsed = installmentScheduleDetailSchema.safeParse({
    installmentInterval,
    installmentRecurrenceBasis,
    installmentNbInterval,
  });
  const fullCycleRows = fullCycleParsed.success
    ? buildInstallmentFullCycleRows(
        fullCycleParsed.data,
        getInstallmentSingleAnchorDate(installmentAnchorDate),
        scheduleTotalCts,
        i18nInstance.language,
      )
    : undefined;

  const fullCycleListItems: ListItemProps[] | undefined =
    fullCycleRows && fullCycleRows.length > 0
      ? fullCycleRows.map((row) => ({
          id: `payment-flow-full-cycle-${row.installmentNumber}`,
          title: row.dateLabel,
          rightTitle: row.amountLabel,
        }))
      : undefined;

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h3" color="default" weight="strong">
          {t("paymentFlowModal.installments.timelineTitle")}
        </Title>

        <div className="flex flex-col gap-xs">
          <div className="flex w-full flex-row items-start gap-xs">
            <div className="min-w-0 flex-1">
              <FormField<
                PaymentFlowFormValues,
                "installmentInterval",
                SelectProps
              >
                name="installmentInterval"
                mapProps={({ field, defaultProps }) => ({
                  name: field.name,
                  value: field.value as InstallmentIntervalId,
                  onChange: (optionId: string) => {
                    field.onChange(optionId);
                  },
                  onBlur: field.onBlur,
                  errorText: defaultProps.statusText,
                  status:
                    defaultProps.status === "error" ? "critical" : "default",
                })}
              >
                <Select
                  id={`payment-flow-installments-interval-${ids.intervalSelect}`}
                  required
                  fullWidth
                  label={t("paymentFlowModal.installments.intervalLabel")}
                  items={intervalItems}
                />
              </FormField>
            </div>
            <div className="min-w-0 flex-1">
              <FormField<
                PaymentFlowFormValues,
                "installmentRecurrenceBasis",
                TextFieldProps
              >
                name="installmentRecurrenceBasis"
                mapProps={({ defaultProps, field, form: { setValue } }) => ({
                  ...defaultProps,
                  type: "number",
                  fullWidth: true,
                  label: t("paymentFlowModal.installments.repeatEveryLabel"),
                  value:
                    field.value === 0 && defaultProps.status === "error"
                      ? ""
                      : String(field.value ?? ""),
                  suffix: { type: "text", value: recurrenceSuffix },
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    const parsed = parseIntegerInput(e.target.value);
                    if (parsed === null) {
                      setValue("installmentRecurrenceBasis", 0, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      return;
                    }
                    setValue("installmentRecurrenceBasis", parsed, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  },
                })}
              >
                <TextField
                  id={`payment-flow-installments-repeat-${ids.repeatEvery}`}
                />
              </FormField>
            </div>
          </div>

          <FormField<
            PaymentFlowFormValues,
            "installmentNbInterval",
            TextFieldProps
          >
            name="installmentNbInterval"
            mapProps={({ defaultProps, field, form: { setValue } }) => ({
              ...defaultProps,
              type: "number",
              fullWidth: true,
              label: t("paymentFlowModal.installments.numberOfInvoicesLabel"),
              value:
                field.value === 0 && defaultProps.status === "error"
                  ? ""
                  : String(field.value ?? ""),
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const parsed = parseIntegerInput(e.target.value);
                if (parsed === null) {
                  setValue("installmentNbInterval", 0, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  return;
                }
                setValue("installmentNbInterval", parsed, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          >
            <TextField
              id={`payment-flow-installments-count-${ids.numberOfInvoices}`}
            />
          </FormField>

          <FormField<
            PaymentFlowFormValues,
            "installmentAnchorDate",
            DatePickerProps
          >
            name="installmentAnchorDate"
            mapProps={({ field, defaultProps, form: { setValue } }) => ({
              dateValue: field.value,
              onSelect: (date: SelectedDate) => {
                if (Array.isArray(date)) return;
                setValue(
                  "installmentAnchorDate",
                  date ?? getLocalNow({ zone: getCompanyTimezone() }),
                  { shouldDirty: true, shouldValidate: true },
                );
              },
              onBlur: field.onBlur,
              ref: field.ref,
              status: defaultProps.status,
              statusText: defaultProps.statusText,
            })}
          >
            <DatePicker
              id={`payment-flow-installments-first-${ids.firstInstallment}`}
              fullWidth
              label={t("paymentFlowModal.installments.firstInstallmentLabel")}
              mode="single"
              displayAs="popover"
              isInputField
            />
          </FormField>
        </div>
      </div>

      <Accordion className="flex flex-col gap-lg">
        <Accordion.Item
          ariaLabel={t("paymentFlowModal.installments.showFullCycle")}
          header={
            <Title htmlVariant="h4" color="default" weight="strong">
              {t("paymentFlowModal.installments.showFullCycle")}
            </Title>
          }
        >
          {fullCycleListItems ? (
            <List
              id={`payment-flow-full-cycle-${ids.fullCycleList}`}
              className="mt-xs"
              isCompact
              items={fullCycleListItems}
            />
          ) : (
            <Body
              htmlVariant="p"
              size="lg"
              weight="weak"
              color="weak"
              className="mt-xs px-md py-xs"
            >
              {t("paymentFlowModal.installments.fullCyclePreviewUnavailable")}
            </Body>
          )}
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
