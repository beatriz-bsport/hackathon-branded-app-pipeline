import React from 'react';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import { useMediaQuery, useTheme } from '@material-ui/core';

type OwnProps = {
  children: React.ReactNode;
  isWidget: boolean;
  open: boolean;
  maxWidth: 'sm' | 'md' | 'xs' | 'lg' | 'xl';
  fullWidth: boolean;
  onClose?: () => void;
};
type Props = OwnProps;
export const CustomFormViewDialog = (props: Props) => {
  const { isWidget, open, maxWidth, fullWidth, children, onClose } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullScreen={isWidget || fullScreen}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {children}
    </Dialog>
  );
};
export default compose<any, OwnProps>(CustomFormViewDialog);
