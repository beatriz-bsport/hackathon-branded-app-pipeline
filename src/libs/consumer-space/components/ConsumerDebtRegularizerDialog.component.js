// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PaymentForm from '../../checkout/components/PaymentForm.component';

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
  setOpenByButton: (boolean) => void,
};

export const ConsumerDebtRegularizerDialog = (props: Props) => {
  if (props.member && props.member.credit_account_balance < 0) {
    return (
      <Paper className={props.classes.container}>
        <Typography variant="h6" inline>
          {props.t('debt.title')}
        </Typography>
        <div className={props.classes.row}>
          <Typography variant="h6" inline color="error">
            {`${props.member.credit_account_balance} €`}
          </Typography>
          <Button
            color="primary"
            onClick={() => props.setOpenByButton(true)}
            variant="contained"
            className={props.classes.buttonContainer}
          >
            {props.t('debt.regularize')}
          </Button>
        </div>
        <Dialog
          fullScreen={props.fullScreen}
          open={props.open || props.openByButton}
        >
          <DialogTitle>{props.t('debt.titlePaymentDialog')}</DialogTitle>
          <DialogContent>
            {props.member ? (
              <div>
                <div className={props.classes.priceContainer}>
                  <Typography variant="h4">
                    {-props.member.credit_account_balance} €
                  </Typography>
                </div>
                <Typography
                  color="textSecondary"
                  className={props.classes.contentExplain}
                >
                  {props.t('debt.explainPayment')}
                </Typography>
                <PaymentForm
                  onCancel={() => {
                    if (props.onClose) props.onClose();
                    props.setOpenByButton(false);
                  }}
                  availablePaymentMethods={[0]}
                  submitPayment={(data, options) =>
                    props.submitPayment(data, {
                      onSuccess: (response) => {
                        if (options && options.onSuccess) {
                          options.onSuccess(response);
                        }
                        props.setOpenByButton(false);
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
};

const styles = (theme) => ({
  priceContainer: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit * 4,
    borderRadius: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 2,
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
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  buttonContainer: {
    marginLeft: theme.spacing.unit * 2,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentExplain: {
    margin: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },
});

export default compose(
  withStyles(styles),
  withMobileDialog(),
  withNamespaces(['consumerSpace']),
  withState('openByButton', 'setOpenByButton', false),
)(ConsumerDebtRegularizerDialog);
