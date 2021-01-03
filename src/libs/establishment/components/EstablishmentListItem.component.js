// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ClearIcon from '@material-ui/icons/Clear';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';

import { withTranslation, TFunction } from 'react-i18next';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import Tooltip from '../../../components/Tooltip.component';

import type { Establishment } from '../../../api/types';

type Props = {
  establishment: Establishment,
  onClickEdit: ?() => void,
  onClickDelete: ?() => void,
  onClick: ?() => void,
  divider: ?boolean,
  clearIcon: boolean,

  classes: Object,
  t: TFunction,
};

const styles = (theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
});

// ------------------ Main function ----------------------------------------
export default withTranslation(['establishment'])(
  withStyles(styles)((props: Props) => {
    const { classes, showCapacity, establishment, divider, onClick, t } = props;
    return (
      <ListItem
        divider={divider}
        button={!!onClick}
        onClick={onClick}
        alignItems="center"
        selected={props.selected}
      >
        <ListItemAvatar>
          <Avatar className={classes.avatar} alt="" src={establishment.cover} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="subtitle1">
              {establishment.title}
            </Typography>
          }
          secondary={
            showCapacity
              ? t('capacity.explain', {
                  count: establishment.capacity,
                  capacity: establishment.capacity,
                })
              : null
          }
        />
        {establishment.hasActiveNotification && (
          <Tooltip
            classes={props.classes}
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
            props.onClickEdit && {
              icon: EditIcon,
              label: t('forms.edit'),
              color: 'primary',
              onClick: props.onClickEdit,
            },
            props.onClickDelete && {
              icon: props.clearIcon ? ClearIcon : DeleteIcon,
              label: t('forms.delete.actions.confirm'),
              onClick: props.onClickDelete,
            },
            establishment.disabled &&
              props.onRestore && {
                icon: RestoreFromTrashIcon,
                label: t('actions.restore'),
                onClick: () => props.onRestore(),
              },
          ]}
        />
      </ListItem>
    );
  }),
);
