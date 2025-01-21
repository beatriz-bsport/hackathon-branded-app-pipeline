import React from 'react';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  title?: string;
  hide?: boolean;
  anchorOrigin?: PopoverProps['anchorOrigin'];
  transformOrigin?: PopoverProps['transformOrigin'];
  className?: string;
  customClasses?: {
    container?: string;
    hoveredText?: string;
    MUIPopOverContainer?: string;
    MUIPaperContainer?: string;
  };
};

const PopOver = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handlePopoverClose = React.useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleVoid = () => {};

  const open = Boolean(anchorEl);
  const classes = useStyles();

  if (props.hide || !props.title) return <>{props.children}</>;

  return (
    <div
      className={props.customClasses?.container}
      data-testid="popover-container"
    >
      <div
        className={props.customClasses?.hoveredText}
        id="hovered-text"
        onBlur={handleVoid}
        onFocus={handleVoid}
        onMouseOut={handlePopoverClose}
        onMouseOver={handlePopoverOpen}
      >
        {props.children}
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={
          props.anchorOrigin ?? {
            vertical: 'bottom',
            horizontal: 'left',
          }
        }
        classes={{ paper: props.customClasses?.MUIPaperContainer }}
        className={clsx(
          classes.popover,
          props.customClasses?.MUIPopOverContainer,
        )}
        id="mouse-over-popover"
        onClose={handlePopoverClose}
        open={open}
        PaperProps={{
          className: classes.popoverPaper,
        }}
        transformOrigin={
          props.transformOrigin ?? {
            vertical: 'top',
            horizontal: 'left',
          }
        }
      >
        <Typography
          className={clsx(classes.popoverText, props.className)}
          data-testid="popoverid"
          id="popover"
        >
          {props.title}
        </Typography>
      </Popover>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverPaper: {
    borderRadius: theme.spacing(1),
  },
  popoverText: {
    paddingTop: theme.spacing(1.875),
    paddingBottom: theme.spacing(1.875),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
  },
}));

export default PopOver;
