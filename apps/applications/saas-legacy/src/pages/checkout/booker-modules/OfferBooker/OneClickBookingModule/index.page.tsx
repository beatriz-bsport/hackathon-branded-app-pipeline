import React, { useCallback, useEffect, useState } from 'react';
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
import Skeleton from '#src/components/css-only/Skeleton';
import Typography from '#src/components/css-only/Fabrique/Typography/Typography.component';
import { TypographyVariant } from '#src/components/css-only/Fabrique/Typography/constants';
import ButtonV2 from '#src/components/css-only/Fabrique/ButtonV2';
import MinimalPaymentPackCard from '#src/libs/marketplace/components/@PaymentPack/MinimalPaymentPackCard';
import { LinkExternal01 } from '#src/components/untitledui';
import './index.css';
import LightSignupForm, {
  LightSignupFormValues,
} from './_components/LightSignupForm';
import useFetchOfferInformation from './_hooks/useFetchOfferInformation';
import useBookInOneClick from './_hooks/useBookInOneClick';

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
}) => {
  const [selectedPaymentPackId, setSelectedPaymentPackId] = useState<
    number | null
  >(null);

  const [state, fetchOffer] = useFetchOfferInformation();
  const [bookingState, bookInOneClick] = useBookInOneClick();

  const { t } = useTranslation('booking');

  useEffect(() => {
    (async () => {
      if (companyId) {
        retrieveCompanyCssConfigurationAction(companyId);
      }
      const { paymentPacks } = await fetchOffer(offerId, companyId);
      if (paymentPacks.length > 0) {
        setSelectedPaymentPackId(paymentPacks[0].id);
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

  const onSubmitLightSignupForm = useCallback(
    async (formValues: LightSignupFormValues) => {
      await bookInOneClick({
        companyId,
        selectedPaymentPackId,
        offer,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone,
      });
    },
    [companyId, selectedPaymentPackId, offer, bookInOneClick],
  );

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

  // @debt(4, 2, 2) This works because we do not set the authenticated state in the redux store
  // when we are on the one click booking page (we are just storing the token in the local storage)
  if (authenticated) {
    return <Redirect to={offerBookerUrl} />;
  }

  const offerLevelTranslation = getLevelTranslation(offer?.level, ' ', t);

  return (
    <div className="bs-oneclick-booking__container">
      <Typography variant={TypographyVariant.TITLE_LG}>
        {t('oneClickBooking.checkoutTitle')}
      </Typography>
      <div className="bs-oneclick-booking__already-member">
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
      {state.loading && (
        <>
          <Skeleton className="bs-oneclick-booking__skeleton--tiny" />
          <Skeleton className="bs-oneclick-booking__skeleton" />
          <Skeleton className="bs-oneclick-booking__skeleton--small" />
          <Skeleton className="bs-oneclick-booking__skeleton--small" />
          <Skeleton className="bs-oneclick-booking__skeleton" />
        </>
      )}
      {offer && (
        <div className="bs-oneclick-booking__booking-details">
          <Typography variant={TypographyVariant.TITLE_SM}>
            {t('oneClickBooking.yourBooking')}
          </Typography>
          <div className="bs-oneclick-booking__booking-details__card">
            <ConsumerBookingDetailsCard
              collapsable
              coachName={coach?.name}
              coachPicture={coach?.photo}
              consumerPaymentPackAvailableCredits={0}
              consumerPaymentPackUsedCredits={0}
              date={offerDate}
              description={metaActivity?.description}
              establishmentAddress={establishment?.location.address}
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
                onClick={() => setSelectedPaymentPackId(paymentPack.id)}
              >
                <MinimalPaymentPackCard
                  isFocused={paymentPack.id === selectedPaymentPackId}
                  isLoading={state.loading}
                  paymentPack={paymentPack}
                />
              </div>
            ))}
            <ButtonV2
              color="secondary"
              href={loginToBookerUrl}
              size="small"
              variant="text"
            >
              <div className="bs-oneclick-booking__see-more-with-login">
                {t('oneClickBooking.seeMoreWithLogin')}
                <LinkExternal01 size="16px" />
              </div>
            </ButtonV2>
          </div>
          <div className="bs-oneclick-booking__light-signup-form">
            <LightSignupForm submitValidatedForm={onSubmitLightSignupForm} />
          </div>
        </div>
      )}
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
)(OneClickBookingModule);
