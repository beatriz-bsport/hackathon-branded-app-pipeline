// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation, TFunction } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group.js';
import PaymentStripeTerminal from '#src/libs/terminal/components/PaymentStripeTerminal.component';
import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#src/libs/payment/utils';
import type { StripeReader } from '#src/libs/terminal/types';
import { FeatureList } from '#src/libs/company/types';
import { UPSELL_IDENTIFIER_STRIPE_TERMINAL } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import PaymentBsportInternal from './payment-backend-internal/PaymentBsportInternal.component';
import { Establishment } from '../../establishment/types';
import { getPaymentGroupStatus as getPaymentGroupStatusAPI } from '../api';

import { InternalPaymentPayload } from '../types';
import type {
  OptionCallback,
  OptionBackgroundCallback,
} from '../../../state/types';
import OnlinePayment from './OnlinePayment.component';

type Props = {
  clientSecret: string,
  requestClientSecret: (paymentEngine: number, params?: any) => void,
  classes: Object,
  t: TFunction,
  onError: () => void,
  onCancel: () => void,
  memberId: number,
  onSuccess: (callback?: () => void) => void,
  amountToPay: string,
  onlyInternal?: boolean,
  asConsumer?: boolean,
  paymentGroupId: number,
  paymentGroupPriceCts: number,
  termsAndConditionsAccepted: boolean,
  clientSecretError?: boolean,
  clientSecretLoading: boolean,
  availablePaymentMethodList?: Array<number>,
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
  defaultUserName?: string,
  defaultUserEmail?: string,
  establishments: Array<Establishment>,
  applyBalanceToInvoice?: (options: OptionCallback) => void,
  allowConsumerToUseInternalAccount?: boolean,
  creditAccountBalance?: number | null,
  applyBalanceLoading?: boolean,
  stripeReaders: StripeReader[],
  stripePaymentElementConfig: StripePaymentElementConfig,
  cardBillingDetailsMandatory: boolean,
  companyId: number,
  invoiceUuid?: string,
  onBackgroundTaskSuccess?: (invoiceUuid: string) => void,
  submitInternalPaymentInBackground: (
    paymentGroupId: number,
    invoiceUuid: string,
    data: InternalPaymentPayload,
    options?: OptionBackgroundCallback<
      { paymentGroupId: number, invoiceUuid: string },
      { paymentGroupId: number, invoiceUuid: string },
    >,
  ) => void,
  bsportPaymentMethodsToDisable?: number[],
};

type State = {
  paymentEngine: number,
  nextPaymentIntentStatusCheckSeconds: number,
  processingPayment: boolean,
};

export class PaymentDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const paymentEngine = this.getAvailableEngineList().includes(
      PAYMENT_ENGINE_STRIPE,
    )
      ? PAYMENT_ENGINE_STRIPE
      : PAYMENT_ENGINE_BSPORT;

    this.state = {
      paymentEngine,
      nextPaymentIntentStatusCheckSeconds: 1,
      processingPayment: false,
    };
  }

  componentDidMount() {
    this.props.requestClientSecret(this.state.paymentEngine);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.paymentEngine !== this.state.paymentEngine) {
      if (
        [PAYMENT_ENGINE_BSPORT, PAYMENT_ENGINE_STRIPE].includes(
          parseInt(this.state.paymentEngine.toString()),
        )
      ) {
        this.props.requestClientSecret(this.state.paymentEngine);
      } else if (
        this.state.paymentEngine === PAYMENT_STRIPE_TERMINAL_FAKE.toString()
      ) {
        this.props.requestClientSecret(PAYMENT_ENGINE_STRIPE, {
          is_physical_payment_intent: true,
        });
      }
    }
  }

  onSuccess = () => {
    getPaymentGroupStatusAPI(this.props.paymentGroupId)
      .then((r) => {
        if (r.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
          setTimeout(() => this.props.onSuccess(), 2000);
        } else {
          setTimeout(
            this.onSuccess,
            this.state.nextPaymentIntentStatusCheckSeconds * 1000,
          );
          this.setState((prevState: State) => ({
            nextPaymentIntentStatusCheckSeconds:
              prevState.nextPaymentIntentStatusCheckSeconds * 2,
          }));
        }
      })
      .catch(console.error);
  };

  getAvailableEngineList = () => {
    return [PAYMENT_ENGINE_STRIPE, PAYMENT_ENGINE_BSPORT].filter((e) => {
      if (this.props.asConsumer) {
        return e === PAYMENT_ENGINE_STRIPE;
      }
      if (this.props.onlyInternal) {
        return e === PAYMENT_ENGINE_BSPORT;
      }
      return true;
    });
  };

  /**
   * Filters the bsport payment methods to disable based on the props
   * This function is only useful for adjusting the member balance method since
   * we want to remove the ability for the member to adjust his balance based on his
   * own balance.
   *
   * @returns {number[]} The filtered bsport payment methods
   */
  getFilteredBsportPaymentMethodChoices = () => {
    return PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT].filter(
      (paymentMethod) =>
        !this.props.bsportPaymentMethodsToDisable?.includes(paymentMethod),
    );
  };

  render() {
    const { classes, t, stripeReaders } = this.props;

    const availableEngineList = this.getAvailableEngineList();
    const dialogOffset = '50%';

    return (
      <Modal open classes={{ paper: classes.container }}>
        <>
          <div
            className={classes.modal}
            style={{
              transform: `translate(-${dialogOffset}, -${dialogOffset})`,
              top: dialogOffset,
              left: dialogOffset,
            }}
          >
            <div className={classes.innerDialog}>
              <div className={classes.container}>
                <FormControl
                  component="fieldset"
                  disabled={
                    !this.props.clientSecret ||
                    !!this.props.clientSecretLoading ||
                    this.state.processingPayment
                  }
                  style={{ width: '100%' }}
                >
                  {availableEngineList.length > 1 && (
                    <RadioGroup
                      row
                      aria-label="position"
                      className={classes.radioGroupContainer}
                      defaultValue={`${availableEngineList[0]}`}
                      disabled={
                        !!this.props.clientSecretLoading ||
                        this.state.processingPayment
                      }
                      name="position"
                      onChange={(ev, value) =>
                        this.setState({ paymentEngine: value })
                      }
                    >
                      {[PAYMENT_ENGINE_STRIPE, PAYMENT_ENGINE_BSPORT].map(
                        (engineIdentifier) => (
                          <FormControlLabel
                            control={<Radio color="primary" />}
                            disabled={
                              !availableEngineList.includes(engineIdentifier) ||
                              !!this.props.clientSecretLoading ||
                              this.state.processingPayment
                            }
                            label={t(`paymentEngine.label.${engineIdentifier}`)}
                            labelPlacement="bottom"
                            value={`${engineIdentifier}`}
                          />
                        ),
                      )}
                      <FeatureListProvider>
                        {(featureList: FeatureList) => (
                          <FormControlLabel
                            control={<Radio color="primary" />}
                            disabled={
                              !!this.props.clientSecretLoading ||
                              !stripeReaders ||
                              stripeReaders.length === 0 ||
                              this.state.processingPayment ||
                              !hasUpsell(
                                featureList,
                                UPSELL_IDENTIFIER_STRIPE_TERMINAL,
                              )
                            }
                            label={t(
                              'configuration.stripeTerminal.paymentDialog.radio',
                            )}
                            labelPlacement="bottom"
                            value={`${PAYMENT_STRIPE_TERMINAL_FAKE}`}
                          />
                        )}
                      </FeatureListProvider>
                    </RadioGroup>
                  )}
                  {this.props.clientSecret &&
                  !this.props.clientSecretLoading ? (
                    <Divider className={classes.divider} />
                  ) : (
                    <LinearProgress className={classes.divider} />
                  )}
                  {!!this.props.clientSecretError && (
                    <div className={classes.errorContainer}>
                      <WarningIcon className={classes.leftIcon} />
                      <div className={classes.multilineTextContainer}>
                        <Typography
                          style={{ color: 'white' }}
                          variant="caption"
                        >
                          {t('paymentPanel.errorSecretExplain1')}
                        </Typography>
                        <Typography
                          style={{ color: 'white' }}
                          variant="caption"
                        >
                          {t('paymentPanel.errorSecretExplain2')}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {parseInt(this.state.paymentEngine, 10) ===
                    PAYMENT_ENGINE_STRIPE && (
                    <OnlinePayment
                      allowConsumerToUseInternalAccount={
                        this.props.allowConsumerToUseInternalAccount
                      }
                      applyBalanceLoading={
                        this.props.applyBalanceLoading ||
                        this.props.clientSecretLoading ||
                        !this.props.clientSecret
                      }
                      applyBalanceToInvoice={() =>
                        this.props.applyBalanceToInvoice({
                          onSuccess: () =>
                            this.props.requestClientSecret(
                              this.state.paymentEngine,
                            ),
                        })
                      }
                      cardBillingDetailsMandatory={
                        this.props.cardBillingDetailsMandatory
                      }
                      clientSecret={this.props.clientSecret}
                      clientSecretLoading={this.props.clientSecretLoading}
                      companyId={this.props.companyId}
                      creditAccountBalance={this.props.creditAccountBalance}
                      detachPaymentMethod={this.props.detachPaymentMethod}
                      detachPaymentMethodLoading={
                        this.props.detachPaymentMethodLoading
                      }
                      establishments={this.props.establishments}
                      memberId={this.props.memberId}
                      onCancel={this.props.onCancel}
                      onError={this.props.onError}
                      onSuccess={this.onSuccess}
                      paymentGroupId={this.props.paymentGroupId}
                      paymentGroupPriceCts={this.props.paymentGroupPriceCts}
                      paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
                        PAYMENT_ENGINE_STRIPE
                      ].filter((pm) => {
                        if (this.props.availablePaymentMethodList) {
                          return this.props.availablePaymentMethodList.length
                            ? this.props.availablePaymentMethodList.includes(pm)
                            : pm === PAYMENT_GROUP_METHOD_IDENTIFIER_CB;
                        }
                        return true;
                      })}
                      sepaDefaultEmail={this.props.defaultUserEmail}
                      sepaDefaultName={this.props.defaultUserName}
                      snackbarErrorMsg={this.props.snackbarErrorMsg}
                      snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                      stripePaymentElementConfig={
                        this.props.stripePaymentElementConfig
                      }
                      termsAndConditionsAccepted={
                        this.props.termsAndConditionsAccepted
                      }
                      updatePriceCts={this.props.updatePriceCts}
                    />
                  )}
                  {parseInt(this.state.paymentEngine, 10) ===
                    PAYMENT_STRIPE_TERMINAL_FAKE && (
                    <PaymentStripeTerminal
                      clientSecret={this.props.clientSecret}
                      memberId={this.props.memberId}
                      onCancel={this.props.onCancel}
                      onSuccess={this.onSuccess}
                      paymentGroupId={this.props.paymentGroupId}
                      paymentGroupPriceCts={this.props.paymentGroupPriceCts}
                      setProcessing={(value: boolean) =>
                        this.setState({ processingPayment: value })
                      }
                      stripeReaders={this.props.stripeReaders}
                      updatePriceCts={this.props.updatePriceCts}
                    />
                  )}
                  {parseInt(this.state.paymentEngine, 10) ===
                    PAYMENT_ENGINE_BSPORT && (
                    <PaymentBsportInternal
                      amountToPay={this.props.amountToPay}
                      clientSecret={this.props.clientSecret}
                      establishment={this.props.establishments}
                      invoiceUuid={this.props.invoiceUuid}
                      memberId={this.props.memberId}
                      onBackgroundTaskSuccess={
                        this.props.onBackgroundTaskSuccess
                      }
                      onCancel={this.props.onCancel}
                      onError={this.props.onError}
                      onSuccess={this.onSuccess}
                      paymentGroupId={this.props.paymentGroupId}
                      paymentMethodChoices={this.getFilteredBsportPaymentMethodChoices()}
                      submitInternalPaymentInBackground={
                        this.props.submitInternalPaymentInBackground
                      }
                      termsAndConditionsAccepted={
                        this.props.termsAndConditionsAccepted
                      }
                    />
                  )}
                </FormControl>
              </div>
            </div>
          </div>
        </>
      </Modal>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxWidth: '100vw',
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 600,
    },
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  radioGroupContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  innerDialog: {
    padding: theme.spacing(2),
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.palette.error.light,
    border: `1px solid ${theme.palette.error.dark}`,
    borderRadius: 4,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(2),
  },
  multilineTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    overflow: 'auto',
    maxHeight: '100vh',
  },
});

export default compose(
  withTranslation(['invoice']),
  withStyles(styles),
  withMobileDialog(),
)(PaymentDialog);
