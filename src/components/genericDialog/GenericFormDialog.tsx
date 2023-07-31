import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/styles';
import { Dialog, useMediaQuery } from '@material-ui/core';

type OwnProps = {
  open: boolean;
};
type Props = OwnProps;
export const GenericFormDialog: React.FC<Props> = (props) => {
  const { children, open } = props;
  const theme: Theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      scroll="body"
    >
      {children}
    </Dialog>
  );
};

export default GenericFormDialog;
