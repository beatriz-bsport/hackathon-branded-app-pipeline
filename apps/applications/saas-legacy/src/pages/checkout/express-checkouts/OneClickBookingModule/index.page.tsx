import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';
import themeSelectors from '#src/libs/theme/selectors';
import type { RootState } from '#src/reducers';
import { Redirect } from 'react-router-dom';
//@ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';

import {
  getLoginUrl,
  getOfferBookerUrl,
} from '#src/libs/marketplace/routing-utils';
import {
  shouldCheckPaymentStatus,
  hasRedirectionFailed,
} from '#src/libs/checkout/utils';
//@ts-expect-error
import CheckPaymentStatus from '#src/pages/checkout/basket/CheckPaymentStatus.component.js';
import ConsumerBookingDetailsCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';
import { getLevelTranslation } from '#src/libs/level/utils';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import Typography from '#src/components/css-only/Fabrique/Typography/Typography.component';
import { TypographyVariant } from '#src/components/css-only/Fabrique/Typography/constants';
import ButtonV2 from '#src/components/css-only/Fabrique/ButtonV2';
import MinimalPaymentPackCard from '#src/libs/marketplace/components/@PaymentPack/MinimalPaymentPackCard';
import { LinkExternal01 } from '#src/components/untitledui';
import LightSignupForm, {
  LightSignupFormValues,
  lightSignupFormWrapper,
} from '#src/pages/checkout/express-checkouts/components/LightSignupForm';
import useFetchOfferInformation from './_hooks/useFetchOfferInformation';
import useBookInOneClick from './_hooks/useBookInOneClick';
import {
  ErrorCode,
  ErrorMessage,
} from '#src/pages/checkout/express-checkouts/components/ErrorMessage';
import useCheckBookableStatus from './_hooks/useCheckBookableStatus';
import Loader from '#src/pages/checkout/express-checkouts/components/Loader';
import { consumerAppBarHOC } from '#src/hocs/consumer-app-bar.hoc';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/ButtonV2/constants';
import { useFormikContext } from 'formik';
import { OneClickCheckoutSkeleton } from '#src/pages/checkout/express-checkouts/components/OneClickCheckoutSkeleton';
import { OnlinePaymentBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/OnlinePaymentBasket';
import { useHandleUserRegistration } from './_hooks/useHandleUserRegistration';
import { getItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID } from '#src/actions/constants';
import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { PaymentButtons } from '#src/pages/checkout/express-checkouts/components/PaymentButtons';
import { SUBMIT_BUTTONS } from '#src/libs/checkout/types';
import { CheckPaymentIntent } from '#src/pages/checkout/express-checkouts/constants';
import { BASKET_INCONSISTENT } from '#src/libs/checkout/constants';
import { useCheckPaymentStatusFail } from '#src/pages/checkout/express-checkouts/hooks/useCheckPaymentStatusFail';
import { useNavigation } from '#src/pages/checkout/express-checkouts/hooks/useNavigation';
import { getUserRegistrationResponse } from '#src/pages/checkout/express-checkouts/utils/userRegistration';
import {
  useLightSignUpOperations,
  LightSignupCreateResult,
  LightSignupUpdateResult,
} from '#src/pages/checkout/express-checkouts/hooks/useLightSignUpOperations';

import './index.css';

enum RedirectStatus {
  SUCCEEDED = 'succeeded',
  PENDING = 'pending',
  FAILED = 'failed',
}

type OwnProps = {
  companyId: number;
  offerId: number;
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
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const OneClickBookingModule: React.FC<Props> = ({
  companyId,
  offerId,
  authenticated,
  theme,
  retrieveCompanyCssConfiguration,
  snackbarError,
  queryParams,
  setQueryParams,
}) => {
  const { t } = useTranslation(['booking', 'checkout']);

  const paymentRef = useRef(null);

  const { values: lightSignupValues, isValid } =
    useFormikContext<LightSignupFormValues>();

  const onCheckPaymentStatusFail = useCheckPaymentStatusFail(setQueryParams);

  const { goBackToCalendar } = useNavigation(companyId);

  const memberId =
    getItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID) ?? '';

  const [selectedPaymentPackId, setSelectedPaymentPackId] = useState<
    number | null
  >(null);

  const [bookableStatusState, checkBookableStatus] = useCheckBookableStatus();
  const [offerState, fetchOffer] = useFetchOfferInformation();

  const {
    bookInOneClick: [bookingState, bookInOneClick],
    redirectOnBookingSuccess,
  } = useBookInOneClick();

  const [
    { loading: userRegistrationLoading, value: userRegistrationValues },
    handleUserRegistration,
  ] = useHandleUserRegistration();

  const { basket, userRegistrationResponse } = userRegistrationValues ?? {};

  useEffect(() => {
    if (!!userRegistrationResponse) {
      setQueryParams('user_registration_response')(
        encodeURIComponent(JSON.stringify(userRegistrationResponse)),
      );
    }
  }, [userRegistrationResponse, setQueryParams]);

  const buyableItemErrorCode =
    userRegistrationResponse?.buyable_item_error_code;

  useEffect(() => {
    if (queryParams?.redirect_status !== RedirectStatus.FAILED) {
      checkBookableStatus(offerId);
    }
  }, [offerId, checkBookableStatus, queryParams?.redirect_status]);

  useEffect(() => {
    if (bookingState.error) {
      snackbarError('oneClickBooking.genericError');
    }
  }, [bookingState.error, snackbarError]);

  useEffect(() => {
    if (buyableItemErrorCode) {
      if (ALL_ERROR_CODES.includes(buyableItemErrorCode)) {
        snackbarError(`canNotBuyErrorCode.${buyableItemErrorCode}`);
      } else {
        snackbarError(`canNotBuyErrorCode.generic`);
      }
    }
  }, [buyableItemErrorCode, snackbarError]);

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

  const offer = offerState.value?.offer;
  const metaActivity = offerState.value?.metaActivity;
  const establishment = offerState.value?.establishment;
  const coach = offerState.value?.coach;
  const paymentPacks = offerState.value?.paymentPacks;

  const isSelectedPaymentPackFree = !paymentPacks?.find(
    ({ id }) => id === selectedPaymentPackId,
  )?.price;

  const {
    debouncedLightSignUp,
    lightSignUpWithoutDebounce,
    createdMember,
    updatedMember,
  } = useLightSignUpOperations({
    companyId,
    onDebouncedCreateSuccess: async (result: LightSignupCreateResult) => {
      await handleUserRegistration({
        companyId,
        offerId,
        email: result.email,
        paymentPackId: selectedPaymentPackId!,
      });
    },
    onImmediateCreateSuccess: async (result: LightSignupCreateResult) => {
      await bookInOneClick({
        offer: offer!,
        companyId,
        selectedPaymentPackId: selectedPaymentPackId!,
        email: result.email,
      });
    },
    onImmediateUpdateSuccess: async (result: LightSignupUpdateResult) => {
      await bookInOneClick({
        offer: offer!,
        companyId,
        selectedPaymentPackId: selectedPaymentPackId!,
        email: result.email,
      });
    },
    shouldSkip: !selectedPaymentPackId || !offer,
  });

  useEffect(() => {
    if (!isSelectedPaymentPackFree) debouncedLightSignUp();
  }, [debouncedLightSignUp, isSelectedPaymentPackFree, lightSignupValues]);

  useEffect(() => {
    (async () => {
      if (companyId) {
        retrieveCompanyCssConfiguration(companyId);
      }
      const response = await fetchOffer(offerId, companyId);
      if (response?.paymentPacks && response?.paymentPacks.length > 0) {
        setSelectedPaymentPackId(response.paymentPacks[0].id);
        if (!basket?.id && memberId) {
          handleUserRegistration({
            companyId,
            email: createdMember?.email || updatedMember?.email,
            offerId,
            paymentPackId: response.paymentPacks[0].id,
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, offerId]);

  const cleanLocalStorageAndRedirect = useCallback(() => {
    const basketId = queryParams?.basket_redirection
      ? queryParams.basket_redirection
      : basket?.id;

    redirectOnBookingSuccess({
      offer,
      basketId,
      userRegistrationResponse: getUserRegistrationResponse({
        getUserRegistrationFromStorage:
          queryParams?.get_user_registration_from_storage,
        userRegistrationResponse,
      }),
    });
  }, [
    basket?.id,
    redirectOnBookingSuccess,
    userRegistrationResponse,
    offer,
    queryParams?.get_user_registration_from_storage,
    queryParams?.basket_redirection,
  ]);

  const onBookWithFreePaymentPack = useCallback(async () => {
    if ((await checkBookableStatus(offerId))?.shouldDisplayErrorPage) {
      return;
    }

    await lightSignUpWithoutDebounce();
  }, [checkBookableStatus, offerId, lightSignUpWithoutDebounce]);

  const offerDate = useConsumerBookingDateTime({
    dateStart: offer?.date_start,
    durationMinute: offer?.duration_minute,
    establishmentTimezoneName: establishment?.tzname,
    isMetaActivityBroadcast: metaActivity?.is_broadcast,
    sessionTimeDisplay: theme.session_time_display,
    timezoneName: offer?.timezone_name,
  });

  const offerBookerUrl = getOfferBookerUrl(companyId, offerId);
  const loginToBookerUrl = getLoginUrl(
    companyId,
    offerBookerUrl,
    window.location.search,
  );

  const selectPaymentPack = useCallback(
    (paymentPackId: number) => async () => {
      setSelectedPaymentPackId(paymentPackId);
      if (memberId) {
        await handleUserRegistration({
          companyId,
          offerId,
          email: createdMember?.email ?? updatedMember?.email,
          paymentPackId: paymentPackId,
        });
      }
    },
    [
      offerId,
      companyId,
      handleUserRegistration,
      memberId,
      createdMember?.email,
      updatedMember?.email,
    ],
  );

  const isButtonLoading = bookingState.loading || userRegistrationLoading;

  const isBookButtonDisable =
    !isValid || !lightSignupValues.acceptTermsAndConditions;

  const shouldDisplayOnlinePayment =
    !!basket?.id &&
    !!memberId &&
    !!basket?.total_price_cts &&
    !userRegistrationLoading;

  // @debt(4, 2, 2) This works because we do not set the authenticated state in the redux store
  // when we are on the one click booking page (we are just storing the token in the local storage)
  if (authenticated) {
    return <Redirect to={offerBookerUrl} />;
  }

  if (bookableStatusState?.value?.shouldRedirect) {
    return <Redirect to={loginToBookerUrl} />;
  }

  if (
    !queryParams?.basket_redirection &&
    offerState.value?.paymentPacks &&
    offerState.value.paymentPacks.length === 0
  ) {
    return <Redirect to={loginToBookerUrl} />;
  }

  if (
    bookableStatusState?.error ||
    bookableStatusState?.value?.shouldDisplayErrorPage
  ) {
    return (
      <ErrorMessage
        /* Using "as" here to avoid redundance.
         * shouldDisplayErrorPage is already true only if statusCode is 1 | 2 | 3 | 4
         * Instead of writing again a if statement, we cast the value of statusCode
         */
        errorCode={bookableStatusState?.value?.statusCode as ErrorCode}
        goBack={goBackToCalendar}
        goBackButtonLabel={t('booking:oneClickBooking.goToCalendar')}
      />
    );
  }

  const offerLevelTranslation = getLevelTranslation(offer?.level, ' ', t);

  if (shouldCheckPaymentStatus(queryParams)) {
    return (
      <CheckPaymentStatus
        onFail={onCheckPaymentStatusFail}
        onSuccess={cleanLocalStorageAndRedirect}
        paymentIntent={queryParams.payment_intent}
      />
    );
  }

  if (!!memberId && isNaN(parseInt(memberId))) {
    throw new Error(
      'Invalid requirements: Member ID is present but not a valid number',
    );
  }

  return (
    <div className="bs-oneclick-booking__root">
      <div className="bs-oneclick-booking__container">
        <Typography variant={TypographyVariant.TITLE_LG}>
          {t('booking:oneClickBooking.checkoutTitle')}
        </Typography>
        <div className="bs-oneclick-booking__already-member--mobile">
          {t('booking:oneClickBooking.alreadyMember')}
          <ButtonV2
            color="primary"
            href={loginToBookerUrl}
            size="small"
            variant="text"
          >
            {t('booking:oneClickBooking.goToLogin')}
          </ButtonV2>
        </div>
        <OneClickCheckoutSkeleton isLoading={offerState.loading} />
        {offer && (
          <div className="bs-oneclick-booking__content">
            <div className="bs-oneclick-booking__booking-details">
              <Typography variant={TypographyVariant.TITLE_SM}>
                {t('booking:oneClickBooking.yourBooking')}
              </Typography>
              <div className="bs-oneclick-booking__booking-details__card">
                <ConsumerBookingDetailsCard
                  coachName={coach?.name}
                  coachPicture={coach?.photo}
                  consumerPaymentPackAvailableCredits={0}
                  consumerPaymentPackUsedCredits={0}
                  date={offerDate}
                  description={metaActivity?.description}
                  establishmentAddress={establishment?.location?.address}
                  establishmentTitle={establishment?.title}
                  isLoading={offerState.loading}
                  levelName={offerLevelTranslation}
                  metaActivityLastDiscardMinutes={
                    metaActivity?.last_discard_minutes
                  }
                  metaActivityName={metaActivity?.name}
                  metaActivityPicture={metaActivity?.cover_main}
                  paymentPackTotalCredits={0}
                  sessionTimeDisplay={offer?.duration_minute}
                  showPlaceholder={false}
                  timezoneName={offer?.timezone_name}
                />
              </div>
              <div className="bs-oneclick-booking__payment-packs">
                {offerState.value.paymentPacks.map((paymentPack) => (
                  <div
                    key={paymentPack.id}
                    className="bs-oneclick-booking__payment-pack-item"
                    onClick={selectPaymentPack(paymentPack.id)}
                  >
                    <MinimalPaymentPackCard
                      isFocused={paymentPack.id === selectedPaymentPackId}
                      isLoading={offerState.loading}
                      paymentPack={paymentPack}
                    />
                  </div>
                ))}
                <ButtonV2
                  color={ButtonColor.SECONDARY}
                  href={loginToBookerUrl}
                  size={ButtonSize.SM}
                  variant={ButtonVariant.TEXT}
                >
                  <div className="bs-oneclick-booking__see-more-with-login">
                    {t('booking:oneClickBooking.seeMoreWithLogin')}
                    <LinkExternal01 size="16px" />
                  </div>
                </ButtonV2>
              </div>
            </div>
            <div className="bs-oneclick-booking__divider" />

            <div className="bs-oneclick-booking__light-signup-form">
              <Typography variant={TypographyVariant.TITLE_SM}>
                {t('booking:oneClickBooking.yourDetails')}
              </Typography>
              <LightSignupForm />
              {shouldDisplayOnlinePayment && (
                <OnlinePaymentBasket
                  ref={paymentRef}
                  hideConfirmPaymentButton
                  basketId={basket.id}
                  companyId={companyId}
                  onConfirmPaymentSuccess={cleanLocalStorageAndRedirect}
                  payerContext={{
                    memberId: parseInt(memberId),
                    termsAndConditionsAccepted:
                      lightSignupValues.acceptTermsAndConditions,
                  }}
                  stripePaymentElementConfig={{
                    isDefaultForRegion: theme.is_default_for_region,
                    stripeId: theme.stripe_id,
                  }}
                />
              )}
              <div className="bs-oneclick-booking__already-member--desktop">
                {t('booking:oneClickBooking.alreadyMember')}
                <ButtonV2
                  color="primary"
                  href={loginToBookerUrl}
                  size="small"
                  variant="text"
                >
                  {t('booking:oneClickBooking.goToLogin')}
                </ButtonV2>
              </div>
              {isSelectedPaymentPackFree ? (
                <div className="bs-oneclick-booking__book-button-container">
                  <ButtonV2
                    className="bs-oneclick-booking__book-button"
                    color={ButtonColor.PRIMARY}
                    isDisabled={isBookButtonDisable}
                    onClick={onBookWithFreePaymentPack}
                    size={ButtonSize.LG}
                    variant={ButtonVariant.CONTAINED}
                  >
                    {isButtonLoading ? (
                      <div className="bs-light-signup-form__submit-button-loader">
                        <Loader />
                      </div>
                    ) : (
                      t('booking:oneClickBooking.bookButtonLabel')
                    )}
                  </ButtonV2>
                </div>
              ) : (
                <PaymentButtons
                  enforceDisabled={isBookButtonDisable}
                  paymentBasketRef={paymentRef}
                  paymentContext={{
                    basketId: basket?.id,
                    companyId,
                    memberId: parseInt(memberId),
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

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    theme: themeSelectors.getTheme(state),
    customConfiguration: state.exportableComponents.customCss,
  }),
  {
    snackbarError: snackbarErrorAction,
    retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  },
);

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    offerId: 'offerId:number',
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
)(OneClickBookingModule);
