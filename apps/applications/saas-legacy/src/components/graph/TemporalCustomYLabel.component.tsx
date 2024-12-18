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
        className={classes.yLabelContainer}
        height={30}
        width={250}
        x={((chartHeight - 250) / 2 + 250) * -1}
        y={0}
      >
        <div className={classes.yLabel}>{yLabel}</div>
      </foreignObject>
    </g>
  );
};

export default TemporalCustomYLabel;
