import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Dialog, useMediaQuery } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

type OwnProps = {
  id?: string;
  open: boolean;
  maxWidth?: Breakpoint;
  fullScreenBreakpoint?: Breakpoint;
  onClose?: () => void;
  padding?: boolean;
  noFullScreen?: boolean;
  disablePortal?: boolean;
  disableEnforceFocus?: boolean;
  PaperComponent?: React.Component;
  ariaLabelledby?: string;
};

type Props = OwnProps;

export const GenericResponsiveDialog: React.FC<Props> = (props) => {
  const {
    children,
    disableEnforceFocus,
    disablePortal,
    fullScreenBreakpoint,
    maxWidth,
    noFullScreen,
    onClose,
    open,
    padding,
    PaperComponent,
    ariaLabelledby,
  } = props;
  const theme: Theme = useTheme();
  const classes = useStyles({ padding });
  const fullScreen = useMediaQuery(
    theme.breakpoints.down(fullScreenBreakpoint),
  );

  return (
    <Dialog
      fullWidth
      {...(ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {})}
      classes={{ paper: classes.modal }}
      disableEnforceFocus={disableEnforceFocus}
      disablePortal={disablePortal}
      fullScreen={noFullScreen ? false : fullScreen}
      id={props.id}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
      scroll="body"
      {...(PaperComponent || {})}
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
