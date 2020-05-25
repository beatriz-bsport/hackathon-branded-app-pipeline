// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { compose, withState, withProps } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';

import SubscriptionContractCard from '../../libs/subscription/components/SubscriptionContractCard.component';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';

import Config from '../../config';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  t: TFunction,
  contract: ?Contract,
  fullScreen: boolean,
  firstBillingTimestamp: ?number,
  setFirstBillingTimestmap: (?number) => void,
  onCancel: () => void,
  processing: boolean,
  onSubmit: (any) => void,
};

export const SubscriptionContractBooking = (props: Props) => (
  <Dialog fullScreen={props.fullScreen} open={!!props.contract}>
    {!props.firstBillingTimestamp ? (
      <div>
        <SubscriptionContractCard
          contract={props.contract}
          onPayRequest={props.setFirstBillingTimestmap}
        />
        <DialogActions>
          <Button onClick={props.onCancel}>{props.t('common.cancel')}</Button>
        </DialogActions>
      </div>
    ) : (
      <StripeProvider apiKey={STRIPE_KEY}>
        <Elements>
          <SubscriptionPayment
            processing={props.processing}
            onCancel={() => {
              props.setFirstBillingTimestmap(null);
              props.onCancel();
            }}
            onSubmit={props.onSubmit}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
          />
        </Elements>
      </StripeProvider>
    )}
  </Dialog>
);

export default compose(
  withTranslation(),
  withMobileDialog(),
  withState('firstBillingTimestamp', 'setFirstBillingTimestmap', null),
  withState('processing', 'setProcessing', false),
  withProps(
    ({
      contract,
      onSubmit,
      firstBillingTimestamp,
      setFirstBillingTimestmap,
      setProcessing,
    }) => ({
      onSubmit: async (token: string) => {
        setProcessing(true);
        try {
          const first_billing_timestamp = moment(firstBillingTimestamp).unix();
          await postContractSubscriptionAPI(contract.id, {
            stripe_source: token,
            first_billing_timestamp,
          });
          onSubmit();
          setFirstBillingTimestmap(null);
        } catch (err) {
          console.error(err);
        }
        setProcessing(false);
      },
    }),
  ),
)(SubscriptionContractBooking);
