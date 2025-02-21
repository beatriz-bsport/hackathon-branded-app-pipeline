import React, { useCallback, useEffect, useState } from 'react';
import { replace as replaceRouter } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { snackbarError } from '#src/libs/snackbar/actions';
import themeSelectors from '#src/libs/theme/selectors';
import type { RootState } from '#src/reducers';
import { Redirect } from 'react-router-dom';
import {
  getLoginUrl,
  getOfferBookerUrl,
} from '#src/libs/marketplace/routing-utils';
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
} from './_components/LightSignupForm';
import useFetchOfferInformation from './_hooks/useFetchOfferInformation';
import useBookInOneClick from './_hooks/useBookInOneClick';
import { ErrorCode, ErrorMessage } from './_components/ErrorMessage';
import useCheckBookableStatus from './_hooks/useCheckBookableStatus';
import Loader from './_components/Loader';
import { consumerAppBarHOC } from '#src/hocs/consumer-app-bar.hoc';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/ButtonV2/constants';
import { useFormikContext } from 'formik';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { urlToMarketplace } from '#src/libs/marketplace/utils';
import { OneClickCheckoutSkeleton } from '#src/pages/checkout/booker-modules/OfferBooker/OneClickBookingModule/_components/OneClickCheckoutSkeleton';
import './index.css';

type OwnProps = {
  companyId: number;
  offerId: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const OneClickBookingModule: React.FC<Props> = ({
  companyId,
  offerId,
  authenticated,
  theme,
  retrieveCompanyCssConfiguration,
  replace,
}) => {
  const {
    values: lightSignupValues,
    submitForm: submitLightSignupForm,
    validateForm: validateLightSignupForm,
  } = useFormikContext<LightSignupFormValues>();
  const [selectedPaymentPackId, setSelectedPaymentPackId] = useState<
    number | null
  >(null);

  const [bookableStatusState, checkBookableStatus] = useCheckBookableStatus();
  const [state, fetchOffer] = useFetchOfferInformation();
  const [bookingState, bookInOneClick] = useBookInOneClick();

  const { t } = useTranslation('booking');

  useEffect(() => {
    checkBookableStatus(offerId);
  }, [offerId, checkBookableStatus]);

  useEffect(() => {
    (async () => {
      if (companyId) {
        retrieveCompanyCssConfiguration(companyId);
      }
      const response = await fetchOffer(offerId, companyId);
      if (response?.paymentPacks && response?.paymentPacks.length > 0) {
        setSelectedPaymentPackId(response.paymentPacks[0].id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, offerId]);

  useEffect(() => {
    if (state.error || bookingState.error) {
      snackbarError('booking.fetch.error');
    }
  }, [state.error, bookingState.error]);

  const offer = state.value?.offer;
  const metaActivity = state.value?.metaActivity;
  const establishment = state.value?.establishment;
  const coach = state.value?.coach;

  const onBook = useCallback(async () => {
    const formErrors = await validateLightSignupForm();
    const isFormValid = Object.values(formErrors).length === 0;
    if (!isFormValid) {
      return;
    }
    if ((await checkBookableStatus(offerId))?.shouldDisplayErrorPage) {
      return;
    }
    await submitLightSignupForm();
    await bookInOneClick({
      companyId,
      selectedPaymentPackId,
      offer,
      firstName: lightSignupValues.firstName,
      lastName: lightSignupValues.lastName,
      email: lightSignupValues.email,
      phone: lightSignupValues.phone,
    });
  }, [
    validateLightSignupForm,
    submitLightSignupForm,
    bookInOneClick,
    companyId,
    selectedPaymentPackId,
    offer,
    lightSignupValues.firstName,
    lightSignupValues.lastName,
    lightSignupValues.email,
    lightSignupValues.phone,
    checkBookableStatus,
    offerId,
  ]);

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

  const goBackToCalendar = () => {
    if (WidgetUtils.isWidget()) {
      WidgetUtils.handleGoBackNavigation();
    }
    replace(urlToMarketplace(theme?.company_name, companyId.toString()));
  };

  const selectPaymentPack = useCallback(
    (paymentPackId: number) => () => setSelectedPaymentPackId(paymentPackId),
    [],
  );

  // @debt(4, 2, 2) This works because we do not set the authenticated state in the redux store
  // when we are on the one click booking page (we are just storing the token in the local storage)
  if (authenticated) {
    return <Redirect to={offerBookerUrl} />;
  }

  if (bookableStatusState.loading || !bookableStatusState.value) {
    return (
      <div className="bs-oneclick-booking__container--loading">
        <Loader />
      </div>
    );
  }

  if (bookableStatusState.value.shouldRedirect) {
    return <Redirect to={loginToBookerUrl} />;
  }

  if (state.value?.paymentPacks && state.value.paymentPacks.length === 0) {
    return <Redirect to={loginToBookerUrl} />;
  }

  if (
    bookableStatusState.error ||
    bookableStatusState.value?.shouldDisplayErrorPage
  ) {
    return (
      <ErrorMessage
        /* Using "as" here to avoid redundance.
         * shouldDisplayErrorPage is already true only if statusCode is 1 | 2 | 3 | 4
         * Instead of writing again a if statement, we cast the value of statusCode
         */
        errorCode={bookableStatusState.value.statusCode as ErrorCode}
        goBackToCalendar={goBackToCalendar}
      />
    );
  }

  const offerLevelTranslation = getLevelTranslation(offer?.level, ' ', t);

  return (
    <div className="bs-oneclick-booking__root">
      <div className="bs-oneclick-booking__container">
        <Typography variant={TypographyVariant.TITLE_LG}>
          {t('oneClickBooking.checkoutTitle')}
        </Typography>
        <div className="bs-oneclick-booking__already-member--mobile">
          {t('oneClickBooking.alreadyMember')}
          <ButtonV2
            color="primary"
            href={loginToBookerUrl}
            size="small"
            variant="text"
          >
            {t('oneClickBooking.goToLogin')}
          </ButtonV2>
        </div>
        <OneClickCheckoutSkeleton isLoading={state.loading} />
        {offer && (
          <div className="bs-oneclick-booking__content">
            <div className="bs-oneclick-booking__booking-details">
              <Typography variant={TypographyVariant.TITLE_SM}>
                {t('oneClickBooking.yourBooking')}
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
                  isLoading={state.loading}
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
                {state.value?.paymentPacks.map((paymentPack) => (
                  <div
                    key={paymentPack.id}
                    className="bs-oneclick-booking__payment-pack-item"
                    onClick={selectPaymentPack(paymentPack.id)}
                  >
                    <MinimalPaymentPackCard
                      isFocused={paymentPack.id === selectedPaymentPackId}
                      isLoading={state.loading}
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
                    {t('oneClickBooking.seeMoreWithLogin')}
                    <LinkExternal01 size="16px" />
                  </div>
                </ButtonV2>
              </div>
            </div>
            <div className="bs-oneclick-booking__divider" />

            <div className="bs-oneclick-booking__light-signup-form">
              <Typography variant={TypographyVariant.TITLE_SM}>
                {t('oneClickBooking.yourDetails')}
              </Typography>
              <LightSignupForm />
              <div className="bs-oneclick-booking__already-member--desktop">
                {t('oneClickBooking.alreadyMember')}
                <ButtonV2
                  color="primary"
                  href={loginToBookerUrl}
                  size="small"
                  variant="text"
                >
                  {t('oneClickBooking.goToLogin')}
                </ButtonV2>
              </div>
              <div className="bs-oneclick-booking__book-button-container">
                <ButtonV2
                  className="bs-oneclick-booking__book-button"
                  color={ButtonColor.PRIMARY}
                  onClick={onBook}
                  size={ButtonSize.LG}
                  variant={ButtonVariant.CONTAINED}
                >
                  {bookingState.loading ? (
                    <div className="bs-light-signup-form__submit-button-loader">
                      <Loader />
                    </div>
                  ) : (
                    t('oneClickBooking.bookButtonLabel')
                  )}
                </ButtonV2>
              </div>
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
  }),
  {
    snackbarError,
    retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
    replace: replaceRouter,
  },
);

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    offerId: 'offerId:number',
  }),
  connector,
  marketplaceCssHoc(),
  WithCustomCssProvider,
  consumerAppBarHOC(),
  lightSignupFormWrapper,
)(OneClickBookingModule);
