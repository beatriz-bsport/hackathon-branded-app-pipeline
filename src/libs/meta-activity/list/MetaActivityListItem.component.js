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
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { MetaActivity } from '../../../api/types';
import { formatAsDatetime } from '../../../datetime';

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
  t: TFunction,
  divider: ?boolean,
};

export function MetaActivityListItem(props: Props) {
  const { classes, metaActivity, t } = props;
  const { next_slot } = metaActivity;
  return (
    <Link
      to={`/activity/${metaActivity.id}`}
      style={{ textDecoration: 'none' }}
    >
      <ListItem button divider={props.divider} alignItems="center">
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
          <Link
            to={`/activity/${metaActivity.id}/edit`}
            style={{ textDecoration: 'none' }}
          >
            <IconButton aria-label={t('common.edit')} color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  );
}

const styles = (theme) => ({
  avatar: {
    width: theme.spacing.unit * 7,
    height: theme.spacing.unit * 7,
  },
});

export default withStyles(styles)(withNamespaces([])(MetaActivityListItem));
