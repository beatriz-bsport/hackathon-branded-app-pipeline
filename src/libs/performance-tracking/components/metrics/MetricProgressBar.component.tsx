import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Slider, Typography } from '@material-ui/core';
import { PerformanceTrackingMetric } from '#libs/performance-tracking/types';

type OwnProps = {
  metric: PerformanceTrackingMetric;
};
type Props = OwnProps;
export const MetricProgressBar = (props: Props) => {
  const { metric } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>{metric?.min_value}</Typography>
      <div className={classes.sliderContainer}>
        <div className={classes.leftCircle}>
          <div className={classes.littleCircle} />
        </div>
        <Slider
          className={classes.slider}
          classes={{
            thumb: classes.sliderThumb,
            valueLabel: classes.valueLabel,
            rail: classes.rail,
            track: classes.track,
          }}
          value={metric?.default_value}
          min={metric?.min_value}
          max={metric?.max_value}
          disabled
          valueLabelDisplay="on"
        />
        <div className={classes.rightCircle}>
          <div className={classes.littleCircle} />
        </div>
      </div>
      <Typography className={classes.typoRight}>{metric?.max_value}</Typography>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  track: {
    opacity: 0,
  },
  rail: {
    backgroundColor: theme.palette.primary.main,
    minHeight: theme.spacing(0.3),
    opacity: '1',
  },
  typoRight: {
    position: 'relative',
    right: '4px',
  },
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    width: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    '&.MuiSlider-root.Mui-disabled': {
      color: theme.palette.primary.main,
    },
  },
  valueLabel: {
    left: 'unset',
    top: '13px',
    color: 'transparent',
    '& > span > span': {
      color: 'black',
    },
  },
  sliderThumb: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0%',
    '&.Mui-disabled': {
      width: '2px',
    },
  },
  rightCircle: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    minWidth: theme.spacing(1.5),
    minHeight: theme.spacing(1.5),
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    zIndex: 10,
    position: 'relative',
    right: theme.spacing(1),
  },
  leftCircle: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    minWidth: theme.spacing(1.5),
    minHeight: theme.spacing(1.5),
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    zIndex: 10,
    position: 'relative',
    left: theme.spacing(0.5),
  },
  littleCircle: {
    width: theme.spacing(0.75),
    height: theme.spacing(0.75),
    backgroundColor: 'white',
    borderRadius: '100%',
  },
}));

export default MetricProgressBar;
