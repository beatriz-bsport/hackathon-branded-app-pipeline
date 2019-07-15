// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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

export default withNamespaces([])(
  withStyles(styles)((props: Props) => {
    const { coach, coach_override, classes, t } = props;
    // eslint-disable-next-line
    const tooltipText = coach_override
      ? `${t('marketplace.substitute')} ${
          coach_override && coach_override.user ? coach_override.user.name : ''
        }`
      : coach && coach.user
      ? coach.user.name
      : '';
    return (
      <Tooltip title={tooltipText}>
        <Avatar
          src={
            (coach_override &&
              coach_override.user &&
              coach_override.user.photo) ||
            (coach && coach.user ? coach.user.photo : null)
          }
          className={coach_override ? classes.avatarSubstitute : classes.avatar}
        />
      </Tooltip>
    );
  }),
);
