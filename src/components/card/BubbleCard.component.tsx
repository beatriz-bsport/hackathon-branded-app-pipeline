import React from 'react';
import { makeStyles, type Theme } from '@material-ui/core/styles';

type StylesProps = {
  customColor?: string;
  withShadow?: boolean;
  width?: string;
};

export type BubbleCardProps = {
  children: React.ReactNode;
} & StylesProps;

const BubbleCard: React.FC<BubbleCardProps> = ({
  children,
  customColor,
  withShadow,
  width,
}) => {
  const classes = useStyles({ customColor, withShadow, width });

  return (
    <div className={classes.card}>
      <svg
        width="23"
        height="34"
        viewBox="0 0 23 34"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.arrow}
      >
        <path
          id="Arrow"
          d="M0.980749 15.4319L19.7586 0.566112C21.0697 -0.471871 23 0.461933 23 2.1342L23 17L23 31.8658C23 33.5381 21.0697 34.4719 19.7586 33.4339L0.980749 18.5681C-0.0307105 17.7674 -0.0307104 16.2326 0.980749 15.4319Z"
        />
      </svg>
      <div className={classes.container}>{!!children && children}</div>
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
  arrow: {
    flexShrink: 0,
    zIndex: 1,
    marginRight: theme.spacing(-0.5),
    fill: ({ customColor }) => customColor || theme.palette.common.white,
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
      `${theme.spacing(0)}px ${theme.spacing(0.5)}px ${theme.spacing(
        1,
      )}px ${theme.spacing(0)}px ${theme.palette.action.selected}`,
  },
}));

export default React.memo(BubbleCard);
