import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

type Props = {
  buttonCancelText?: string;
  buttonConfirmText?: string;
  children: any;
  fullScreen: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  open: boolean;
  title?: string;
};
const CommunicationWrapperDialog = (props: Props) => {
  const classes = useStyles();
  return (
    <Dialog fullScreen={props.fullScreen} open={props.open}>
      {props.title && (
        <DialogTitle>
          <div className={classes.dialogTitle}>{props.title}</div>
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
  buttonClose: {
    color: theme.palette.text.secondary,
  },
}));

export default CommunicationWrapperDialog;
