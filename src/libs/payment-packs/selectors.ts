// @flow

import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import memoize from 'memoize-one';
import { filterUnaccessiblePaymentPack } from '@bsport/common/lib/master-data/payment-pack';

import { getSCTs } from '../category/selectors';
import { getAllEstablishmentsDict as getEstablishmentData } from '../establishment/selectors';
import { getMetaActivityAbstractDict as getMetaActivityData } from '../meta-activity/selectors';
import { getallTagsWithTagGroup } from '../tag/selectors';
import {
  PaymentPack,
  PaymentPackTemplate,
  PaymentPackTemplateAPI,
  PaymentPackTemplateInstance,
} from './types';
import { Company } from '../company/types';

import { RootState } from '../../reducers';

import { getFranchiseCompanyById } from '../franchise/selectors';

type PaymentPackSelector = (
  state: RootState,
) => Immutable.Immutable<Array<PaymentPack> | PaymentPack>;

type PaymentPackArraySelector = (
  state: RootState,
) => Immutable.Immutable<Array<PaymentPack>>;

export const getPaymentPackById = (state: RootState) => state.paymentPack.byId;

export const getPaymentPack = (state: RootState, id: number) =>
  getPaymentPackById(state)[id];

export const getPaymentPackAllIds = (state: RootState) =>
  state.paymentPack.allIds;

export const getPaymentPackCategoryById = (state: RootState) =>
  state.paymentPack.paymentPackCategory.byId;

export const getPaymentPackCategoryAllIds = (state: RootState) =>
  state.paymentPack.paymentPackCategory.allIds;

export const getPaymentPackCategory = createSelector(
  [getPaymentPackCategoryById, (_, id: number) => id],
  (categoryDict, paymentPackId) => categoryDict[paymentPackId],
);

export const getAllPaymentPackCategory = createSelector(
  [getPaymentPackCategoryAllIds, getPaymentPackCategoryById],
  (idList, categoryData) => idList.map((id: number) => categoryData[id]),
);
export const getAll = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) => idList.map((id: number) => paymentPacks[id]),
);

export const getEnabledPaymentPacks = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) =>
    idList
      .map((id: number) => paymentPacks[id])
      .filter((pack: PaymentPack) => !pack.disabled),
);

export const getDisabledPaymentPacks = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) =>
    idList
      .map((id: number) => paymentPacks[id])
      .filter((pack: PaymentPack) => pack.disabled && !pack.template_instance),
);

const get = (state: RootState, id: number) => {
  return state.paymentPack.byId[id];
};

export const getWithSCT = (state: RootState, id: number) => {
  const pack = state.paymentPack.byId[id];
  if (pack) {
    return {
      ...pack,
      categories: getSCTs(state).filter((sct) =>
        (pack.categories || []).includes(sct.id),
      ),
    };
  }
  return pack;
};

export const getOne = (state: RootState, id: number) =>
  state.paymentPack.byId[id];

export const withSCT = memoize((selector: PaymentPackSelector) =>
  createSelector([selector, getSCTs], (paymentPacks, SCTs) => {
    if (Array.isArray(paymentPacks)) {
      return paymentPacks.map((pp) => ({
        ...pp,
        categories: SCTs.filter((sct) =>
          (pp.categories || []).includes(sct.id),
        ),
      }));
    }
    if (paymentPacks) {
      return {
        ...paymentPacks,
        categories: SCTs.filter((sct) =>
          (paymentPacks.categories || []).includes(sct.id),
        ),
      };
    }
    return paymentPacks;
  }),
);

export const withMetaActivities = memoize((selector: PaymentPackSelector) =>
  createSelector(
    [selector, getMetaActivityData],
    (paymentPacks, metaActivityData) => {
      if (Array.isArray(paymentPacks)) {
        return paymentPacks.map((pp) => ({
          ...pp,
          metaActivities: pp.metaActivities.map(
            (id: number) => metaActivityData[id],
          ),
        }));
      }
      if (paymentPacks) {
        return {
          ...paymentPacks,
          metaActivities: paymentPacks.metaActivities.map(
            (id: number) => metaActivityData[id],
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

export const withEstablishments = memoize((selector: PaymentPackSelector) =>
  createSelector(
    [selector, getEstablishmentData],
    (paymentPacks, establishmentData) => {
      if (Array.isArray(paymentPacks)) {
        return paymentPacks.map((pp: PaymentPack) => ({
          ...pp,
          establishments: pp.establishments.map((id) => establishmentData[id]),
        }));
      }
      if (paymentPacks) {
        return {
          ...paymentPacks,
          establishments: paymentPacks.establishments.map(
            (id: number) => establishmentData[id],
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

export const withTags = memoize((selector: PaymentPackSelector) =>
  createSelector(
    [selector, getallTagsWithTagGroup],
    (paymentPacks, tagList) => {
      if (Array.isArray(paymentPacks)) {
        return paymentPacks.map((pp) => ({
          ...pp,
          whitelist_tags: tagList.filter((tag) =>
            pp.whitelist_tags.includes(tag.id),
          ),
          blacklist_tags: tagList.filter((tag) =>
            pp.blacklist_tags.includes(tag.id),
          ),
        }));
      }
      if (paymentPacks) {
        return {
          ...paymentPacks,
          whitelist_tags: tagList.filter((tag) =>
            paymentPacks.whitelist_tags.includes(tag.id),
          ),
          blacklist_tags: tagList.filter((tag) =>
            paymentPacks.blacklist_tags.includes(tag.id),
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

export const getPaymentPackNotifications = (state: RootState, id: number) =>
  Immutable(
    Object.values(state.paymentPack.notification.itemsById).filter(
      (notification) => notification.payment_pack === id,
    ),
  );

export const getEnabled: PaymentPackSelector = createSelector(getAll, (pps) =>
  pps.filter((pp: PaymentPack) => !pp.disabled),
);

export const getPaymentPackListCompatibleWithVideo = createSelector(
  getAll,
  (pps) =>
    pps.filter(
      (pp: PaymentPack) =>
        !pp.disabled && (pp.full_vod_access || pp.only_vod_access),
    ),
);

export const getAllPaymentPacks = createSelector(
  getPaymentPackById,
  (paymentPacks) => Immutable(Object.values(paymentPacks)),
);

export const getMarketplacePaymentPacks = createSelector(
  [getAll, getSCTs],
  (paymentPacks, SCTs) =>
    paymentPacks.map((pp: PaymentPack) => ({
      ...pp,
      categories: SCTs.filter((sct) => pp.categories.includes(sct.id)),
    })),
);

export const getActivityCompatiblePaymentPackAllIds = (state: RootState) =>
  state.paymentPack.byActivity.allIds;

export const getActivityCompatiblePaymentPacks = createSelector(
  [getActivityCompatiblePaymentPackAllIds, getPaymentPackById],
  (idList, paymentPacks) => idList.map((id: number) => paymentPacks[id]),
);

const _getPaymentPackForBookingIds = (state: RootState) =>
  state.paymentPack.forBooking.allIds;

export const getPaymentPackForBooking = createSelector(
  [_getPaymentPackForBookingIds, getPaymentPackById],
  (ids, data) => ids.map((id: number) => data[id]),
);

const _getPaymentPackListIds = (state: RootState) =>
  state.paymentPack.compatible.allIds;

export const getPaymentPackCompatibleList = createSelector(
  [getPaymentPackById, _getPaymentPackListIds],
  (data, ids) => ids.map((id: number) => data[id]),
);

export default {
  get,
  getWithSCT,
  getAll,
  getEnabled,
  getActivityCompatiblePaymentPacks,
  getPaymentPackNotifications,
};

export const filterByNoCategory = memoize(
  (selector: PaymentPackArraySelector) =>
    createSelector([selector], (enabledPackList) => {
      return enabledPackList.filter((pack) => !pack.category);
    }),
);

export const getPaymentPackCategories = (selector: PaymentPackArraySelector) =>
  createSelector([selector], (enabledPackList) => {
    return enabledPackList.map((e: PaymentPack) => e.category);
  });

export const groupByCategory = memoize((selector: PaymentPackArraySelector) =>
  createSelector(
    [getPaymentPackCategoryAllIds, getPaymentPackCategoryById, selector],
    (categoryIdList, categoryData, packList) => {
      return Immutable([
        ...categoryIdList.map((catId: number) => ({
          ...categoryData[catId],
          packs: packList.filter((e) => e.category === catId),
        })),
        {
          id: null,
          name: '',
          category_ordering: Number.MAX_SAFE_INTEGER,
          packs: packList.filter((pack) => !pack.category),
        },
      ]);
    },
  ),
);

export const getPaymentPackTemplateData = (state: RootState) =>
  state.paymentPack.paymentPackTemplate.byId;

const getPaymentPackTemplateIdList = (state: RootState) =>
  state.paymentPack.paymentPackTemplate.allIds;

export const getPaymentPackTemplateList: (
  state: RootState,
) => Array<PaymentPackTemplate> = createSelector(
  [
    getPaymentPackTemplateData,
    getPaymentPackTemplateIdList,
    getFranchiseCompanyById,
  ],
  (data, ids, companyData) =>
    ids
      .map((id: number) => data[id])
      .filter((ppt) => !ppt.disabled)
      .map((ppt: PaymentPackTemplateAPI) => ({
        ...ppt,
        companies: ppt.payment_pack_template_instances
          .map(
            (ppti: PaymentPackTemplateInstance) =>
              !ppti.disabled && companyData[ppti.company],
          )
          .filter((c: Company) => !!c),
      })),
);

const _getId = (state, id) => id;

export const getPaymentPackTemplate: (
  state: RootState,
  id: number,
) => PaymentPackTemplate = createSelector(
  [getPaymentPackTemplateData, getFranchiseCompanyById, _getId],
  (data, companyData, id) => {
    const template = data[id];
    if (!template) return null;
    return {
      ...template,
      companies: template.payment_pack_template_instances
        .map(
          (ppti: PaymentPackTemplateInstance) =>
            !ppti.disabled && companyData[ppti.company],
        )
        .filter((c: Company) => !!c),
    };
  },
);

export const getPaymentPackTemplateListManagerOnly = createSelector(
  getPaymentPackTemplateList,
  (list) => list.filter((p) => !!p.manager_only),
);

export const getPaymentPackTemplateListAvailable = createSelector(
  getPaymentPackTemplateList,
  (list) => list.filter((p) => !p.manager_only),
);

export const excludeUnaccessiblePacks = memoize(
  (selector: (state: RootState) => Array<PaymentPack>) =>
    createSelector(
      [
        selector,
        (
          state: RootState,
          {
            memberTagList,
            authenticated,
          }: { memberTagList: Array<number>; authenticated: boolean },
        ) => ({
          memberTagList,
          authenticated,
        }),
      ],
      (paymentPacks, { memberTagList, authenticated }) =>
        filterUnaccessiblePaymentPack(paymentPacks, {
          memberTagIdsList: memberTagList,
          authenticated,
        }),
    ),
);
