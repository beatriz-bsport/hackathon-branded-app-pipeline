import React from 'react';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import Badge from '@material-ui/core/Badge';
import Archive from '@material-ui/icons/Archive';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach.js';
import { Coach } from '../types';

type Props = {
  loading: boolean;
  onDelete?: () => void;
  coach: Coach;
  showDisabledIcon?: boolean;
  coachDisplay?: MarketPlaceCoachDisplay;
};

export const CoachChip: React.FC<Props> = ({
  loading,
  onDelete,
  coach,
  showDisabledIcon,
  coachDisplay,
}) => {
  const classes = useStyles();

  const coachName = getCoachDisplayName(
    coachDisplay,
    coach?.name,
    coach?.firstname,
  );

  return (
    <Chip
      avatar={
        loading ? (
          <Skeleton animation="wave" variant="circle" />
        ) : (
          <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<Archive className={classes.badge} />}
            invisible={!showDisabledIcon || !coach.disabled}
            overlap="circular"
          >
            <Avatar
              alt={coachName}
              classes={{ root: classes.avatar }}
              src={coach.photo}
            />
          </Badge>
        )
      }
      className={clsx(classes.background, {
        [classes.disabled]: showDisabledIcon && coach.disabled,
      })}
      label={loading ? <Skeleton animation="wave" variant="text" /> : coachName}
      onDelete={onDelete}
      variant="outlined"
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
