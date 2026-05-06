import React, { useId, useMemo, useState } from "react";

import { getLocalNow } from "@bsport/datetime-manipulation";
import {
  DatePicker,
  type Item,
  Select,
  type SelectedDate,
  TextArea,
} from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { i18nInstance, useTranslation } from "#src/i18n";

type ManualMethodType =
  | "card_manual_machine"
  | "cash"
  | "check"
  | "vacation_check"
  | "american_express"
  | "transfer"
  | "other"
  | "client_credit_balance";

const DEFAULT_MANUAL_METHOD: ManualMethodType = "card_manual_machine";

export const ManualPaymentMethod: React.FC = () => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const [manualType, setManualType] = useState<ManualMethodType>(
    DEFAULT_MANUAL_METHOD,
  );
  const [paymentDate, setPaymentDate] = useState<SelectedDate>(
    getLocalNow({ zone: getCompanyTimezone() }),
  );
  const [note, setNote] = useState("");

  const manualTypeId = useId();
  const manualDateId = useId();
  const manualNoteId = useId();

  const manualTypeOptions: Item[] = useMemo(
    () => [
      {
        id: "card_manual_machine",
        label: t(
          "paymentFlowModal.manual.fields.type.options.cardManualMachine",
        ),
      },
      {
        id: "cash",
        label: t("paymentFlowModal.manual.fields.type.options.cash"),
      },
      {
        id: "check",
        label: t("paymentFlowModal.manual.fields.type.options.check"),
      },
      {
        id: "vacation_check",
        label: t("paymentFlowModal.manual.fields.type.options.vacationCheck"),
      },
      {
        id: "american_express",
        label: t("paymentFlowModal.manual.fields.type.options.americanExpress"),
      },
      {
        id: "transfer",
        label: t("paymentFlowModal.manual.fields.type.options.transfer"),
      },
      {
        id: "other",
        label: t("paymentFlowModal.manual.fields.type.options.other"),
      },
      {
        id: "client_credit_balance",
        label: t(
          "paymentFlowModal.manual.fields.type.options.clientCreditBalance",
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-row items-start gap-xs self-stretch">
        <Select
          id={`payment-flow-manual-type-${manualTypeId}`}
          required
          fullWidth
          label={t("paymentFlowModal.manual.fields.type.label")}
          items={manualTypeOptions}
          value={manualType}
          onChange={(value) => setManualType(value as ManualMethodType)}
        />
        <DatePicker
          id={`payment-flow-manual-date-${manualDateId}`}
          required
          fullWidth
          label={t("paymentFlowModal.manual.fields.date.label")}
          mode="single"
          displayAs="popover"
          isInputField
          dateValue={paymentDate}
          onSelect={(date: SelectedDate) => {
            if (Array.isArray(date)) return;
            setPaymentDate(date ?? getLocalNow({ zone: getCompanyTimezone() }));
          }}
        />
      </div>
      <TextArea
        id={`payment-flow-manual-note-${manualNoteId}`}
        label={t("paymentFlowModal.manual.fields.note.label")}
        value={note}
        placeholder={t("paymentFlowModal.manual.fields.note.placeholder")}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          setNote(event.target.value)
        }
      />
    </div>
  );
};
