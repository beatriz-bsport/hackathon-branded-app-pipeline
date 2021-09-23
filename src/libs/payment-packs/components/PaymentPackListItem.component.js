// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles } from '@material-ui/core/styles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import EventIcon from '@material-ui/icons/Event';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import Tooltip from '../../../components/Tooltip.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { getValidityInfo } from '../utils';

import type { PaymentPack } from '../types';

type Props = {
  pack: PaymentPack,
  divider: ?boolean,
  disabled?: boolean,
  onClick: () => void,
  onEdit?: () => void,
  onDelete?: () => void,
  hidePacksNumber: boolean,
  selected: boolean,
  showDuration?: boolean,
  onBook?: () => void,
  onBookOne?: () => void,
  onBookMultiple?: () => void,
  goToPack?: () => void,
  onRestore?: () => void,
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    fontSize: 11,
  },
  bookButton: {
    marginRight: theme.spacing(1),
  },
}));

export const PaymentPackListItem = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  if (!props.pack) {
    return (
      <ListItem divider={props.divider}>
        <CircularProgress />
      </ListItem>
    );
  }
  const dateInfo = getValidityInfo(props.pack, t);
  return (
    <ListItem
      button={!!props.onClick}
      onClick={props.onClick}
      divider={props.divider}
      selected={props.selected}
    >
      <ListItemText
        primary={
          <span>
            <Typography inline component="span">
              {props.pack.name}
            </Typography>
            {props.hidePacksNumber ? null : (
              <Typography
                inline
                variant="caption"
                component="span"
                color="primary"
              >
                {` (${props.pack.nb_consumer_payment_packs})`}
              </Typography>
            )}
          </span>
        }
        secondary={`${
          !props.pack.unlimited
            ? t('specifications.nbCredits', {
                credits: props.pack.credits,
              })
            : t('specifications.unlimitedCredits')
        } - ${getCurrencyDisplayWithPrice(props.pack.price)}${
          props.showDuration ? ` - ${dateInfo}` : ''
        }`}
      />
      {!props.disabled && props.onEdit && props.onDelete ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {props.pack.hasActiveNotification && (
            <Tooltip
              classes={classes}
              title={
                <Typography variant="subtitle2">
                  {t('notificationToolTip')}
                </Typography>
              }
              aria-label="info"
            >
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          )}
          <ListItemResponsiveAction
            actions={[
              props.onEdit && {
                icon: EditIcon,
                label: t('actions.edit'),
                color: 'primary',
                onClick: () => {
                  props.onEdit();
                },
              },
              props.onDelete && {
                icon: DeleteIcon,
                label: t('actions.delete'),
                onClick: () => {
                  props.onDelete();
                },
              },
            ]}
          />
        </div>
      ) : null}
      {!props.disabled && props.onDelete && !props.onEdit ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
      {!props.onDelete && props.onEdit ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onEdit}>
            <EditIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
      {!props.disabled && props.onBook ? (
        <ListItemSecondaryAction>
          <Button
            className={classes.bookButton}
            variant="contained"
            color="primary"
            onClick={props.onBook}
          >
            <AddShoppingCartIcon />
          </Button>
        </ListItemSecondaryAction>
      ) : null}
      {!props.disabled && props.onBookOne ? (
        <Button
          className={classes.bookButton}
          variant="outlined"
          color="primary"
          onClick={props.onBookOne}
        >
          <EventIcon />
        </Button>
      ) : null}
      {!props.disabled && props.onBookMultiple ? (
        <Tooltip title={t('multipleBookingTooltip')}>
          <Button
            className={classes.bookButton}
            variant="outlined"
            color="secondary"
            onClick={props.onBookMultiple}
          >
            <DateRangeIcon />
          </Button>
        </Tooltip>
      ) : null}
      {props.goToPack ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onClick}>
            <VisibilityIcon color="primary" />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
      {props.disabled && props.onRestore ? (
        <ListItemSecondaryAction>
          <IconButton color="secondary" onClick={props.onRestore}>
            <RestoreFromTrashIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default PaymentPackListItem;
