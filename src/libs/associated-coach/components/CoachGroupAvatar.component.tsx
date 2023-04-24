// @ts-nocheck
import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import CoachChip from './CoachChip.component';
import Tooltip from '#components/Tooltip.component';
import type { Coach } from '../types';

type Props = {
  hideCoach: Boolean;
  coaches?: Array<Coach>;
  size?: string;
  loading: boolean;
};
export const CoachGroupAvatar: React.FC<Props> = ({
  hideCoach,
  coaches,
  size,
  loading,
}) => {
  const classes = useStyles();
  const currentCoaches = coaches.filter((c) => !!c);
  if (currentCoaches.length === 1 && !hideCoach) {
    return (
      <div>
        {currentCoaches.map((c) => (
          <CoachChip key={c.id} coach={c} loading={loading} />
        ))}
      </div>
    );
  }

  return (
    currentCoaches.length > 1 &&
    !hideCoach && (
      <AvatarGroup>
        {currentCoaches.map((c) => (
          <Tooltip key={c.id} title={c.name}>
            {loading ? (
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.smallAvatar}
              />
            ) : (
              <Avatar
                className={size === 'small' ? classes.smallAvatar : null}
                alt={c.name}
                src={c.photo}
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
