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
import moment from 'moment-timezone';

import CircularProgress from '@material-ui/core/CircularProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';

import PAYMENT_METHODS from '@bsport/common/lib/master-data/payment-methods';

type Props = {
  paymentItem: PaymentItem,
  handleChangeMethod: (uuid: string, paymentMethodId: number) => void,
};

export const PaymentItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const { paymentItem } = props;
  const [changeMethodAnchorEl, setChangeMethodAnchorEl] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        {!paymentItem.is_processing && paymentItem.payment_received && (
          <CheckIcon color="secondary" />
        )}
        {!paymentItem.is_processing &&
          paymentItem.payment_received === false && (
            <CancelIcon color="secondary" />
          )}
        {!!paymentItem.is_processing ||
          (paymentItem.payment_received === null && (
            <HourglassEmpty color="secondary" />
          ))}
        <div className={classes.leftText}>
          <Typography className={paymentItem.reverted ? classes.revert : null}>
            {`${t(`paymentMethod.${paymentItem.payment_method}`)}`}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className={paymentItem.reverted ? classes.revert : null}
          >
            {paymentItem.payment_note}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className={paymentItem.reverted ? classes.revert : null}
          >
            {moment(paymentItem.date).format('LL')}
          </Typography>
        </div>
      </div>
      <div className={classes.line} />
      <div className={classes.secondaryAction}>
        <div className={paymentItem.reverted ? classes.revert : null}>
          <div>{`${parseFloat(paymentItem.price).toFixed(2)} €`}</div>
          {!!parseFloat(paymentItem.returned_amount) && (
            <div>
              {`${t('returnedAmount')} -${parseFloat(
                paymentItem.returned_amount,
              ).toFixed(2)} €`}
            </div>
          )}
        </div>
      </div>
      {!!processing && <CircularProgress />}
      {!!props.paymentItem.is_method_editable && !processing && (
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
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  refundButton: {
    marginLeft: theme.spacing(1),
  },
}));

export default PaymentItem;
