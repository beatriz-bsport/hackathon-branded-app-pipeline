import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import memoize from 'memoize-one';
import { filterUnaccessiblePaymentPack } from '@bsport/common/lib/master-data/payment-pack.js';

import type { SCT } from '#src/libs/category/types';
import { getAvailablePrivatePasses } from '#src/libs/private-service/selectors/private-pass';
import { FranchiseCompany } from '#src/libs/franchise/types';
import { getSCTs, getEditableSCTs } from '../category/selectors';
import { getAllEstablishmentsDict as getEstablishmentData } from '../establishment/selectors';
import { getMetaActivityAbstractDict as getMetaActivityData } from '../meta-activity/selectors';
import { getAllTagsWithTagGroup } from '../tag/selectors';
import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
  PaymentPackTemplate,
  PaymentPackTemplateAPI,
  PaymentPackTemplateInstance,
} from './types';

import { RootState } from '../../reducers';

import {
  getAllowedFranchisees,
  getFranchiseCompanyById,
  getSortedFranchiseesWithAllowed,
  withAllowed,
  withAllowedOnArray,
} from '../franchise/selectors';

type PaymentPackSelector<LPP = number | null> = (
  state: RootState,
) => Immutable.Immutable<Array<PaymentPack<LPP>> | PaymentPack<LPP>>;

type PaymentPackArraySelector = (
  state: RootState,
) => Immutable.Immutable<Array<PaymentPack>>;

export const getPaymentPackLoading = (state: RootState): boolean =>
  state.paymentPack.loading;

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
      .filter((id: number) => !!id)
      .map((id: number) => paymentPacks?.[id])
      .filter((pack: PaymentPack) => !pack?.disabled),
);

export const getDisabledPaymentPacks = createSelector(
  [getPaymentPackById, getPaymentPackAllIds],
  (paymentPacks, idList) =>
    idList
      .map((id: number) => paymentPacks[id])
      .filter(
        (pack: PaymentPack) => pack && pack.disabled && !pack.template_instance,
      ),
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
        (pack.categories ?? []).includes(sct.id),
      ),
    };
  }
  return pack;
};

export const getOne = (state: RootState, id: number) =>
  state.paymentPack.byId[id];

export const withSCT = memoize((selector: PaymentPackSelector) =>
  createSelector([selector, getEditableSCTs], (paymentPacks, SCTs) => {
    if (paymentPacks && Array.isArray(paymentPacks)) {
      const validPaymentPacks = paymentPacks.filter((pp) => !!pp);

      return validPaymentPacks.map((pp) => ({
        ...pp,
        categories: pp.categories?.map((category: number | SCT) => {
          // @ts-expect-error
          return category?.id
            ? category
            : SCTs.find((sct) => sct.id === category);
        }),
      }));
    }
    if (paymentPacks) {
      return {
        ...paymentPacks,
        categories: (
          paymentPacks as Immutable.Immutable<PaymentPack>
        ).categories?.map((category: number | SCT) => {
          // @ts-expect-error
          return category?.id
            ? category
            : SCTs.find((sct) => sct.id === category);
        }),
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
          // @ts-expect-error
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
          // @ts-expect-error
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
    [selector, getAllTagsWithTagGroup],
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
            // @ts-expect-error
            paymentPacks.whitelist_tags.includes(tag.id),
          ),
          blacklist_tags: tagList.filter((tag) =>
            // @ts-expect-error
            paymentPacks.blacklist_tags.includes(tag.id),
          ),
        };
      }
      return paymentPacks;
    },
  ),
);

export const getEnabled: PaymentPackArraySelector = createSelector(
  getAll,
  (pps) => pps.filter((pp: PaymentPack) => pp && !pp.disabled),
);

export const getPaymentPackListCompatibleWithVideo = createSelector(
  getAll,
  (pps) =>
    pps.filter(
      (pp: PaymentPack) =>
        pp && !pp.disabled && (pp.full_vod_access || pp.only_vod_access),
    ),
);

// @ts-expect-error
export const getAllPaymentPacks: PaymentPackArraySelector = createSelector(
  getPaymentPackById,
  (paymentPacks) => Immutable(Object.values(paymentPacks)),
);

export const getMarketplacePaymentPacks = createSelector(
  [
    getAll,
    getSCTs,
    (_, authenticated: boolean) => authenticated,
    (_, __, memberTagList: number[]) => memberTagList,
  ],
  (paymentPacks, SCTs, authenticated, memberTagList) => {
    const paymentPacksWithCategories: PaymentPack[] = paymentPacks.map(
      (paymentPack: PaymentPack) => ({
        ...paymentPack,
        categories: SCTs.filter((sct) =>
          paymentPack.categories.includes(sct.id),
        ),
      }),
    );

    // @ts-expect-error
    return filterUnaccessiblePaymentPack(paymentPacksWithCategories, {
      memberTagIdsList: memberTagList,
      authenticated,
    });
  },
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
};

export const filterByNoCategory = memoize(
  (selector: PaymentPackArraySelector) =>
    createSelector([selector], (enabledPackList) => {
      return enabledPackList.filter((pack) => !pack.category);
    }),
);

export const getPaymentPackCategories = (selector: PaymentPackArraySelector) =>
  createSelector([selector], (enabledPackList) => {
    // @ts-expect-error
    return enabledPackList.map((e: PaymentPack) => e.category);
  });

export const groupByCategory = memoize((selector: PaymentPackArraySelector) =>
  createSelector(
    [getPaymentPackCategoryAllIds, getPaymentPackCategoryById, selector],
    (categoryIdList, categoryData, packList) => {
      return Immutable<PaymentPackCategoryWithPacks[]>([
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

export const getPaymentPackTemplateById = (state: RootState, id: number) =>
  state.paymentPack.paymentPackTemplate.byId[id];

export const getPaymentPackTemplateIdList = (state: RootState) =>
  state.paymentPack.paymentPackTemplate.allIds;

const getPaymentPackTemplateIdManagerOnlyList = (state: RootState) =>
  state.paymentPack.paymentPackTemplate.allIdsManagerOnly || [];

export const getPaymentPackTemplateList: (
  state: RootState,
) => Array<PaymentPackTemplate> = createSelector(
  [
    getPaymentPackTemplateData,
    getPaymentPackTemplateIdList,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (data, ids, allowed_franchisee_ids, companyById) =>
    ids
      .map((id: number) => data[id])
      .filter((ppt: PaymentPackTemplateAPI) => !!ppt && !ppt.disabled)
      .map((ppt: PaymentPackTemplateAPI) => ({
        ...ppt,
        companies: withAllowed(
          ppt.payment_pack_template_instances.map(
            (ppti: PaymentPackTemplateInstance) =>
              !ppti.disabled && ppti.company,
          ),
          // TODO : this is higly dangerous, ?.filter((ppt_id) => !!ppt_id) : should be added
          // at the end of expression since the current code is returning a array of boolean and number
          // for example [1,false, 3, false,5 .. etc]
          allowed_franchisee_ids,
          companyById,
          // @ts-expect-error
        )?.filter((c: FranchiseCompany) => !!c),
      })),
);

export const getPaymentPackTemplateManagerOnlyList: (
  state: RootState,
) => Array<PaymentPackTemplate> = createSelector(
  [
    getPaymentPackTemplateData,
    getPaymentPackTemplateIdManagerOnlyList,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (data, ids, allowed_franchisee_ids, companyById) =>
    ids
      .map((id: number) => data[id])
      .filter((ppt: PaymentPackTemplateAPI) => !ppt.disabled)
      .map((ppt: PaymentPackTemplateAPI) => ({
        ...ppt,
        companies: withAllowed(
          ppt.payment_pack_template_instances.map(
            (ppti: PaymentPackTemplateInstance) =>
              !ppti.disabled && ppti.company,
          ),
          allowed_franchisee_ids,
          companyById,
          // @ts-expect-error
        )?.filter((c: FranchiseCompany) => !!c),
      })),
);

// ---------- FOR UNIVERSAL PASSES ON MASTER ACCOUNT ----------

export const getUniversalPaymentPackTemplateData = (state: RootState) =>
  state.paymentPack.universalPaymentPackTemplate.byId;

export const getUniversalPaymentPackTemplateIds = (state: RootState) =>
  state.paymentPack.universalPaymentPackTemplate.allIds;

const getUniversalPaymentPackTemplateManagerOnlyIds = (state: RootState) =>
  state.paymentPack.universalPaymentPackTemplate.allIdsManagerOnly;
/**
 *@deprecated
 * */
export const getUniversalPaymentPackTemplateListAvailableForSale =
  createSelector(
    [
      getUniversalPaymentPackTemplateData,
      getUniversalPaymentPackTemplateIds,
      getSortedFranchiseesWithAllowed,
    ],
    (data, ids, sortedFranchisees) =>
      ids
        .map((id: number) => ({
          ...data[id],
          companies: sortedFranchisees.filter(
            (company) =>
              company.id in
              data[id].payment_pack_template_instances.map(
                (paymentPackTemplateInstance) =>
                  !paymentPackTemplateInstance.disabled &&
                  paymentPackTemplateInstance.company,
              ),
          ),
        }))
        .filter(
          (paymentPackTemplate) =>
            !paymentPackTemplate.disabled &&
            !paymentPackTemplate.manager_only &&
            paymentPackTemplate.is_usable_by_staff,
        ),
  );

const getUniversalPaymentPackTemplateManagerOnlyPaginatedState = (
  state: RootState,
) =>
  state.paymentPackReworked.universalPaymentPackTemplatePaginated
    .managerOnlyPasses;

export const getUniverslPaymentPackTemplatePaginatedManagerOnly =
  createSelector(
    [
      getUniversalPaymentPackTemplateManagerOnlyPaginatedState,
      getAllowedFranchisees,
      getFranchiseCompanyById,
    ],
    (paginatedState, allowed_franchisee_ids, companyById) => {
      const { allIds, byId } = paginatedState;
      return {
        ...paginatedState,
        passes: allIds
          .map((id) => byId[id])
          .map((paymentPackTemplate) => ({
            ...paymentPackTemplate,
            companies: withAllowedOnArray(
              paymentPackTemplate.payment_pack_template_instances
                .map(
                  (ppti: PaymentPackTemplateInstance) =>
                    !ppti.disabled && ppti.company,
                )
                .filter(
                  (payment_pack_template_intance_id) =>
                    !!payment_pack_template_intance_id,
                ),
              allowed_franchisee_ids,
              companyById,
            )?.filter((c) => !!c),
          })),
      };
    },
  );

const getUniversalPaymentPackTemplateAvailableForSalePaginatedState = (
  state: RootState,
) =>
  state.paymentPackReworked.universalPaymentPackTemplatePaginated
    .availablePasses;

export const getUniversalPaymentPackTemplatePaginatedAvailableForSale =
  createSelector(
    [
      getUniversalPaymentPackTemplateAvailableForSalePaginatedState,
      getAllowedFranchisees,
      getFranchiseCompanyById,
    ],
    (paginatedState, allowed_franchisee_ids, companyById) => {
      const { allIds, byId } = paginatedState;

      return {
        ...paginatedState,
        passes: allIds
          .map((id) => byId[id])
          .map((paymentPackTemplate) => ({
            ...paymentPackTemplate,
            companies: withAllowedOnArray(
              paymentPackTemplate.payment_pack_template_instances
                .map(
                  (ppti: PaymentPackTemplateInstance) =>
                    !ppti.disabled && ppti.company,
                )
                .filter(
                  (payment_pack_template_intance_id) =>
                    !!payment_pack_template_intance_id,
                ),
              allowed_franchisee_ids,
              companyById,
            )?.filter((c) => !!c),
          })),
      };
    },
  );

const getUniversalPaymentPackTemplateArchived = (state: RootState) =>
  state.paymentPackReworked.universalPaymentPackTemplatePaginated
    .archivedPasses;

export const getUniversalPaymentPackTemplatePaginatedArchived = createSelector(
  [
    getUniversalPaymentPackTemplateArchived,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginatedState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginatedState;

    return {
      ...paginatedState,
      passes: allIds
        .map((id) => byId[id])
        .map((paymentPackTemplate) => ({
          ...paymentPackTemplate,
          companies: withAllowedOnArray(
            paymentPackTemplate.payment_pack_template_instances
              .filter(
                (ppti: PaymentPackTemplateInstance) =>
                  !ppti.disabled && !!ppti.company,
              )
              .map((ppti: PaymentPackTemplateInstance) => ppti.company),
            allowed_franchisee_ids,
            companyById ?? {},
          )?.filter((company) => !!company),
        })),
    };
  },
);

/**
 *@deprecated
 * */
export const getUniversalPaymentPackTemplateListManagerOnly = createSelector(
  [
    getUniversalPaymentPackTemplateData,
    getUniversalPaymentPackTemplateManagerOnlyIds,
    getSortedFranchiseesWithAllowed,
  ],
  (data, ids, sortedFranchisees) =>
    ids
      .map((id: number) => ({
        ...data[id],
        companies: sortedFranchisees.filter(
          (company) =>
            company.id in
            data[id].payment_pack_template_instances.map(
              (paymentPackTemplateInstance) =>
                !paymentPackTemplateInstance.disabled &&
                paymentPackTemplateInstance.company,
            ),
        ),
      }))
      .filter(
        (paymentPackTemplate) =>
          !paymentPackTemplate.disabled &&
          (paymentPackTemplate.manager_only ||
            !paymentPackTemplate.is_usable_by_staff),
      ),
);

// @ts-expect-error
const _getId = (state, id) => id;
// @ts-expect-error
export const getUniversalPaymentPackTemplate: (
  state: RootState,
  id: number,
) => PaymentPackTemplate = createSelector(
  [
    getUniversalPaymentPackTemplateData,
    getAllowedFranchisees,
    getFranchiseCompanyById,
    _getId,
  ],
  (data, allowed_franchisee_ids, companyById, id) => {
    const template = data[id];

    if (!template) return null;
    return {
      ...template,
      companies: withAllowed(
        template.payment_pack_template_instances?.map(
          (ppti: PaymentPackTemplateInstance) => !ppti.disabled && ppti.company,
        ),
        allowed_franchisee_ids,
        companyById,
        // @ts-expect-error
      )?.filter((c: FranchiseCompany) => !!c),
    };
  },
);

export const getPaymentPackTemplate: (
  state: RootState,
  id: number,
) => PaymentPackTemplate = createSelector(
  [
    getPaymentPackTemplateData,
    getAllowedFranchisees,
    getFranchiseCompanyById,
    _getId,
  ],
  (data, allowed_franchisee_ids, companyById, id) => {
    const template = data[id];
    if (!template) return null;
    return {
      ...template,
      companies: withAllowed(
        template.payment_pack_template_instances?.map(
          (ppti: PaymentPackTemplateInstance) => !ppti.disabled && ppti.company,
        ),
        allowed_franchisee_ids,
        companyById,
        // @ts-expect-error
      )?.filter((c: FranchiseCompany) => !!c),
    };
  },
);

/**
 * @description Used in master account.
 * @deprecated Using an unpaginated reducer.
 */
export const getPaymentPackTemplateListAvailableForSale = createSelector(
  getPaymentPackTemplateList,
  (paymentPackTemplateList) =>
    paymentPackTemplateList.filter(
      (paymentPackTemplate) =>
        !paymentPackTemplate.manager_only &&
        paymentPackTemplate.is_usable_by_staff,
    ),
);

const getPaymentPackTemplateAvailableForSalePaginatedState = (
  state: RootState,
) => state.paymentPackReworked.paymentPackTemplatePaginated.availablePasses;

export const getPaymentPackTemplatePaginatedAvailableForSale = createSelector(
  [
    getPaymentPackTemplateAvailableForSalePaginatedState,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginatedState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginatedState;
    return {
      ...paginatedState,
      passes: allIds
        .map((id) => byId[id])
        .map((paymentPackTemplate) => ({
          ...paymentPackTemplate,
          companies: withAllowedOnArray(
            paymentPackTemplate.payment_pack_template_instances
              .filter(
                (ppti: PaymentPackTemplateInstance) =>
                  !ppti.disabled && !!ppti.company,
              )
              .map((ppti: PaymentPackTemplateInstance) => ppti.company),
            allowed_franchisee_ids,
            companyById ?? {},
          )?.filter((company) => !!company),
        })),
    };
  },
);

const getPaymentPackTemplateArchivedPaginatedState = (state: RootState) =>
  state.paymentPackReworked.paymentPackTemplatePaginated.archivedPasses;

export const getPaymentPackTemplatePaginatedArchived = createSelector(
  [
    getPaymentPackTemplateArchivedPaginatedState,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginatedState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginatedState;
    return {
      ...paginatedState,
      passes: allIds
        .map((id) => byId[id])
        .map((paymentPackTemplate) => ({
          ...paymentPackTemplate,
          companies: withAllowedOnArray(
            paymentPackTemplate.payment_pack_template_instances
              .filter(
                (ppti: PaymentPackTemplateInstance) =>
                  !ppti.disabled && !!ppti.company,
              )
              .map((ppti: PaymentPackTemplateInstance) => ppti.company),
            allowed_franchisee_ids,
            companyById ?? {},
          )?.filter((company) => !!company),
        })),
    };
  },
);

/**
 * @description Used in master account.
 * @deprecated Using an unpaginated reducer.
 */
export const getPaymentPackTemplateListManagerOnly = createSelector(
  getPaymentPackTemplateManagerOnlyList,
  (paymentPackTemplateList) =>
    paymentPackTemplateList.filter(
      (paymentPackTemplate) =>
        paymentPackTemplate.manager_only ||
        !paymentPackTemplate.is_usable_by_staff,
    ),
);

const getPaymentPackTemplateManagerOnlyPaginatedState = (state: RootState) =>
  state.paymentPackReworked.paymentPackTemplatePaginated.managerOnlyPasses;

export const getPaymentPackTemplatePaginatedManagerOnly = createSelector(
  [
    getPaymentPackTemplateManagerOnlyPaginatedState,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginatedState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginatedState;

    return {
      ...paginatedState,
      passes: allIds
        .map((id) => byId[id])
        .map((paymentPackTemplate) => ({
          ...paymentPackTemplate,
          companies: withAllowedOnArray(
            paymentPackTemplate.payment_pack_template_instances
              .map(
                (ppti: PaymentPackTemplateInstance) =>
                  !ppti.disabled && ppti.company,
              )
              .filter(
                (payment_pack_template_intance_id) =>
                  !!payment_pack_template_intance_id,
              ),
            allowed_franchisee_ids,
            companyById,
          )?.filter((c) => !!c),
        })),
    };
  },
);
/**
 * @description Used in marketplace.
 */
export const getPaymentPackTemplateListAvailable = createSelector(
  getPaymentPackTemplateList,
  (paymentPackTemplateList) =>
    paymentPackTemplateList.filter(
      (paymentPackTemplate) => !paymentPackTemplate.manager_only,
    ),
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
        // @ts-expect-error
        filterUnaccessiblePaymentPack(paymentPacks, {
          memberTagIdsList: memberTagList,
          authenticated,
        }),
    ),
);

export const withLinkedPrivatePass = memoize((selector: PaymentPackSelector) =>
  createSelector(
    [selector, getAvailablePrivatePasses],
    (packObject, privatePasses) => {
      if (!packObject) return packObject;
      if (!Array.isArray(packObject)) {
        return {
          ...packObject,
          linked_private_pass: privatePasses?.find(
            // @ts-expect-error
            (ps) => ps.id === packObject.linked_private_pass,
          ),
        };
      }
      return packObject.map((pack) => ({
        ...pack,
        linked_private_pass: privatePasses?.find(
          (ps) => ps.id === pack.linked_private_pass,
        ),
      }));
    },
  ),
);

export const getPaymentPackCategoriesWithPacks = createSelector(
  [
    getMarketplacePaymentPacks,
    getPaymentPackCategoryAllIds,
    getPaymentPackCategoryById,
  ],
  (paymentPackList, categoryIdList, categoryData) => {
    return Immutable<PaymentPackCategoryWithPacks[]>([
      ...categoryIdList.map((catId: number) => ({
        ...categoryData[catId],
        packs: paymentPackList.filter((e) => e.category === catId),
      })),
      {
        id: null,
        name: '',
        category_ordering: Number.MAX_SAFE_INTEGER,
        packs: paymentPackList.filter((pack) => !pack.category),
      },
    ]);
  },
);

export const getPaymentPackCategoryWithNbItems = createSelector(
  [groupByCategory(getEnabledPaymentPacks)],
  (enabledPaymentPacksByCategory) => {
    return enabledPaymentPacksByCategory.map((category) => {
      return {
        id: category.id,
        nbAvailableItems: (
          category?.packs?.filter((pack) => !pack.manager_only) ?? []
        ).length,
      };
    });
  },
);

export const getPaymentPackMassExtensionList = (state: RootState) => {
  return state.paymentPack.massExtension.allIds.map(
    (id) => state.paymentPack.massExtension.byId[id],
  );
};
