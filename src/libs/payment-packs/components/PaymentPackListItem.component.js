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
import { withTranslation } from 'react-i18next';
import NotificationsIcon from '@material-ui/icons/Notifications';
import withStyles from '@material-ui/core/styles/withStyles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import type { TFunction } from 'react-i18next';
import Tooltip from '../../../components/Tooltip.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

import { getValidityInfo } from '../utils';

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
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(
  withTranslation(['paymentPack'])((props: Props) => {
    if (!props.pack) {
      return (
        <ListItem divider={props.divider}>
          <CircularProgress />
        </ListItem>
      );
    }
    const dateInfo = getValidityInfo(props.pack, props.t);
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
              ? props.t('specifications.nbCredits', {
                  credits: props.pack.credits,
                })
              : props.t('specifications.unlimitedCredits')
          } - ${props.t('specifications.price', {
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
                    {props.t('notificationToolTip')}
                  </Typography>
                }
                aria-label="info"
              >
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            <ListItemResponsiveAction
              actions={[
                props.onEdit && {
                  icon: EditIcon,
                  label: props.t('actions.edit'),
                  color: 'primary',
                  onClick: () => {
                    props.onEdit();
                  },
                },
                props.onDelete && {
                  icon: DeleteIcon,
                  label: props.t('actions.delete'),
                  onClick: () => {
                    props.onDelete();
                  },
                },
              ]}
            />
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
        {props.goToPack ? (
          <ListItemSecondaryAction>
            <IconButton onClick={props.onClick}>
              <VisibilityIcon color="primary" />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    );
  }),
);
