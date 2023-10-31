import { compose, withHandlers } from 'recompose';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  getSimilars as getSimilarsOffers,
  getOffersListByGroup as getOffersListByGroupSelector,
  withEstablishment,
  withMetaActivity,
  compatiblePacksWithOfferAndEnabled,
} from '../../libs/offer/selectors';
import {
  fetchSimilarOffers as fetchSimilarOffersAction,
  checkOfferTagEligibility as checkOfferTagEligibilityAction,
  fetchOffersInGroup as fetchOffersInGroupAction,
  fetchOfferBulk as fetchOfferBulkAction,
  fetchCompatiblePacks as fetchCompatiblePacksAction,
} from '../../libs/offer/actions';
import {
  fetchByOfferByMember,
  fetchConsumerPaymentPackMaxoutBooking,
  fetchNonCompatibleByOfferByMember,
  fetchIncompatibilitiesReasonsByOfferByConsumerPack as fetchIncompatibilitiesReasonsByOfferByConsumerPackAction,
  resetIncompatibilitiesReasonsByOfferByConsumerPack as resetIncompatibilitiesReasonsByOfferByConsumerPackAction,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk } from '../../libs/payment-packs/actions';
import {
  getByOfferByMember,
  getNonCompatibleByOfferByMember,
  withPaymentPack,
  getIncompatibilitiesReasons,
} from '../../libs/consumer-payment-pack/selectors';
import { fetchMember } from '../../libs/member/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup,
} from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import {
  fetchGroupOffer as fetchGroupOfferAction,
  fetchSimilarGroupOffers as fetchSimilarGroupOffersAction,
} from '#libs/group-offer/actions';
import { getSimilarGroups } from '#libs/group-offer/selectors';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import BookingModuleManagerComponent from '../../libs/booking/components/booker-module/BookerModuleManager.component';
import { RootState } from '../../reducers';
import themeSelectors from '../../libs/theme/selectors';
import { withIsSharedActive } from '../../libs/relationship/selectors';
import { fetchConsumerPaymentPackLinks } from '../../libs/relationship/actions';
import { getFutureBookingsByMemberCount } from '#libs/booking/selectors';
import { fetchFutureBookingsByMember } from '#libs/booking/actions';

import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { withCustomLevel } from '#libs/level/selectors';
import { fetchCompanyUserRoles } from '#libs/role/actions';
import { getUserRole } from '#libs/role/selectors';

export default compose(
  connect(
    (state: RootState, props) => ({
      consumerPacksLoading: state.consumerPaymentPack.byOfferByMember.loading,
      consumerPacks: withIsSharedActive(withPaymentPack(getByOfferByMember))(
        state,
      ),
      consumerPacksNonCompatible: withIsSharedActive(
        withPaymentPack(getNonCompatibleByOfferByMember),
      )(state),
      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,
      similarOffers: withCustomLevel(getSimilarsOffers)(state),
      similarGroups: getSimilarGroups(state),
      cppMaxoutBookingsByCpp: state.consumerPaymentPack.maxout_booking.byId,
      maxoutLoading: state.consumerPaymentPack.maxout_booking.loading,
      establishments: getAvailableEstablishmentList(state),
      companyTheme: themeSelectors.getTheme(state),
      companyId: state.theme.theme.company,
      similarOfferGroup: withMetaActivity(
        withEstablishment(withCustomLevel(getOffersListByGroupSelector)),
      )(state, props.offer.group?.id ?? props.offer.group),
      compatiblePacks: compatiblePacksWithOfferAndEnabled(state),
      compatiblePacksLoading: state.offer.compatiblePacks.loading,
      userRole: getUserRole(state),
      incompatibilitiesReasons: getIncompatibilitiesReasons(state),
      nonCompatibleByOfferByMemberLoading:
        state.consumerPaymentPack.nonCompatibleByOfferByMember.loading,
      futureBookingsByMemberCount: getFutureBookingsByMemberCount(
        state,
        props.member.id,
      ),
    }),
    {
      fetchPaymentPackBulk,
      fetchNoncompatibleConsumerPackByOfferByMember:
        fetchNonCompatibleByOfferByMember,
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
      checkOfferTagEligibilityAction,
      fetchLevelList: fetchLevelListAction,
      fetchSimilarGroupOffers: fetchSimilarGroupOffersAction,
      fetchGroup: fetchGroupOfferAction,
      fetchOffersInGroup: fetchOffersInGroupAction,
      fetcOffersBulk: fetchOfferBulkAction,
      fetchCompatiblePacks: fetchCompatiblePacksAction,
      fetchCompanyUserRoles,
      fetchIncompatibilitiesReasonsByOfferByConsumerPack:
        fetchIncompatibilitiesReasonsByOfferByConsumerPackAction,
      resetIncompatibilitiesReasonsByOfferByConsumerPack:
        resetIncompatibilitiesReasonsByOfferByConsumerPackAction,
      pushRouter: push,
      fetchFutureBookingsByMember,
    },
  ),

  withHandlers({
    fetchSimilarOffers:
      ({
        fetchMetaActivityBulk,
        fetchEstablishmentBulk,
        fetchCoachBulk,
        fetchSimilarOffers,
        offerId,
      }) =>
      () => {
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
