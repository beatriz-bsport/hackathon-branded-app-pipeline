// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import { compose } from 'recompose';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { MetaActivity } from '../../../api/types';
import { formatAsDatetime } from '../../../datetime';
import { getSportWithIcon } from '../../../components/category/utils';

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
  t: TFunction,
  divider: ?boolean,
  clearIcon?: boolean,
  goToEdit: (metaActivityId: number) => void,
  onClick: (MetaActivity) => void,

  deleteMetaActivity: () => void,
};

export function MetaActivityListItem(props: Props) {
  const { classes, metaActivity, onClick, goToEdit, t } = props;
  const { next_slot } = metaActivity;
  return (
    <ListItem
      button={onClick}
      divider={props.divider}
      alignItems="center"
      onClick={onClick ? () => onClick(metaActivity) : null}
      style={{
        borderLeft: metaActivity.color !== '' ? '5px solid' : '0px',
        borderLeftColor: metaActivity.color,
      }}
    >
      {metaActivity.cover_thumbnail ? (
        <ListItemAvatar>
          <Avatar
            className={classes.avatar}
            alt=""
            src={metaActivity.cover_thumbnail}
          />
        </ListItemAvatar>
      ) : (
        <ListItemIcon>
          <img
            className={classes.avatar}
            alt=""
            src={(getSportWithIcon(metaActivity.parent_category) || {}).icon}
          />
        </ListItemIcon>
      )}
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
        {props.goToEdit ? (
          <IconButton
            aria-label={t('common.edit')}
            color="primary"
            onClick={() => goToEdit(metaActivity.id)}
          >
            <EditIcon />
          </IconButton>
        ) : null}
        {props.deleteMetaActivity ? (
          <IconButton color="secondary" onClick={props.deleteMetaActivity}>
            {props.clearIcon ? <ClearIcon /> : <DeleteIcon />}
          </IconButton>
        ) : null}
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

export default compose(
  withStyles(styles),
  withNamespaces([]),
)(MetaActivityListItem);
