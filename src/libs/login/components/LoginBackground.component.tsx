import React from 'react';
import { compose } from 'recompose';
import { withStyles, WithTheme } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import classNames from 'classnames';
import { MaterialStyleType } from '../../../utils/types';
import './LoginBackground.css';

type OwnProps = {
  company?: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTheme;

const effectArray = ['ball1', 'ball2', 'ball3', 'ball4']
  .map((effect) => ({ effect, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ effect }) => effect);

export const LoginBackgroundComponent = (props: Props) => {
  const { classes } = props;

  return (
    <div className={classes.loginBackground}>
      <div
        className={classNames(
          classes.circle,
          classes.dark,
          classes.size2,
          effectArray[0],
        )}
      />
      <div
        className={classNames(
          classes.circle,
          classes.dark,
          classes.size3,
          classes.left,
          effectArray[2],
        )}
      />
      <div
        className={classNames(
          classes.circle,
          classes.light,
          classes.size6,
          'bigBall',
        )}
      />
      <div
        className={classNames(classes.circle, classes.light, classes.size1)}
      />
      <div
        className={classNames(
          classes.circle,
          classes.light,
          classes.size3,
          classes.right,
        )}
      />
      <div
        className={classNames(
          classes.circle,
          classes.light,
          classes.size4,
          classes.animate1,
          effectArray[1],
        )}
      />
      <div
        className={classNames(
          classes.circle,
          classes.dark,
          classes.size5,
          effectArray[3],
        )}
      />
      <div className={classNames(classes.svg, 'svgMove')}>
        <svg
          width="911"
          height="295"
          viewBox="0 0 911 295"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M335 203C565 209 863.5 212.5 910.5 294.5H0V0.5C34 50 105 197 335 203Z"
            fillOpacity="0.6"
            fill={
              props.company
                ? props.theme.palette.primary.main
                : 'rgba(44, 118, 126)'
            }
          />
        </svg>
      </div>
    </div>
  );
};

const styles = (theme: Theme): any => ({
  loginBackground: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 0,
    position: 'relative',
  },
  circle: {
    borderRadius: '50%',
    position: 'absolute',
  },
  dark: (props: Props) => ({
    background: props.company
      ? theme.palette.primary.main
      : 'rgba(44, 118, 126)',
    opacity: 0.6,
  }),
  light: (props: Props) => ({
    background: props.company
      ? theme.palette.secondary.main
      : 'rgba(73, 156, 124)',
    opacity: 0.6,
  }),
  size1: {
    height: 28,
    width: 28,
    top: '45%',
    left: '11%',
  },
  size2: {
    height: 63,
    width: 63,
    top: '35%',
    right: '3%',
  },
  size3: {
    height: 71,
    width: 71,
  },
  size4: {
    height: 127,
    width: 127,
    top: '60%',
    left: '2%',
  },
  size5: {
    height: 155,
    width: 155,
    bottom: '30%',
    right: '4%',
  },
  size6: {
    height: 500,
    width: 500,
    bottom: -80,
    right: -250,
  },
  left: {
    top: '35%',
    left: '3%',
  },
  right: {
    top: '52%',
    right: '18%',
  },
  svg: {
    bottom: -8,
    left: 0,
    position: 'absolute',
  },
});

export default compose<any, Props>(withStyles(styles, { withTheme: true }))(
  LoginBackgroundComponent,
);
