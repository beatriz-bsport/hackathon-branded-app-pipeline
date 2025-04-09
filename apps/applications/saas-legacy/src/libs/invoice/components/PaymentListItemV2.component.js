// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import CachedIcon from '@material-ui/icons/Cached';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import MenuItem from '@material-ui/core/MenuItem';

import CircularProgress from '@material-ui/core/CircularProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PAYMENT_METHODS, {
  DISPUTE as PAYMENT_METHOD_DISPUTE,
} from '@bsport/common/lib/master-data/payment-methods.js';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

type Props = {
  paymentItem: PaymentItem,
  handleChangeMethod: (uuid: string, paymentMethodId: number) => void,
};

const PaymentItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const { paymentItem } = props;
  const [changeMethodAnchorEl, setChangeMethodAnchorEl] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        {!paymentItem.is_processing &&
          paymentItem.payment_received &&
          paymentItem.payment_method !== PAYMENT_METHOD_DISPUTE.id && (
            <CheckIcon color="secondary" />
          )}
        {!paymentItem.is_processing &&
          paymentItem.payment_received &&
          paymentItem.payment_method === PAYMENT_METHOD_DISPUTE.id && (
            <WarningIcon color="error" />
          )}
        {!paymentItem.is_processing &&
          false === paymentItem.payment_received &&
          paymentItem.payment_method === PAYMENT_METHOD_DISPUTE.id && (
            <CheckCircleOutlineIcon color="primary" />
          )}
        {!paymentItem.is_processing &&
          false === paymentItem.payment_received &&
          paymentItem.payment_method !== PAYMENT_METHOD_DISPUTE.id && (
            <CancelIcon color="secondary" />
          )}
        {(!!paymentItem.is_processing ||
          paymentItem.payment_received === null) && (
          <HourglassEmpty color="secondary" />
        )}
        <div className={classes.leftText}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Typography
              className={
                paymentItem.reverted ||
                (!paymentItem.is_processing &&
                  false === paymentItem.payment_received &&
                  paymentItem.payment_method === PAYMENT_METHOD_DISPUTE.id)
                  ? classes.revert
                  : null
              }
            >
              {t(`paymentMethod.${paymentItem.payment_method}`)}
            </Typography>
            {!paymentItem.is_processing &&
            false === paymentItem.payment_received &&
            paymentItem.payment_method === PAYMENT_METHOD_DISPUTE.id ? (
              <Typography style={{ marginLeft: 4 }}>
                {`${t('paymentMethod.disputeWon')}`}
              </Typography>
            ) : (
              <div />
            )}
          </div>

          <Typography
            className={paymentItem.reverted ? classes.revert : null}
            color="textSecondary"
            variant="caption"
          >
            {paymentItem.payment_note}
          </Typography>
          <Typography
            className={paymentItem.reverted ? classes.revert : null}
            color="textSecondary"
            variant="caption"
          >
            {formatAsDatetimeAdapted(paymentItem.date, 'DDD')}
          </Typography>
        </div>
      </div>
      <div className={classes.line} />
      <div className={classes.secondaryAction}>
        <div className={paymentItem.reverted ? classes.revert : null}>
          <div>
            {`${getCurrencyDisplayWithPrice(
              parseFloat(paymentItem.price).toFixed(2),
            )}`}
          </div>
          {!!parseFloat(paymentItem.returned_amount) && (
            <div>
              {`${t('returnedAmount')} -${getCurrencyDisplayWithPrice(
                parseFloat(paymentItem.returned_amount).toFixed(2),
              )}`}
            </div>
          )}
        </div>
      </div>
      {!!processing && <CircularProgress />}
      {!!props.paymentItem.is_method_editable && !processing && (
        <IconButton
          color="primary"
          disabled={!paymentItem.is_method_editable}
          onClick={(e) => setChangeMethodAnchorEl(e.currentTarget)}
        >
          <CachedIcon />
        </IconButton>
      )}
      <Menu
        anchorEl={changeMethodAnchorEl}
        id={`simple-menu${paymentItem.uuid}`}
        onClose={() => setChangeMethodAnchorEl(null)}
        open={Boolean(changeMethodAnchorEl)}
      >
        {PAYMENT_METHODS.filter((pm) => pm.is_method_editable).map((pm) => (
          <MenuItem
            key={pm.id + paymentItem.uuid}
            disabled={pm.id === paymentItem.payment_method}
            onClick={() => {
              setProcessing(true);
              props.handleChangeMethod(paymentItem.uuid, pm.id, {
                onError: () => setProcessing(false),
                onSuccess: () => setProcessing(false),
              });
              setChangeMethodAnchorEl(null);
            }}
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
    wordBreak: 'break-word',
  },
  revert: {
    textDecoration: 'line-through',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  refundButton: {
    marginLeft: theme.spacing(1),
  },
}));

export default PaymentItem;
