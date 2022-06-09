// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import { compose } from 'recompose';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation, WithTranslation } from 'react-i18next';
import SPORTS from '@bsport/common/lib/master-data/sports';

import { DraggableSyntheticListeners } from '@dnd-kit/core';
import { createStyles, Theme } from '@material-ui/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { MetaActivity } from '../types';
import { formatAsDatetime } from '../../../utils/datetime';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import Tooltip from '../../../components/Tooltip.component';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  metaActivity: MetaActivity;
  item: MetaActivity;
  divider?: boolean;
  dense?: boolean;
  goToEdit?: (metaActivityId: number) => void;
  onClick?: (metaActivityId?: number) => void;
  onEdit?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRestore?: () => void;
  selected?: boolean;

  onClickCopy?: (id: number, suffix: string) => void;

  deleteMetaActivity: () => void;
  restoreMetaActivity?: () => void;

  draggable?: boolean;
  listeners?: DraggableSyntheticListeners;
  attributes?: {
    role: string;
    tabIndex: number;
    'aria-pressed': boolean;
    'aria-roledescription': string;
    'aria-describedby': string;
  };
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const MetaActivityListItem = (props: Props) => {
  const { t } = props;
  const metaActivity = props.metaActivity ? props.metaActivity : props.item;

  let onEdit;
  if (props.goToEdit) {
    onEdit = () => props.goToEdit(metaActivity.id);
  } else if (props.onEdit) {
    onEdit = () => props.onEdit(metaActivity.id);
  } else {
    onEdit = undefined;
  }

  let onDelete;
  if (props.deleteMetaActivity) {
    onDelete = () => props.deleteMetaActivity();
  } else if (props.onDelete) {
    onDelete = () => props.onDelete(metaActivity.id);
  } else {
    onDelete = undefined;
  }

  let onDuplicate;
  if (props.onClickCopy) {
    onDuplicate = () =>
      props.onClickCopy(metaActivity.id, t('common.copySuffix'));
  } else if (props.onDuplicate) {
    onDuplicate = () => props.onDuplicate(metaActivity.id);
  } else {
    onDuplicate = undefined;
  }

  const onClick = props.onClick
    ? () => props.onClick(metaActivity.id)
    : undefined;

  const { next_slot } = metaActivity;
  return (
    <ListItem
      button={!!onClick}
      divider={props.divider}
      alignItems="center"
      dense={props.dense}
      onClick={onClick}
      style={{
        borderLeft: metaActivity.color !== '' ? '5px solid' : '0px',
        borderLeftColor: metaActivity.color,
      }}
    >
      {props.draggable && (
        <IconButton {...props.listeners} {...props.attributes}>
          <DragHandleIcon />
        </IconButton>
      )}
      <Hidden xsDown>
        <ListItemAvatar>
          <Avatar
            alt=""
            className={props.classes.avatar}
            src={
              metaActivity.cover_main
                ? metaActivity.cover_main
                : (getSportWithIcon(metaActivity.parent_category) || {}).icon
            }
          />
        </ListItemAvatar>
      </Hidden>
      <ListItemText
        primary={
          <Typography component="span" variant="subtitle1">
            {metaActivity.name}
          </Typography>
        }
        secondary={
          next_slot
            ? `${t('activity.nextSlotAt')} ${formatAsDatetime(
                metaActivity.next_slot,
              )}`
            : t('activity.noNextSlot')
        }
      />
      {metaActivity.hasActiveNotification && (
        <Tooltip
          classes={props.classes}
          title={
            <Typography variant="subtitle2">
              {t('metaActivityNotificationToolTip')}
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
          metaActivity.customer_enabled &&
            onDuplicate && {
              icon: FileCopyIcon,
              label: t('common.duplicate'),
              color: 'primary',
              onClick: onDuplicate,
            },
          metaActivity.customer_enabled &&
            onEdit && {
              icon: EditIcon,
              label: t('common.edit'),
              color: 'primary',
              onClick: onEdit,
            },
          metaActivity.customer_enabled &&
            onDelete && {
              icon: DeleteIcon,
              label: t('common.delete'),
              onClick: onDelete,
            },
          !metaActivity.customer_enabled &&
            !!props.restoreMetaActivity && {
              icon: RestoreFromTrashIcon,
              label: t('common.restore'),
              onClick: props.restoreMetaActivity,
            },
        ]}
      />
    </ListItem>
  );
};

const getSportWithIcon = (parentCategory: number) =>
  SPORTS.find((s) => s.id === parentCategory);

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: theme.spacing(2),
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation([]),
)(MetaActivityListItem);
