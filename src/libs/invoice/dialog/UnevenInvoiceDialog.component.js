// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import type { OptionCallback } from '../../../state/types.ts';

type Props = {
  open: boolean,
  onSubmit: (options: OptionCallback) => void,
  onClose: () => void,
  totalItem: ?number,
  totalPayment: ?number,
  isSubmitting: boolean,
  setIsSubmitting: (boolean) => void,
};

export function UnevenInvoiceDialog(props: Props) {
  const { t } = useTranslation();
  const { open, onSubmit, onClose } = props;
  let { totalItem, totalPayment } = props;
  const classes = useStyles();
  if (props.totalItem) totalItem = parseFloat(totalItem).toFixed(2);
  if (props.totalPayment) totalPayment = parseFloat(totalPayment).toFixed(2);
  return (
    <Dialog
      open={open || props.isSubmitting}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('form.invoice.titleUnevenInvoice')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('form.invoice.explainUnevenInvoice', {
            totalInvoiceItems: totalItem || 0,
            totalPayments: totalPayment || 0,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          disabled={props.isSubmitting}
        >
          {t('common.cancel')}
        </Button>
        {props.isSubmitting ? (
          <div className={classes.circularProgress}>
            <CircularProgress />
          </div>
        ) : (
          <Button
            onClick={() => {
              props.setIsSubmitting(true);
              onSubmit({
                onSuccess: () => props.setIsSubmitting(false),
                onError: () => props.setIsSubmitting(false),
              });
            }}
            color="primary"
            autoFocus
          >
            {t('common.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default compose(withState('isSubmitting', 'setIsSubmitting', false))(
  UnevenInvoiceDialog,
);
