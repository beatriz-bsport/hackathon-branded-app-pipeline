import React from 'react';
import { Button, Theme, makeStyles, CircularProgress } from '@material-ui/core';
import chroma from 'chroma-js';

export type Props = {
  value: string;
  disabled: boolean;
  buttonLoading: boolean;
  onClick: () => void;
};

const BookingConfirmButton: React.FC<Props> = ({
  value,
  disabled,
  buttonLoading,
  onClick,
}) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled || buttonLoading}
      className={classes.button}
    >
      {buttonLoading ? <CircularProgress color="inherit" /> : value}
    </Button>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    width: '100%',
    borderRadius: 24,
    background: theme.palette.primary.main,
    color:
      chroma(theme.palette.primary.main).luminance() > 0.5
        ? '#000000'
        : '#ffffff',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}));

export default BookingConfirmButton;
