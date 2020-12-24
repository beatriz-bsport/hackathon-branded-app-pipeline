// @flow
import { withTranslation } from 'react-i18next';

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Chip from '@material-ui/core/Chip';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EditIcon from '@material-ui/icons/Edit';
import CallIcon from '@material-ui/icons/Call';
import type { CoachDetailed as Coach } from '../../../api/types';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

import { DEFAULT_AVATAR } from '../utils.ts';

type Props = {
  t: TFunction,
  coach: Coach,
  onCoachSelected: () => void,
  deleteCoach: () => void,
  restoreCoach?: (id: number) => void,
  divider: ?boolean,
  classes: Object,
  onEditCoach: () => void,
  selected?: boolean,
};

const openPhone = (event, phoneNumber: string) => {
  event.stopPropagation();
  window.location.href = 'tel:'.concat(phoneNumber);
};
const openEmail = (event, email: string) => {
  event.stopPropagation();
  window.location.href = 'mailto:'.concat(email);
};

export function CoachListItem(props: Props) {
  const { coach, classes, onCoachSelected, t, selected } = props;
  return (
    <ListItem
      key={coach.id}
      id="button_teacher"
      button
      divider={props.divider}
      onClick={onCoachSelected}
      selected={selected}
    >
      <ListItemAvatar>
        <Avatar
          className={classes.avatar}
          src={coach.photo || DEFAULT_AVATAR}
        />
      </ListItemAvatar>
      <ListItemText
        id="button_teacher"
        primary={
          <Typography component="span" variant="subtitle1">
            {coach.name}
          </Typography>
        }
        secondary={
          <React.Fragment>
            {coach.email || null ? (
              <Chip
                icon={<MailOutlineIcon />}
                label={coach.email}
                className={classes.chip}
                onClick={(e) => openEmail(e, coach.email)}
                clickable
                variant="outlined"
              />
            ) : null}

            {coach.phone || null ? (
              <Chip
                icon={<CallIcon />}
                label={coach.phone}
                className={classes.chip}
                onClick={(e) => {
                  openPhone(e, coach.phone);
                }}
                clickable
                variant="outlined"
              />
            ) : null}
          </React.Fragment>
        }
      />
      <ListItemResponsiveAction
        actions={[
          !props.coach.disabled &&
            props.onEditCoach && {
              icon: EditIcon,
              label: t('common.edit'),
              color: 'primary',
              onClick: props.onEditCoach,
            },
          !props.coach.disabled &&
            props.deleteCoach && {
              icon: DeleteIcon,
              label: t('common.delete'),
              onClick: props.deleteCoach,
            },
          props.coach.disabled && {
            icon: RestoreFromTrashIcon,
            label: t('common.restore'),
            onClick: () => props.restoreCoach(),
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
  chip: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(withTranslation()(CoachListItem));
