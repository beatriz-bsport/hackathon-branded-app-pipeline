import React from 'react';
import { colors } from '@bsport/common/lib/colors';

import { useTranslation } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Tooltip from '#components/Tooltip.component';
import type { Coach } from '../types';

type Props = {
  coach?: Coach;
  coach_override?: Coach;
};

export const CoachAvatar: React.FC<Props> = ({ coach, coach_override }) => {
  const classes = useStyles();

  const { t } = useTranslation('translation');

  let tooltipText = coach_override
    ? `${t('marketplace.substitute')} ${
        coach_override ? coach_override.name : ''
      }`
    : '';
  if (!tooltipText) {
    tooltipText = coach ? coach.name : '';
  }

  return (
    <Tooltip title={tooltipText}>
      <Avatar
        className={coach_override && classes.avatarSubstitute}
        src={
          (coach_override && coach_override.photo) ||
          (coach ? coach.photo : null)
        }
      />
    </Tooltip>
  );
};

const useStyles = makeStyles(() => ({
  avatarSubstitute: {
    border: '2px solid black',
    borderColor: colors.primary,
  },
}));

export default CoachAvatar;
