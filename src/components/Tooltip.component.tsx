// @flow

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { colors } from '@bsport/common/lib/colors';
import type { TooltipProps } from '@material-ui/core/Tooltip/Tooltip';

type Props = TooltipProps & {
  hide?: boolean;
  children: any;
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 200,
    textAlign: 'center',
  },
  highlighted: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.5)',
    boxShadow: theme.shadows[1],
    border: `1px solid ${colors.secondary}`,
    fontSize: 11,
    maxWidth: 200,
  },
}));

export const ToolTip = (props: Props) => {
  const classes = useStyles();
  if (!props.title || props?.hide) return props.children;

  return (
    <Tooltip
      title={props.title || null}
      placement={props.placement || 'bottom'}
      classes={{ tooltip: classes[props.variant || 'tooltip'] }}
    >
      {props.children}
    </Tooltip>
  );
};

export default ToolTip;
