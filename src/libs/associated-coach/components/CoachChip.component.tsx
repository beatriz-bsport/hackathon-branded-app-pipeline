import React from 'react';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import Badge from '@material-ui/core/Badge';
import Archive from '@material-ui/icons/Archive';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';

import { Coach } from '../types';

type Props = {
  loading: boolean;
  onDelete?: () => void;
  coach: Coach;
  showDisabledIcon?: boolean;
};

export const CoachChip: React.FC<Props> = ({
  loading,
  onDelete,
  coach,
  showDisabledIcon,
}) => {
  const classes = useStyles();

  return (
    <Chip
      avatar={
        loading ? (
          <Skeleton animation="wave" variant="circle" />
        ) : (
          <Badge
            badgeContent={<Archive className={classes.badge} />}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            overlap="circular"
            invisible={!showDisabledIcon || !coach.disabled}
          >
            <Avatar
              alt={coach.name}
              src={coach.photo}
              classes={{ root: classes.avatar }}
            />
          </Badge>
        )
      }
      label={
        loading ? <Skeleton animation="wave" variant="text" /> : coach.name
      }
      onDelete={onDelete}
      variant="outlined"
      className={classnames(classes.background, {
        [classes.disabled]: showDisabledIcon && coach.disabled,
      })}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: 'white',
  },
  disabled: {
    color: theme.palette.grey.A200,
  },
  badge: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    transform: 'translateY(-10%)',
  },
  avatar: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
}));

export default CoachChip;
