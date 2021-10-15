// @flow
import React from 'react';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Typography from '@material-ui/core/Typography';
import StepLabel from '@material-ui/core/StepLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { compose, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import UpdateIcon from '@material-ui/icons/Update';
import type { TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';

import { CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT } from '@bsport/common/lib/master-data/payment-methods';
import type { Basket } from '../types';

import BasketDeliveryForm from './BasketDeliveryForm.component';
import CouponCodeForm from '../../coupon/components/CouponCodeForm.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import AcceptTermsAndConditions from '../../payment/components/AcceptTermsAndConditions.component';

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
  loading: boolean,
  processing: boolean,
  backToCalendar: () => void,
  patchBasket: (data: any) => void,
  attachCoupon: (basketId: string, code: string) => void,
  paymentModule: any,
  processing: boolean,
  validateUnpaid: (options: OptionsCallback) => void,

  selfProcessing: boolean,
  setProcessing: (boolean) => void,

  t: TFunction,
  classes: Object,

  termsAndConditionsAccepted: boolean,
  setTermsAndConditionsAccepted: (boolean) => void,
  termsAndConditions: string,
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
      default: {
        if (
          !(
            (this.props.basket.total_price_cts || 0) -
            (this.props.basket.total_price_prepaid_lines_cts || 0)
          )
        ) {
          return (
            <Button
              disabled={this.props.selfProcessing}
              onClick={() => {
                this.props.setProcessing(true);
                this.props.validateUnpaid({
                  onSuccess: () => this.props.setProcessing(false),
                  onError: () => this.props.setProcessing(false),
                });
              }}
              variant="contained"
              color="primary"
            >
              {this.props.t('myBasket.actions.payZero')}
              {this.props.selfProcessing && (
                <CircularProgress
                  className={this.props.classes.circularProgress}
                  size={24}
                  color="inherit"
                />
              )}
            </Button>
          );
        }

        return (
          <React.Fragment>
            {this.props.paymentModule}
            {this.props.basket.available_payment_methods.includes(
              PAYMENT_METHOD_CREDIT_ACCOUNT.id,
            ) && (
              <div>
                <div className={this.props.classes.separatorContainer}>
                  <div className={this.props.classes.separatorLine} />
                  <Typography color="textSecondary">
                    {this.props.t('or')}
                  </Typography>
                  <div className={this.props.classes.separatorLine} />
                </div>
                <div className={this.props.classes.payLaterText}>
                  <Typography color="textSecondary">
                    {this.props.t('payLater.explain')}
                  </Typography>
                </div>
                {!!this.props.termsAndConditions && (
                  <AcceptTermsAndConditions
                    accepted={this.props.termsAndConditionsAccepted}
                    onChecked={this.props.setTermsAndConditionsAccepted}
                    termsAndConditions={this.props.termsAndConditions}
                    type="theTermsAndConditions"
                  />
                )}
                <Button
                  disabled={
                    this.props.selfProcessing ||
                    !this.props.termsAndConditionsAccepted
                  }
                  onClick={() => {
                    this.props.setProcessing(true);
                    this.props.validateUnpaid({
                      onSuccess: () => this.props.setProcessing(false),
                      onError: () => this.props.setProcessing(false),
                    });
                  }}
                  variant="outlined"
                  color="primary"
                >
                  <UpdateIcon className={this.props.classes.iconLeft} />
                  {this.props.t('payLater.submit')}
                  {this.props.selfProcessing && (
                    <CircularProgress
                      className={this.props.classes.circularProgress}
                      size={24}
                      color="inherit"
                    />
                  )}
                </Button>
              </div>
            )}
          </React.Fragment>
        );
      }
      /*
          <PaymentForm
            price_cts={this.props.basket.total_price_cts}
            availablePaymentMethods={
              this.props.basket.available_payment_methods
            }
            loading={this.props.loading || this.props.processing || this.props.selfProcessing}
            processing={this.props.processing}
            onSuccess={this.props.onBasketFinalized}
            submitPayment={this.props.submitPayment}
            termsAndConditions={this.props.termsAndConditions}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            onCancel={() => {
              if (this.props.basket.need_address) {
                this.setState({ currentStep: ADDRESS_STEP.id });
              } else {
                this.props.backToCalendar();
              }
            }}
          />
	);
	*/
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
        <div className={this.props.classes.totalPrice}>
          <Typography component="p" variant="h4">
            {`${getCurrencyDisplayWithPrice(
              parseFloat(this.props.basket.total_price) -
                parseFloat(this.props.basket.total_price_prepaid_lines),
            )}`}
          </Typography>
        </div>
        <div className={this.props.classes.couponCodeContainer}>
          <CouponCodeForm
            loading={
              this.props.loading ||
              this.props.processing ||
              this.props.selfProcessing
            }
            onSubmit={this.props.attachCoupon}
          />
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
    marginBottom: theme.spacing(2),
  },
  totalPrice: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    backgroundColor: '#eee',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorLine: {
    height: 1,
    width: '100%',
    margin: theme.spacing(2),
    backgroundColor: '#DEDEDE',
  },
  payLaterText: {
    backgroundColor: '#F8F8F8',
    border: '1px solid #DEDEDE',
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: 650,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  circularProgress: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
  withState('selfProcessing', 'setProcessing', false),
)(BasketFinalizer);
