// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import Button from '@material-ui/core/Button';
import UndoIcon from '@material-ui/icons/Undo';

import PAYMENT_METHODS, {
  SUBSCRIPTION_CB as PAYMENT_METHOD_SUBSCRIPTION_CB,
  DISPUTE as PAYMENT_METHOD_DISPUTE,
  CB as PAYMENT_METHOD_CB,
} from '@bsport/common/lib/master-data/payment-methods';

import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  paymentItem: PaymentItem,
  onDelete: ?() => void,
  returnPayment: (uuid: string) => void,
  isReturningPayment: boolean,
  handleChangeMethod: (uuid: string, paymentMethodId: number) => void,
};
const ButtonReturnPayment = withConfirm(Button, 'onClick', {
  title: 'invoice:returnPayment.modal.title',
  cancel: 'invoice:returnPayment.modal.cancel',
  confirm: 'invoice:returnPayment.modal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('invoice:returnPayment.modal.content')}</p>
  ),
});

export const PaymentItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const { paymentItem } = props;
  const [changeMethodAnchorEl, setChangeMethodAnchorEl] = React.useState(null);

  const editable =
    ![PAYMENT_METHOD_DISPUTE, PAYMENT_METHOD_SUBSCRIPTION_CB, PAYMENT_METHOD_CB]
      .map((pm) => pm.id)
      .includes(paymentItem.payment_method) && !paymentItem.reverted;

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        {paymentItem.payment_received && <CheckIcon color="secondary" />}
        {paymentItem.payment_received === false && (
          <CancelIcon color="secondary" />
        )}
        {(paymentItem.payment_method === PAYMENT_METHOD_DISPUTE.id ||
          paymentItem.payment_method === PAYMENT_METHOD_SUBSCRIPTION_CB.id) && (
          <HourglassEmpty color="secondary" />
        )}
        {!(
          paymentItem.payment_method === PAYMENT_METHOD_DISPUTE.id ||
          paymentItem.payment_method === PAYMENT_METHOD_SUBSCRIPTION_CB.id
        ) &&
          paymentItem.payment_received === null && (
            <CancelIcon color="secondary" />
          )}
        <div className={classes.leftText}>
          <Typography className={paymentItem.reverted ? classes.revert : null}>
            {t(`paymentMethod.${paymentItem.payment_method}`)}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className={paymentItem.reverted ? classes.revert : null}
          >
            {paymentItem.payment_note}
          </Typography>
        </div>
      </div>
      <div className={classes.line} />
      <div className={classes.secondaryAction}>
        <div className={paymentItem.reverted ? classes.revert : null}>
          {`${parseFloat(paymentItem.price).toFixed(2)} €`}
        </div>
        {!!paymentItem.editable && !!props.onDelete && (
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
      {paymentItem.is_returnable &&
        !!props.returnPayment &&
        !props.isReturningPayment && (
          <ButtonReturnPayment
            onClick={() => props.returnPayment(paymentItem.uuid)}
            variant="outlined"
          >
            <UndoIcon className={classes.leftIcon} />
            {t('payment.return')}
          </ButtonReturnPayment>
        )}
      {!!props.isReturningPayment && <CircularProgress />}
      {!!editable && (
        <IconButton
          disabled={!paymentItem.is_method_editable}
          onClick={(e) => setChangeMethodAnchorEl(e.currentTarget)}
          color="primary"
        >
          <CachedIcon />
        </IconButton>
      )}
      <Menu
        id={`simple-menu${paymentItem.uuid}`}
        anchorEl={changeMethodAnchorEl}
        open={Boolean(changeMethodAnchorEl)}
        onClose={() => setChangeMethodAnchorEl(null)}
      >
        {PAYMENT_METHODS.filter((pm) => pm.is_method_editable).map((pm) => (
          <MenuItem
            key={pm.id + paymentItem.uuid}
            disabled={pm.id === paymentItem.payment_method}
            onClick={() => props.handleChangeMethod(paymentItem.uuid, pm.id)}
            value={pm.id}
          >
            {t(`paymentMethod.${pm.id}`)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  secondaryAction: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  line: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(1),
  },
  revert: {
    textDecoration: 'line-through',
  },
}));

export default PaymentItem;
