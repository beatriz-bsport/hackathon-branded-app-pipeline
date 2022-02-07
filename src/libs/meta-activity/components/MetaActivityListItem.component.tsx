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
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation, WithTranslation } from 'react-i18next';

import { DraggableSyntheticListeners } from '@dnd-kit/core';
import { createStyles, Theme } from '@material-ui/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import type { MetaActivity } from '../../../api/types';
import { formatAsDatetime } from '../../../utils/datetime';
import { getSportWithIcon } from '../../../components/category/utils';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import Tooltip from '../../../components/Tooltip.component';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  metaActivity: MetaActivity;
  item: MetaActivity;
  divider?: boolean;
  dense?: boolean;
  goToEdit: (metaActivityId: number) => void;
  onClick?: (metaActivity?: MetaActivity) => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  selected?: boolean;

  onClickCopy: (id: number, suffix: string) => void;

  deleteMetaActivity: () => void;
  restoreMetaActivity: () => void;

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
  const { onClick, t } = props;
  const metaActivity = props.metaActivity ? props.metaActivity : props.item;
  const onEdit = props.goToEdit
    ? () => props.goToEdit(props.metaActivity.id)
    : props.onEdit;

  const onDelete = props.deleteMetaActivity
    ? props.deleteMetaActivity
    : props.onDelete;

  const onDuplicate = props.onClickCopy
    ? () => props.onClickCopy(metaActivity.id, t('common.copySuffix'))
    : props.onDuplicate;

  const { next_slot } = metaActivity;
  return (
    <ListItem
      button={!!onClick}
      divider={props.divider}
      alignItems="center"
      dense={props.dense}
      onClick={onClick ? () => onClick(metaActivity) : null}
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
          !metaActivity.customer_enabled && {
            icon: RestoreFromTrashIcon,
            label: t('common.restore'),
            onClick: () => props.restoreMetaActivity(),
          },
        ]}
      />
    </ListItem>
  );
};

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
