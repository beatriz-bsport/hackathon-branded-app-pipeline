import React from 'react';

import { useTranslation } from 'react-i18next';

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
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import type { Coach } from '../types';
import ListItemResponsiveAction from '#components/button/ListItemResponsiveAction.component';

import { DEFAULT_AVATAR } from '../utils';

type Props = {
  coach: Coach;
  onCoachSelected?: () => void;
  deleteCoach?: () => void;
  restoreCoach?: (id: number) => void;
  divider?: boolean;
  onEditCoach?: () => void;
  selected?: boolean;
};

const openPhone = (event: React.MouseEvent, phoneNumber: string) => {
  event.stopPropagation();
  window.location.href = 'tel:'.concat(phoneNumber);
};

const openEmail = (event: React.MouseEvent, email: string) => {
  event.stopPropagation();
  window.location.href = 'mailto:'.concat(email);
};

export const CoachListItem: React.FC<Props> = ({
  coach,
  onCoachSelected,
  deleteCoach,
  restoreCoach,
  divider,
  onEditCoach,
  selected,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('translation');

  return (
    <ListItem
      key={coach.id}
      id="button_teacher"
      button
      divider={divider}
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
          !coach.disabled &&
            onEditCoach && {
              icon: EditIcon,
              label: t('common.edit'),
              color: 'primary',
              onClick: onEditCoach,
            },
          !coach.disabled &&
            deleteCoach && {
              icon: DeleteIcon,
              label: t('common.delete'),
              onClick: deleteCoach,
            },
          coach.disabled && {
            icon: RestoreFromTrashIcon,
            label: t('common.restore'),
            onClick: () => restoreCoach(coach.id),
          },
        ]}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
  chip: {
    marginRight: theme.spacing(1),
  },
}));

export default CoachListItem;
