import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { getSimilars as getSimilarsOffers } from '../../libs/offer/selectors';
import { fetchSimilarOffers as fetchSimilarOffersAction } from '../../libs/offer/actions';
import {
  fetchByOfferByMember,
  fetchNonCompatibleByOfferByMember,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk } from '../../libs/payment-packs/actions';
import {
  withPaymentPack,
  getByOfferByMember,
  getNonCompatibleByOfferByMember,
} from '../../libs/consumer-payment-pack/selectors';
import { fetchMember } from '../../libs/member/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import BookingModuleManagerComponent from '../../libs/booking/components/booker-module/BookerModuleManager.component';

export default compose(
  connect(
    (state) => ({
      consumerPacksLoading: state.consumerPaymentPack.byOfferByMember.loading,
      consumerPacks: withPaymentPack(getByOfferByMember)(state),
      consumerPacksNonCompatible: withPaymentPack(
        getNonCompatibleByOfferByMember,
      )(state),
      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,
      similarOffers: getSimilarsOffers(state),
    }),
    {
      fetchConsumerPackByOfferByMember: fetchByOfferByMember,
      fetchPaymentPackBulk,
      fetchNoncompatibleConsumerPackByOfferByMember: fetchNonCompatibleByOfferByMember,
      fetchByOfferByMemberAction: fetchByOfferByMember,
      fetchMemberAction: fetchMember,
      fetchSimilarOffers: fetchSimilarOffersAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
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
