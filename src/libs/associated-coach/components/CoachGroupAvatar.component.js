// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Skeleton from '@material-ui/lab/Skeleton';
import CoachChip from './CoachChip.component';
import Tooltip from '../../../components/Tooltip.component';

type Props = {
  hideCoach: Boolean,
  coaches: ?Array<Coach>,
  size?: string,
  loading: boolean,
};
export const CoachGroupAvatar = (props: Props) => {
  const classes = useStyles();
  const coaches = props.coaches.filter((c) => !!c);
  if (coaches.length === 1 && !props.hideCoach) {
    return (
      <div>
        {coaches.map((c) => (
          <CoachChip key={c.id} coach={c} loading={props.loading} />
        ))}
      </div>
    );
  }

  if (coaches.length > 1 && !props.hideCoach) {
    return (
      <AvatarGroup>
        {coaches.map((c) => (
          <Tooltip key={c.id} title={c.name}>
            {props.loading ? (
              <Skeleton
                animation="wave"
                variant="circle"
                className={classes.smallAvatar}
              />
            ) : (
              <Avatar
                className={props.size === 'small' ? classes.smallAvatar : null}
                alt={c.name}
                src={c.photo}
              />
            )}
          </Tooltip>
        ))}
      </AvatarGroup>
    );
  }
  return null;
};

const useStyles = makeStyles(() => ({
  smallAvatar: {
    height: 26,
    width: 26,
  },
}));

export default CoachGroupAvatar;
