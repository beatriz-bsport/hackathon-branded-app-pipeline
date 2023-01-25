import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import RefreshIcon from '@material-ui/icons/Refresh';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import CancelIcon from '@material-ui/icons/Cancel';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
  PLANNED_PAYMENT_EVENT_STATUS_ERROR,
  PLANNED_PAYMENT_EVENT_STATUS_PENDING,
} from '@bsport/common/lib/master-data/planned-payment-event';
import RedButton from '#components/button/RedButton.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PlannedPaymentEvent, Invoice } from '../types';

type Props = {
  invoice: Invoice;
  plannedPaymentEvent: PlannedPaymentEvent;
  actions?: {
    onRegisterNow?: (id: number) => void;
    onDisable?: (id: number) => void;
    onEnable?: (id: number) => void;
    onEdit?: (id: number) => void;
    onChangeMethod?: (ppeId: number) => void;
  };
};

const onlyIfFuture =
  (
    plannedPaymentEvent: PlannedPaymentEvent,
    t: TFunction,
    callback: () => void,
  ) =>
  () => {
    if (
      moment(
        plannedPaymentEvent.next_retry_date || plannedPaymentEvent.future_date,
      ).isSameOrBefore(moment())
    ) {
      if (
        Math.abs(
          moment(plannedPaymentEvent.date_created).diff(moment(), 'minutes'),
        ) > 30
      ) {
        // eslint-disable-next-line no-alert
        alert(t('plannedPaymentEvent.lockedToday'));
        return;
      }
    }
    callback();
  };

export const PlannedPaymentEventListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const { plannedPaymentEvent } = props;

  const [menuAchorEl, setMenuAnchorEl] = React.useState();
  const [processing, setProcessing] = React.useState(false);
  const closeMenu = {
    onSuccess: () => {
      setProcessing(false);
      setMenuAnchorEl(null);
    },
    onError: () => {
      setProcessing(false);
      setMenuAnchorEl(null);
    },
  };

  let { onDisable, onEnable, onRegisterNow, onEdit, onChangeMethod } = {};

  let StatusIcon = HourglassEmptyIcon;
  let statusColor;
  let secondaryAction = null;

  if (plannedPaymentEvent.nb_retries > 0) {
    StatusIcon = RefreshIcon;
  }
  if (plannedPaymentEvent.processing) {
    StatusIcon = RefreshIcon;
  }
  if (plannedPaymentEvent.status === PLANNED_PAYMENT_EVENT_STATUS_CANCELED) {
    onDisable = null;
    onRegisterNow = null;
    onEdit = null;
    onEnable =
      parseInt(props.invoice.amount_paid_cts) +
        parseInt(props.plannedPaymentEvent.amount_cts) <=
        parseInt(props.invoice.amount_due_cts) && props.actions?.onEnable;
    onChangeMethod = null;

    StatusIcon = CancelIcon;
  }
  if (plannedPaymentEvent.status === PLANNED_PAYMENT_EVENT_STATUS_ERROR) {
    StatusIcon = ErrorIcon;
    statusColor = 'error';
    onDisable = null;
    onRegisterNow = null;
    onEnable = null;
    secondaryAction = (props.actions?.recoverableErrorActions || {})[
      plannedPaymentEvent.recoverable_error_type || 'none'
    ];
  }

  if (plannedPaymentEvent.status === PLANNED_PAYMENT_EVENT_STATUS_PENDING) {
    onDisable = props.actions?.onDisable;
    onRegisterNow = props.actions?.onRegisterNow;
    onEdit = props.actions?.onEdit;
    onChangeMethod = props.actions?.onChangeMethod;
  }

  return (
    <div className={classes.container}>
      <Backdrop open={processing} className={classes.backdrop}>
        <CircularProgress />
      </Backdrop>
      <div className={classes.row}>
        <StatusIcon color={statusColor} className={classes.leftIcon} />
        <div className={classes.leftColumn}>
          <Typography
            style={
              [
                PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
                PLANNED_PAYMENT_EVENT_STATUS_ERROR,
              ].includes(plannedPaymentEvent.status)
                ? { 'text-decoration': 'line-through' }
                : null
            }
          >
            {(parseInt(plannedPaymentEvent.amount_cts)
              ? `${getCurrencyDisplayWithPrice(
                  parseInt(plannedPaymentEvent.amount_cts) / 100,
                )} `
              : '') +
              t(
                `paymentMethod.label.${plannedPaymentEvent.payment_method_identifier}`,
              )}
          </Typography>
          {plannedPaymentEvent.nb_retries === 0 && (
            <div className={classes.row}>
              <Typography
                color="textSecondary"
                variant="caption"
                style={
                  [
                    PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
                    PLANNED_PAYMENT_EVENT_STATUS_ERROR,
                  ].includes(plannedPaymentEvent.status)
                    ? { 'text-decoration': 'line-through' }
                    : null
                }
              >
                {moment(plannedPaymentEvent.future_date).isSameOrBefore(
                  moment(),
                )
                  ? moment().format('L')
                  : moment(plannedPaymentEvent.future_date).format('L')}
              </Typography>
            </div>
          )}
          {plannedPaymentEvent.nb_retries !== 0 && (
            <div className={classes.row}>
              <Typography
                color="textSecondary"
                variant="caption"
                style={
                  [
                    PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
                    PLANNED_PAYMENT_EVENT_STATUS_ERROR,
                  ].includes(plannedPaymentEvent.status)
                    ? { 'text-decoration': 'line-through' }
                    : null
                }
              >
                {t('plannedPaymentEvent.nextRetryDate', {
                  d: moment(props.plannedPaymentEvent.next_retry_date).format(
                    'LL',
                  ),
                })}
              </Typography>
            </div>
          )}
        </div>
      </div>
      {!!secondaryAction && (
        <RedButton
          variant="outlined"
          onClick={() => secondaryAction(plannedPaymentEvent)}
        >
          {t('plannedPaymentEvent.actions.solveInvalidPaymentAttempt')}
        </RedButton>
      )}
      {(!!onEdit ||
        !!onDisable ||
        !!onEnable ||
        !!onRegisterNow ||
        !!onChangeMethod) && (
        <>
          {!(
            props.invoice.amount_paid_cts >= props.invoice.amount_due_cts &&
            props.plannedPaymentEvent.status ===
              PLANNED_PAYMENT_EVENT_STATUS_CANCELED
          ) &&
            (!props.invoice.reverse_invoices ||
              !props.reverse_invoices?.length) &&
            !props.invoice.reverted && (
              <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
            )}
          <Menu
            onClose={() => setMenuAnchorEl(null)}
            open={!!menuAchorEl}
            anchorEl={menuAchorEl}
          >
            {!!onChangeMethod && (
              <MenuItem
                onClick={onlyIfFuture(props.plannedPaymentEvent, t, () => {
                  setMenuAnchorEl(null);
                  onChangeMethod(props.plannedPaymentEvent);
                })}
              >
                <ListItemIcon>
                  <SwapHorizIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('plannedPaymentEvent.actions.changeMethod')}
                />
              </MenuItem>
            )}
            {!!onEdit && (
              <MenuItem
                onClick={onlyIfFuture(props.plannedPaymentEvent, t, () => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onEdit(props.plannedPaymentEvent.id, closeMenu);
                })}
              >
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary={t('plannedPaymentEvent.actions.edit')} />
              </MenuItem>
            )}
            {!!onRegisterNow && (
              <MenuItem
                onClick={onlyIfFuture(props.plannedPaymentEvent, t, () => {
                  setMenuAnchorEl(null);
                  onRegisterNow(props.plannedPaymentEvent);
                })}
              >
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('plannedPaymentEvent.actions.registerNow')}
                />
              </MenuItem>
            )}
            {!!onDisable && (
              <MenuItem
                onClick={onlyIfFuture(props.plannedPaymentEvent, t, () => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onDisable(props.plannedPaymentEvent.id, closeMenu);
                })}
              >
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('plannedPaymentEvent.actions.disable')}
                />
              </MenuItem>
            )}
            {!!onEnable && (
              <MenuItem
                onClick={onlyIfFuture(props.plannedPaymentEvent, t, () => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onEnable(props.plannedPaymentEvent.id, closeMenu);
                })}
              >
                <ListItemIcon>
                  <HourglassEmptyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('plannedPaymentEvent.actions.enable')}
                />
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rowRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default PlannedPaymentEventListItem;
