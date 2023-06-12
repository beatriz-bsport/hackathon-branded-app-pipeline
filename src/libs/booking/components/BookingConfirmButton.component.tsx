import React from 'react';
import { Button, makeStyles, CircularProgress } from '@material-ui/core';

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
      {buttonLoading && (
        <CircularProgress
          style={{ marginRight: 8 }}
          size={24}
          color="inherit"
        />
      )}
      {value}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100%',
    borderRadius: 24,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}));

export default BookingConfirmButton;
