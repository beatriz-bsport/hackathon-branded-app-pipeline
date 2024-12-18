import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { OptionCallback } from '../../../state/types';

type Props = {
  open: boolean;
  onSubmit: (options: OptionCallback) => void;
  onClose: () => void;
  totalItem?: string;
  totalPayment?: string;
};

const UnevenInvoiceDialog = (props: Props) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open, onSubmit, onClose, totalItem, totalPayment } = props;
  const classes = useStyles();

  // creation of the variable formattedTotalItem to avoid directly changing the prop totalItem
  const formattedTotalItem = props.totalItem
    ? parseFloat(totalItem).toFixed(2)
    : '0.00';
  // idem for totalPayment
  const formattedTotalPayment = props.totalPayment
    ? parseFloat(totalPayment).toFixed(2)
    : '0.00';

  return (
    <GenericResponsiveDialog onClose={onClose} open={open || isSubmitting}>
      <DialogTitle id="alert-dialog-title">
        {t('form.invoice.titleUnevenInvoice')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('form.invoice.explainUnevenInvoice', {
            totalInvoiceItems: formattedTotalItem,
            totalPayments: formattedTotalPayment,
            currencyDisplay: getCurrencyDisplay(),
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" disabled={isSubmitting} onClick={onClose}>
          {t('common.cancel')}
        </Button>
        {isSubmitting ? (
          <div className={classes.circularProgress}>
            <CircularProgress />
          </div>
        ) : (
          <Button
            autoFocus
            color="primary"
            onClick={() => {
              setIsSubmitting(true);
              onSubmit({
                onSuccess: () => setIsSubmitting(false),
                onError: () => setIsSubmitting(false),
              });
            }}
          >
            {t('common.confirm')}
          </Button>
        )}
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  circularProgress: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default UnevenInvoiceDialog;
