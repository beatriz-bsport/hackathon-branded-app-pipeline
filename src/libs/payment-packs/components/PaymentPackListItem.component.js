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

import type { TFunction } from 'react-i18next';
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
            props.pack.credits
              ? props.t('paymentPack.specifications.nbCredits', {
                  credits: props.pack.credits,
                })
              : props.t('paymentPack.specifications.unlimitedCredits')
          } - ${props.t('paymentPack.specifications.price', {
            price: props.pack.price,
          })}`}
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
      </ListItem>
    );
  }),
);
