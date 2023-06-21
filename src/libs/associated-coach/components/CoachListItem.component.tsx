import React from 'react';

import Immutable from 'seamless-immutable';

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
import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';

import type { Theme } from '@material-ui/core/styles';

import type { Coach } from '../types';
import ListItemResponsiveAction, {
  ActionOption,
} from '#components/button/ListItemResponsiveAction.component';

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

type PropsSkeleton = {
  numberItems: number;
};

const openPhone = (event: React.MouseEvent, phoneNumber: string) => {
  event.stopPropagation();
  window.location.href = 'tel:'.concat(phoneNumber);
};

const openEmail = (event: React.MouseEvent, email: string) => {
  event.stopPropagation();
  window.location.href = 'mailto:'.concat(email);
};

export const CoachListSkeleton: React.FC<PropsSkeleton> = React.memo(
  ({ numberItems }) => {
    const classes = useStyles();
    return (
      <List dense disablePadding>
        {Array.from(Array(numberItems).keys()).map((key) => (
          <ListItem key={key}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <ListItemText
              id="button_teacher"
              primary={
                <Typography component="span" variant="subtitle1">
                  <Skeleton className={classes.nameSkeleton} />
                </Typography>
              }
              secondary={
                <Typography component="span" variant="subtitle1">
                  <Skeleton className={classes.chipSkeleton} />
                </Typography>
              }
            />
            <Skeleton
              animation="wave"
              variant="rect"
              className={classes.leftActionButtonSkeleton}
            />
            <Skeleton
              animation="wave"
              variant="rect"
              className={classes.rightActionButtonSkeleton}
            />
          </ListItem>
        ))}
      </List>
    );
  },
);

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

  const handleOpenEmail = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      openEmail(event, coach.email);
    },
    [coach.email],
  );

  const handleOpenPhone = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      openPhone(event, coach.phone);
    },
    [coach.phone],
  );

  const handleClick = React.useCallback(() => {
    restoreCoach(coach.id);
  }, [restoreCoach, coach.id]);

  const actionsList = React.useMemo(
    () =>
      Immutable([
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
          onClick: handleClick,
        },
      ]),
    [coach.disabled, handleClick, deleteCoach, onEditCoach, t],
  ) as Immutable.ImmutableArray<ActionOption>;

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
                onClick={handleOpenEmail}
                clickable
                variant="outlined"
              />
            ) : null}

            {coach.phone || null ? (
              <Chip
                icon={<CallIcon />}
                label={coach.phone}
                className={classes.chip}
                onClick={handleOpenPhone}
                clickable
                variant="outlined"
              />
            ) : null}
          </React.Fragment>
        }
      />
      <ListItemResponsiveAction actions={actionsList} />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
  leftActionButtonSkeleton: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  rightActionButtonSkeleton: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  nameSkeleton: { width: theme.spacing(15) },
  chipSkeleton: { width: theme.spacing(8) },
  chip: {
    marginRight: theme.spacing(1),
    maxWidth: '100%',
  },
}));

export default React.memo(CoachListItem);
