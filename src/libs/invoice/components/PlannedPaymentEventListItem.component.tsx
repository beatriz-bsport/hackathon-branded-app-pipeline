// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import RefreshIcon from '@material-ui/icons/Refresh';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
  PLANNED_PAYMENT_EVENT_STATUS_PENDING,
} from '@bsport/common/lib/master-data/planned-payment-event';
import { PlannedPaymentEvent } from '../types';

type Props = {
  invoice: Invoice;
  plannedPaymentEvent: PlannedPaymentEvent;
  actions?: {
    onRegisterNow?: (id: number) => void;
    onDisable?: (id: number) => void;
    onEnable?: (id: number) => void;
    onEdit?: (id: number) => void;
  };
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

  let { onDisable, onEnable, onRegisterNow, onEdit } = {};

  let StatusIcon = HourglassEmptyIcon;
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
    onEnable = props.actions?.onEnable;
    StatusIcon = RefreshIcon;
  }

  if (plannedPaymentEvent.status === PLANNED_PAYMENT_EVENT_STATUS_PENDING) {
    onDisable = props.actions?.onDisable;
    onRegisterNow = props.actions?.onRegisterNow;
    onEdit = props.actions?.onEdit;
  }

  return (
    <div className={classes.container}>
      <Backdrop open={processing} className={classes.backdrop}>
        <CircularProgress />
      </Backdrop>
      <div className={classes.row}>
        <StatusIcon className={classes.leftIcon} />
        <div className={classes.leftColumn}>
          <Typography
            style={
              plannedPaymentEvent.status ===
              PLANNED_PAYMENT_EVENT_STATUS_CANCELED
                ? { 'text-decoration': 'line-through' }
                : null
            }
          >
            {t(
              `paymentMethod.label.${plannedPaymentEvent.payment_method_identifier}`,
            )}
          </Typography>
          {plannedPaymentEvent.nb_retries === 0 && (
            <div className={classes.row}>
              <Typography
                color="textSecondary"
                variant="caption"
                style={
                  plannedPaymentEvent.status ===
                  PLANNED_PAYMENT_EVENT_STATUS_CANCELED
                    ? { 'text-decoration': 'line-through' }
                    : null
                }
              >
                {moment(plannedPaymentEvent.future_date).format('L')}
              </Typography>
            </div>
          )}
          {plannedPaymentEvent.nb_retries !== 0 && (
            <div className={classes.row}>
              <Typography
                color="textSecondary"
                variant="caption"
                style={
                  plannedPaymentEvent.status ===
                  PLANNED_PAYMENT_EVENT_STATUS_CANCELED
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
      {(!!onEdit || !!onDisable || !!onEnable || !!onRegisterNow) && (
        <>
          {!(
            props.invoice.amount_paid_cts >= props.invoice.amount_due_cts &&
            props.plannedPaymentEvent.status ===
              PLANNED_PAYMENT_EVENT_STATUS_CANCELED
          ) && (
            <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            onClose={() => setMenuAnchorEl(null)}
            open={!!menuAchorEl}
            anchorEl={menuAchorEl}
          >
            {!!onEdit && (
              <MenuItem
                onClick={() => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onEdit(props.plannedPaymentEvent.id, closeMenu);
                }}
              >
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary={t('plannedPaymentEvent.actions.edit')} />
              </MenuItem>
            )}
            {!!onRegisterNow && (
              <MenuItem
                onClick={() => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onRegisterNow(props.plannedPaymentEvent.id, closeMenu);
                }}
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
                onClick={() => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onDisable(props.plannedPaymentEvent.id, closeMenu);
                }}
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
                onClick={() => {
                  setMenuAnchorEl(null);
                  setProcessing(true);
                  onEnable(props.plannedPaymentEvent.id, closeMenu);
                }}
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

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
