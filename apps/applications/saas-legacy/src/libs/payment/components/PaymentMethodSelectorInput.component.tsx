import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

type Props = {
  disabled?: boolean;
  helperText: string;
  label?: string;
  onChange: (available_payment_method_identifiers: number[]) => void;
  paymentMethodIds: number[];
};

type PaymentMethodItemProps = {
  id: number;
  isChecked?: boolean;
  isDisabled?: boolean;
  label: string;
  onChange: (id: number) => void;
};

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  id,
  isChecked,
  isDisabled,
  label,
  onChange,
}) => {
  const handleTogglePaymentMethod = useCallback(() => {
    onChange(id);
  }, [id, onChange]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleTogglePaymentMethod}
        />
      }
      label={label}
    />
  );
};

const PaymentMethodSelectorField: React.FC<Props> = ({
  disabled,
  helperText,
  label,
  onChange,
  paymentMethodIds,
}) => {
  const { t } = useTranslation(['payment', 'translation']);

  const handleTogglePaymentMethod = useCallback(
    (paymentMethodId: number) => {
      if (paymentMethodIds.includes(paymentMethodId)) {
        onChange(paymentMethodIds.filter((i) => i !== paymentMethodId));
      } else {
        onChange([...paymentMethodIds, paymentMethodId]);
      }
    },
    [onChange, paymentMethodIds],
  );

  return (
    <fieldset>
      {!!label && <legend style={{ marginBottom: -2 }}>{label}</legend>}
      <FormGroup>
        {[
          { id: CB.id, optionLabel: t(`payment:paymentMethod.onlinePayments`) },
          {
            id: CREDIT_ACCOUNT.id,
            optionLabel: t(
              'translation:form.shop.item.onsite_payment_available',
            ),
          },
        ].map((paymentMethod) => (
          <PaymentMethodItem
            key={paymentMethod.id}
            id={paymentMethod.id}
            isChecked={paymentMethodIds.includes(paymentMethod.id)}
            isDisabled={!!disabled}
            label={paymentMethod.optionLabel}
            onChange={handleTogglePaymentMethod}
          />
        ))}
      </FormGroup>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </fieldset>
  );
};

export default React.memo(PaymentMethodSelectorField);
