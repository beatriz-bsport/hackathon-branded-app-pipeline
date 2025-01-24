import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import useAsyncFn from '#src/hooks/useAsyncFn';

import themeSelectors from '#src/libs/theme/selectors';
import { retrieveOffer } from '#src/libs/offer/api';
import { fetchPaymentPackList } from '#src/libs/payment-packs/api';
import { fetchMetaActivityDetails } from '#src/libs/meta-activity/api/common';
import { retrieveEstablishment } from '#src/libs/establishment/api';
import { fetchAssociatedCoaches } from '#src/libs/associated-coach/api';
import type { RootState } from '#src/reducers';
import { Redirect } from 'react-router-dom';
import { getOfferBookerUrl } from '#src/libs/marketplace/routing-utils';
import type { Coach } from '#src/libs/associated-coach/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Establishment } from '#src/libs/establishment/types';
import ConsumerBookingDetailsCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';
import { getLevelTranslation } from '#src/libs/level/utils';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';

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
  const fetchOfferInformation = async () => {
    const { data: offer } = await retrieveOffer(offerId);
    const { data: paymentPacks } = await fetchPaymentPackList({
      offer: offer.id,
      company: companyId,
      manager_only: false,
      disabled: false,
      as_consumer: true,
      page: 1,
      page_size: 300,
      include_expired: false,
      new_member_only: true,
    });
    let metaActivity: MetaActivity | undefined;
    let establishment: Establishment | undefined;
    let coach: Coach | undefined;
    try {
      metaActivity = (await fetchMetaActivityDetails(offer.meta_activity)).data;
      establishment = (await retrieveEstablishment(offer.establishment)).data;

      coach = (await fetchAssociatedCoaches({ id__in: [offer.coach] }))
        .data?.[0];
    } catch (error) {
      console.error(error);
    }

    return {
      offer,
      paymentPacks,
      metaActivity,
      establishment,
      coach,
    };
  };

  const [state, doFetchOffer] = useAsyncFn(fetchOfferInformation, [
    offerId,
    companyId,
  ]);

  const { t } = useTranslation();

  // TODO: Add a method to create the member and fetch the current basket right after
  // TODO: Add a method to add the offer to the basket based on postUserRegistration

  useEffect(() => {
    (async () => {
      if (companyId) {
        retrieveCompanyCssConfigurationAction(companyId);
      }
      await doFetchOffer();
    })();
  }, [companyId, offerId]);

  const offer = state.value?.offer;
  const metaActivity = state.value?.metaActivity;
  const establishment = state.value?.establishment;
  const coach = state.value?.coach;

  const offerDate = useConsumerBookingDateTime({
    dateStart: offer?.date_start,
    durationMinute: offer?.duration_minute,
    establishmentTimezoneName: establishment?.tzname,
    isMetaActivityBroadcast: metaActivity?.is_broadcast,
    sessionTimeDisplay: theme.session_time_display,
    timezoneName: offer?.timezone_name,
  });

  if (authenticated) {
    return (
      <Redirect
        to={getOfferBookerUrl(companyId, offerId, window.location.search)}
      />
    );
  }

  if (state.loading) {
    return <div className="">Loading...</div>;
  }

  const offerLevelTranslation = getLevelTranslation(offer?.level, ' ', t);

  return (
    <div className="">
      {state.error && <span>Some error occured</span>}
      <ConsumerBookingDetailsCard
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
        metaActivityLastDiscardMinutes={metaActivity?.last_discard_minutes}
        metaActivityName={metaActivity?.name}
        metaActivityPicture={metaActivity?.cover_main}
        paymentPackTotalCredits={0}
        sessionTimeDisplay={offer?.duration_minute}
        showPlaceholder={false}
        timezoneName={offer?.timezone_name}
      />
    </div>
  );
};

const connector = connect((state: RootState) => ({
  authenticated: state.auth.authenticated,
  theme: themeSelectors.getTheme(state),
}));

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    offerId: 'offerId:number',
  }),
  connector,
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(OneClickBookingModule);
