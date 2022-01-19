// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import InputAdornment from '@material-ui/core/InputAdornment';
import type { OptionCallback } from '../../../state/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { PriceField } from '../../../components/forms';

type Props = {
  onBasketSubmit: (amount: number, options?: OptionCallback) => void;
  onInvoiceSubmit: () => void;
  creditAccountBalance: number;
  loading?: boolean;
  disabled?: boolean;
} & FormikProps<{ amount: number }>;

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .nullable(false)
    .test(
      'Test Amount Lesser than Credits',
      'checkout:internAccount.error.amountMustBeLessThanCredits',
      function CheckAmout(item) {
        return this.parent.maximum_credits >= item && item > 0;
      },
    ),
  maximum_credits: Yup.number().nullable(false),
});
export const UseInternalAccountForm: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { t } = useTranslation('checkout');
  const classes = useStyles();
  return (
    <>
      {props.onBasketSubmit && (
        <>
          <Typography variant="h6" className={classes.header}>
            {t('internalAccount.myInternalAccount')}
          </Typography>
          <Collapse in={!open} timeout={{ appear: 10000 }}>
            <div className={classes.container}>
              <div className={classes.outterButtonContainer}>
                <Button
                  disabled={props.loading || props.disabled}
                  onClick={() => setOpen(true)}
                  color="primary"
                  variant="outlined"
                >
                  <AccountBalanceWalletIcon className={classes.iconButton} />
                  {t('internalAccount.use')}
                </Button>
                <div className={classes.paddingLeft}>
                  <Typography variant="h6">
                    {getCurrencyDisplayWithPrice(props.creditAccountBalance)}
                  </Typography>
                </div>
              </div>
            </div>
          </Collapse>
        </>
      )}
      {props.onInvoiceSubmit && (
        <>
          <div className={classes.greyContainer}>
            <Typography variant="h6">
              {getCurrencyDisplayWithPrice(props.creditAccountBalance)}
            </Typography>
            <Button
              disabled={props.loading || props.disabled}
              onClick={() => props.onInvoiceSubmit()}
              color="primary"
              variant="outlined"
            >
              <AccountBalanceWalletIcon className={classes.iconButton} />
              {t('internalAccount.use')}
            </Button>
          </div>
        </>
      )}
      {props.onBasketSubmit && open && (
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            amount: 0,
            maximum_credits: props.creditAccountBalance,
          }}
          onSubmit={(values) => {
            return props.onBasketSubmit(values.amount, {
              onSuccess: () => {
                setOpen(false);
              },
            });
          }}
        >
          {(formik) => (
            <Form>
              <Collapse in={open}>
                <div className={classes.flexCollaspe}>
                  <PriceField
                    name="amount"
                    label={`${t(
                      'internalAccount.label',
                    )}${'\u00A0'}${getCurrencyDisplayWithPrice(
                      props.creditAccountBalance,
                    )}`}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            disabled={formik.isSubmitting || props.loading}
                            onClick={() => formik.handleSubmit()}
                            color="primary"
                            edge="end"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <div className={classes.flexButtons}>
                    <IconButton onClick={() => setOpen(false)}>
                      <CancelIcon />
                    </IconButton>
                  </div>
                </div>
              </Collapse>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
  },
  iconButton: {
    marginRight: theme.spacing(1),
  },
  outterButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddingLeft: {
    paddingLeft: theme.spacing(2),
  },
  greyContainer: {
    backgroundColor: grey[100],
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
  },
  flexCollaspe: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  flexButtons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1),
  },
}));
export default compose<any, Props>(UseInternalAccountForm);
