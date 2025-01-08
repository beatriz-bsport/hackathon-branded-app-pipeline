import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/master-data/coach.js';
import Tooltip from '#src/components/Tooltip.component';
import CoachChip from './CoachChip.component';
import type { Coach } from '../types';

type Props = {
  hideCoach: Boolean;
  coaches?: Array<Coach>;
  size?: string;
  loading: boolean;
  coachDisplay?: MarketPlaceCoachDisplay;
};
export const CoachGroupAvatar: React.FC<Props> = ({
  hideCoach,
  coaches,
  size,
  loading,
  coachDisplay,
}) => {
  const classes = useStyles();
  const currentCoaches = coaches.filter((coach) => !!coach);
  if (currentCoaches.length === 1 && !hideCoach) {
    return (
      <div>
        {currentCoaches.map((coach) => (
          <CoachChip
            key={coach.id}
            coach={coach}
            coachDisplay={coachDisplay}
            loading={loading}
          />
        ))}
      </div>
    );
  }

  return (
    currentCoaches.length > 1 &&
    !hideCoach && (
      <AvatarGroup>
        {currentCoaches.map((coach) => (
          <Tooltip
            key={coach.id}
            title={getCoachDisplayName(
              coachDisplay,
              coach?.name,
              coach?.firstname,
            )}
          >
            {loading ? (
              <Skeleton
                animation="wave"
                className={classes.smallAvatar}
                variant="circle"
              />
            ) : (
              <Avatar
                alt={getCoachDisplayName(
                  coachDisplay,
                  coach?.name,
                  coach?.firstname,
                )}
                className={size === 'small' ? classes.smallAvatar : null}
                src={coach.photo}
              />
            )}
          </Tooltip>
        ))}
      </AvatarGroup>
    )
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  smallAvatar: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
}));

export default CoachGroupAvatar;
