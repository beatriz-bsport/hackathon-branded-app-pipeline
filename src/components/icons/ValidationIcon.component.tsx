import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/styles';

type Props = {
  color?: string;
  fillOpacity?: string;
};

export const ValidationIcon: React.FC<Props> = (props) => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  return (
    <div className={classes.container}>
      <div className={classes.validationIcon}>
        <svg
          width="96"
          height="77"
          viewBox="0 0 96 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classes.checkIcon}
        >
          <path
            d="M80.2615 2.92325C80.1785 3.00371 80.1006 3.08935 80.0284 3.17964L39.5542 54.7484L15.1625 30.345C13.5056 28.8011 11.3141 27.9606 9.04969 28.0005C6.78531 28.0405 4.62484 28.9578 3.02343 30.5592C1.42203 32.1606 0.504723 34.3211 0.464771 36.5855C0.424819 38.8498 1.26534 41.0413 2.80925 42.6982L33.6456 73.5463C34.4764 74.3755 35.4656 75.0289 36.5543 75.4675C37.643 75.9061 38.8089 76.1209 39.9824 76.0992C41.156 76.0774 42.3131 75.8195 43.3848 75.3409C44.4565 74.8622 45.4209 74.1726 46.2203 73.3132L92.7429 15.1599C94.327 13.4973 95.1931 11.2779 95.154 8.98178C95.1149 6.68562 94.1736 4.4971 92.5338 2.88939C90.8939 1.28168 88.6872 0.383956 86.3907 0.390292C84.0942 0.396628 81.8925 1.30652 80.2615 2.92325Z"
            fill={props.color ? props.color : theme.palette.primary.main}
          />
        </svg>
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="55"
            cy="55"
            r="55"
            fill={props.color ? props.color : theme.palette.primary.main}
            fillOpacity={props.fillOpacity}
          />
        </svg>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>(() => ({
  checkIcon: {
    position: 'absolute',
    top: '10%',
    left: '20%',
  },
  container: { display: 'flex' },
  validationIcon: { position: 'relative' },
}));
ValidationIcon.defaultProps = {
  fillOpacity: '0.3',
};
export default ValidationIcon;
