import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';
import { CheckPaymentIntent } from '#src/pages/checkout/express-checkouts/constants';

type SetQueryParamsFunction = (queryParam: string) => (value: string) => void;

export const useCheckPaymentStatusFail = (
  setQueryParams: SetQueryParamsFunction,
) => {
  const { t } = useTranslation('checkout');
  const dispatch = useDispatch();

  const snackbarError = useCallback(
    (message: string) => dispatch(snackbarErrorAction(message)),
    [dispatch],
  );

  const onCheckPaymentStatusFail = useCallback(() => {
    if (!setQueryParams) {
      console.warn('setQueryParams function is not provided');
      return;
    }
    setQueryParams('check_payment_intent')(CheckPaymentIntent.FALSE);
    snackbarError(
      t('checkout:validation.sections.confirmationStatusTitle.errors.generic'),
    );
  }, [snackbarError, t, setQueryParams]);

  return onCheckPaymentStatusFail;
};
