import React from 'react';

import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';

import InstalmentPaymentMultiplyIcon from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfigurationMultiplyIcon.component';
import { useBasketInstalmentPaymentOptionStyle } from '#libs/instalment-payment-configuration/hooks';

type Props = {
  checked: boolean;
  disabled: boolean;
  onSelect: () => void;
};

export const BasketInstalmentEmptyPlaceholder: React.FC<Props> = ({
  checked,
  onSelect,
  disabled,
}) => {
  const { t } = useTranslation(['instalmentPayment']);
  const classes = useBasketInstalmentPaymentOptionStyle({ checked });

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Radio
          onChange={onSelect}
          color="primary"
          disabled={disabled}
          checked={checked}
        />
        <Typography>{t('paymentAllInOnce')}</Typography>
        <InstalmentPaymentMultiplyIcon multiplyFactor={1} />
      </div>
    </div>
  );
};

export default BasketInstalmentEmptyPlaceholder;
