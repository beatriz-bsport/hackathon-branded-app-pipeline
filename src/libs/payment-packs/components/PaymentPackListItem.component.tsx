// @ts-nocheck
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
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Theme } from '@material-ui/core/styles';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import StyleIcon from '@material-ui/icons/Style';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Tooltip from '../../../components/Tooltip.component';
import ConditionalWrapper from '#components/ConditionnalWrapper.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import {
  getCurrencyDisplayWithPrice,
  getCreditFactor,
} from '../../theme/selectors';

import { getValidityInfo } from '../utils';

import type { PaymentPack } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  pack: PaymentPack;
  dense?: boolean;
  divider?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hidePacksNumber?: boolean;
  selected?: boolean;
  showDuration?: boolean;
  onBook?: () => void;
  onBookOne?: () => void;
  onBookMultiple?: () => void;
  goToPack?: boolean;
  onRestore?: () => void;
  draggable?: boolean;
  listeners?: DraggableSyntheticListeners;
  attributes?: any;
  isExcludingTax?: boolean;
  isFlexContainerOnMobile?: boolean;
  creditScaleFactor: number;
  isPaperVariant?: boolean;
};

type Props = WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  OwnProps;

const styles = (theme: Theme) => ({
  actionsContainer: {
    display: 'flex',
  },
  actionsContainerFlexOnMobile: {
    [theme.breakpoints.down('xs')]: {
      alignSelf: 'flex-end',
      height: 36,
    },
  },
  container: {
    height: 100,
  },
  containerFlexOnMobile: {
    [theme.breakpoints.down('xs')]: {
      height: 140,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  bookButton: {
    marginRight: theme.spacing(1),
  },
});

export class PaymentPackListItem extends React.PureComponent<Props> {
  render() {
    if (!this.props.pack) {
      return (
        <ConditionalWrapper
          condition={this.props.isPaperVariant}
          WrapperComponent={Paper}
        >
          <ListItem divider={this.props.divider}>
            <CircularProgress />
          </ListItem>
        </ConditionalWrapper>
      );
    }
    const dateInfo = getValidityInfo(this.props.pack, this.props.t);

    return (
      <ConditionalWrapper
        condition={this.props.isPaperVariant}
        WrapperComponent={Paper}
      >
        <ListItem
          button={!!this.props.onClick}
          className={classNames({
            [this.props.classes.container]: !this.props.dense,
            [this.props.classes.containerFlexOnMobile]:
              this.props.isFlexContainerOnMobile,
          })}
          dense={this.props.dense}
          divider={this.props.divider}
          onClick={this.props.onClick}
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
                {this.props.hidePacksNumber ||
                this.props.pack.nb_consumer_payment_packs ===
                  undefined ? null : (
                  <Typography
                    color="primary"
                    component="span"
                    variant="caption"
                  >
                    {` (${this.props.pack.nb_consumer_payment_packs})`}
                  </Typography>
                )}
              </span>
            }
            secondary={`${
              !this.props.pack.unlimited
                ? this.props.t('specifications.nbCredits', {
                    count: this.props.pack.credits / getCreditFactor(),
                    credits: this.props.pack.credits / getCreditFactor(),
                  })
                : this.props.t('specifications.unlimitedCredits')
            } - ${getCurrencyDisplayWithPrice(
              this.props.pack.price,
              this.props.isExcludingTax,
              this.props.pack.tax,
            )}${this.props.showDuration ? ` - ${dateInfo}` : ''}`}
            style={{ marginLeft: this.props.draggable ? '1%' : 0 }}
          />

          <div
            className={classNames(this.props.classes.actionsContainer, {
              [this.props.classes.actionsContainerFlexOnMobile]:
                this.props.isFlexContainerOnMobile,
            })}
          >
            {!this.props.pack.is_usable_by_staff && !this.props.disabled ? (
              <Tooltip title={this.props.t('listItem.unusableByStaff')}>
                <IconButton onClick={null}>
                  <RemoveShoppingCartIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {this.props.pack.manager_only && !this.props.disabled ? (
              <Tooltip title={this.props.t('form.paymentPack.managerOnly')}>
                <IconButton onClick={null}>
                  <VisibilityOffIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {!!this.props.pack.linked_private_pass && (
              <Tooltip
                title={this.props.t('form.paymentPack.universalPass.label')}
              >
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
                    aria-label="info"
                    classes={this.props.classes}
                    title={
                      <Typography variant="subtitle2">
                        {this.props.t('notificationToolTip')}
                      </Typography>
                    }
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
                  color="primary"
                  onClick={this.props.onBook}
                  variant="contained"
                >
                  <AddShoppingCartIcon />
                </Button>
              </ListItemSecondaryAction>
            ) : null}

            {!this.props.disabled && this.props.onBookOne ? (
              <Button
                className={this.props.classes.bookButton}
                color="primary"
                onClick={this.props.onBookOne}
                variant="outlined"
              >
                <EventIcon />
              </Button>
            ) : null}
            {!this.props.disabled && this.props.onBookMultiple ? (
              <Tooltip title={this.props.t('multipleBookingTooltip')}>
                <Button
                  className={this.props.classes.bookButton}
                  color="secondary"
                  onClick={this.props.onBookMultiple}
                  variant="outlined"
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
          </div>
        </ListItem>
      </ConditionalWrapper>
    );
  }
}

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['paymentPack']),
)(PaymentPackListItem);
