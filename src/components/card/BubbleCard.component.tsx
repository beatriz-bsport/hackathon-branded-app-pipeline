import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

type StylesProps = {
  customColor?: string;
  withShadow?: boolean;
  width?: string;
};

type BubbleCardProps = {
  children: React.ReactNode;
  withUpwardPointingTail?: boolean;
} & StylesProps;

const BubbleCard: React.FC<BubbleCardProps> = ({
  children,
  customColor,
  withShadow,
  width,
  withUpwardPointingTail,
}) => {
  const classes = useStyles({ customColor, withShadow, width });

  if (!children) return null;

  if (withUpwardPointingTail)
    return (
      <div className={classes.upwardPointingCard}>
        <div className={classes.upwardPointingTailContainer}>
          <svg
            className={classes.upwardPointingTail}
            height="23"
            viewBox="0 0 34 23"
            width="34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.4319 0.980747L0.566113 19.7586C-0.47187 21.0697 0.461933 23 2.1342 23L17 23L31.8658 23C33.5381 23 34.4719 21.0697 33.4339 19.7586L18.5681 0.980747C17.7674 -0.0307123 16.2326 -0.0307124 15.4319 0.980747Z"
              id="Tail"
            />
          </svg>
        </div>
        <div className={classes.container}>{children}</div>
      </div>
    );

  return (
    <div className={classes.card}>
      <div>
        <svg
          className={classes.tail}
          height="34"
          viewBox="0 0 23 34"
          width="23"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.980749 15.4319L19.7586 0.566112C21.0697 -0.471871 23 0.461933 23 2.1342L23 17L23 31.8658C23 33.5381 21.0697 34.4719 19.7586 33.4339L0.980749 18.5681C-0.0307105 17.7674 -0.0307104 16.2326 0.980749 15.4319Z"
            id="Tail"
          />
        </svg>
      </div>
      <div className={classes.container}>{children}</div>
    </div>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  card: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    width: ({ width }) => width,
  },
  upwardPointingCard: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'center',
    width: ({ width }) => width,
  },
  tail: {
    position: 'relative',
    zIndex: 1,
    marginRight: theme.spacing(-0.5),
    clipPath: ({ withShadow }) => !withShadow && 'margin-box',
    fill: ({ customColor }) => customColor || theme.palette.common.white,
  },
  upwardPointingTail: {
    position: 'relative',
    zIndex: 1,
    marginBottom: theme.spacing(-0.5),
    clipPath: ({ withShadow }) => !withShadow && 'margin-box',
    fill: ({ customColor }) => customColor || theme.palette.common.white,
  },
  upwardPointingTailContainer: {
    display: 'flex',
    paddingLeft: '50%',
    clipPath: 'margin-box',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    gap: theme.spacing(4),
    width: '100%',
    backgroundColor: ({ customColor }) =>
      customColor || theme.palette.common.white,
    boxShadow: ({ withShadow }) =>
      withShadow &&
      `${theme.spacing(0)}px ${theme.spacing(0)}px ${theme.spacing(
        3,
      )}px ${theme.spacing(1)}px ${theme.palette.action.selected}`,
  },
}));

export default React.memo(BubbleCard);
