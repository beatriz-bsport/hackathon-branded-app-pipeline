import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { Offer } from '#src/libs/offer/types';
import {
  withCoach,
  withEstablishment,
  withMetaActivity,
  getOfferDataList,
} from '#src/libs/offer/selectors';
import { withCustomLevel } from '#src/libs/level/selectors';
import { getAllCoaches } from '#src/libs/associated-coach/selectors';
import {
  getMetaActivities,
  getWorkshops,
} from '#src/libs/meta-activity/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { SCT } from '#src/libs/category/types';
import { Coach } from '#src/libs/associated-coach/types';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
} from '#src/libs/establishment/selectors';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import { ReplacementRequestStatus } from './constants';
import {
  DisciplineGroup,
  ReplacementRequest,
  ReplacementRequestState,
} from './types';
import { RootState } from '../../reducers';

const getState = (state: RootState): ReplacementRequestState =>
  state.replacementRequest;

const _getReplacementRequestsDetails = (state: RootState) =>
  getState(state).byId;

const _getReplacementRequestsIdList = (state: RootState) =>
  getState(state).allIds;

const _getPendingReplacementRequestsDetails = (state: RootState) =>
  getState(state).pendingRequests.byId;

const _getPendingReplacementRequestsIdList = (state: RootState) =>
  getState(state).pendingRequests.allIds;
const _getTeacherFoundReplacementRequestsDetails = (state: RootState) =>
  getState(state).teacherFoundRequests.byId;

const _getTeacherFoundReplacementRequestsIdList = (state: RootState) =>
  getState(state).teacherFoundRequests.allIds;

export const getReplacementRequestById = (state: RootState) => (id: number) => {
  return getState(state).byId[id];
};

export const getAllReplacementRequestsDict = (
  state: RootState,
): { [key: string]: ReplacementRequest } => getState(state).byId;

export const getAllReplacementRequests = createSelector(
  [_getReplacementRequestsIdList, _getReplacementRequestsDetails],
  (ids, data) => {
    return ids.map((id) => data[id]);
  },
);

export const getAllPendingReplacementRequestsSpecificPagination =
  createSelector(
    [
      _getPendingReplacementRequestsIdList,
      _getPendingReplacementRequestsDetails,
    ],
    (ids, data) => {
      return ids.map((id) => data[id]);
    },
  );
export const getAllTeacherFoundReplacementRequestsSpecificPagination =
  createSelector(
    [
      _getTeacherFoundReplacementRequestsIdList,
      _getTeacherFoundReplacementRequestsDetails,
    ],
    (ids, data) => {
      return ids.map((id) => data[id]);
    },
  );

export const getAllPendingReplacementRequests = createSelector(
  [getAllReplacementRequests],
  (replacementRequests) =>
    replacementRequests.filter((r: ReplacementRequest) =>
      [
        ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS,
        ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS,
      ].includes(r.status),
    ),
);

export const withCompleteOffer = memoize(
  (selector: (state: RootState) => any) =>
    createSelector(
      [
        selector,
        withMetaActivity(
          withCustomLevel(withCoach(withEstablishment(getOfferDataList))),
        ),
      ],
      (replacementRequests, offerData) => {
        if (!replacementRequests) return null;
        if (!Array.isArray(replacementRequests)) {
          return {
            ...replacementRequests,
            offer:
              offerData.find(
                (offer: Offer) =>
                  offer.id === replacementRequests.offer ||
                  offer.id === replacementRequests.offer?.id,
              ) || replacementRequests.offer,
          };
        }

        return replacementRequests.map((rr) => ({
          ...rr,
          offer:
            offerData.find(
              (offer: Offer) =>
                offer.id === rr.offer || offer.id === rr.offer?.id,
            ) || rr.offer,
        }));
      },
    ),
);

const _getReplacementRequestCoachAnswersDetails = (state: RootState) =>
  getState(state).replacementRequestCoachAnswer.byId;

const _getReplacementRequestCoachAnswersIdList = (state: RootState) =>
  getState(state).replacementRequestCoachAnswer.allIds;

export const getReplacementRequestCoachAnswerById =
  (state: RootState) => (id: number) => {
    return getState(state).replacementRequestCoachAnswer.byId[id];
  };

export const getAllReplacementRequestCoachAnswers = createSelector(
  [
    _getReplacementRequestCoachAnswersIdList,
    _getReplacementRequestCoachAnswersDetails,
  ],
  (ids, data) => {
    return ids.map((id) => data[id]).filter((ca) => !!ca);
  },
);

export const withCoachAnswers = memoize((selector: (state: RootState) => any) =>
  createSelector(
    [selector, getAllCoaches, getAllReplacementRequestCoachAnswers],
    (replacementRequests, coaches, coachAnswers) => {
      if (!replacementRequests) return null;
      if (!Array.isArray(replacementRequests)) {
        return {
          ...replacementRequests,
          coach_author:
            coaches.find(
              (coach) => coach.id === replacementRequests.coach_author,
            ) || replacementRequests.coach_author,
          coach_answer: replacementRequests.coach_answer
            // @ts-expect-error
            .map((answerId) => coachAnswers.find((ca) => ca.id === answerId))
            // @ts-expect-error
            .filter((ca) => !!ca)
            // @ts-expect-error
            .map((ca) => ({
              ...ca,
              coach: coaches.find((coach) => coach.id === ca.coach),
            }))
            // @ts-expect-error
            .filter((ca) => !!ca.coach),
        };
      }

      return replacementRequests.map((rr) => ({
        ...rr,
        coach_author:
          coaches.find((coach) => coach.id === rr.coach_author) ||
          rr.coach_author,
        coach_answer: rr.coach_answer
          // @ts-expect-error
          .map((answerId) => coachAnswers.find((ca) => ca.id === answerId))
          // @ts-expect-error
          .filter((ca) => !!ca)
          // @ts-expect-error
          .map((ca) => ({
            ...ca,
            coach: coaches.find((coach) => coach.id === ca.coach),
          }))
          // @ts-expect-error
          .filter((ca) => !!ca.coach),
      }));
    },
  ),
);

export const getDisciplineGroupLoading = (state: RootState) =>
  getState(state).disciplineGroup.loading;

const _getDisciplineGroupsDetails = (state: RootState) =>
  getState(state).disciplineGroup.byId;

const _getDisciplineGroupsIdList = (state: RootState) =>
  getState(state).disciplineGroup.allIds;

export const getDisciplineGroupById = (state: RootState) => (id: number) => {
  return getState(state).disciplineGroup.byId[id];
};

export const getAllDisciplineGroups = createSelector(
  [_getDisciplineGroupsIdList, _getDisciplineGroupsDetails],
  (ids, data) => {
    return ids.map((id) => data[id]);
  },
);

// @ts-expect-error
export const getAllDisciplineGroupsWithFullData: (
  state: RootState,
) => DisciplineGroup<
  MetaActivity,
  MetaActivity,
  SCT,
  Establishment,
  EstablishmentGroup,
  Coach
>[] = createSelector(
  [
    getAllDisciplineGroups,
    getAllCoaches,
    getMetaActivities,
    getAvailableEstablishmentList,
    getAssociatedEstablishmentGroup,
    getWorkshops,
    getEditableSCTs,
  ],
  (
    disciplineGroups,
    coaches,
    metaActivities,
    establishments,
    establishmentGroups,
    workshops,
    SCTs,
  ) => {
    if (!disciplineGroups) return [];
    return disciplineGroups.map((group) => ({
      ...group,
      associated_coaches: group.associated_coaches
        .map((acId) => coaches.find((c) => c.associated_coach_id === acId))
        .filter((c) => !!c),
      establishments: group.establishments
        .map((establishmentId) =>
          establishments.find(
            (establishment) => establishment.id === establishmentId,
          ),
        )
        .filter((establishment) => !!establishment),
      establishment_groups: group.establishment_groups
        .map((establishmentGroupId) =>
          establishmentGroups.find(
            (establishment_group) =>
              establishment_group.id === establishmentGroupId,
          ),
        )
        .filter((establishment_group) => !!establishment_group),
      meta_activities: group.meta_activities
        .map((activityId) =>
          metaActivities.find((activity) => activity.id === activityId),
        )
        .filter((a) => !!a),
      workshops: group.workshops
        .map((workshopId) =>
          workshops.find((workshop) => workshop.id === workshopId),
        )
        .filter((w) => !!w),
      categories: group.categories
        .map((SCTid) => SCTs.find((sct) => sct.id === SCTid))
        .filter((sct) => !!sct),
    }));
  },
);

export const getReplacementRequestConfiguration = (state: RootState) =>
  state.replacementRequest.configuration.configuration;
