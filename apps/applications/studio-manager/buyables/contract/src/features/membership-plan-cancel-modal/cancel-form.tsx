import type { FC } from "react";

import type {
  PlannedInvoice,
  PlannedInvoiceStatus,
} from "@bsport/api-buyables/billing-plan-planned-invoice";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { FormField } from "@bsport/form";
import {
  Body,
  Collapse,
  Divider,
  Icon,
  RadioButton,
  TextField,
  type TextFieldProps,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FIELD_CONSTRAINTS,
  type MembershipPlanCancelFormData,
  useDefaultData,
} from "./schema";

const CANCELED_STATUSES: PlannedInvoiceStatus[] = ["voided", "refunded"];

const getInvoiceStatusMeta = (
  status: PlannedInvoiceStatus,
  t: ReturnType<typeof useTranslation>["t"],
): { icon: "hourglass-03" | "x-circle"; tooltip: string } =>
  CANCELED_STATUSES.includes(status)
    ? {
        icon: "x-circle",
        tooltip: t("cancelModal.invoicesField.statusTooltip.canceled"),
      }
    : {
        icon: "hourglass-03",
        tooltip: t("cancelModal.invoicesField.statusTooltip.pending"),
      };

type InvoiceRadioListProps = {
  invoices: PlannedInvoice[];
  isLoading?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

const InvoiceRadioList: FC<InvoiceRadioListProps> = ({
  invoices,
  isLoading,
  onChange,
  value,
}) => {
  const { t, i18n } = useTranslation("membership-plan");

  return (
    <Collapse initiallyOpen>
      <Collapse.Controller>
        {({ isCollapseOpen, setIsCollapseOpen, collapseProps }) => (
          <button
            type="button"
            {...collapseProps}
            className="flex items-center gap-xs text-left"
            onClick={() => setIsCollapseOpen((isOpen) => !isOpen)}
            aria-label={t("cancelModal.invoicesField.toggle")}
          >
            <Body size="md" weight="strong">
              {t("cancelModal.invoicesField.label")}
            </Body>
            <Icon
              icon={isCollapseOpen ? "chevron-down" : "chevron-right"}
              size="md"
            />
          </button>
        )}
      </Collapse.Controller>
      <Collapse.Content>
        <div className="mt-sm flex flex-col">
          {isLoading ? (
            <Body size="sm" color="weak">
              {t("cancelModal.invoicesField.loading")}
            </Body>
          ) : invoices.length > 0 ? (
            <>
              <div>
                <div
                  className={`flex items-center gap-sm py-md px-xs rounded-sm transition-colors cursor-pointer ${value === "" ? "bg-surface-status-positive-weak" : "hover:bg-surface-action-default-elevated-hovered"}`}
                  onClick={() =>
                    onChange?.({
                      target: { value: "" },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <RadioButton
                    label=""
                    value=""
                    checked={value === ""}
                    onChange={onChange ?? (() => {})}
                  />
                  <div className="flex-1">
                    <Body size="md">
                      {t("cancelModal.invoicesField.noInvoice")}
                    </Body>
                  </div>
                </div>
                <Divider weight="extra-thin" className="my-0" />
              </div>
              {invoices.map((invoice, index) => {
                const invoiceValue = String(invoice.id);
                const isChecked = value === invoiceValue;
                const formattedDate = formatDateTime(
                  invoice.date,
                  DATETIME_FORMATS.MEDIUM_DATE,
                  { locale: i18n.language },
                );
                const formattedAmount = getCurrencyDisplayWithPrice(
                  invoice.amount_due_cts / 100,
                );

                const { icon, tooltip } = getInvoiceStatusMeta(
                  invoice.status,
                  t,
                );

                return (
                  <div key={invoice.id}>
                    {index > 0 && (
                      <Divider weight="extra-thin" className="my-0" />
                    )}
                    <div
                      className={`flex items-center gap-sm py-md px-xs rounded-sm transition-colors cursor-pointer ${isChecked ? "bg-surface-status-positive-weak" : "hover:bg-surface-action-default-elevated-hovered"}`}
                      onClick={() =>
                        onChange?.({
                          target: { value: invoiceValue },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      <RadioButton
                        label=""
                        value={invoiceValue}
                        checked={isChecked}
                        onChange={onChange ?? (() => {})}
                      />
                      <div className="flex-1">
                        <Body size="md">{formattedDate}</Body>
                      </div>
                      <Body size="sm" color="weak">
                        {formattedAmount}
                      </Body>
                      <Tooltip label={tooltip} placement="top">
                        <Icon icon={icon} size="sm" />
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <Body size="sm" color="weak">
              {t("cancelModal.invoicesField.empty")}
            </Body>
          )}
        </div>
      </Collapse.Content>
    </Collapse>
  );
};

type MembershipPlanCancelFormProps = {
  formId: string;
  invoices: PlannedInvoice[];
  isLoadingInvoices?: boolean;
};

export const MembershipPlanCancelForm: FC<MembershipPlanCancelFormProps> = ({
  formId,
  invoices,
  isLoadingInvoices,
}) => {
  const { t } = useTranslation("membership-plan");
  const defaultData = useDefaultData();

  return (
    <section className="flex flex-col gap-md">
      <FormField<MembershipPlanCancelFormData, "reason", TextFieldProps>
        name="reason"
        mapProps={({ defaultProps, field, form }) => ({
          ...defaultProps,
          helperText: `${field.value.length}/${FIELD_CONSTRAINTS.REASON_MAX_LENGTH}`,
          onClear: () => {
            form.setValue("reason", defaultData.reason, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        })}
      >
        <TextField
          id={`${formId}-reason`}
          label={t("cancelModal.reasonField.label")}
          required
          fullWidth
        />
      </FormField>

      <FormField<
        MembershipPlanCancelFormData,
        "fromInvoiceId",
        InvoiceRadioListProps
      >
        name="fromInvoiceId"
        mapProps={({ defaultProps, form }) => ({
          value: defaultProps.value == null ? "" : String(defaultProps.value),
          onChange: (event) => {
            const raw = event.target.value;
            form.setValue("fromInvoiceId", raw === "" ? null : Number(raw), {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        })}
      >
        <InvoiceRadioList invoices={invoices} isLoading={isLoadingInvoices} />
      </FormField>
    </section>
  );
};
