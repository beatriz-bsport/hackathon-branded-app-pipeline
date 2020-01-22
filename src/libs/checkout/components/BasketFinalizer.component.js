// @flow
import React from 'react';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PaymentForm from './PaymentForm.component';
import type { Basket } from '../types';

import BasketDeliveryForm from './BasketDeliveryForm.component';
import CouponCodeForm from '../../coupon/components/CouponCodeForm.component';

export const ADDRESS_STEP = {
  id: 0,
  label: 'address',
};
export const PAYMENT_STEP = {
  id: 1,
  label: 'payment',
};

type Props = {
  basket: Basket,
  processing: boolean,
  backToCalendar: () => void,
  onBasketFinalized: () => void,
  patchBasket: (data: any) => void,
  submitPayment: (data: *) => void,
  attachCoupon: (basketId: string, code: string) => void,
  termsAndConditions: string,

  t: TFunction,
  classes: Object,
};

type State = {
  currentStep: number,
};

export class BasketFinalizer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.basket.need_address) {
      this.state = {
        steps: [ADDRESS_STEP, PAYMENT_STEP],
        currentStep: ADDRESS_STEP.id,
      };
    } else {
      this.state = { steps: [PAYMENT_STEP], currentStep: PAYMENT_STEP.id };
    }
  }

  renderStep = () => {
    switch (this.state.currentStep) {
      case ADDRESS_STEP.id:
        return (
          <div>
            <BasketDeliveryForm
              basket={this.props.basket}
              loading={this.props.processing}
              onCancel={this.props.backToCalendar}
              onSubmit={(data) =>
                this.props.patchBasket(data, {
                  onSuccess: () => {
                    this.setState({ currentStep: PAYMENT_STEP.id });
                  },
                })
              }
            />
          </div>
        );
      case PAYMENT_STEP.id:
      default:
        return (
          <PaymentForm
            price_cts={this.props.basket.total_price_cts}
            availablePaymentMethods={
              this.props.basket.available_payment_methods
            }
            loading={this.props.loading}
            processing={this.props.processing}
            onSuccess={this.props.onBasketFinalized}
            submitPayment={this.props.submitPayment}
            termsAndConditions={this.props.termsAndConditions}
            onCancel={() => {
              if (this.props.basket.need_address) {
                this.setState({ currentStep: ADDRESS_STEP.id });
              } else {
                this.props.backToCalendar();
              }
            }}
          />
        );
    }
  };

  render() {
    if (
      !this.props.basket.checkout_items ||
      this.props.basket.checkout_items.length === 0
    ) {
      return null;
    }
    return (
      <div>
        <div className={this.props.classes.couponCodeContainer}>
          <CouponCodeForm onSubmit={this.props.attachCoupon} />
        </div>
        {this.state.steps.length > 1 ? (
          <Stepper activeStep={this.state.currentStep} alternativeLabel>
            {this.state.steps.map((step) => (
              <Step key={step.id}>
                <StepLabel>
                  {this.props.t(`myBasket.finalize.steps.${step.label}`)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : null}
        {this.renderStep()}
      </div>
    );
  }
}

const styles = (theme) => ({
  couponCodeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['checkout']),
)(BasketFinalizer);
