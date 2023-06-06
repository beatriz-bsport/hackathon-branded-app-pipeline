import React from 'react';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  title?: string;
  hide?: boolean;
  anchorOrigin?: PopoverProps['anchorOrigin'];
  transformOrigin?: PopoverProps['transformOrigin'];
  className?: string;
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
    <div data-testid="popover-container">
      <div
        onMouseOver={handlePopoverOpen}
        onFocus={handleVoid}
        onBlur={handleVoid}
        onMouseOut={handlePopoverClose}
        id="hovered-text"
      >
        {props.children}
      </div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={
          props.anchorOrigin ?? {
            vertical: 'bottom',
            horizontal: 'left',
          }
        }
        transformOrigin={
          props.transformOrigin ?? {
            vertical: 'top',
            horizontal: 'left',
          }
        }
        onClose={handlePopoverClose}
        PaperProps={{
          className: classes.popoverPaper,
        }}
      >
        <Typography
          className={classNames(classes.popoverText, props.className)}
          id="popover"
          data-testid="popoverid"
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
