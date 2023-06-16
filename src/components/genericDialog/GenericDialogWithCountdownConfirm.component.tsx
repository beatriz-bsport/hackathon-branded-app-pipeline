import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';

export type Props = {
  content?: string;
  countdownBeforeActivation?: number;
  validateLabel?: string;
  onValidate: () => void;
  open: boolean;
  title: string;
};

export const GenericDialogWithCountdownConfirm = (props: Props) => {
  const classes = useStyles();
  const button = [
    {
      variant: 'text',
      onClick: props.onValidate,
      delayBeforeActivation: props.countdownBeforeActivation ?? 5,
      className: classes.button,
      ...(props.validateLabel
        ? { label: props.validateLabel }
        : { commonLabel: 'ok' }),
    },
  ];
  return (
    <CustomMuiDialog
      open={props.open}
      buttons={button}
      title={props.title}
      content={props.content}
      contentColor="textSecondary"
      fullScreenBreakpoint="xs"
    />
  );
};

const useStyles = makeStyles<Theme>({
  button: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default GenericDialogWithCountdownConfirm;
