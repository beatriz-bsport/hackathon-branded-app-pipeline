// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import { withTranslation, TFunction } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors';
import Tooltip from '../../../components/Tooltip.component';

import type { Coach } from '../types';

const styles = () => ({
  avatarSubstitute: {
    border: '2px solid black',
    borderColor: colors.primary,
  },
});

type Props = {
  coach: ?Coach,
  coach_override: ?Coach,
  classes: Object,
  t: TFunction,
};

export default withTranslation([])(
  withStyles(styles)((props: Props) => {
    const { coach, coach_override, classes, t } = props;
    // eslint-disable-next-line
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
          src={
            (coach_override && coach_override.photo) ||
            (coach ? coach.photo : null)
          }
          className={coach_override ? classes.avatarSubstitute : classes.avatar}
        />
      </Tooltip>
    );
  }),
);
