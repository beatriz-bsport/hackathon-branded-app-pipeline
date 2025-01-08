import React from 'react';
import { colors } from '@bsport/common/colors.js';

import { useTranslation } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/master-data/coach.js';
import Tooltip from '#src/components/Tooltip.component';
import type { Coach } from '../types';

type Props = {
  coach?: Coach;
  coach_override?: Coach;
  coachDisplay?: MarketPlaceCoachDisplay;
};

export const CoachAvatar: React.FC<Props> = ({
  coach,
  coach_override,
  coachDisplay,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('translation');

  let tooltipText = coach_override
    ? `${t('marketplace.substitute')} ${
        coach_override
          ? getCoachDisplayName(
              coachDisplay,
              coach_override?.name,
              coach_override?.firstname,
            )
          : ''
      }`
    : '';
  if (!tooltipText) {
    tooltipText = coach
      ? getCoachDisplayName(coachDisplay, coach.name, coach.firstname)
      : '';
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
