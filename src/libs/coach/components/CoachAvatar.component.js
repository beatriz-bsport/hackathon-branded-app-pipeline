// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors';

const styles = (theme) => ({
  avatarSubstitute: {
    border: '2px solid black',
    borderColor: colors.primary,
  },
  lightTooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
});

type Props = {
  coach: Coach,
  coach_override: ?Coach,
  classes: Object,
  t: TFunction,
};

export default withNamespaces([])(
  withStyles(styles)((props: Props) => {
    const { coach, coach_override, classes, t } = props;
    const tooltipText = coach_override
      ? `${t('marketplace.substitute')} ${coach_override.name}`
      : coach.name;
    return (
      <Tooltip title={tooltipText} classes={{ tooltip: classes.lightTooltip }}>
        <Avatar
          src={(coach_override && coach_override.photo) || coach.photo}
          className={coach_override ? classes.avatarSubstitute : classes.avatar}
        />
      </Tooltip>
    );
  }),
);
