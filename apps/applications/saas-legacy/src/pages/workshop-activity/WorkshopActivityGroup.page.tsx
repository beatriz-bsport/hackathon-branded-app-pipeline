import memoize from 'lodash/memoize';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  goBack as goBackRouter,
  push as pushRouter,
} from 'connected-react-router';

import { withWidth } from '@material-ui/core';

import { fetchEstablishments as fetchEstablishmentsAction } from '#src/libs/establishment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#src/libs/associated-coach/actions';
import { fetchRoomBlueprints as fetchRoomBlueprintsAction } from '#src/libs/spot-scheduling/actions';
import { fetchAllCoachPaymentRules as fetchAllCoachPaymentRulesAction } from '#src/libs/coach-payment-rules/actions';
import { setWorkshopGroupFilter as setWorkshopGroupFilterAction } from '#src/libs/user-preference/actions';
import {
  fetchMetaActivities as fetchMetaActivitiesAction,
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
} from '#src/libs/meta-activity/actions';
import {
  fetchGroupsOfferList as fetchGroupsOfferListAction,
  fetchGroupOffer as fetchGroupOfferAction,
  createGroupOffers as createGroupOffersAction,
  generateGroupOffersPreview as generateGroupOffersPreviewAction,
  resetGeneratePreview as resetGeneratePreviewAction,
  editGroupOffer as editGroupOfferAction,
  fetchSimilarGroupOffers as fetchSimilarGroupOffersAction,
  deleteGroupOffer as deleteGroupOfferAction,
  fetchExistingGroupOffer as fetchExistingGroupOfferAction,
} from '#src/libs/group-offer/actions';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#src/libs/level/actions';
import {
  fetchBookedGenderBulk as fetchBookedGenderBulkAction,
  fetchOfferBulkBatched as fetchOfferBulkBatchedAction,
  restoreOffer as restoreOfferActtion,
  editOffers as editOffersAction,
  deleteOffer as deleteOfferAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
  disableOffer as disableOfferAction,
  hardDeleteOffers as hardDeleteOffersAction,
  fetchSimilarOffersWithReset as fetchSimilarOffersWithResetAction,
} from '#src/libs/offer/actions';
import { snackbarSuccess as snackbarSuccessAction } from '#src/libs/snackbar/actions';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#src/libs/member/actions';
import { fetchBookingsByOffer as fetchBookingsByOfferAction } from '#src/libs/booking/actions';

import { getOfferBookingList } from '#src/libs/booking/selectors';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
  withCustomLevel,
} from '#src/libs/level/selectors';
import { getActiveCoaches } from '#src/libs/associated-coach/selectors';
import {
  getAllEstablishments,
  getAvailableEstablishmentList,
} from '#src/libs/establishment/selectors';
import {
  getAvailableRoomBlueprints,
  getRoomBlueprints,
} from '#src/libs/spot-scheduling/selector';
import { CoachPaymentRuleByKindSelector } from '#src/libs/coach-payment-rules/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import themeSelectors from '#src/libs/theme/selectors';
import {
  getGroupPreview,
  getGroupList,
  getGroupListCount,
  withGroup,
  getOffersListByGroup as getOffersListByGroupSelector,
  getSimilarGroups,
} from '#src/libs/group-offer/selectors';
import { getWorkshopGroupFilter } from '#src/libs/user-preference/selectors';
import {
  getOfferById,
  withMetaActivity,
  withCoach,
  withEstablishment,
  withGender,
  withTags,
  getSimilars as getSimilarsOffers,
} from '#src/libs/offer/selectors';
import { getEnabledWorkshops } from '#src/libs/meta-activity/selectors';
import {
  getAllMembers,
  withTags as withMemberTag,
} from '#src/libs/member/selectors';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { fetchZoomApp as fetchZoomAppAction } from '#src/libs/zoom-app/actions';
import zoomAppSelectors from '#src/libs/zoom-app/selectors';
import WorkshopActivityGroup from './WorkshopActivityGroup.component';
import { RootState } from '../../reducers';

export const workshopActivityGroupConnector = connect(
  (
    state: RootState,
    routerProps: { selectedOfferId?: number; metaActivityId?: number },
  ) => ({
    metaActivities: getEnabledWorkshops(state),
    metaActivityLoading: state.metaActivity.loading,
    groupList: getGroupList(state),
    groupListCount: getGroupListCount(state),
    groupListLoading: state.groupOffer.loading,
    getOffersListByGroup: memoize((id: number) =>
      getOffersListByGroupSelector(state, id),
    ),
    similarGroups: getSimilarGroups(state),
    similarLoading: state.groupOffer.similar.loading,
    metaActivity: state.metaActivity.byId?.[routerProps.metaActivityId],
    groupExistLoading: state.groupOffer.existing.loading,
    groupExist: state.groupOffer.existing.exist,
    // Edit offer
    coachesLoading: state.coach.loading,
    allCustomLevels: getAllCustomLevels(state),
    similarOfferLoading: state.offer.similarOffers.loading,
    establishmentsLoading: state.establishment.loading,
    similarOffers: withEstablishment(withCoach(getSimilarsOffers))(state),
    editOfferProcessing: state.offer.edit.loading,

    // Offer Card
    selectedOffer: withTags(
      withMetaActivity(
        withGroup(
          // @ts-expect-error
          withCustomLevel(
            // @ts-expect-error
            withEstablishment(withCoach(withGender(getOfferById))),
          ),
        ),
      ),
      // @ts-expect-error
    )(state, routerProps.selectedOfferId),
    bookings: getOfferBookingList(state),
    bookingsLoading: state.booking.byOffer.loading,
    members: withMemberTag(getAllMembers)(state),
    membersLoading: state.member.loading,
    // Modal Creation / Edit
    availableEstablishments: getAvailableEstablishmentList(state),
    allEstablishments: getAllEstablishments(state),
    coaches: getActiveCoaches(state),
    theme: themeSelectors.getTheme(state),
    availableRoomBlueprints: getAvailableRoomBlueprints(state),
    allRoomBlueprints: getRoomBlueprints(state),
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    groupPreview: getGroupPreview(state),
    customLevels: getActiveCustomLevels(state),
    companyId: state.theme.theme.company,
    zoomAppDetail: zoomAppSelectors.getZoomApp(state),
  }),
  {
    fetchGroupsOfferList: fetchGroupsOfferListAction,
    createGroupOffers: createGroupOffersAction,
    generateGroupOffersPreview: generateGroupOffersPreviewAction,
    fetchOfferBulk: fetchOfferBulkBatchedAction,
    editGroupOffer: editGroupOfferAction,
    fetchSimilarGroupOffers: fetchSimilarGroupOffersAction,
    deleteGroupOffer: deleteGroupOfferAction,
    fetchExistingGroupOffer: fetchExistingGroupOfferAction,
    resetPreview: resetGeneratePreviewAction,
    fetchSimilarOffersWithReset: fetchSimilarOffersWithResetAction,

    // Offers Modal
    fetchSimilarOffers: fetchSimilarOffersAction,
    editOffers: editOffersAction,
    disableOffer: disableOfferAction,
    hardDeleteOffers: hardDeleteOffersAction,

    // Offer Card
    fetchBookedGenderBulk: fetchBookedGenderBulkAction,
    restoreOffer: restoreOfferActtion,
    deleteOffer: deleteOfferAction,
    fetchFilteredMembers: fetchFilteredMembersAction,
    snackbarSuccess: snackbarSuccessAction,
    fetchBookingsByOffer: fetchBookingsByOfferAction,
    fetchGroupOffer: fetchGroupOfferAction,
    // Modal Creation / Edit
    fetchLevelList: fetchLevelListAction,
    updateLevel: updateLevelAction,
    createLevel: createLevelAction,
    deleteLevel: deleteLevelAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchRoomBlueprints: fetchRoomBlueprintsAction,
    fetchAllCoachPaymentRules: fetchAllCoachPaymentRulesAction,
    fetchMetaActivities: fetchMetaActivitiesAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    goBack: goBackRouter,
    push: pushRouter,
    fetchZoomApp: fetchZoomAppAction,
  },
);

export default compose(
  routerParamsToProps({
    selectedOfferId: 'selectedOfferId:number',
  }),
  withWidth(),
  workshopActivityGroupConnector,
  connect(
    (state: RootState) => ({
      filter: getWorkshopGroupFilter(state),
    }),
    {
      setWorkshopGroupFilter: setWorkshopGroupFilterAction,
    },
  ),
)(WorkshopActivityGroup);
