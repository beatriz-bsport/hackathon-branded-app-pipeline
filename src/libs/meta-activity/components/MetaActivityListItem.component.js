// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { MetaActivity } from '../../../api/types';
import { formatAsDatetime } from '../../../datetime';

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
  t: TFunction,
  divider: ?boolean,
  goToEdit: (metaActivityId: number) => void,
  goToDetail: (metaActivityId: number) => void,
};

export function MetaActivityListItem(props: Props) {
  const { classes, metaActivity, goToDetail, goToEdit, t } = props;
  const { next_slot } = metaActivity;
  return (
    <ListItem
      button
      divider={props.divider}
      alignItems="center"
      onClick={() => goToDetail(metaActivity.id)}
    >
      <ListItemAvatar>
        <Avatar
          className={classes.avatar}
          alt=""
          src={metaActivity.cover_main}
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
      <ListItemSecondaryAction>
        <IconButton
          aria-label={t('common.edit')}
          color="primary"
          onClick={() => goToEdit(metaActivity.id)}
        >
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const styles = (theme) => ({
  avatar: {
    width: theme.spacing.unit * 7,
    height: theme.spacing.unit * 7,
  },
});

export default withStyles(styles)(withNamespaces([])(MetaActivityListItem));
