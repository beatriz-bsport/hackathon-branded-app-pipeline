import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { getSimilars as getSimilarsOffers } from '../../libs/offer/selectors';
import { fetchSimilarOffers as fetchSimilarOffersAction } from '../../libs/offer/actions';
import {
  fetchByOfferByMember,
  fetchConsumerPaymentPackMaxoutBooking,
  fetchNonCompatibleByOfferByMember,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk } from '../../libs/payment-packs/actions';
import {
  getByOfferByMember,
  getNonCompatibleByOfferByMember,
  withPaymentPack,
} from '../../libs/consumer-payment-pack/selectors';
import { fetchMember } from '../../libs/member/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup,
} from '../../libs/establishment/actions';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import BookingModuleManagerComponent from '../../libs/booking/components/booker-module/BookerModuleManager.component';
import { RootState } from '../../reducers';
import themeSelectors from '../../libs/theme/selectors';
import { withIsSharedActive } from '../../libs/relationship/selectors';
import { fetchConsumerPaymentPackLinks } from '../../libs/relationship/actions';

export default compose(
  connect(
    (state: RootState) => ({
      consumerPacksLoading: state.consumerPaymentPack.byOfferByMember.loading,
      consumerPacks: withIsSharedActive(getByOfferByMember)(state),
      consumerPacksNonCompatible: withIsSharedActive(
        withPaymentPack(getNonCompatibleByOfferByMember),
      )(state),
      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,
      similarOffers: getSimilarsOffers(state),
      cppMaxoutBookingsByCpp: state.consumerPaymentPack.maxout_booking.byId,
      maxoutLoading: state.consumerPaymentPack.maxout_booking.loading,
      establishments: getAvailableEstablishmentList(state),
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      fetchPaymentPackBulk,
      fetchNoncompatibleConsumerPackByOfferByMember: fetchNonCompatibleByOfferByMember,
      fetchByOfferByMemberAction: fetchByOfferByMember,
      fetchMemberAction: fetchMember,
      fetchSimilarOffers: fetchSimilarOffersAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchConsumerPaymentPackMaxoutBooking,
      fetchEstablishments,
      fetchAllEstablishmentBillingGroup,
      fetchConsumerPaymentPackLinks,
    },
  ),

  withHandlers({
    fetchSimilarOffers: ({
      fetchMetaActivityBulk,
      fetchEstablishmentBulk,
      fetchCoachBulk,
      fetchSimilarOffers,
      offerId,
    }) => () => {
      fetchSimilarOffers(
        offerId,
        { wide: true },
        {
          onSuccess: (offers) => {
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity));
            fetchEstablishmentBulk(offers.map((o) => o.establishment));
            fetchCoachBulk(offers.map((o) => o.coach));
          },
        },
      );
    },
  }),
)(BookingModuleManagerComponent);
