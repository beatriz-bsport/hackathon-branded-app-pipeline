// @ts-nocheck
import React from 'react';
import { makeStyles } from '@material-ui/styles';

type Props = {
  chartHeight: number;
  yLabel: string;
};

const useStyles = makeStyles(() => ({
  yLabelContainer: {
    transform: 'rotate(-90deg)',
    textAlign: 'center',
  },
  yLabel: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

const TemporalCustomYLabel: React.FC<Props> = ({ chartHeight, yLabel }) => {
  const classes = useStyles();
  return (
    <g>
      <foreignObject
        x={((chartHeight - 250) / 2 + 250) * -1}
        y={0}
        width={250}
        height={30}
        className={classes.yLabelContainer}
      >
        <div className={classes.yLabel}>{yLabel}</div>
      </foreignObject>
    </g>
  );
};

export default TemporalCustomYLabel;
