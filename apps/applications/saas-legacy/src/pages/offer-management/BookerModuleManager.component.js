import { compose, withHandlers } from 'recompose';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import {
  fetchGroupOffer as fetchGroupOfferAction,
  fetchSimilarGroupOffers as fetchSimilarGroupOffersAction,
} from '#src/libs/group-offer/actions';
import { getSimilarGroups } from '#src/libs/group-offer/selectors';
import { getFutureBookingsByMemberCount } from '#src/libs/booking/selectors';
import { fetchFutureBookingsByMember } from '#src/libs/booking/actions';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { withCustomLevel } from '#src/libs/level/selectors';
import { fetchCompanyUserRoles } from '#src/libs/role/actions';
import { getUserRole } from '#src/libs/role/selectors';
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
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
  getStaffEstablishmentBillingGroupSelector,
} from '../../libs/establishment/selectors';
import BookingModuleManagerComponent from '../../libs/booking/components/booker-module/BookerModuleManager.component';
import { RootState } from '../../reducers';
import themeSelectors from '../../libs/theme/selectors';
import { withIsSharedActive } from '../../libs/relationship/selectors';
import { fetchConsumerPaymentPackLinks } from '../../libs/relationship/actions';

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
      establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
      staffDefaultEstablishmentBillingGroup:
        getStaffEstablishmentBillingGroupSelector(state),
      companyTheme: themeSelectors.getTheme(state),
      companyId: state.theme.theme.company,
      similarOfferGroup: withMetaActivity(
        withEstablishment(withCustomLevel(getOffersListByGroupSelector)),
      )(state, props.offer.group?.id ?? props.offer.group),
      similarOfferGroupLoading: state.offer.groups.loading,
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
    fetchAssociatedOffers:
      ({
        fetchMetaActivityBulk,
        fetchEstablishmentBulk,
        fetchCoachBulk,
        fetchSimilarOffers,
        fetchOffersInGroup,
        offerId,
        offer,
      }) =>
      () => {
        // For offers with a group, we fetch the offers in the same group rather than with the same recurrent id
        if (offer.group) {
          fetchOffersInGroup(offer.group.id);
          return;
        }
        // Otherwise, we fetch similar offers based on the recurrent id or the datetime of the session
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
