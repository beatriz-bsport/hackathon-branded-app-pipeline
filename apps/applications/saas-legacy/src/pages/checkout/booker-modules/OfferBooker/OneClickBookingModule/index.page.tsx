import React, { useCallback, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
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
import useDebouncedCallback from '#src/hooks/useDebouncedCallBack';
import { useLightSignUp } from './_hooks/useLightSignUp';
import './index.css';
import { getItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID } from '#src/actions/constants';
import { getAuthToken } from '#src/http';

type OwnProps = {
  companyId: number;
  offerId: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

/**
 * Trims whitespace from all string fields in a LightSignupFormValues object.
 *
 * This function is necessary because the backend may return string values without
 * leading or trailing whitespace, while the frontend form values might contain
 * extraneous spaces. By trimming the form values before comparison, we ensure
 * consistency between the frontend and backend data. This consistency is crucial
 * for accurately determining whether an update is necessary, as it prevents
 * false positives caused by mere differences in whitespace.
 *
 * @param formValues - The LightSignupFormValues object containing form data.
 * @returns A new LightSignupFormValues object with all string fields trimmed of
 * leading and trailing whitespace.
 */
function trimFormValues(
  formValues: LightSignupFormValues,
): LightSignupFormValues {
  return {
    ...formValues,
    firstName: formValues.firstName.trim(),
    lastName: formValues.lastName.trim(),
    email: formValues.email.trim(),
    phone: formValues.phone.trim(),
  };
}

const OneClickBookingModule: React.FC<Props> = ({
  companyId,
  offerId,
  authenticated,
  theme,
  retrieveCompanyCssConfiguration,
  replace,
}) => {
  const DEBOUNCE_CALLBACK_DELAY = 1000;
  const {
    values: lightSignupValues,
    submitForm: submitLightSignupForm,
    validateForm: validateLightSignupForm,
    isValid,
  } = useFormikContext<LightSignupFormValues>();

  const getIsFormInvalid = useCallback(async () => {
    const formErrors = await validateLightSignupForm();
    return !(Object.values(formErrors).length === 0);
  }, [validateLightSignupForm]);

  const memberId = getItemInStorage(
    'local',
    STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID,
  );

  const token = getAuthToken();

  const isTokenNull = !token || token === 'null';

  const [selectedPaymentPackId, setSelectedPaymentPackId] = useState<
    number | null
  >(null);

  const [bookableStatusState, checkBookableStatus] = useCheckBookableStatus();
  const [offerState, fetchOffer] = useFetchOfferInformation();
  const [bookingState, bookInOneClick] = useBookInOneClick();
  const {
    lightSignupCreate: [
      {
        loading: lightSignupCreateLoading,
        error: lightSignupCreateError,
        value: createdMember,
      },
      lightSignupCreate,
    ],
    lightSignUpUpdate: [
      { value: updatedMember, error: lightSignupUpdateError },
      lightSignUpUpdate,
    ],
  } = useLightSignUp();

  const { t } = useTranslation('booking');

  const canPerformLightSignUpCreate =
    !memberId && isTokenNull && !lightSignupCreateLoading;

  const canPerformLightSignupUpdate =
    !!memberId &&
    !isTokenNull &&
    !!lightSignupValues &&
    !isEqual(updatedMember, trimFormValues(lightSignupValues));

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
    if (offerState.error || bookingState.error) {
      snackbarError('booking.fetch.error');
    }
  }, [offerState.error, bookingState.error]);

  const offer = offerState.value?.offer;
  const metaActivity = offerState.value?.metaActivity;
  const establishment = offerState.value?.establishment;
  const coach = offerState.value?.coach;
  const paymentPacks = offerState.value?.paymentPacks;

  const isSelectedPaymentPackFree = !paymentPacks?.find(
    ({ id }) => id === selectedPaymentPackId,
  )?.price;

  const debouncedLightSignUp = useDebouncedCallback(
    async () => {
      if (!selectedPaymentPackId || !offer) return;
      if (canPerformLightSignUpCreate) {
        if (!isValid || (await getIsFormInvalid())) {
          return;
        }
        await submitLightSignupForm();
        await lightSignupCreate({
          companyId,
          firstName: lightSignupValues.firstName,
          lastName: lightSignupValues.lastName,
          email: lightSignupValues.email,
          phone: lightSignupValues.phone,
          acceptEmail: lightSignupValues.acceptEmail,
          acceptSms: lightSignupValues.acceptSms,
          accept_terms_and_conditions:
            lightSignupValues.acceptTermsAndConditions,
        });
        return;
      }
      if (canPerformLightSignupUpdate) {
        if (!isValid || (await getIsFormInvalid())) {
          return;
        }
        await submitLightSignupForm();
        await lightSignUpUpdate({
          id: memberId,
          first_name: lightSignupValues.firstName,
          last_name: lightSignupValues.lastName,
          email: lightSignupValues.email,
          phone_number: lightSignupValues.phone,
          accept_email: lightSignupValues.acceptEmail,
          accept_sms: lightSignupValues.acceptSms,
          accept_terms_and_conditions:
            lightSignupValues.acceptTermsAndConditions,
        });
      }
    },
    DEBOUNCE_CALLBACK_DELAY,
    [
      checkBookableStatus,
      companyId,
      lightSignupCreate,
      lightSignupValues.acceptEmail,
      lightSignupValues.acceptSms,
      lightSignupValues.email,
      lightSignupValues.firstName,
      lightSignupValues.lastName,
      lightSignupValues.phone,
      lightSignupValues.acceptTermsAndConditions,
      offer,
      offerId,
      selectedPaymentPackId,
      submitLightSignupForm,
      validateLightSignupForm,
    ],
  );

  useEffect(() => {
    if (!isSelectedPaymentPackFree) debouncedLightSignUp();
  }, [debouncedLightSignUp, isSelectedPaymentPackFree, lightSignupValues]);

  const onBook = useCallback(async () => {
    if (!selectedPaymentPackId || !offer) return;
    if (await getIsFormInvalid()) {
      return;
    }
    if ((await checkBookableStatus(offerId))?.shouldDisplayErrorPage) {
      return;
    }

    await submitLightSignupForm();

    if (canPerformLightSignUpCreate) {
      await lightSignupCreate({
        companyId,
        firstName: lightSignupValues.firstName,
        lastName: lightSignupValues.lastName,
        email: lightSignupValues.email,
        phone: lightSignupValues.phone,
        acceptEmail: lightSignupValues.acceptEmail,
        acceptSms: lightSignupValues.acceptSms,
        accept_terms_and_conditions: lightSignupValues.acceptTermsAndConditions,
      });
      if (!lightSignupCreateError && !!createdMember) {
        await bookInOneClick({
          offer,
          companyId,
          selectedPaymentPackId,
          email: createdMember.email,
        });
      }
    } else {
      await lightSignUpUpdate({
        id: memberId,
        first_name: lightSignupValues.firstName,
        last_name: lightSignupValues.lastName,
        email: lightSignupValues.email,
        phone_number: lightSignupValues.phone,
        accept_email: lightSignupValues.acceptEmail,
        accept_sms: lightSignupValues.acceptSms,
        accept_terms_and_conditions: lightSignupValues.acceptTermsAndConditions,
      });
      if (!lightSignupUpdateError && !!updatedMember) {
        await bookInOneClick({
          offer,
          companyId,
          selectedPaymentPackId,
          email: updatedMember.email,
        });
      }
    }
  }, [
    lightSignupCreate,
    lightSignUpUpdate,
    lightSignupUpdateError,
    updatedMember,
    submitLightSignupForm,
    bookInOneClick,
    companyId,
    selectedPaymentPackId,
    offer,
    lightSignupValues.acceptEmail,
    lightSignupValues.acceptSms,
    lightSignupValues.firstName,
    lightSignupValues.lastName,
    lightSignupValues.email,
    lightSignupValues.phone,
    lightSignupValues.acceptTermsAndConditions,
    memberId,
    checkBookableStatus,
    offerId,
    canPerformLightSignUpCreate,
    createdMember,
    getIsFormInvalid,
    lightSignupCreateError,
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

  if (bookableStatusState?.value?.shouldRedirect) {
    return <Redirect to={loginToBookerUrl} />;
  }

  if (offerState.value?.paymentPacks && !offerState.value.paymentPacks.length) {
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
        <OneClickCheckoutSkeleton isLoading={offerState.loading} />
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
                  isDisabled={!isValid}
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
