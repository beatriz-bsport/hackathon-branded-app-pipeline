// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withStateHandlers } from 'recompose';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

type Props = {
  open: boolean,
  loading: boolean,
  price: string,
  note: string,
  credits: number,
  consumerPaymentPack: ConsumerPaymentPack,
  handlePriceChange: (SyntheticEvent<HTMLElement>) => void,
  handleCreditChange: (SyntheticEvent<HTMLEvent>) => void,
  handleNoteChange: (SyntheticEvent<HTMLEvent>) => void,
  onSubmit: (
    consumerPackId: number,
    data: {
      credit_to_refund: number,
      refund_amount: string,
      note: string,
    },
  ) => void,
  onClose: () => void,
};

export const RefundConsumerPaymentPack = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('consumerPaymentPack.refund.title')}</DialogTitle>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          props.onSubmit(props.consumerPaymentPack.id, {
            credit_to_refund: props.credits,
            refund_amount: props.price,
            note: props.note,
          });
        }}
      >
        <DialogContent>
          <Typography>{t('consumerPaymentPack.refund.explain')}</Typography>
          <div className={classes.warningRow}>
            <WarningIcon className={classes.leftIcon} />
            <Typography variant="caption">
              {t('consumerPaymentPack.refund.warningFirst')}
            </Typography>
          </div>
          <div className={classes.warningRow}>
            <Typography>
              {t('consumerPaymentPack.refund.warningSecond')}
            </Typography>
          </div>
          <div className={classes.fieldContainer}>
            {!props.consumerPaymentPack.payment_pack.unlimited && (
              <TextField
                value={props.credits}
                className={classes.field}
                InputProps={{ inputProps: { step: 1, min: 1 } }}
                variant="outlined"
                label={t('consumerPaymentPack.refund.credits.label')}
                onChange={props.handleCreditChange}
                onBlur={() =>
                  props.handleCreditChange({
                    target: {
                      value: parseInt(props.credits, 10) || 0,
                    },
                  })
                }
                type="numeric"
              />
            )}
            <TextField
              label={t('consumerPaymentPack.refund.price.label')}
              value={props.price}
              variant="outlined"
              InputProps={{ inputProps: { step: 1, min: 0 } }}
              className={classes.field}
              onChange={props.handlePriceChange}
              onBlur={() =>
                props.handlePriceChange({
                  target: {
                    value: parseFloat(
                      String(props.price).replace(',', '.'),
                    ).toFixed(2),
                  },
                })
              }
            />
            <TextField
              required
              label={t('consumerPaymentPack.refund.note.label')}
              value={props.note}
              variant="outlined"
              className={classes.field}
              rows={3}
              onChange={props.handleNoteChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {props.loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Button onClick={props.onClose}>
                {t('consumerPaymentPack.refund.actions.cancel')}
              </Button>
              <Button color="primary" type="submit">
                {t('consumerPaymentPack.refund.actions.submit')}
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  warningRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

export default compose(
  withStateHandlers(
    ({ consumerPaymentPack }) => ({
      credits: Math.max(parseInt(consumerPaymentPack.available_credits, 10), 0),
      price: 0,
      note: '',
    }),
    {
      handleNoteChange: () => (ev) => ({
        note: ev.target.value,
      }),
      handleCreditChange: () => (ev) => ({
        credits: ev.target.value,
      }),
      handlePriceChange: () => (ev) => ({
        price: ev.target.value,
      }),
    },
  ),
)(RefundConsumerPaymentPack);
