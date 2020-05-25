// @flow
import React from 'react';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import { MultipleCheckboxField } from '../../../components/forms';

type Props = {
  t: TFunction,
};
const PaymentMethodSelectorField = (props: Props) => {
  return (
    <MultipleCheckboxField
      {...props}
      choices={[
        { id: CB.id, optionLabel: props.t(`paymentMethod.${CB.text}`) },
        {
          id: CREDIT_ACCOUNT.id,
          optionLabel: props.t(`paymentMethod.${CREDIT_ACCOUNT.text}`),
        },
      ]}
    />
  );
};

export default compose(withTranslation(['translation']))(
  PaymentMethodSelectorField,
);
