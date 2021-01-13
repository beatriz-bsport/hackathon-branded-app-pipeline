// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import { colors } from '@bsport/common/lib/colors';

type Props = {
  classes: Object,
  title: string,
  placement?: string,
  variant?: string,
  children: any,
};

const styles = (theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 200,
  },
  highlighted: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.5)',
    boxShadow: theme.shadows[1],
    border: `1px solid ${colors.secondary}`,
    fontSize: 11,
    maxWidth: 200,
  },
});

export default withStyles(styles)((props: Props) => {
  if (!props.title) return props.children;
  return (
    <Tooltip
      title={props.title || null}
      placement={props.placement || 'bottom'}
      classes={{ tooltip: props.classes[props.variant || 'tooltip'] }}
    >
      {props.children}
    </Tooltip>
  );
});
