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
import { withTranslation, WithTranslation } from 'react-i18next';
import NotificationsIcon from '@material-ui/icons/Notifications';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import EventIcon from '@material-ui/icons/Event';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Theme } from '@material-ui/core/styles';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import StyleIcon from '@material-ui/icons/Style';
import Tooltip from '../../../components/Tooltip.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { getValidityInfo } from '../utils';

import type { PaymentPack } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  pack: PaymentPack;
  divider?: boolean;
  disabled?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hidePacksNumber?: boolean;
  selected?: boolean;
  showDuration?: boolean;
  onBook?: () => void;
  onBookOne?: () => void;
  onBookMultiple?: () => void;
  goToPack?: () => void;
  onRestore?: () => void;
  draggable?: boolean;
  listeners?: DraggableSyntheticListeners;
  attributes?: any;
  isExcludingTax?: boolean;
};

type Props = WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  OwnProps;

const styles = (theme: Theme) => ({
  bookButton: {
    marginRight: theme.spacing(1),
  },
});

export class PaymentPackListItem extends React.PureComponent<Props> {
  render() {
    if (!this.props.pack) {
      return (
        <ListItem divider={this.props.divider}>
          <CircularProgress />
        </ListItem>
      );
    }
    const dateInfo = getValidityInfo(this.props.pack, this.props.t);

    return (
      <ListItem
        button={!!this.props.onClick}
        onClick={this.props.onClick}
        divider={this.props.divider}
        selected={this.props.selected}
      >
        {this.props.draggable ? (
          <IconButton {...this.props.listeners} {...this.props.attributes}>
            <DragHandleIcon />
          </IconButton>
        ) : null}
        <ListItemText
          primary={
            <span>
              <Typography component="span">{this.props.pack.name}</Typography>
              {this.props.hidePacksNumber ? null : (
                <Typography variant="caption" component="span" color="primary">
                  {` (${this.props.pack.nb_consumer_payment_packs})`}
                </Typography>
              )}
            </span>
          }
          secondary={`${
            !this.props.pack.unlimited
              ? this.props.t('specifications.nbCredits', {
                  count: this.props.pack.credits,
                  credits: this.props.pack.credits,
                })
              : this.props.t('specifications.unlimitedCredits')
          } - ${getCurrencyDisplayWithPrice(
            this.props.pack.price,
            this.props.isExcludingTax,
            this.props.pack.tax,
          )}${this.props.showDuration ? ` - ${dateInfo}` : ''}`}
          style={{ marginLeft: this.props.draggable ? '1%' : 0 }}
        />

        {this.props.pack.manager_only && !this.props.disabled ? (
          <Tooltip title={this.props.t('form.paymentPack.managerOnly')}>
            <IconButton onClick={null}>
              <VisibilityOffIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {!!this.props.pack.linked_private_pass && (
          <Tooltip title={this.props.t('form.paymentPack.universalPass.label')}>
            <IconButton onClick={null}>
              <StyleIcon color="inherit" />
            </IconButton>
          </Tooltip>
        )}
        {!this.props.disabled &&
        this.props.onEdit &&
        this.props.onDelete &&
        !this.props.pack.template_instance ? (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {this.props.pack.hasActiveNotification && (
              <Tooltip
                classes={this.props.classes}
                title={
                  <Typography variant="subtitle2">
                    {this.props.t('notificationToolTip')}
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
                this.props.onEdit && {
                  icon: EditIcon,
                  label: this.props.t('actions.edit'),
                  color: 'primary',
                  onClick: () => {
                    this.props.onEdit();
                  },
                },
                this.props.onDelete &&
                  !this.props.pack.template_instance && {
                    icon: DeleteIcon,
                    label: this.props.t('actions.delete'),
                    onClick: () => {
                      this.props.onDelete();
                    },
                  },
              ]}
            />
          </div>
        ) : null}

        {!this.props.disabled &&
        this.props.onDelete &&
        !this.props.pack.template_instance &&
        !this.props.onEdit ? (
          <ListItemResponsiveAction
            actions={[
              {
                icon: DeleteIcon,
                label: this.props.t('actions.delete'),
                onClick: () => {
                  this.props.onDelete();
                },
              },
            ]}
          />
        ) : null}

        {(!this.props.onDelete || !!this.props.pack.template_instance) &&
        this.props.onEdit ? (
          <ListItemResponsiveAction
            actions={[
              this.props.onEdit && {
                icon: EditIcon,
                label: this.props.t('actions.edit'),
                color: 'primary',
                onClick: () => {
                  this.props.onEdit();
                },
              },
            ]}
          />
        ) : null}

        {!this.props.disabled && this.props.onBook ? (
          <ListItemSecondaryAction>
            <Button
              className={this.props.classes.bookButton}
              variant="contained"
              color="primary"
              onClick={this.props.onBook}
            >
              <AddShoppingCartIcon />
            </Button>
          </ListItemSecondaryAction>
        ) : null}

        {!this.props.disabled && this.props.onBookOne ? (
          <Button
            className={this.props.classes.bookButton}
            variant="outlined"
            color="primary"
            onClick={this.props.onBookOne}
          >
            <EventIcon />
          </Button>
        ) : null}
        {!this.props.disabled && this.props.onBookMultiple ? (
          <Tooltip title={this.props.t('multipleBookingTooltip')}>
            <Button
              className={this.props.classes.bookButton}
              variant="outlined"
              color="secondary"
              onClick={this.props.onBookMultiple}
            >
              <DateRangeIcon />
            </Button>
          </Tooltip>
        ) : null}
        {this.props.goToPack ? (
          <ListItemSecondaryAction>
            <IconButton onClick={this.props.onClick}>
              <VisibilityIcon color="primary" />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
        {this.props.disabled && this.props.onRestore ? (
          <ListItemSecondaryAction>
            <IconButton color="secondary" onClick={this.props.onRestore}>
              <RestoreFromTrashIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    );
  }
}

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['paymentPack']),
)(PaymentPackListItem);
