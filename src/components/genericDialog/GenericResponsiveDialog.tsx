import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Dialog, useMediaQuery } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

type OwnProps = {
  open: boolean;
  maxWidth?: Breakpoint;
  fullScreenBreakpoint?: Breakpoint;
  onClose?: () => void;
  padding?: boolean;
  noFullScreen?: boolean;
};

type Props = OwnProps;

export const GenericResponsiveDialog: React.FC<Props> = (props) => {
  const {
    children,
    open,
    maxWidth,
    fullScreenBreakpoint,
    onClose,
    padding,
    noFullScreen,
  } = props;
  const theme: Theme = useTheme();
  const classes = useStyles({ padding });
  const fullScreen = useMediaQuery(
    theme.breakpoints.down(fullScreenBreakpoint),
  );

  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={noFullScreen ? false : fullScreen}
      scroll="body"
      onClose={onClose}
      classes={{ paper: classes.modal }}
    >
      {children}
    </Dialog>
  );
};
const useStyles = makeStyles<Theme, { padding: boolean }>((theme) => ({
  modal: ({ padding }) => ({ padding: padding ? theme.spacing(2) : 0 }),
}));
GenericResponsiveDialog.defaultProps = {
  maxWidth: 'md',
  fullScreenBreakpoint: 'sm',
  padding: false,
};

export default GenericResponsiveDialog;
