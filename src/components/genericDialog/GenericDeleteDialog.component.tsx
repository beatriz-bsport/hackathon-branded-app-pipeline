import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CustomMuiDialog from '#src/components/genericDialog/CustomMuiDialog.component';

export type Props = {
  cancelLabel?: string;
  children?: any;
  content?: string;
  delayBeforeActivation?: number;
  onCancel: () => void;
  onValidate: () => void;
  open: boolean;
  title: string;
  validateLabel?: string;
};

export const GenericDeleteDialog = (props: Props) => {
  const classes = useStyles();
  const buttons = [
    {
      variant: 'text',
      onClick: props.onCancel,
      className: classes.button,
      ...(props.cancelLabel
        ? { label: props.cancelLabel }
        : { commonLabel: 'close' }),
    },
    {
      variant: 'text',
      onClick: props.onValidate,
      delayBeforeActivation: props.delayBeforeActivation ?? 5,
      className: classes.buttonRed,
      ...(props.validateLabel
        ? { label: props.validateLabel }
        : { commonLabel: 'delete' }),
    },
  ];
  return (
    <CustomMuiDialog
      buttons={buttons}
      content={props.content}
      contentColor="textSecondary"
      fullScreenBreakpoint="xs"
      open={props.open}
      title={props.title}
    >
      {props.children}
    </CustomMuiDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    fontWeight: 'bold',
  },
  buttonRed: {
    fontWeight: 'bold',
    color: theme.palette.error.main,
  },
}));

export default GenericDeleteDialog;
