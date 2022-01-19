// @flow
import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_INTENT_STATUS_SUCCESS,
  PAYMENT_INTENT_TYPE_DEBT,
} from '@bsport/common/lib/master-data/payment-group';
import * as Sentry from '@sentry/react';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import PaymentDialog from '../../payment/components/PaymentDialog.component';
import { requestClientSecret as requestClientSecretAPI } from '../../invoice/api';
import {
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  setBillingEstablishmentOnCompletedPaymentGroupStatus as setBillingEstablishmentOnCompletedPaymentGroupStatusAPI,
} from '../../payment/api';

const PAYMENT_GROUP_STATUS_INTENT_MAX_RETRY = 100;

type Props = {
  t: TFunction,
  member: Member,
  classes: Object,
  openByButton: boolean,
  fullScreen: boolean,
  open?: boolean,
  openDialog: () => void,
  closeDialog: () => void,
  snackbarErrorMsg: () => void,
  snackbarSuccessMsg: () => void,
  availablePaymentMethodList: Array<number>,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string, options: any) => void,
  fetchMembership: () => void,
};

type State = {
  clientSecret: string | null,
  clientSecretError: boolean,
  clientSecretLoading: boolean,
  paymentGroupId: number | null,
  retryPaymentGroupStatus: number,
  billingEstablishmentId: number | null,
  paymentGroupCompletedCheckSeconds: number,
};

export class ConsumerDebtRegularizerDialog extends React.Component<
  Props,
  State,
> {
  state = {
    clientSecret: null,
    clientSecretError: false,
    clientSecretLoading: false,
    paymentGroupId: null,
    retryPaymentGroupStatus: 0,
    billingEstablishmentId: null,
    paymentGroupCompletedCheckSeconds: 0.5,
  };

  setClientSecret = (clientSecret: string | null) =>
    this.setState({ clientSecret });

  setClientSecretError = (clientSecretError: boolean) =>
    this.setState({ clientSecretError });

  setClientSecretLoading = (clientSecretLoading: boolean) =>
    this.setState({ clientSecretLoading });

  setPaymentGroupId = (paymentGroupId: number | null) =>
    this.setState({ paymentGroupId });

  setRetryPaymentGroupStatus = (retryPaymentGroupStatus: number) =>
    this.setState({ retryPaymentGroupStatus });

  setBillingEstablishmentId = (billingEstablishmentId: number | null) =>
    this.setState({ billingEstablishmentId });

  requestClientSecret = (paymentEngine) => {
    this.setClientSecret(null);
    this.setClientSecretLoading(true);
    this.setClientSecretError(false);
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_DEBT, {
      invoice: null,
      member: this.props.member.id,
      requested_price_cts:
        -parseFloat(this.props.member.credit_account_balance).toFixed(2) * 100,
    })
      .then((r) => {
        this.setClientSecretLoading(false);
        this.setClientSecret(r.data.client_secret);
        this.setPaymentGroupId(r.data.payment_group);
        this.setClientSecretError(false);
      })
      .catch((err) => {
        console.error(err);
        this.setClientSecretLoading(false);
        this.setClientSecretError(true);
        Sentry.captureException(err);
      });
  };

  listenPaymentGroupCompleted = (callback) => {
    getPaymentGroupStatusAPI(this.state.paymentGroupId)
      .then((r) => {
        if (
          this.state.retryPaymentGroupStatus >
          PAYMENT_GROUP_STATUS_INTENT_MAX_RETRY
        ) {
          return;
        }
        if (r.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
          setTimeout(() => {
            setBillingEstablishmentOnCompletedPaymentGroupStatusAPI(
              this.state.paymentGroupId,
              this.state.billingEstablishmentId,
            );
            if (callback) callback();
          }, 2000);
        } else {
          this.setRetryPaymentGroupStatus(
            this.state.retryPaymentGroupStatus + 1,
          );
          setTimeout(
            this.listenPaymentGroupCompleted,
            this.state.paymentGroupCompletedCheckSeconds * 2000,
          );
        }
      })
      .catch(console.error);
  };

  render() {
    if (
      this.props.member &&
      parseFloat(this.props.member.credit_account_balance) < 0
    ) {
      return (
        <Paper className={this.props.classes.container}>
          <Typography variant="h6" inline>
            {this.props.t('debt.title')}
          </Typography>
          <div className={this.props.classes.row}>
            <Typography variant="h6" inline color="error">
              {getCurrencyDisplayWithPrice(
                parseFloat(this.props.member.credit_account_balance).toFixed(2),
              )}
            </Typography>
            <Button
              color="primary"
              onClick={() => this.props.openDialog()}
              variant="contained"
              className={this.props.classes.buttonContainer}
            >
              {this.props.t('debt.regularize')}
            </Button>
          </div>
          <Dialog
            fullScreen={this.props.fullScreen}
            open={this.props.open || this.props.openByButton}
          >
            <DialogTitle>{this.props.t('debt.titlePaymentDialog')}</DialogTitle>
            <DialogContent>
              {this.props.member ? (
                <PaymentDialog
                  memberId={this.props.member.id}
                  onError={() => {}}
                  paymentGroupPriceCts={
                    -parseFloat(
                      this.props.member.credit_account_balance,
                    ).toFixed(2) * 100
                  }
                  onSuccess={(callback) => {
                    this.listenPaymentGroupCompleted();
                    this.props.fetchMembership();
                    if (typeof callback === 'function') callback();
                    this.props.closeDialog();
                  }}
                  requestClientSecret={this.requestClientSecret}
                  termsAndConditionsAccepted
                  clientSecret={
                    this.state.clientSecretLoading
                      ? null
                      : this.state.clientSecret
                  }
                  clientSecretLoading={this.state.clientSecretLoading}
                  paymentGroupId={this.state.paymentGroupId}
                  onlyInternal={
                    -parseFloat(
                      this.props.member.credit_account_balance,
                    ).toFixed(2) *
                      100 <
                    0
                  }
                  asConsumer
                  clientSecretError={this.state.clientSecretError}
                  amountToPay={
                    -parseFloat(
                      this.props.member.credit_account_balance,
                    ).toFixed(2) * 100
                  }
                  onCancel={() => {
                    this.props.closeDialog();
                  }}
                  availablePaymentMethodList={
                    this.props.availablePaymentMethodList?.length
                      ? this.props.availablePaymentMethodList
                      : [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]
                  }
                  detachPaymentMethod={this.props.detachPaymentMethod}
                  detachPaymentMethodLoading={
                    this.props.detachPaymentMethodLoading
                  }
                  snackbarErrorMsg={this.props.snackbarErrorMsg}
                  snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                  defaultUserName={this.props.member?.name || ''}
                  defaultUserEmail={this.props.member?.email || ''}
                />
              ) : (
                <CircularProgress />
              )}
            </DialogContent>
          </Dialog>
        </Paper>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  priceContainer: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(4),
    margin: theme.spacing(2),
    minWidth: 280,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    border: '1px solid red',
  },
  buttonContainer: {
    marginLeft: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentExplain: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withMobileDialog(),
  withTranslation(['consumerSpace']),
  withStateHandlers(
    { openByButton: false },
    {
      openDialog:
        (_, { refreshPaymentMethodList }) =>
        () => {
          if (refreshPaymentMethodList) {
            refreshPaymentMethodList();
          }
          return { openByButton: true };
        },
      closeDialog: () => () => ({ openByButton: false }),
    },
  ),
)(ConsumerDebtRegularizerDialog);
