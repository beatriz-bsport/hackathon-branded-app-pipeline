import { type FC, useMemo, useState } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services";
import {
  ALL_PAYMENT_METHOD_SELECTOR_ID,
  PAYMENT_METHOD_SELECTOR_SELECTION_KIND,
  PaymentMethodSelector,
  type PaymentMethodSelectorSelection,
} from "@bsport/kaizen-business-components/financial-services/payment-method-selector";
import { Alert, Button } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const HIDDEN_NEW_METHOD_IDS = [
  ALL_PAYMENT_METHOD_SELECTOR_ID.GIFT_CARD_CODE,
  ALL_PAYMENT_METHOD_SELECTOR_ID.ACCOUNT_BALANCE,
  ALL_PAYMENT_METHOD_SELECTOR_ID.TERMINAL,
  ALL_PAYMENT_METHOD_SELECTOR_ID.MANUAL,
];

const getInitialSelection = (
  paymentMethod: SavedPaymentMethod | undefined,
): PaymentMethodSelectorSelection | undefined =>
  paymentMethod
    ? {
        kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
        id: paymentMethod.id,
        paymentMethodType: paymentMethod.type,
        payment_backend_identifier: paymentMethod.payment_backend_identifier,
      }
    : undefined;

export type SavedPaymentMethodSelection = Extract<
  Exclude<PaymentMethodSelectorSelection, null>,
  { kind: typeof PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED }
>;

type Props = {
  currentPaymentMethod?: SavedPaymentMethod;
  isSaving: boolean;
  memberId: number;
  onCancel: () => void;
  onSave: (selection: SavedPaymentMethodSelection) => Promise<unknown>;
};

export const MembershipPlanPaymentMethodEditor: FC<Props> = ({
  currentPaymentMethod,
  isSaving,
  memberId,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation("membership-plan");
  const initialSelection = useMemo(
    () => getInitialSelection(currentPaymentMethod),
    // Intentionally only on mount — the editor is remounted each time editing
    // starts, so currentPaymentMethod is stable for its lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [selection, setSelection] = useState<PaymentMethodSelectorSelection>(
    initialSelection ?? null,
  );
  const [inlineError, setInlineError] = useState<string | null>(null);

  const savedSelection =
    selection?.kind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED
      ? selection
      : null;

  const handleSave = async () => {
    if (!savedSelection) return;

    setInlineError(null);

    try {
      await onSave(savedSelection);
      onCancel();
    } catch {
      setInlineError(t("panel.paymentMethod.toasts.error"));
    }
  };

  return (
    <div className="flex flex-col gap-sm">
      <PaymentMethodSelector
        fetch={fetch}
        memberId={memberId}
        {...(initialSelection ? { defaultValue: initialSelection } : {})}
        allMethodsConfig={{ hiddenIds: HIDDEN_NEW_METHOD_IDS }}
        onSelectionChange={(nextSelection) => {
          setInlineError(null);
          setSelection(nextSelection);
        }}
      />

      {inlineError && <Alert status="critical">{inlineError}</Alert>}

      <div className="flex justify-end gap-xs">
        <Button
          color="default"
          disabled={isSaving}
          intent="flat"
          label={t("panel.paymentMethod.cancel")}
          onClick={onCancel}
          size="md"
        />
        <Button
          color="main"
          disabled={!savedSelection || isSaving}
          intent="default"
          label={t("panel.paymentMethod.save")}
          loading={isSaving}
          onClick={() => void handleSave()}
          size="md"
        />
      </div>
    </div>
  );
};

MembershipPlanPaymentMethodEditor.displayName =
  "MembershipPlanPaymentMethodEditor";
