// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
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
import type { TFunction } from 'react-i18next';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
} from '@bsport/common/lib/master-data/payment-group';
import PaymentStripe from './payment-backend-stripe/PaymentStripe.component';
import PaymentBsportInternal from './payment-backend-internal/PaymentBsportInternal.component';

import { getPaymentGroupStatus as getPaymentGroupStatusAPI } from '../api';

type Props = {
  clientSecret: string,
  requestClientSecret: (number) => void,
  classes: Object,
  t: TFunction,
  onError: () => void,
  onCancel: () => void,
  memberId: number,
  onSuccess: () => void,
  amountToPay: number,
  onlyInternal: ?boolean,
  asConsumer: ?boolean,
  paymentGroupId: number,
  fullScreen: boolean,
  paymentGroupPriceCts: number,
  termsAndConditionsAccepted: boolean,
  clientSecretError: ?boolean,
  clientSecretLoading: boolean,
  availablePaymentMethodList: ?Array<number>,
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
};

type State = {
  paymentEngine: number,
  nextPaymentIntentStatusCheckSeconds: number,
};

export class PaymentDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let paymentEngine = PAYMENT_ENGINE_STRIPE;
    if (this.props.onlyInternal) {
      paymentEngine = PAYMENT_ENGINE_BSPORT;
    } else {
      paymentEngine = PAYMENT_ENGINE_STRIPE;
    }
    this.state = {
      paymentEngine,
      nextPaymentIntentStatusCheckSeconds: 1,
    };
  }

  componentDidMount() {
    this.props.requestClientSecret(this.state.paymentEngine);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.paymentEngine !== this.state.paymentEngine) {
      this.props.requestClientSecret(this.state.paymentEngine);
    }
  }

  onSuccess = () => {
    getPaymentGroupStatusAPI(this.props.paymentGroupId)
      .then((r) => {
        if (r.data >= 200) {
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

  render() {
    const { classes, t } = this.props;

    let defaultEngine = PAYMENT_ENGINE_STRIPE;

    if (this.props.onlyInternal) {
      defaultEngine = PAYMENT_ENGINE_BSPORT;
    }
    if (this.props.asConsumer) {
      defaultEngine = PAYMENT_ENGINE_STRIPE;
    }
    const availableEngineList = [
      PAYMENT_ENGINE_STRIPE,
      PAYMENT_ENGINE_BSPORT,
    ].filter((e) => {
      if (this.props.asConsumer) {
        return e === PAYMENT_ENGINE_STRIPE;
      }
      if (this.props.onlyInternal) {
        return e === PAYMENT_ENGINE_BSPORT;
      }
      return true;
    });

    const dialogOffset = this.props.fullScreen ? '0%' : '50%';
    return (
      <Modal open classes={{ paper: classes.container }}>
        <>
          <div
            style={{
              transform: `translate(-${dialogOffset}, -${dialogOffset})`,
              top: dialogOffset,
              left: dialogOffset,
            }}
            className={classes.modal}
          >
            <div className={classes.innerDialog}>
              <div className={classes.container}>
                <FormControl
                  disabled={
                    !this.props.clientSecret || !!this.props.clientSecretLoading
                  }
                  component="fieldset"
                >
                  {availableEngineList.length > 1 && (
                    <RadioGroup
                      row
                      aria-label="position"
                      name="position"
                      defaultValue={`${defaultEngine}`}
                      disabled={!!this.props.clientSecretLoading}
                      onChange={(ev, value) =>
                        this.setState({ paymentEngine: value })
                      }
                      className={classes.radioGroupContainer}
                    >
                      {[PAYMENT_ENGINE_STRIPE, PAYMENT_ENGINE_BSPORT].map(
                        (engineIdentifier) => (
                          <FormControlLabel
                            value={`${engineIdentifier}`}
                            control={<Radio color="primary" />}
                            label={t(`paymentEngine.label.${engineIdentifier}`)}
                            disabled={
                              !availableEngineList.includes(engineIdentifier) ||
                              !!this.props.clientSecretLoading
                            }
                            labelPlacement="bottom"
                          />
                        ),
                      )}
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
                          variant="caption"
                          style={{ color: 'white' }}
                        >
                          {t('paymentPanel.errorSecretExplain1')}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{ color: 'white' }}
                        >
                          {t('paymentPanel.errorSecretExplain2')}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {parseInt(this.state.paymentEngine, 10) ===
                    PAYMENT_ENGINE_STRIPE && (
                    <PaymentStripe
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
                      clientSecret={this.props.clientSecret}
                      paymentGroupPriceCts={this.props.paymentGroupPriceCts}
                      onSuccess={this.onSuccess}
                      updatePriceCts={this.props.updatePriceCts}
                      termsAndConditionsAccepted={
                        this.props.termsAndConditionsAccepted
                      }
                      onError={this.props.onError}
                      onCancel={this.props.onCancel}
                      memberId={this.props.memberId}
                      detachPaymentMethodLoading={
                        this.props.detachPaymentMethodLoading
                      }
                      detachPaymentMethod={this.props.detachPaymentMethod}
                      snackbarErrorMsg={this.props.snackbarErrorMsg}
                      snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                    />
                  )}
                  {parseInt(this.state.paymentEngine, 10) ===
                    PAYMENT_ENGINE_BSPORT && (
                    <PaymentBsportInternal
                      paymentMethodChoices={
                        PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT]
                      }
                      clientSecret={this.props.clientSecret}
                      onSuccess={this.onSuccess}
                      onError={this.props.onError}
                      termsAndConditionsAccepted={
                        this.props.termsAndConditionsAccepted
                      }
                      onCancel={this.props.onCancel}
                      amountToPay={this.props.amountToPay}
                      memberId={this.props.memberId}
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
  container: { maxWidth: '100vw' },
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
