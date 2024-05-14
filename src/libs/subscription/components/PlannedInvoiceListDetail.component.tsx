import React, { FC, useCallback } from 'react';
import { DateTime } from 'luxon';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import UndoIcon from '@material-ui/icons/Undo';
import TodayIcon from '@material-ui/icons/Today';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
import type { LuxonDateTime } from '#src/types';

import { formatAsDate, sortByDate } from '../../../utils/datetime';
import Tooltip from '#components/Tooltip.component';
import PlannedInvoicePriceUpdater from './PlannedInvoicePriceUpdater.component';
import PlannedInvoiceDateUpdater from './PlannedInvoiceDateUpdater.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import {
  PlannedInvoice,
  Subscription,
  PauseRequestData,
  SubscriptionPause,
} from '../types';
import { OptionCallback } from '../../../state/types';
import PauseDetailListItem from './pause/PauseDetailListItem.component';
import PauseFormDialog from './pause/PauseFormDialog.component';
import { getInvoiceIdentifier } from '#libs/invoice/utils';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

const Status: FC<{
  disabled?: boolean;
  plannedInvoice: PlannedInvoice;
}> = React.memo(({ plannedInvoice, disabled }) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  if (plannedInvoice.reverted) {
    return (
      <Tooltip title={t('plannedInvoiceStatus.reverted')}>
        <span>
          <UndoIcon className={classes.icon} color="secondary" />
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
            <HourglassEmptyIcon className={classes.icon} color="secondary" />
          </span>
        </Tooltip>
      );
    case SUCCEEDED.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.succeeded')}>
          <span>
            <CheckIcon className={classes.icon} color="primary" />
          </span>
        </Tooltip>
      );
    case CANCELED.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.canceled')}>
          <span>
            <CancelIcon className={classes.icon} color="secondary" />
          </span>
        </Tooltip>
      );
    case FAILED.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.failed')}>
          <span>
            <ErrorIcon className={classes.icon} color="error" />
          </span>
        </Tooltip>
      );
    case PROCESSING.id:
      return (
        <Tooltip title={t('plannedInvoiceStatus.processing')}>
          <span>
            <RefreshIcon className={classes.icon} color="error" />
          </span>
        </Tooltip>
      );
    default:
      return <RefreshIcon />;
  }
});

const StopItem: FC<{ unscheduleStop: () => void }> = React.memo((props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);

  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const { unscheduleStop } = props;

  const handleOpenMenu = useCallback(
    (ev) => setMenuAnchor(ev.currentTarget),
    [setMenuAnchor],
  );
  const handleCloseMenu = useCallback(
    () => setMenuAnchor(null),
    [setMenuAnchor],
  );
  const handleUnscheduleStop = useCallback(() => {
    setMenuAnchor(null);
    unscheduleStop();
  }, [setMenuAnchor, unscheduleStop]);

  return (
    <React.Fragment>
      <div className={classes.listItem}>
        <StopIcon className={classes.icon} color="error" />
        <div className={classes.smallLinkH} />
        <div className={classes.listItemBody}>
          <Typography>{t('scheduledStop.label')}</Typography>
        </div>
        <div className={classes.expandedLink} />
        <IconButton color="secondary" onClick={handleOpenMenu}>
          <EditIcon />
        </IconButton>
      </div>
      <div className={classes.endLine} />
      <Menu anchorEl={menuAnchor} onClose={handleCloseMenu} open={!!menuAnchor}>
        <MenuItem onClick={handleUnscheduleStop}>
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
});

const EndItem: FC<{
  subscription: Subscription;
  toogleAutoRenew: ({ auto_renewal }: { auto_renewal: boolean }) => void;
}> = React.memo((props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);

  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const isAutoRenew = props.subscription.auto_renewal;

  const { toogleAutoRenew } = props;

  const handleOpenMenu = useCallback(
    (ev) => setMenuAnchor(ev.currentTarget),
    [setMenuAnchor],
  );
  const handleCloseMenu = useCallback(
    () => setMenuAnchor(null),
    [setMenuAnchor],
  );
  const handleAutoRenewalChange = useCallback(() => {
    toogleAutoRenew({
      auto_renewal: !isAutoRenew,
    });
    setMenuAnchor(null);
  }, [isAutoRenew, toogleAutoRenew, setMenuAnchor]);

  return (
    <React.Fragment>
      <div className={classes.listItem}>
        {isAutoRenew ? (
          <RefreshIcon className={classes.icon} color="primary" />
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
        <IconButton color="secondary" onClick={handleOpenMenu}>
          <EditIcon />
        </IconButton>
      </div>
      <Menu anchorEl={menuAnchor} onClose={handleCloseMenu} open={!!menuAnchor}>
        <MenuItem onClick={handleAutoRenewalChange}>
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
});

type PlannedInvoiceEditMenuProps = {
  plannedInvoice: PlannedInvoice;
  goToInvoice?: (uuid: string) => void;
  disableActions?: boolean;
  onClose: () => void;
  anchor: any;
  open: boolean;
  onRequestPriceChange: (plannedInvoice: PlannedInvoice) => void;
  onRequestDateChange: (plannedInvoice: PlannedInvoice) => void;
  onRequestScheduledStop: (
    plannedInvoiceId?: number,
    stopNote?: string,
  ) => void;
  disableDateModification: boolean;
  hasEditInvoiceDateBPPermission: boolean;
  hasEditInvoicePriceBPPermission: boolean;
  hasEndAfterInvoiceBPPermission: boolean;
};

const PlannedInvoiceEditMenu: FC<PlannedInvoiceEditMenuProps> = React.memo(
  ({
    plannedInvoice,
    goToInvoice,
    disableActions,
    onClose,
    anchor,
    open,
    onRequestPriceChange,
    onRequestDateChange,
    onRequestScheduledStop,
    disableDateModification,
    hasEditInvoiceDateBPPermission,
    hasEditInvoicePriceBPPermission,
    hasEndAfterInvoiceBPPermission,
  }) => {
    const { t } = useTranslation(['subscription']);
    const isPast =
      DateTime.fromISO(plannedInvoice.date) < DateTime.now() ||
      plannedInvoice.status !== PENDING.id;

    const [stopNote, setStopNote] = React.useState<string>('');

    const handleNoteChange = React.useCallback(
      (event) => {
        setStopNote(event.target.value);
      },
      [setStopNote],
    );

    const [
      isOpenRequestScheduledStopDialog,
      setIsOpenRequestScheduledStopDialog,
    ] = React.useState(false);

    const dateModificationIsDisabled = React.useMemo(
      () => isPast || disableActions || disableDateModification,
      [isPast, disableActions, disableDateModification],
    );
    const priceModificationIsDisabled = React.useMemo(
      () => isPast || disableActions,
      [isPast, disableActions],
    );
    const scheduledStopIsDisabled = React.useMemo(
      () =>
        disableActions ||
        DateTime.fromISO(plannedInvoice.date).diffNow('days').days < -31,
      [disableActions, plannedInvoice.date],
    );

    const handleSeeInvoice = React.useCallback(
      () => goToInvoice(plannedInvoice.uuid),
      [goToInvoice, plannedInvoice],
    );
    const handleEditDate = React.useCallback(
      () => onRequestDateChange(plannedInvoice),
      [onRequestDateChange, plannedInvoice],
    );
    const handleEditPrice = React.useCallback(
      () => onRequestPriceChange(plannedInvoice),
      [onRequestPriceChange, plannedInvoice],
    );

    const handleRequestScheduledStop = React.useCallback(() => {
      setIsOpenRequestScheduledStopDialog(true);
    }, []);
    const handleCancelScheduledStop = React.useCallback(() => {
      setIsOpenRequestScheduledStopDialog(false);
    }, []);

    const handleSubmitRequestScheduledStop = React.useCallback(() => {
      setIsOpenRequestScheduledStopDialog(false);
      onRequestScheduledStop(plannedInvoice.id, stopNote);
    }, [onRequestScheduledStop, plannedInvoice.id, stopNote]);

    return (
      <>
        <Menu anchorEl={anchor} onClose={onClose} open={open}>
          {goToInvoice && (
            <MenuItem onClick={handleSeeInvoice}>
              <ListItemIcon>
                <ArrowForwardIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {t('subscription.actions.showInvoice')}
              </Typography>
            </MenuItem>
          )}
          {hasEditInvoiceDateBPPermission && (
            <MenuItem
              disabled={dateModificationIsDisabled}
              onClick={handleEditDate}
            >
              <ListItemIcon>
                <TodayIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {t('subscription.actions.changeDate')}
              </Typography>
            </MenuItem>
          )}
          {hasEditInvoicePriceBPPermission && (
            <MenuItem
              disabled={priceModificationIsDisabled}
              onClick={handleEditPrice}
            >
              <ListItemIcon>
                <EuroSymbolIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {t('subscription.actions.changePrice')}
              </Typography>
            </MenuItem>
          )}
          {hasEndAfterInvoiceBPPermission && (
            <MenuItem
              disabled={scheduledStopIsDisabled}
              onClick={handleRequestScheduledStop}
            >
              <ListItemIcon>
                <StopIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {t('subscription.actions.stop')}
              </Typography>
            </MenuItem>
          )}
        </Menu>
        {isOpenRequestScheduledStopDialog && (
          <Dialog open={isOpenRequestScheduledStopDialog}>
            <DialogTitle>
              <Typography variant="h6">
                {t('subscription.scheduledStop.title')}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label={t('subscription.scheduledStop.notePlaceholder')}
                onChange={handleNoteChange}
                placeholder={t('subscription.scheduledStop.notePlaceholder')}
                value={stopNote}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelScheduledStop}>
                {t('subscription.freeze.form.cancel')}
              </Button>
              <Button
                color="primary"
                onClick={handleSubmitRequestScheduledStop}
              >
                {t('subscription.freeze.form.submit')}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  },
);

const PlannedInvoiceItem = React.memo(
  (props: {
    plannedInvoice: PlannedInvoice;
    onClickInvoice?: (uuid: string) => void;
    disableActions: boolean;
    disableDateModification: boolean;
    onRequestPriceChange: (plannedInvoice: PlannedInvoice) => void;
    onRequestDateChange: (plannedInvoice: PlannedInvoice) => void;
    onRequestScheduledStop: (
      plannedInvoiceId?: number,
      stopNote?: string,
    ) => void;
    hasEditInvoiceDateBPPermission: boolean;
    hasEditInvoicePriceBPPermission: boolean;
    hasEndAfterInvoiceBPPermission: boolean;
  }) => {
    const { plannedInvoice } = props;
    const classes = useStyles();
    const { t } = useTranslation(['subscription']);
    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const invoiceLabel = t('subscription.invoice.label', {
      price: getCurrencyDisplayWithPrice(plannedInvoice.amount_due_cts / 100),
      uuid: getInvoiceIdentifier(plannedInvoice),
    });

    return (
      <React.Fragment>
        <div className={classes.listItem}>
          <Status
            disabled={props.disableActions}
            plannedInvoice={plannedInvoice}
          />
          <div className={classes.smallLinkH} />
          <ButtonBase
            className={classes.listItemBody}
            disableRipple={props.disableActions || !props.onClickInvoice}
            onClick={() => {
              if (!props.disableActions && props.onClickInvoice) {
                props.onClickInvoice(plannedInvoice.uuid);
              }
            }}
          >
            {plannedInvoice &&
            (plannedInvoice.uuid || plannedInvoice.invoice_legal_identifier) ? (
              <React.Fragment>
                <Typography
                  color={props.disableActions ? 'textSecondary' : undefined}
                >
                  {invoiceLabel}
                </Typography>
                <Typography color="textSecondary" variant="caption">
                  {formatAsDate(plannedInvoice.date)}
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
          anchor={menuAnchor}
          disableActions={props.disableActions}
          disableDateModification={props.disableDateModification}
          goToInvoice={props.onClickInvoice}
          hasEditInvoiceDateBPPermission={props.hasEditInvoiceDateBPPermission}
          hasEditInvoicePriceBPPermission={
            props.hasEditInvoicePriceBPPermission
          }
          hasEndAfterInvoiceBPPermission={props.hasEndAfterInvoiceBPPermission}
          onClose={() => setMenuAnchor(null)}
          onRequestDateChange={props.onRequestDateChange}
          onRequestPriceChange={props.onRequestPriceChange}
          onRequestScheduledStop={props.onRequestScheduledStop}
          open={!!menuAnchor}
          plannedInvoice={props.plannedInvoice}
        />
      </React.Fragment>
    );
  },
);

type Props = {
  plannedInvoiceList: Array<PlannedInvoice>;
  plannedInvoiceUpdateLoading?: boolean;
  requestUpdatePrice: (
    data: {
      planned_invoice: number;
      price: number;
      update_all: boolean;
      update_recurrent_price: boolean;
    },
    options?: OptionCallback<Subscription>,
  ) => void;
  onRequestScheduledStop: (
    plannedInvoiceId?: number,
    stopNote?: string,
  ) => void;
  pauseList: Array<SubscriptionPause>;
  cancelPause: (id: number, options?: OptionCallback<Subscription>) => void;
  updatePause: (data: PauseRequestData, options: OptionCallback<any>) => void;
  toogleAutoRenew: ({ auto_renewal }: { auto_renewal: boolean }) => void;
  subscription: Subscription;
  unflagPlannedInvoiceAsLast: (id: number) => void;
  onClickInvoice: (uuid: string) => void;
  updateDate: (
    data: {
      date: string;
      planned_invoice: number;
    },
    options: OptionCallback,
  ) => void;
  updateEventList: () => void;
  hasEditInvoiceDateBPPermission: boolean;
  hasEditInvoicePriceBPPermission: boolean;
  hasEndAfterInvoiceBPPermission: boolean;
};

export const PlannedInvoiceListDetail: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [plannedInvoiceToUpdatePrice, setPlannedInvoiceToUpdatePrice] =
    React.useState<PlannedInvoice>(null);
  const [plannedInvoiceToUpdateDate, setPlannedInvoiceToUpdateDate] =
    React.useState(null);
  const [pauseToUpdate, setPauseToUpdate] = React.useState(null);
  let fullDisable = false;

  const { plannedInvoiceList, pauseList } = props;
  const plannedInvoiceListWithRelatedPauseList = React.useMemo(
    () =>
      plannedInvoiceList.map((plannedInvoice) => ({
        plannedInvoice,
        relatedPauses: sortByDate(
          pauseList.filter(
            (p: SubscriptionPause) =>
              p.first_paused_planned_invoice === plannedInvoice.id,
          ),
          'from_date',
        ),
      })),
    [plannedInvoiceList, pauseList],
  );
  let endOrRenewalDay: LuxonDateTime = DateTime.now();
  let pausesWithoutRelatedPlannedInvoicesBeforeEnd: SubscriptionPause[] = [];
  let pausesWithoutRelatedPlannedInvoicesAfterEnd: SubscriptionPause[] = [];
  const { recurrence_basis, interval } = props.subscription;
  if (plannedInvoiceList?.length > 0 && !!recurrence_basis && !!interval) {
    const lastPlannedInvoiceDate = DateTime.fromISO(
      plannedInvoiceList[plannedInvoiceList.length - 1].date,
    );
    endOrRenewalDay = lastPlannedInvoiceDate.plus({
      [interval]: recurrence_basis,
    });
  }
  pausesWithoutRelatedPlannedInvoicesBeforeEnd = sortByDate(
    pauseList.filter(
      (p: SubscriptionPause) =>
        !p.first_paused_planned_invoice &&
        endOrRenewalDay > DateTime.fromISO(p.from_date),
    ),
    'from_date',
  );
  pausesWithoutRelatedPlannedInvoicesAfterEnd = sortByDate(
    pauseList.filter(
      (p: SubscriptionPause) =>
        !p.first_paused_planned_invoice &&
        endOrRenewalDay <= DateTime.fromISO(p.from_date),
    ),
    'from_date',
  );

  return (
    <div className={classes.container}>
      <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.readInvoices">
        {(hasReadInvoicePermission: boolean) => (
          <>
            {plannedInvoiceListWithRelatedPauseList.map(
              (plannedInvoiceWithPauses) => {
                const pl = plannedInvoiceWithPauses.plannedInvoice;
                const relatedPauses = plannedInvoiceWithPauses.relatedPauses;
                fullDisable =
                  fullDisable || pl.is_last_invoice_before_scheduled_stop;
                return (
                  <React.Fragment>
                    {relatedPauses.map((pause: SubscriptionPause) => (
                      <PauseDetailListItem
                        key={pause.id}
                        dateEndIsPast={
                          DateTime.fromISO(pause.until_date).diffNow('days')
                            .days < 0
                        }
                        dateStartIsPast={
                          DateTime.fromISO(pause.from_date).diffNow('days')
                            .days < 0
                        }
                        deletePause={props.cancelPause}
                        pause={pause}
                        updateEventList={props.updateEventList}
                        updatePause={() => setPauseToUpdate(pause)}
                      />
                    ))}
                    <div key={pl.id} className={classes.innerContainer}>
                      <PlannedInvoiceItem
                        disableActions={
                          fullDisable &&
                          !pl.is_last_invoice_before_scheduled_stop
                        }
                        disableDateModification={
                          !!props.subscription.month_billing_day
                        }
                        hasEditInvoiceDateBPPermission={
                          props.hasEditInvoiceDateBPPermission
                        }
                        hasEditInvoicePriceBPPermission={
                          props.hasEditInvoicePriceBPPermission
                        }
                        hasEndAfterInvoiceBPPermission={
                          props.hasEndAfterInvoiceBPPermission
                        }
                        onClickInvoice={
                          hasReadInvoicePermission && props.onClickInvoice
                        }
                        onRequestDateChange={setPlannedInvoiceToUpdateDate}
                        onRequestPriceChange={setPlannedInvoiceToUpdatePrice}
                        onRequestScheduledStop={props.onRequestScheduledStop}
                        plannedInvoice={pl}
                      />
                      {pl.is_last_invoice_before_scheduled_stop && (
                        <StopItem
                          unscheduleStop={() =>
                            props.unflagPlannedInvoiceAsLast(pl.id)
                          }
                        />
                      )}
                    </div>
                  </React.Fragment>
                );
              },
            )}
          </>
        )}
      </ObjectLevelPermissionProvider>
      {pausesWithoutRelatedPlannedInvoicesBeforeEnd.length > 0 &&
        pausesWithoutRelatedPlannedInvoicesBeforeEnd.map((pause) => (
          <PauseDetailListItem
            key={pause.id}
            dateEndIsPast={
              DateTime.fromISO(pause.until_date).diffNow('days').days < 0
            }
            dateStartIsPast={
              DateTime.fromISO(pause.from_date).diffNow('days').days < 0
            }
            deletePause={props.cancelPause}
            pause={pause}
            updateEventList={props.updateEventList}
            updatePause={() => setPauseToUpdate(pause)}
          />
        ))}
      <EndItem
        subscription={props.subscription}
        toogleAutoRenew={props.toogleAutoRenew}
      />
      {pausesWithoutRelatedPlannedInvoicesAfterEnd.length > 0 && (
        <>
          <div className={classes.endLine} />
          {pausesWithoutRelatedPlannedInvoicesAfterEnd.map((pause) => (
            <PauseDetailListItem
              key={pause.id}
              dateEndIsPast={
                DateTime.fromISO(pause.until_date).diffNow('days').days < 0
              }
              dateStartIsPast={
                DateTime.fromISO(pause.from_date).diffNow('days').days < 0
              }
              deletePause={props.cancelPause}
              isLastPauseAfterEndItem={
                pausesWithoutRelatedPlannedInvoicesAfterEnd.indexOf(pause) ===
                pausesWithoutRelatedPlannedInvoicesAfterEnd.length - 1
              }
              pause={pause}
              updateEventList={props.updateEventList}
              updatePause={() => setPauseToUpdate(pause)}
            />
          ))}
        </>
      )}
      {!!plannedInvoiceToUpdatePrice && (
        <PlannedInvoicePriceUpdater
          onCancel={() => setPlannedInvoiceToUpdatePrice(null)}
          onSubmit={(
            data: {
              planned_invoice: number;
              price: number;
              update_all: boolean;
              update_recurrent_price: boolean;
            },
            options?: OptionCallback,
          ) => {
            props.requestUpdatePrice(data, {
              onSuccess: (args: any) => {
                if (options && options.onSuccess) options.onSuccess(args);
                setPlannedInvoiceToUpdatePrice(null);
              },
              onError: options && options.onError,
            });
          }}
          open={!!plannedInvoiceToUpdatePrice}
          plannedInvoice={plannedInvoiceToUpdatePrice}
          plannedInvoiceUpdateLoading={props.plannedInvoiceUpdateLoading}
          subscription={props.subscription}
        />
      )}
      {!!plannedInvoiceToUpdateDate && (
        <PlannedInvoiceDateUpdater
          onClose={() => setPlannedInvoiceToUpdateDate(null)}
          onSubmit={(
            data: {
              date: string;
              planned_invoice: number;
            },
            options: OptionCallback,
          ) => props.updateDate(data, options)}
          plannedInvoice={plannedInvoiceToUpdateDate}
        />
      )}
      {!!pauseToUpdate && (
        <PauseFormDialog
          closeDialog={() => setPauseToUpdate(null)}
          onSubmit={props.updatePause}
          openForm={!!pauseToUpdate}
          pauseBeingEdited={pauseToUpdate}
          subscription={props.subscription}
          updateEventList={props.updateEventList}
        />
      )}
    </div>
  );
};

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

export default React.memo(PlannedInvoiceListDetail);
