import React from 'react';

import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';

import InstalmentPaymentMultiplyIcon from '#src/libs/instalment-payment-configuration/components/InstalmentPaymentConfigurationMultiplyIcon.component';
import { useBasketInstalmentPaymentOptionStyle } from '#src/libs/instalment-payment-configuration/hooks';
import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';

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
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useBasketInstalmentPaymentOptionStyle({
    checked,
    isNewCheckoutFlow,
  });

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Radio
          checked={checked}
          color="primary"
          disabled={disabled}
          onChange={onSelect}
        />
        <Typography>{t('paymentAllInOnce')}</Typography>
        <InstalmentPaymentMultiplyIcon multiplyFactor={1} />
      </div>
    </div>
  );
};

export default BasketInstalmentEmptyPlaceholder;
