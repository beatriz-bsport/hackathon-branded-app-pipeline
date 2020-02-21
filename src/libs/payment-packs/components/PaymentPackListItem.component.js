// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import type { TFunction } from 'react-i18next';

import { formatAsDate } from '../../../datetime';

import type { PaymentPack } from '../types';

type Props = {
  pack: PaymentPack,
  divider: ?boolean,
  onClick: () => void,
  onEdit?: () => void,
  onDelete?: () => void,
  t: TFunction,
  hidePacksNumber: boolean,
  selected: boolean,
};

const styles = (theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    fontSize: 11,
  },
  bookButton: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(
  withNamespaces([])((props: Props) => {
    if (!props.pack) {
      return (
        <ListItem divider={props.divider}>
          <CircularProgress />
        </ListItem>
      );
    }
    let dateInfo = '';
    const {
      validity_daterange,
      duration_days,
      duration_months,
      duration_years,
    } = props.pack;
    if (duration_days || duration_months || duration_years) {
      dateInfo = props.t('paymentPack.validForDuration')(
        duration_days,
        duration_months,
        duration_years,
      );
    }
    if (validity_daterange) {
      dateInfo = `${props.t('paymentPack.validity')} ${formatAsDate(
        moment(JSON.parse(validity_daterange).lower),
      )} - ${formatAsDate(moment(JSON.parse(validity_daterange).upper))}`;
    }
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
              ? props.t('paymentPack.specifications.nbCredits', {
                  credits: props.pack.credits,
                })
              : props.t('paymentPack.specifications.unlimitedCredits')
          } - ${props.t('paymentPack.specifications.price', {
            price: props.pack.price,
          })}${props.showDuration ? ` - ${dateInfo}` : ''}`}
        />
        {props.onEdit && props.onDelete ? (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {props.pack.notifications && props.pack.notifications.length > 0 ? (
              <Tooltip
                classes={props.classes}
                title={
                  <Typography variant="subtitle2">
                    {props.t('paymentPack.notificationToolTip')}
                  </Typography>
                }
                aria-label="info"
              >
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onEdit();
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : null}
        {props.onDelete && !props.onEdit ? (
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
        {props.onBook ? (
          <ListItemSecondaryAction>
            <Button
              className={props.classes.bookButton}
              variant="contained"
              color="primary"
              onClick={props.onBook}
            >
              <AddShoppingCartIcon />
            </Button>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    );
  }),
);
