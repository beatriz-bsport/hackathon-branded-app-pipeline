import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';

// Redux
import { connect, ConnectedProps } from 'react-redux';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import type { RootState } from '#src/reducers';
import { getTheme } from '#src/libs/theme/selectors';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';

// HOCs
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
//@ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import { consumerAppBarHOC } from '#src/hocs/consumer-app-bar.hoc';

// Routing
import {
  getLoginUrl,
  getCheckoutValidationUrl,
} from '#src/libs/marketplace/routing-utils';
import { Redirect } from 'react-router';
import {
  hasRedirectionFailed,
  shouldCheckPaymentStatus,
} from '#src/libs/checkout/utils';

// Fabrique
import Typography from '#src/components/css-only/Fabrique/Typography';
import ButtonV2 from '#src/components/css-only/Fabrique/ButtonV2';
import { TypographyVariant } from '#src/components/css-only/Fabrique/Typography/constants';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/ButtonV2/constants';
import { ArrowLeft } from '#src/components/untitledui';
import IconButton from '#src/components/css-only/Fabrique/IconButton';

// Light Signup
import { useFormikContext } from 'formik';
import LightSignupForm, {
  LightSignupFormValues,
  lightSignupFormWrapper,
} from '#src/pages/checkout/express-checkouts/components/LightSignupForm';
import { useLightSignUpOperations } from '../hooks/useLightSignUpOperations';

// Checkout
import { OneClickCheckoutSkeleton } from '#src/pages/checkout/express-checkouts/components/OneClickCheckoutSkeleton';
import Loader from '#src/pages/checkout/express-checkouts/components/Loader';
import { usePassCard } from './hooks/usePassCard';
import { AlreadyMemberSection } from '../components/AlreadyMemberSection';
import { useBasket } from './hooks/useBasket';
import useCheckPassValidity from './hooks/useCheckPassValidity';
import {
  PassCardDataProvider,
  usePassCardDataContext,
} from './context/PassCardDataContext';
import { PassTypes } from '#src/libs/marketplace/types';
import { useNavigation } from '../hooks/useNavigation';
import { OnlinePaymentBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/OnlinePaymentBasket';
import { useRedirectOnSuccess } from '../hooks/useRedirectOnSuccess';
import { PaymentButtons } from '../components/PaymentButtons';
import { Basket, SUBMIT_BUTTONS } from '#src/libs/checkout/types';
import { ErrorMessage, ErrorCode } from '../components/ErrorMessage';
import { useCheckPaymentStatusFail } from '#src/pages/checkout/express-checkouts/hooks/useCheckPaymentStatusFail';
//@ts-expect-error
import CheckPaymentStatus from '#src/pages/checkout/basket/CheckPaymentStatus.component.js';
import { CheckPaymentIntent } from '#src/pages/checkout/express-checkouts/constants';
import { BASKET_INCONSISTENT } from '#src/libs/checkout/constants';

// Storage
import { STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID } from '#src/actions/constants';
import { getItemInStorage } from '#src/utils/storage';

import './express-pass-checkout.css';

enum RedirectStatus {
  SUCCEEDED = 'succeeded',
  PENDING = 'pending',
  FAILED = 'failed',
}
type Props = {
  companyId: number;
  passId: number;
  passType: PassTypes;
  queryParams: {
    check_payment_intent?: CheckPaymentIntent;
    payment_intent?: string;
    user_registration_response?: string;
    redirect_status?: RedirectStatus;
    get_user_registration_from_storage?: string;
    basket_redirection?: string;
    paypalError?: string;
  };
  setQueryParams: (queryParam: string) => (value: string) => void;
} & ConnectedProps<typeof connector>;

type ContentProps = Pick<
  Props,
  | 'authenticated'
  | 'companyTheme'
  | 'retrieveCompanyCssConfiguration'
  | 'setQueryParams'
  | 'queryParams'
  | 'snackbarError'
>;

const ExpressPassCheckoutContent: React.FC<ContentProps> = ({
  authenticated,
  companyTheme,
  retrieveCompanyCssConfiguration,
  queryParams,
  setQueryParams,
  snackbarError,
}) => {
  const { t } = useTranslation(['checkout', 'booking', 'invoice']);

  // Context
  const { companyId, passId, passCardData, passType } =
    usePassCardDataContext();

  // URLs
  const passPreCheckoutUrl =
    passType === PassTypes.PAYMENTPACK
      ? `/checkout/${companyId}/pre-checkout/payment-pack/${passId}`
      : `/checkout/${companyId}/pre-checkout/private-pass/${passId}`;

  const loginToPaymentPackUrl = getLoginUrl(
    companyId,
    passPreCheckoutUrl,
    window.location.search,
  );

  // Pass validity check
  const [passValidityState, checkPassValidity] = useCheckPassValidity();

  // Storage
  const memberId = (() => {
    try {
      return (
        getItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID) ?? ''
      );
    } catch (error) {
      console.error('Failed to retrieve member ID from storage:', error);
      return '';
    }
  })();

  // Basket
  const {
    addItemToBasket: [
      { error: basketError, loading: basketLoading },
      addItemToBasketAndFetch,
    ],
    currentBasket,
    validateBasket: [{ loading: validateBasketLoading }, validateBasket],
    fetchBasket: [, fetchBasket],
  } = useBasket();

  // Light sign up with basket integration
  const { debouncedLightSignUp, lightSignUpWithoutDebounce } =
    useLightSignUpOperations({
      companyId,
      onDebouncedCreateSuccess: !currentBasket
        ? async () => {
            const validityResult = await checkPassValidity();
            if (validityResult.isValid) {
              await addItemToBasketAndFetch();
            }
          }
        : undefined,
      onDebouncedUpdateSuccess: !currentBasket
        ? async () => {
            const validityResult = await checkPassValidity();
            if (validityResult.isValid) {
              await fetchBasket();
            }
          }
        : undefined,
      onImmediateCreateSuccess: async () => await purchaseFreePass(),
      onImmediateUpdateSuccess: async () => await purchaseFreePass(),
      shouldSkip: authenticated,
    });

  const { values: lightSignupValues, isValid } =
    useFormikContext<LightSignupFormValues>();

  const lightSignUpWithValidityCheck = useCallback(async () => {
    const validityResult = await checkPassValidity();
    if (validityResult.isValid) {
      await lightSignUpWithoutDebounce();
    }
  }, [checkPassValidity, lightSignUpWithoutDebounce]);

  // Pass Card Data
  const { PassCard, hasData } = usePassCard();

  const isPassFree =
    passCardData?.passType === PassTypes.PAYMENTPACK
      ? !passCardData?.paymentPackData?.paymentPack?.price
      : !Number(passCardData?.privatePassData?.privatePass?.price);

  // Payment
  const paymentRef = useRef(null);

  const shouldDisplayOnlinePayment =
    !!currentBasket?.id && !!memberId && !!currentBasket?.total_price_cts;

  const onCheckPaymentStatusFail = useCheckPaymentStatusFail(setQueryParams);

  // Navigation and Redirection
  const { goToPassesPage } = useNavigation(companyId);

  const { cleanLocalStorageAndRedirect } = useRedirectOnSuccess();

  // Create a wrapper for CheckPaymentStatus onSuccess callback
  const onCheckPaymentStatusSuccess = useCallback(() => {
    const basketId = queryParams?.basket_redirection ?? currentBasket?.id;
    if (!basketId) return;

    const confirmationPageUrl = getCheckoutValidationUrl(companyId, {
      basket: basketId,
      express_checkout: 'true',
    });

    cleanLocalStorageAndRedirect({
      canPerformRedirection: !!confirmationPageUrl,
      url: confirmationPageUrl || '/',
    });
  }, [
    cleanLocalStorageAndRedirect,
    companyId,
    queryParams?.basket_redirection,
    currentBasket?.id,
  ]);

  // Checkout finalization
  const basketHasNoErrors = !basketError;
  const basketIsNotLoading = !basketLoading;

  const isBookButtonLoading = !basketIsNotLoading || validateBasketLoading;

  const isBookButtonDisable =
    !isValid ||
    !lightSignupValues.acceptTermsAndConditions ||
    isBookButtonLoading;

  const redirectOnSuccess = useCallback(
    (basket?: Basket) => async () => {
      const basketToCheckout = basket ?? currentBasket;

      if (!basketToCheckout) return;

      const confirmationPageUrl = getCheckoutValidationUrl(companyId, {
        basket: queryParams?.basket_redirection
          ? queryParams.basket_redirection
          : basketToCheckout.id,
        express_checkout: 'true',
      });

      const canRedirect =
        !!confirmationPageUrl && basketHasNoErrors && basketIsNotLoading;

      cleanLocalStorageAndRedirect({
        canPerformRedirection: canRedirect,
        url: confirmationPageUrl,
      });
    },
    [
      cleanLocalStorageAndRedirect,
      companyId,
      currentBasket,
      basketHasNoErrors,
      basketIsNotLoading,
      queryParams?.basket_redirection,
    ],
  );

  const purchaseFreePass = useCallback(async () => {
    const validityResult = await checkPassValidity();
    if (validityResult && !validityResult.isValid) {
      return;
    }
    if (!currentBasket) {
      const basket = await addItemToBasketAndFetch();
      if (!basket) return;
      await validateBasket(basket);
      await redirectOnSuccess(basket)();
      return;
    }
    await validateBasket(currentBasket);
    await redirectOnSuccess(currentBasket)();
  }, [
    addItemToBasketAndFetch,
    currentBasket,
    validateBasket,
    redirectOnSuccess,
    checkPassValidity,
  ]);

  // UseEffects
  useEffect(() => {
    if (memberId && !currentBasket) {
      addItemToBasketAndFetch();
    }
  }, []);

  useEffect(() => {
    if (!isPassFree) {
      debouncedLightSignUp();
    }
  }, [isPassFree, debouncedLightSignUp, lightSignupValues]);

  useEffect(() => {
    retrieveCompanyCssConfiguration(companyId);
  }, [companyId, retrieveCompanyCssConfiguration]);

  useEffect(() => {
    const checkValidityOnMount = async () => {
      if (queryParams?.redirect_status !== RedirectStatus.FAILED) {
        await checkPassValidity();
      }
    };

    checkValidityOnMount();
  }, [checkPassValidity, queryParams?.redirect_status]);

  useEffect(() => {
    if (hasRedirectionFailed(queryParams)) {
      snackbarError(
        t(
          'checkout:validation.sections.confirmationStatusTitle.errors.generic',
        ),
      );
    }
    if (queryParams?.paypalError == BASKET_INCONSISTENT) {
      snackbarError(t('invoice:paymentPanel.actions.basketWasInconsistent'));
    }
  }, [queryParams, snackbarError, t]);

  if (shouldCheckPaymentStatus(queryParams)) {
    return (
      <CheckPaymentStatus
        onFail={onCheckPaymentStatusFail}
        onSuccess={onCheckPaymentStatusSuccess}
        paymentIntent={queryParams.payment_intent}
      />
    );
  }

  if ((!!passValidityState && !passValidityState.isValid) || basketError) {
    return (
      <ErrorMessage
        errorCode={passValidityState?.errorCode as ErrorCode}
        goBack={goToPassesPage}
        goBackButtonLabel={t(
          'checkout:passExpressCheckout.errors.unavailable.goBackButtonLabel',
        )}
      />
    );
  }

  // @debt(4, 2, 2) This works because we do not set the authenticated state in the redux store
  // when we are on the one click booking page (we are just storing the token in the local storage)
  if (authenticated) {
    return <Redirect to={passPreCheckoutUrl} />;
  }

  if (!!passCardData?.paymentPackData?.paymentPack?.whitelist_tags?.length) {
    return <Redirect to={loginToPaymentPackUrl} />;
  }

  return (
    <div className="bs-express-pass-checkout__root">
      <div className="bs-express-pass-checkout__container">
        <div className="bs-express-pass-checkout__title">
          <IconButton
            color="grey"
            onClick={goToPassesPage}
            size="lg"
            variant="text"
          >
            <ArrowLeft />
          </IconButton>
          <Typography variant={TypographyVariant.TITLE_LG}>
            {t('booking:oneClickBooking.checkoutTitle')}
          </Typography>
        </div>
        <div className="bs-express-pass-checkout__already-member--mobile">
          <AlreadyMemberSection loginUrl={loginToPaymentPackUrl} />
        </div>
        <OneClickCheckoutSkeleton isLoading={!hasData} />
        {hasData && (
          <div className="bs-express-pass-checkout__content">
            <div className="bs-express-pass-checkout__booking-details">
              <Typography variant={TypographyVariant.TITLE_SM}>
                {t('checkout:passExpressCheckout.yourPass')}
              </Typography>
              <div className="bs-express-pass-checkout__booking-details__card">
                {PassCard}
              </div>
            </div>
            <div className="bs-express-pass-checkout__divider--mobile" />
            <div className="bs-express-pass-checkout__light-signup-form">
              <div className="bs-express-pass-checkout__already-member--desktop">
                <AlreadyMemberSection loginUrl={loginToPaymentPackUrl} />
              </div>
              <div className="bs-express-pass-checkout__divider--desktop" />
              <LightSignupForm />
              {shouldDisplayOnlinePayment && (
                <OnlinePaymentBasket
                  ref={paymentRef}
                  hideConfirmPaymentButton
                  basketId={currentBasket.id}
                  companyId={companyId}
                  onConfirmPaymentSuccess={redirectOnSuccess()}
                  payerContext={{
                    memberId: Number(memberId),
                    termsAndConditionsAccepted:
                      lightSignupValues.acceptTermsAndConditions,
                  }}
                  stripePaymentElementConfig={{
                    isDefaultForRegion: companyTheme.is_default_for_region,
                    stripeId: companyTheme.stripe_id,
                  }}
                />
              )}
              {isPassFree ? (
                <div className="bs-express-pass-checkout__book-button-container">
                  <ButtonV2
                    className="bs-express-pass-checkout__book-button"
                    color={ButtonColor.PRIMARY}
                    isDisabled={isBookButtonDisable}
                    onClick={lightSignUpWithValidityCheck}
                    size={ButtonSize.LG}
                    variant={ButtonVariant.CONTAINED}
                  >
                    {isBookButtonLoading ? (
                      <div className="bs-light-signup-form__submit-button-loader">
                        <Loader />
                      </div>
                    ) : (
                      t('checkout:passExpressCheckout.payNow')
                    )}
                  </ButtonV2>
                </div>
              ) : (
                <PaymentButtons
                  enforceDisabled={isBookButtonDisable}
                  label={t('checkout:passExpressCheckout.payNow')}
                  paymentBasketRef={paymentRef}
                  paymentContext={{
                    basketId: currentBasket?.id ?? '',
                    companyId,
                    memberId: Number(memberId),
                  }}
                  submitButtons={{
                    PAYPAL_BUTTON: SUBMIT_BUTTONS.PAYPAL_BUTTON,
                    PAY_NOW_BUTTON: SUBMIT_BUTTONS.PAY_NOW_BUTTON,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExpressPassCheckout: React.FC<Props> = ({
  companyId,
  passId,
  passType,
  authenticated,
  retrieveCompanyCssConfiguration,
  companyTheme,
  queryParams,
  setQueryParams,
  snackbarError,
}) => {
  return (
    <PassCardDataProvider
      companyId={companyId}
      passId={passId}
      passType={passType}
    >
      <ExpressPassCheckoutContent
        authenticated={authenticated}
        companyTheme={companyTheme}
        queryParams={queryParams}
        retrieveCompanyCssConfiguration={retrieveCompanyCssConfiguration}
        setQueryParams={setQueryParams}
        snackbarError={snackbarError}
      />
    </PassCardDataProvider>
  );
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    companyTheme: getTheme(state),
    customConfiguration: state.exportableComponents.customCss,
  }),
  {
    snackbarError: snackbarErrorAction,
    retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  },
);

export default compose<any, Props>(
  routerParamsToProps({
    companyId: 'companyId:number',
    passId: 'passId:number',
    passType: 'passType:string',
  }),
  withQueryParams([
    [
      'check_payment_intent',
      'payment_intent',
      'user_registration_response',
      'redirect_status',
      'get_user_registration_from_storage',
      'basket_redirection',
      'paypalError',
    ],
    'queryParams',
    'setQueryParams',
  ]),
  connector,
  marketplaceCssHoc(),
  WithCustomCssProvider,
  consumerAppBarHOC(),
  lightSignupFormWrapper,
)(ExpressPassCheckout);
