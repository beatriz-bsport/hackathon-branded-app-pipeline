import React, { memo } from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

type Props = {
  buttonCancelText?: string;
  buttonConfirmText?: string;
  children: any;
  closeDialog?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onCancel?: () => void;
  onConfirm?: () => void;
  open: boolean;
  title?: string;
};
const CommunicationWrapperDialog = (props: Props) => {
  const classes = useStyles();
  const { fullScreen } = useCommunicationContext();

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      maxWidth={props.maxWidth ?? 'sm'}
      onClose={props.closeDialog}
      open={props.open}
    >
      {props.title && (
        <DialogTitle className={classes.dialogTitleContainer}>
          <Typography className={classes.dialogTitle} variant="h6">
            {props.title}
          </Typography>
        </DialogTitle>
      )}
      <DialogContent className={classes.dialogContent}>
        {props.children}
      </DialogContent>
      <Divider variant="fullWidth" />
      <DialogActions>
        {props.onCancel && (
          <Button className={classes.buttonClose} onClick={props.onCancel}>
            {props.buttonCancelText}
          </Button>
        )}
        {props.onConfirm && (
          <Button color="primary" onClick={props.onConfirm}>
            {props.buttonConfirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogTitle: {
    fontWeight: 'bold',
  },
  dialogTitleContainer: {
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(1),
    },
  },
  buttonClose: {
    color: theme.palette.text.secondary,
  },
}));

export default memo(CommunicationWrapperDialog);
