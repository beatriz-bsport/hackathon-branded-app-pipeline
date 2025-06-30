// @flow
import React from 'react';
import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods.js';

import { MultipleCheckboxField } from '../../../components/forms';

type Props = {
  t: TFunction,
};
const PaymentMethodSelectorField = (props: Props) => {
  return (
    <MultipleCheckboxField
      {...props}
      choices={[
        { id: CB.id, optionLabel: props.t('paymentMethod.onlinePayments') },
        {
          id: CREDIT_ACCOUNT.id,
          optionLabel: props.t(`forms.paymentMethod.${CREDIT_ACCOUNT.id}`),
        },
      ]}
    />
  );
};

export default compose(withTranslation(['payment']))(
  PaymentMethodSelectorField,
);
