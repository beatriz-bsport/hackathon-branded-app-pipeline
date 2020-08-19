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
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { MetaActivity } from '../../../api/types';
import { formatAsDatetime } from '../../../datetime';
import { getSportWithIcon } from '../../../components/category/utils';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import Tooltip from '../../../components/Tooltip.component';

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
  t: TFunction,
  classes: Object,
  divider: ?boolean,
  dense?: boolean,
  goToEdit: (metaActivityId: number) => void,
  onClick: (MetaActivity) => void,

  onClickCopy: (id: number, suffix: string) => void,

  deleteMetaActivity: () => void,
  restoreMetaActivity: () => void,
};

export function MetaActivityListItem(props: Props) {
  const { metaActivity, onClick, goToEdit, t } = props;
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
      {props.metaActivity.on_booking_notification &&
      props.metaActivity.on_booking_notification.filter((n) => !!n && n.active)
        .length > 0 ? (
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
      ) : null}
      <ListItemResponsiveAction
        actions={[
          props.metaActivity.customer_enabled &&
            props.onClickCopy && {
              icon: FileCopyIcon,
              label: t('common.duplicate'),
              color: 'primary',
              onClick: () =>
                props.onClickCopy(metaActivity.id, t('common.copySuffix')),
            },
          props.metaActivity.customer_enabled &&
            props.goToEdit && {
              icon: EditIcon,
              label: t('common.edit'),
              color: 'primary',
              onClick: () => goToEdit(metaActivity.id),
            },
          props.metaActivity.customer_enabled &&
            props.deleteMetaActivity && {
              icon: DeleteIcon,
              label: t('common.delete'),
              onClick: props.deleteMetaActivity,
            },
          !props.metaActivity.customer_enabled && {
            icon: RestoreFromTrashIcon,
            label: t('common.restore'),
            onClick: () => props.restoreMetaActivity(),
          },
        ]}
      />
    </ListItem>
  );
}

const styles = (theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation([]),
)(MetaActivityListItem);
