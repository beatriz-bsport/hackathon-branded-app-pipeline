// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  onClose: () => void,
  onSuccess: () => void,
  requestSetupIntentSecret: () => void,
  stripe: Stripe,
  elements: StripeElement,
  availablePaymentMethodTypeList: ?Array<string>,
  classes: Object,
};

export const CollectPaymentMethod = (props: Props) => {
  return (
    <Dialog open>
      <DialogTitle>{props.t('forms.paymentMethod.collect.title')}</DialogTitle>
      <CollectPaymentMethod {...props} />
    </Dialog>
  );
};

export default compose(withTranslation(['payment']))(CollectPaymentMethod);
