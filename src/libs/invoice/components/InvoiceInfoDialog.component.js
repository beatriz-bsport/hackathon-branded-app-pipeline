// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import PaymentInfoListItem from './PaymentInfoListItem.component';

type Props = {
  onClose: () => void,
  goToInvoice: () => void,
  invoiceInfo: InvoiceInfo,
};

export const InvoiceInfoDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  return (
    <Dialog open className={classes.container}>
      <DialogContent>
        {t('invoiceInfoDialog.explain')}
        <div>
          {props.invoiceInfo.payments.map((p) => (
            <PaymentInfoListItem key={p.id} payment={p} />
          ))}
        </div>
        <div className={classes.centeredContainer}>
          <Button variant="outlined" onClick={props.goToInvoice}>
            {t('invoiceInfoDialog.actions.show')}
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('invoiceInfoDialog.actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  centeredContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

export default InvoiceInfoDialog;
