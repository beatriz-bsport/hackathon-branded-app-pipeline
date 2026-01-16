import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { Basket } from '#src/libs/checkout/types';
import { useBasketPaymentContext } from '#src/libs/checkout/components/new-checkout-flow-unified/BasketPaymentContext';
import CheckoutContext from '../../../pages/checkout/basket/CheckoutContext';
import type { OptionCallback } from '../../../state/types';
// @ts-expect-error
import { PriceField } from '../../../components/forms';

type Props = {
  onBasketSubmit?: (amount: number, options?: OptionCallback<Basket>) => void;
  onInvoiceSubmit?: () => void;
  creditAccountBalance: number;
  loading?: boolean;
  disabled?: boolean;
  asManager?: boolean;
};

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

export const UseInternalAccountForm: React.FC<Props> = ({
  onBasketSubmit,
  onInvoiceSubmit,
  creditAccountBalance,
  loading,
  disabled,
  asManager,
}) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation('checkout');
  const isCheckoutContext = React.useContext(CheckoutContext);
  const classes = useStyles({ isCheckoutContext, open });
  const { setIsInternalAccountAmountEditing } = useBasketPaymentContext();
  const [isUseInternalAccountProcessing, setIsUseInternalAccountProcessing] =
    React.useState(false);

  const handleUseInternalAccountBasketSubmit = React.useCallback(
    (values) => {
      setIsUseInternalAccountProcessing(true);
      onBasketSubmit?.(values.amount, {
        onSuccess: () => {
          setOpen(false);
          setIsUseInternalAccountProcessing(false);
        },
        onError: () => {
          setIsUseInternalAccountProcessing(false);
        },
      });
    },
    [onBasketSubmit],
  );

  useEffect(() => {
    setIsInternalAccountAmountEditing(open);
  }, [open, setIsInternalAccountAmountEditing]);

  const handleAmountFocus = useCallback(
    (formik) => () => {
      if (formik.values.amount === 0) {
        formik.setFieldValue('amount', '');
      }
    },
    [],
  );

  const handleCancelClick = useCallback(() => {
    setIsInternalAccountAmountEditing(false);
    setOpen(false);
  }, [setIsInternalAccountAmountEditing]);

  return (
    <>
      {onBasketSubmit && (
        <>
          {!asManager && (
            <Typography className={classes.header} variant="h6">
              {t('internalAccount.myInternalAccount')}
            </Typography>
          )}
          <div
            className={clsx(
              classes.greyContainer,
              classes.accountBalanceContainer,
            )}
          >
            <Typography className={classes.creditAccountBalance} variant="h6">
              {getCurrencyDisplayWithPrice(creditAccountBalance)}
            </Typography>
            {!open && (
              <div className={clsx(classes.container, classes.fullWidth)}>
                <div className={classes.outterButtonContainer}>
                  <Button
                    fullWidth
                    className={classes.UseInternalAccountButton}
                    color="primary"
                    disabled={loading || disabled}
                    onClick={() => setOpen(true)}
                    variant="outlined"
                  >
                    <AccountBalanceWalletIcon className={classes.iconButton} />
                    {asManager
                      ? t('internalAccount.useAsManager')
                      : t(
                          isCheckoutContext
                            ? 'internalAccount.use_minimal'
                            : 'internalAccount.use',
                        )}
                  </Button>
                </div>
              </div>
            )}
            {onBasketSubmit && open && (
              <Formik
                initialValues={{
                  amount: 0,
                  maximum_credits: creditAccountBalance,
                }}
                onSubmit={handleUseInternalAccountBasketSubmit}
                validationSchema={validationSchema}
              >
                {(formik) => (
                  <Form className={classes.fullWidth}>
                    <Collapse in={open}>
                      <div className={classes.flexCollaspe}>
                        <PriceField
                          allowEmpty
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                {isUseInternalAccountProcessing ? (
                                  <CircularProgress
                                    className={classes.iconButton}
                                    size={20}
                                  />
                                ) : (
                                  <IconButton
                                    color="primary"
                                    disabled={formik.isSubmitting || loading}
                                    edge="end"
                                    onClick={() => formik.handleSubmit()}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                )}
                              </InputAdornment>
                            ),
                          }}
                          label={`${t(
                            'internalAccount.label',
                          )}${'\u00A0'}${getCurrencyDisplayWithPrice(
                            creditAccountBalance,
                          )}`}
                          name="amount"
                          onFocus={handleAmountFocus(formik)}
                          value={formik.values.amount || ''}
                          variant="outlined"
                        />
                        <div className={classes.flexButtons}>
                          <IconButton onClick={handleCancelClick}>
                            <CancelIcon />
                          </IconButton>
                        </div>
                      </div>
                    </Collapse>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </>
      )}
      {onInvoiceSubmit && (
        <>
          <Typography className={classes.header} variant="h6">
            {t('internalAccount.myInternalAccount')}
          </Typography>
          <div className={classes.greyContainer}>
            <Typography className={classes.creditAccountBalance} variant="h6">
              {getCurrencyDisplayWithPrice(creditAccountBalance)}
            </Typography>
            <Button
              color="primary"
              disabled={loading || disabled}
              onClick={() => onInvoiceSubmit()}
              variant="outlined"
            >
              {loading ? (
                <CircularProgress className={classes.iconButton} size={20} />
              ) : (
                <AccountBalanceWalletIcon className={classes.iconButton} />
              )}

              {t('internalAccount.use')}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

const useStyles = makeStyles<
  Theme,
  { isCheckoutContext: boolean; open: boolean }
>((theme) => ({
  creditAccountBalance: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  header: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: theme.spacing(1),
  },
  outterButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: ({ isCheckoutContext }) => (isCheckoutContext ? 'none' : '100%'),
    },
  },
  accountBalanceContainer: {
    alignItems: 'center',
    [theme.breakpoints.down(400)]: {
      flexDirection: ({ open }) => (open ? 'column' : 'row'),
      gap: ({ open }) => (open ? theme.spacing(0.5) : 0),
    },
  },
  greyContainer: {
    backgroundColor: grey[100],
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexWrap: ({ isCheckoutContext }) =>
        isCheckoutContext ? 'none' : 'nowrap',
    },
  },
  fullWidth: {
    [theme.breakpoints.down('xs')]: {
      width: ({ isCheckoutContext }) => (isCheckoutContext ? 'none' : '100%'),
    },
  },
  UseInternalAccountButton: {
    [theme.breakpoints.down('sm')]: {
      borderRadius: ({ isCheckoutContext }) =>
        isCheckoutContext ? '24px' : 'none',
    },
    [theme.breakpoints.down('xs')]: {
      width: ({ isCheckoutContext }) => (isCheckoutContext ? 'none' : '100%'),
    },
  },
  flexCollaspe: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
  },
  flexButtons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1),
  },
}));

export default React.memo(UseInternalAccountForm);
