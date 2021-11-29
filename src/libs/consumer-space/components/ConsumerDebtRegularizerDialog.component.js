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
import PaymentForm from '../../checkout/components/PaymentForm.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  t: TFunction,
  member: Member,
  classes: Object,
  submitPayment: (paymentData: any, options: OptionCallback) => void,
  member: ?Member,
  openByButton: boolean,
  fullScreen: boolean,
  open?: boolean,
  onClose: ?() => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  openDialog: () => void,
  closeDialog: () => void,
};

export class ConsumerDebtRegularizerDialog extends React.Component<Props> {
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
                this.props.member.credit_account_balance,
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
                <div>
                  <div className={this.props.classes.priceContainer}>
                    <Typography variant="h4">
                      {getCurrencyDisplayWithPrice(
                        -parseFloat(this.props.member.credit_account_balance),
                      )}
                    </Typography>
                  </div>
                  <Typography
                    color="textSecondary"
                    className={this.props.classes.contentExplain}
                  >
                    {this.props.t('debt.explainPayment')}
                  </Typography>
                  <PaymentForm
                    onCancel={() => {
                      if (this.props.onClose) this.props.onClose();
                      this.props.closeDialog();
                    }}
                    savedPaymentMethodList={this.props.savedPaymentMethodList}
                    availablePaymentMethods={[0, 13]}
                    submitPayment={(data, options) =>
                      this.props.submitPayment(data, {
                        onSuccess: (response) => {
                          if (options && options.onSuccess) {
                            options.onSuccess(response);
                          }
                          this.props.closeDialog();
                        },
                        onError: (err) => {
                          if (options && options.onError) options.onError(err);
                        },
                      })
                    }
                  />
                </div>
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
