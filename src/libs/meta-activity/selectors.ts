import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import pickBy from 'lodash/pickBy';

// @ts-ignore
import memoize from 'memoize-one';
import type { MetaActivity } from './types';
import { RootState } from '../../reducers';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';

export const getMetaActivityAbstractDict = (state: RootState) =>
  state.metaActivity.byId;

export const getPureMetaActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data, (v) => !v.is_workshop),
);

export const getMetaActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data),
);

export const getMetaActivityLoading = (state: RootState) =>
  state.metaActivity.loading;

const getMetaActivityWorkshopIds = (state: RootState) =>
  state.metaActivity.workshop.allIds;

export const getMetaActivitiesIdList = (state: RootState) =>
  state.metaActivity.allIds;

export const getMetaActivity = (state: RootState, id: number): MetaActivity =>
  state.metaActivity.byId[id];

export const getPureMetaActivities = createSelector(
  getPureMetaActivitiesDict,
  (metaActivities) => Immutable<MetaActivity[]>(Object.values(metaActivities)),
);

export const getMetaActivities = createSelector(
  getMetaActivitiesDict,
  (metaActivities) => Immutable<MetaActivity[]>(Object.values(metaActivities)),
);

export const getEnabledMetaActivities = createSelector(
  getMetaActivityAbstractDict,
  (metactivities) =>
    Immutable(Object.values(metactivities)).filter(
      (ma) => !!ma.customer_enabled,
    ),
);

export const getDisabledPureMetaActivities = createSelector(
  getPureMetaActivitiesDict,
  (metactivities) =>
    Immutable(Object.values(metactivities)).filter(
      (ma) => !ma.customer_enabled,
    ),
);

// TODO TYPES THIS
export const getActivitiesByIdList = memoize((state: RootState, idList: any) =>
  createSelector(getMetaActivityAbstractDict, (metactivities) => {
    return Immutable(Object.values(metactivities)).filter((ma) =>
      idList.includes(ma.id),
    );
  })(state),
);

export const getPagePureMetaActivities = createSelector(
  [getMetaActivitiesIdList, getPureMetaActivitiesDict],
  (idList, metaActivities) =>
    idList.map((id) => metaActivities[id]).filter((ma) => !!ma),
);

export const getPageMetaActivities = createSelector(
  [getMetaActivitiesIdList, getMetaActivitiesDict],
  (idList, metaActivities) =>
    idList.map((id) => metaActivities[id]).filter((ma) => !!ma),
);

export const getPageEnabledPureMetaActivities = createSelector(
  getPagePureMetaActivities,
  (metactivities) => {
    return metactivities.filter((ma) => !!ma.customer_enabled);
  },
);

export const getPageDisabledPureMetaActivities = createSelector(
  getPagePureMetaActivities,
  (metactivities) => {
    return metactivities.filter((ma) => !ma.customer_enabled);
  },
);

export const getWorkshopActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data, (v) => v.is_workshop),
);

export const getWorkshopActivitiesIdList = (state: RootState) =>
  state.metaActivity.allIds;

export const getWorkshops = createSelector(
  getWorkshopActivitiesDict,
  (workshopActivities) =>
    Immutable<MetaActivity[]>(Object.values(workshopActivities)),
);

export const getWorkshopsByAllIds = createSelector(
  [getMetaActivityWorkshopIds, getMetaActivityAbstractDict],
  (ids, byIds) => ids.map((id) => byIds[id]),
);

// export const getOffersListByMetaActivity = memoize((state: RootState) => {
//   const getOffersByMetaActivityId = getOffersDataByMetaActivity(state);
//   const offersData = _getOfferData(state);
//
//   return memoize((metaActivtyId: number) => {
//     const offerByMetaActivity = getOffersByMetaActivityId(metaActivtyId);
//
//     if (!offerByMetaActivity) return null;
//     return {
//       ...offerByMetaActivity,
//       items: withCoach(
//         withEstablishment(
//           () => offerByMetaActivity?.allIds?.map((id) => offersData[id]) ?? [],
//         ),
//       )(state),
//     };
//   });
// });

export const getWorkshop = (state: RootState, id: number): MetaActivity =>
  state.metaActivity.byId[id];

export const getEnabledWorkshops = createSelector(getWorkshops, (workshops) =>
  workshops.filter((ma) => !!ma.customer_enabled),
);

export const getDisabledWorkshops = createSelector(getWorkshops, (workshops) =>
  workshops.filter((ma) => !ma.customer_enabled),
);

export const getFreshPureMetaActivityList = createSelector(
  getPureMetaActivitiesDict,
  (m) => Object.keys(m).map((id) => parseInt(id, 10)),
);

export const getFavoriteMetaActivity = (state: RootState) =>
  state.metaActivity.byId[state.metaActivity.favorite.id];

const _getAllMetaActivityCategoryIds = (state: RootState) =>
  state.metaActivity.metaActivityCategory.allIds;

const _getMetaActivityCategoryById = (state: RootState) =>
  state.metaActivity.metaActivityCategory.byId;

export const getMetaActivityCategories = createSelector(
  [_getAllMetaActivityCategoryIds, _getMetaActivityCategoryById],
  (metaActivityCategoryIds, metaActivityCategoryById) => {
    return metaActivityCategoryIds.map(
      (categoryId) => metaActivityCategoryById[categoryId],
    );
  },
);

export const getMetaActivityByCategoryWithActivities = memoize(
  (selector: (State: RootState) => any) =>
    createSelector(
      [selector, _getAllMetaActivityCategoryIds, _getMetaActivityCategoryById],
      (metaActivityList, metaActivityCategoryIds, metaActivityCategoryById) => {
        return [
          ...metaActivityCategoryIds.map((categoryId) => ({
            ...metaActivityCategoryById[categoryId],
            items: metaActivityList.filter(
              (et: MetaActivity) => et.category === categoryId,
            ),
          })),
          {
            name: '',
            id: null,
            category_ordering: metaActivityCategoryIds.length,
            items: metaActivityList.filter((et: MetaActivity) => !et.category),
          },
        ];
      },
    ),
);

export const withCustomRestrictionsTags = memoize((selector: any) =>
  createSelector(
    [selector, getAllTagsWithTagGroup],
    (metaActivities, tagList) => {
      if (Array.isArray(metaActivities)) {
        return metaActivities.map((meta) => ({
          ...meta,
          custom_restriction_rule: meta?.custom_restriction_rule?.map(
            (crr) => ({
              ...crr,
              tags: tagList.filter((tag) => crr?.tags.includes(tag.id)),
            }),
          ),
        }));
      }
      if (metaActivities) {
        return {
          ...metaActivities,
          custom_restriction_rule: metaActivities?.custom_restriction_rule?.map(
            (crr) => ({
              ...crr,
              tags: tagList.filter((tag) => crr?.tags.includes(tag.id)),
            }),
          ),
        };
      }
      return metaActivities;
    },
  ),
);
