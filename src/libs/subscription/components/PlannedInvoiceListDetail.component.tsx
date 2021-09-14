import React, { FC } from 'react';

import moment from 'moment-timezone';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import UndoIcon from '@material-ui/icons/Undo';
import TodayIcon from '@material-ui/icons/Today';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import { useTranslation } from 'react-i18next';
import {
  PENDING,
  SUCCEEDED,
  FAILED,
  PROCESSING,
  CANCELED,
} from '@bsport/common/lib/master-data/planned-invoice-status';
import StopIcon from '@material-ui/icons/Stop';
import RefreshIcon from '@material-ui/icons/Refresh';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import Tooltip from '../../../components/Tooltip.component';
import PlannedInvoicePriceUpdater from './PlannedInvoicePriceUpdater.component';
import PlannedInvoiceDateUpdater from './PlannedInvoiceDateUpdater.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { PlannedInvoice, Subscription, SubscriptionPause } from '../types';
import { OptionsCallback } from '../../../state/types';

const Status: FC<{
  disabled?: boolean;
  plannedInvoice: PlannedInvoice;
}> = ({ plannedInvoice, disabled }) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  if (plannedInvoice.reverted) {
    return (
      <Tooltip title={t('plannedInvoiceStatus.reverted')}>
        <span>
          <UndoIcon color="secondary" className={classes.icon} />;
        </span>
      </Tooltip>
    );
  }
  switch (plannedInvoice.status) {
    case PENDING.id:
      if (disabled) {
        return <CloseIcon className={classes.icon} />;
      }
      return (
        <Tooltip title={t('plannedInvoiceStatus.pending')}>
          <span>
            <HourglassEmptyIcon color="secondary" className={classes.icon} />
          </span>
        </Tooltip>
      );
    case SUCCEEDED.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.succeeded')}>
          <span>
            <CheckIcon color="primary" className={classes.icon} />
          </span>
        </Tooltip>
      );
    case CANCELED.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.canceled')}>
          <span>
            <CancelIcon color="secondary" className={classes.icon} />
          </span>
        </Tooltip>
      );
    case FAILED.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.failed')}>
          <span>
            <ErrorIcon color="error" className={classes.icon} />
          </span>
        </Tooltip>
      );
    case PROCESSING.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.processing')}>
          <span>
            <RefreshIcon color="error" className={classes.icon} />
          </span>
        </Tooltip>
      );
    default:
      return <RefreshIcon />;
  }
};

const PauseItem = (props: { pause: SubscriptionPause }) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  return (
    <React.Fragment>
      <div className={classes.listItem}>
        <PauseIcon className={classes.icon} />
        <div className={classes.smallLinkH} />
        <div className={classes.listItemBody}>
          <Typography>
            {t('pause.label', { days: props.pause.days })}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('pause.createdAt') +
              moment(props.pause.date_created).format('L') +
              t('pause.secondaryLabel', {
                note: props.pause.name,
              })}
          </Typography>
        </div>
        <div className={classes.expandedLink} />
        <IconButton
          color="secondary"
          onClick={(ev) => setMenuAnchor(ev.currentTarget)}
        >
          <EditIcon />
        </IconButton>
      </div>
      <Menu
        onClose={() => setMenuAnchor(null)}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
      >
        <MenuItem
          onClick={() => {
            props.cancelPause(props.pause.id);
            setMenuAnchor(null);
          }}
          disabled={props.isPast}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">{t('pause.actions.delete')}</Typography>
        </MenuItem>
      </Menu>
      <div className={classes.endLine} />
    </React.Fragment>
  );
};

const StopItem = (props: {}) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  return (
    <React.Fragment>
      <div className={classes.listItem}>
        <StopIcon color="error" className={classes.icon} />
        <div className={classes.smallLinkH} />
        <div className={classes.listItemBody}>
          <Typography>{t('scheduledStop.label')}</Typography>
        </div>
        <div className={classes.expandedLink} />
        <IconButton
          color="secondary"
          onClick={(ev) => setMenuAnchor(ev.currentTarget)}
        >
          <EditIcon />
        </IconButton>
      </div>
      <div className={classes.endLine} />
      <Menu
        onClose={() => setMenuAnchor(null)}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            props.unscheduleStop();
          }}
        >
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">
            {t('scheduledStop.unscheduleStop')}
          </Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

const EndItem = (props: { subscription: Subscription }) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const isAutoRenew = props.subscription.auto_renewal;
  return (
    <React.Fragment>
      <div className={classes.listItem}>
        {isAutoRenew ? (
          <RefreshIcon color="primary" className={classes.icon} />
        ) : (
          <StopIcon className={classes.icon} />
        )}
        <div className={classes.smallLinkH} />
        <div className={classes.listItemBody}>
          <Typography>
            {isAutoRenew ? t('end.renew') : t('end.noRenew')}
          </Typography>
        </div>
        <div className={classes.expandedLink} />
        <IconButton
          color="secondary"
          onClick={(ev) => setMenuAnchor(ev.currentTarget)}
        >
          <EditIcon />
        </IconButton>
      </div>
      <Menu
        onClose={() => setMenuAnchor(null)}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
      >
        <MenuItem
          onClick={() => {
            props.toogleAutoRenew({
              auto_renewal: !isAutoRenew,
            });
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">
            {isAutoRenew
              ? t('subscription.actions.disableAutoRenew')
              : t('subscription.actions.enableAutoRenew')}
          </Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

const PlannedInvoiceEditMenu = (props) => {
  const { t } = useTranslation(['subscription']);
  const isPast =
    moment(props.plannedInvoice.date).isBefore(moment()) ||
    props.plannedInvoice.status !== PENDING.id;
  return (
    <Menu onClose={props.onClose} anchorEl={props.anchor} open={props.open}>
      <MenuItem onClick={() => props.goToInvoice(props.plannedInvoice.uuid)}>
        <ListItemIcon>
          <ArrowForwardIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          {t('subscription.actions.showInvoice')}
        </Typography>
      </MenuItem>
      <MenuItem
        disabled={isPast || props.disableActions}
        onClick={() => props.onRequestDateChange(props.plannedInvoice)}
      >
        <ListItemIcon>
          <TodayIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          {t('subscription.actions.changeDate')}
        </Typography>
      </MenuItem>
      <MenuItem
        disabled={isPast || props.disableActions}
        onClick={() => props.onRequestPriceChange(props.plannedInvoice)}
      >
        <ListItemIcon>
          <EuroSymbolIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          {t('subscription.actions.changePrice')}
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={() => props.onRequestScheduledStop(props.plannedInvoice.id)}
        disabled={
          props.disableActions ||
          moment(props.plannedInvoice.date).isBefore(moment().add(-31, 'days'))
        }
      >
        <ListItemIcon>
          <StopIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          {t('subscription.actions.stop')}
        </Typography>
      </MenuItem>
    </Menu>
  );
};

const PlannedInvoiceItem = (props: { plannedInvoice: PlannedInvoice }) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  return (
    <React.Fragment>
      <div className={classes.listItem}>
        <Status
          disabled={props.disableActions}
          plannedInvoice={props.plannedInvoice}
        />
        <div className={classes.smallLinkH} />
        <ButtonBase
          disableRipple={props.disableActions}
          onClick={() => {
            if (!props.disableActions) {
              props.onClickInvoice(props.plannedInvoice.uuid);
            }
          }}
          className={classes.listItemBody}
        >
          {props.plannedInvoice && props.plannedInvoice.uuid ? (
            <React.Fragment>
              <Typography
                color={props.disableActions ? 'textSecondary' : undefined}
              >
                {t('subscription.invoice.label', {
                  price: getCurrencyDisplayWithPrice(
                    props.plannedInvoice.amount_due_cts / 100,
                  ),
                  uuid: (props.plannedInvoice.uuid || '').slice(0, 8),
                })}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {moment(props.plannedInvoice.date).format('L')}
              </Typography>
            </React.Fragment>
          ) : (
            '   -'
          )}
        </ButtonBase>
        <div className={classes.expandedLink} />
        <IconButton
          color="secondary"
          disabled={props.disableActions}
          onClick={(ev) => setMenuAnchor(ev.currentTarget)}
        >
          <EditIcon />
        </IconButton>
      </div>
      <div className={classes.endLine} />
      <PlannedInvoiceEditMenu
        onClose={() => setMenuAnchor(null)}
        open={!!menuAnchor}
        anchor={menuAnchor}
        plannedInvoice={props.plannedInvoice}
        disableActions={props.disableActions}
        goToInvoice={props.onClickInvoice}
        onRequestPriceChange={props.onRequestPriceChange}
        onRequestDateChange={props.onRequestDateChange}
        onRequestScheduledStop={props.onRequestScheduledStop}
      />
    </React.Fragment>
  );
};

type Props = {
  plannedInvoiceList: Array<PlannedInvoice>;
  requestUpdatePrice: (data: any, options: OptionsCallback) => void;
};

export function PlannedInvoiceListDetail(props: Props) {
  const classes = useStyles();
  const [
    plannedInvoiceToUpdatePrice,
    setPlannedInvoiceToUpdatePrice,
  ] = React.useState(null);
  const [
    plannedInvoiceToUpdateDate,
    setPlannedInvoiceToUpdateDate,
  ] = React.useState(null);
  let fullDisable = false;
  return (
    <div className={classes.container}>
      {props.plannedInvoiceList.map((pl) => {
        fullDisable = fullDisable || pl.is_last_invoice_before_scheduled_stop;
        return (
          <React.Fragment>
            {props.pauseList
              .filter((p) => p.first_paused_planned_invoice === pl.id)
              .map((p) => (
                <PauseItem
                  isPast={moment(pl.date).isBefore(moment())}
                  cancelPause={props.cancelPause}
                  pause={p}
                  key={p.id}
                />
              ))}
            <div key={pl.id} className={classes.innerContainer}>
              <PlannedInvoiceItem
                disableActions={
                  fullDisable && !pl.is_last_invoice_before_scheduled_stop
                }
                onClickInvoice={props.onClickInvoice}
                plannedInvoice={pl}
                onRequestPriceChange={setPlannedInvoiceToUpdatePrice}
                onRequestDateChange={setPlannedInvoiceToUpdateDate}
                onRequestScheduledStop={props.onRequestScheduledStop}
              />
              {pl.is_last_invoice_before_scheduled_stop && (
                <StopItem
                  unscheduleStop={() => props.unflagPlannedInvoiceAsLast(pl.id)}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
      <EndItem
        toogleAutoRenew={props.toogleAutoRenew}
        subscription={props.subscription}
      />
      {!!plannedInvoiceToUpdatePrice && (
        <PlannedInvoicePriceUpdater
          subscription={props.subscription}
          open={!!plannedInvoiceToUpdatePrice}
          planned_invoice={plannedInvoiceToUpdatePrice}
          onCancel={() => setPlannedInvoiceToUpdatePrice(null)}
          onSubmit={(data, options) => {
            props.requestUpdatePrice(data, {
              onSuccess: (...args) => {
                if (options && options.onSuccess) options.onSuccess(...args);
                setPlannedInvoiceToUpdatePrice(null);
              },
              onError: options && options.onError,
            });
          }}
        />
      )}
      {!!plannedInvoiceToUpdateDate && (
        <PlannedInvoiceDateUpdater
          plannedInvoice={plannedInvoiceToUpdateDate}
          onSubmit={(data, options) => props.updateDate(data, options)}
          onClose={() => setPlannedInvoiceToUpdateDate(null)}
        />
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {},
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    padding: theme.spacing(1.5),
    height: 64,
    width: 64,
  },
  icon: {
    height: 38,
    width: 38,
    padding: theme.spacing(0.8),
    border: '1px solid black',
    borderRadius: 100,
  },
  listItemBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  smallLinkH: {
    height: 1,
    width: 12,
    borderBottom: '1px solid gray',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  expandedLink: {
    height: 1,
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  endLine: {
    borderLeft: '1px dashed black',
    height: 24,
    marginLeft: 19,
  },
}));

export default PlannedInvoiceListDetail;
