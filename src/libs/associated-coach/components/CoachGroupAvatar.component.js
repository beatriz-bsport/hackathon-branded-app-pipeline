// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CoachChip from './CoachChip.component';
import Tooltip from '../../../components/Tooltip.component';

type Props = {
  t: TFunction,
};
export const CoachGroupAvatar = (props: Props) => {
  const classes = useStyles();
  const coaches = props.coaches.filter((c) => !!c);
  if (coaches.length === 1) {
    return (
      <div>
        {coaches.map((c) => (
          <CoachChip key={c.id} coach={c} />
        ))}
      </div>
    );
  }
  if (coaches.length > 1) {
    return (
      <AvatarGroup>
        {coaches.map((c) => (
          <Tooltip key={c.id} title={c.name}>
            <Avatar
              className={props.size === 'small' ? classes.smallAvatar : null}
              alt={c.name}
              src={c.photo}
            />
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

export default compose(withTranslation())(CoachGroupAvatar);
