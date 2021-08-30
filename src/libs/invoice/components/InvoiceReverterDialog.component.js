// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER as INVOICE_TYPE_RECEIPT } from '@bsport/common/lib/master-data/invoice-type';
import Collapse from '@material-ui/core/Collapse';

import {
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
} from '@bsport/common/lib/master-data/payment-group';

type Props = {
  open: ?boolean,
  onClose: () => void,
  onSubmit: (any) => void,
  payments: Array<Payment>,
  invoice: Invoice,
};

export const InvoiceReverterDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [processing, setProcessing] = React.useState(false);

  const [reverseMethod, handleChangeReverseMethod] = React.useState(
    REVERSE_ON_PAYMENT_METHOD,
  );

  const [paymentMethodSelected, selectPaymentMethod] = React.useState(
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  );

  return (
    <Dialog open={!!props.open}>
      <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
      {props.payments &&
      props.payments.filter(
        (p) => p.payment_received || p.payment_received === null,
      ).length ? (
        <DialogContent>
          <div className={classes.radioContainer}>
            <div className={classes.row}>
              <Radio
                checked={reverseMethod === REVERSE_ON_PAYMENT_METHOD}
                disabled={processing}
                onChange={() => {
                  handleChangeReverseMethod(REVERSE_ON_PAYMENT_METHOD);
                }}
                value={REVERSE_ON_PAYMENT_METHOD}
              />
              <Typography>
                {t(`revert.content.label.${REVERSE_ON_PAYMENT_METHOD}`)}
              </Typography>
            </div>
            <Typography variant="caption">
              {t(`revert.content.explain.${REVERSE_ON_PAYMENT_METHOD}`)}
            </Typography>
          </div>
          {props.invoice.invoice_type !== INVOICE_TYPE_RECEIPT && (
            <div className={classes.radioContainer}>
              <div className={classes.row}>
                <Radio
                  checked={reverseMethod === REVERSE_ON_DEBT}
                  disabled={processing}
                  onChange={() => handleChangeReverseMethod(REVERSE_ON_DEBT)}
                  value={REVERSE_ON_DEBT}
                />
                <Typography>
                  {t(`revert.content.label.${REVERSE_ON_DEBT}`)}
                </Typography>
              </div>
              <Typography variant="caption">
                {t(`revert.content.explain.${REVERSE_ON_DEBT}`)}
              </Typography>
            </div>
          )}
          <div className={classes.radioContainer}>
            <div className={classes.row}>
              <Radio
                checked={reverseMethod === REVERSE_ON_NEW_PAYMENT_METHOD}
                disabled={processing}
                onChange={() =>
                  handleChangeReverseMethod(REVERSE_ON_NEW_PAYMENT_METHOD)
                }
                value={REVERSE_ON_NEW_PAYMENT_METHOD}
              />
              <Typography>
                {t(`revert.content.label.${REVERSE_ON_NEW_PAYMENT_METHOD}`)}
              </Typography>
            </div>
            <Typography variant="caption">
              {t(`revert.content.explain.${REVERSE_ON_NEW_PAYMENT_METHOD}`)}
            </Typography>
            <Collapse in={reverseMethod === REVERSE_ON_NEW_PAYMENT_METHOD}>
              <Select
                id="payment-method-select"
                value={`${paymentMethodSelected}`}
                style={{ minWidth: 200, marginTop: 16 }}
                onChange={(ev) =>
                  selectPaymentMethod(parseInt(ev.target.value, 10))
                }
              >
                {PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT].map(
                  (pm) => (
                    <MenuItem fullWidth value={pm}>
                      {t(`paymentMethod.label.${pm}`)}
                    </MenuItem>
                  ),
                )}
              </Select>
            </Collapse>
          </div>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText>
            {t('revert.content.explainEmptyPayment')}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button disabled={processing} onClick={props.onClose}>
          {t('revert.dialog.actions.cancel')}
        </Button>
        {processing ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            onClick={() => {
              setProcessing(true);
              props.onSubmit(reverseMethod, paymentMethodSelected, {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              });
            }}
          >
            {t('revert.dialog.actions.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  radioContainer: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
    marginBottom: theme.spacing(2),
  },
}));

export default InvoiceReverterDialog;
