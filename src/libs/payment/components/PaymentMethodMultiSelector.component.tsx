import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles } from '@material-ui/core/styles';

import PaymentMethodIcon from './PaymentMethodIcon.component';

type Props = {
  paymentMethodsSelected: number[];
  paymentMethodChoices: Array<number>;
  selectPaymentMethod: (paymentMethod: number) => void;
  disabled?: number[];
};

export const PaymentMethodMultiSelector = (props: Props) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <div className={classes.row}>
        {props.paymentMethodChoices.map((pm) => (
          <ButtonBase
            className={classes.buttonContainer}
            onClick={() => props.selectPaymentMethod(pm)}
            disabled={props.disabled && props.disabled.includes(pm)}
          >
            <Paper
              className={classnames(
                classes.paper,
                props.paymentMethodsSelected.includes(pm)
                  ? classes.selected
                  : null,
              )}
            >
              <PaymentMethodIcon paymentMethod={pm} />

              {props.disabled && props.disabled.includes(pm) && (
                <div className={classes.disabledBtn} />
              )}
            </Paper>

            {props.paymentMethodsSelected.includes(pm) && (
              <>
                <div className={classes.checkBackground} />
                <CheckCircleIcon
                  className={classes.checkIcon}
                  color="primary"
                />
              </>
            )}
          </ButtonBase>
        ))}
      </div>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100vw',
    overflowX: 'auto',
    paddingBottom: theme.spacing(1),
  },
  selected: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(1),
    zIndex: 1,
  },
  buttonContainer: {
    position: 'relative',
  },
  disabledBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#33333322',
  },
  checkIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 99,
  },
  checkBackground: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 99,
    width: 22,
    height: 22,
    borderRadius: 50,
    backgroundColor: 'white',
  },
}));

export default PaymentMethodMultiSelector;
