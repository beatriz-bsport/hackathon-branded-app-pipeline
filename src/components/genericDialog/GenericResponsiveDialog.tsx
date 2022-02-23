import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/styles';
import { Dialog, useMediaQuery } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

type OwnProps = {
  open: boolean;
  maxWidth?: Breakpoint;
  fullScreenBreakpoint?: Breakpoint;
};
type Props = OwnProps;
export const GenericResponsiveDialog: React.FC<Props> = (props) => {
  const { children, open, maxWidth, fullScreenBreakpoint } = props;
  const theme: Theme = useTheme();
  const fullScreen = useMediaQuery(
    theme.breakpoints.down(fullScreenBreakpoint),
  );

  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen}
      scroll="body"
    >
      {children}
    </Dialog>
  );
};

GenericResponsiveDialog.defaultProps = {
  maxWidth: 'md',
  fullScreenBreakpoint: 'sm',
};

export default GenericResponsiveDialog;
