import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import { getAllPaymentPacks } from '#libs/payment-packs/selectors';
import { FranchiseCompany } from '#libs/franchise/types';
import type {
  PrivatePass,
  // @ts-expect-error
  PrivatePassWithService,
  PrivatePassTemplate,
  PrivatePassTemplateAPI,
  PrivatePassTemplateInstance,
  ServiceCompatibilityPass,
  PrivateServiceCompatibilityPass,
} from '../types';
import { _getPrivateServiceDict } from './private-service';
import { getAllPrivateSlotsDict } from './private-slot';
import { RootState } from '../../../reducers';

import {
  getAllowedFranchisees,
  getFranchiseCompanyById,
  withAllowed,
} from '../../franchise/selectors';


export type PrivatePassSelector<LPP = number> = (
  state: RootState,
) => Immutable.Immutable<Array<PrivatePass<LPP>> | PrivatePass<LPP>>;

export const _getPrivatePassData = (state: RootState) =>
  state.privateService.privatePass.byId;
const _getPrivatePassAsConsumerIds = (state: RootState) =>
  state.privateService.privatePass.asConsumer.allIds;

const _getPrivatePassListIds = (state: RootState) =>
  state.privateService.privatePass.allIds;

export const getPrivatePassById = (
  state: RootState,
  // @ts-expect-error
): Array<PrivatePassWithService> => state.privateService.privatePass.byId;

export const getPrivatePass = (
  state: RootState,
  id: number,
): PrivatePassWithService => getPrivatePassById(state)[id];

export const getPrivatePassListBase: (State: RootState) => Array<PrivatePass> =
  createSelector([_getPrivatePassData, _getPrivatePassListIds], (data, ids) =>
    ids.map((id) => data[id]),
  );

export const getPrivatePassAvailable = createSelector(
  getPrivatePassListBase,
  (privatePassList) => {
    return privatePassList.filter((privatePass) => privatePass.available);
  },
);

export const getPrivatePassAvailableForPrivateBooking = createSelector(
  getPrivatePassListBase,
  (privatePassList) =>
    privatePassList.filter(
      (privatePass) => privatePass.available && privatePass.is_usable_by_staff,
    ),
);

export const getPrivatePassAsConsumer = createSelector(
  [_getPrivatePassData, _getPrivatePassAsConsumerIds],
  (data, ids) => ids.map((id) => data[id]).filter((p) => p.available),
);

export const getPrivatePassListWithPrivateService: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  [_getPrivateServiceDict, getPrivatePassListBase],
  (servicesById, passesList) =>
    passesList.map((pass) => ({
      ...pass,
      private_services: pass.private_services.map((ps) => servicesById[ps]),
    })),
);

export const getPrivatePassAvailableListWithPrivateService: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListWithPrivateService,
  (passList) => passList.filter((p) => p.available),
);

export const getPrivatePassManagerOnlyList: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListBase,
  (passList) => passList.filter((p) => p.available && p.manager_only),
);

export const getPrivatePassListCompatibleWithVideo: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListBase,
  (passList) => passList.filter((p) => p.full_vod_access),
);

export const getPrivatePassCustomerEnabled: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListBase,
  (passList) => passList.filter((p) => p.available && !p.manager_only),
);

export const getAvailablePrivatePasses: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListBase,
  (passList) =>
    passList.filter(
      (p) => p.available && !p.is_unpaid_private_booking_integration,
    ),
);

export const getUnavailablePrivatePasses: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListBase,
  (passList) => passList.filter((p) => !p.available),
);

export const withServices = memoize((selector) =>
  createSelector(
    [selector, _getPrivateServiceDict],
    (passesList, servicesById) => {
      if (!passesList) {
        return passesList;
      }
      if (Array.isArray(passesList)) {
        return passesList.map((pass) => ({
          ...pass,
          // @ts-expect-error
          private_services: pass.private_services.map((ps) => servicesById[ps]),
        }));
      }
      if (passesList) {
        return {
          ...passesList,
          private_services: passesList.private_services.map(
            // @ts-expect-error
            (ps) => servicesById[ps],
          ),
        };
      }
      return passesList;
    },
  ),
);

export const withAvailable = memoize((selector) =>
  createSelector(selector, (passList) => {
    if (!passList) return passList;
    if (Array.isArray(passList)) return passList.filter((p) => p.available);
    if (passList.available) return passList;
    return null;
  }),
);

export const getDisabledPrivatePassAvailableListWithPrivateService: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListWithPrivateService,
  (passList) => passList.filter((p) => !p.available),
);

const _getServiceCompatibiltyPassDict = (state: RootState) =>
  state.privateService.compatibleServicePass.byId;

const _getServiceCompatibiltyPassIds = (state: RootState) =>
  state.privateService.compatibleServicePass.allIds;

export const getServiceCompatibilityPassList: (
  State: RootState,
) => Array<ServiceCompatibilityPass> = createSelector(
  [_getServiceCompatibiltyPassDict, _getServiceCompatibiltyPassIds],
  (data, ids) => ids.map((id) => data[id]),
);

/**
 * `getServiceCompatibilityPassesByPrivatePassAndPrivateService` is a selector that maps service compatibility passes by private pass and private service as a unique key.
 *
 * @function
 * @param {RootState} state - The Redux state.
 * @returns {Object} An object where each key is a string composed of the pair (private service ID, the private pass), and each value is the corresponding PrivateServiceCompatibilityPass.
 */
export const getServiceCompatibilityPassesByPrivatePassAndPrivateService: (
  state: RootState,
) => {
  [private_service: string]: PrivateServiceCompatibilityPass;
} = createSelector(
  [getServiceCompatibilityPassList],
  (serviceCompatibilityPassesList) => {
    return serviceCompatibilityPassesList.reduce(
      (acc, value) => ({
        ...acc,
        [`${value.private_service.id}-${value.private_pass}`]: value,
      }),
      {},
    );
  },
);

export const getCompatibleServicePassLoading = (state: RootState) =>
  state.privateService.compatibleServicePass.loading;

export const getCompatibilityPassWithService: (
  State: RootState,
) => Array<PrivatePassWithService> = createSelector(
  [
    _getPrivateServiceDict,
    getAllPrivateSlotsDict,
    getServiceCompatibilityPassList,
  ],
  (servicesById, slotData, compatibilityList) => {
    if (!compatibilityList) return compatibilityList;
    if (Array.isArray(compatibilityList)) {
      return compatibilityList.map((c) => ({
        ...c,
        private_service: {
          // @ts-expect-error
          ...servicesById[c.private_service],
          // @ts-expect-error
          slots: servicesById[c.private_service]
            ? // @ts-expect-error
              servicesById[c.private_service].slots.map((s) => slotData[s])
            : [],
        },
        included_slots:
          // @ts-expect-error
          servicesById[c.private_service] && c.excluded_slot_ids
            ? // @ts-expect-error
              servicesById[c.private_service].slots
                // @ts-expect-error
                .filter((s) => !c.excluded_slot_ids.includes(s))
                // @ts-expect-error
                .map((s) => slotData[s])
            : null,
      }));
    }
    if (compatibilityList) {
      return {
        // @ts-expect-error
        ...compatibilityList,
        private_service: {
          // @ts-expect-error
          ...servicesById[compatibilityList.private_service],
          // @ts-expect-error
          slots: servicesById[compatibilityList.private_service]
            ? // @ts-expect-error
              servicesById[compatibilityList.private_service].slots.map(
                (s) => slotData[s],
              )
            : [],
        },
        included_slots:
          // @ts-expect-error
          servicesById[compatibilityList.private_service] &&
          // @ts-expect-error
          compatibilityList.excluded_slot_ids
            ? // @ts-expect-error
              servicesById[compatibilityList.private_service].slots
                // @ts-expect-error
                .filter((s) => !compatibilityList.excluded_slot_ids.includes(s))
                .map((s) => slotData[s])
            : null,
      };
    }
    return [];
  },
);

export const getPrivatePassTemplateData = (state: RootState) =>
  state.privateService.privatePassTemplate.byId;

const getPrivatePassTemplateIdList = (state: RootState) =>
  state.privateService.privatePassTemplate.allIds;

export const getPrivatePassTemplateList: (
  state: RootState,
) => Array<PrivatePassTemplate> = createSelector(
  [
    getPrivatePassTemplateData,
    getPrivatePassTemplateIdList,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (data, ids, allowed_franchisee_ids, companyById) =>
    ids
      .map((id: number) => data[id])
      .filter((ppt: PrivatePassTemplateAPI) => !ppt.disabled)
      .map((ppt: PrivatePassTemplateAPI) => ({
        ...ppt,
        companies: withAllowed(
          ppt.private_pass_template_instances.map(
            (ppti: PrivatePassTemplateInstance) =>
              !ppti.disabled && ppti.company,
          ),
          allowed_franchisee_ids,
          companyById,
          // @ts-expect-error
        ).filter((c: FranchiseCompany) => !!c),
      })),
);

const _getId = (state: RootState, id: number) => id;

export const getPrivatePassTemplate: (
  state: RootState,
  id: number,
) => PrivatePassTemplate = createSelector(
  [
    getPrivatePassTemplateData,
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
        template.private_pass_template_instances?.map(
          (ppti: PrivatePassTemplateInstance) => !ppti.disabled && ppti.company,
        ),
        allowed_franchisee_ids,
        companyById,
        // @ts-expect-error
      )?.filter((c: FranchiseCompany) => !!c),
    };
  },
);

export const getPrivatePassTemplateListManagerOnly = createSelector(
  getPrivatePassTemplateList,
  (privatePassTemplateList) =>
    privatePassTemplateList.filter(
      (privatePassTemplate) =>
        privatePassTemplate.manager_only ||
        !privatePassTemplate.is_usable_by_staff,
    ),
);

export const getPrivatePassTemplateListAvailable = createSelector(
  getPrivatePassTemplateList,
  (privatePassTemplateList) =>
    privatePassTemplateList.filter(
      (privatePassTemplate) =>
        !privatePassTemplate.manager_only &&
        privatePassTemplate.is_usable_by_staff,
    ),
);
export const withLinkedPaymentPack = memoize((selector: PrivatePassSelector) =>
  createSelector([selector, getAllPaymentPacks], (passObject, paymentPacks) => {
    if (!passObject) return passObject;
    if (!Array.isArray(passObject)) {
      return {
        ...passObject,
        linked_payment_pack: paymentPacks?.find(
          // @ts-expect-error
          (ps) => ps.id === passObject.linked_payment_pack,
        ),
      };
    }
    return passObject.map((pack: PrivatePass) => ({
      ...pack,
      linked_payment_pack: paymentPacks?.find(
        (ps) => ps.id === pack.linked_payment_pack,
      ),
    }));
  }),
);

export const _getRelatedPrivatePassData = (state: RootState) =>
  state.privateService.privatePass.byId;
const _getRelatedPrivatePassListIds = (state: RootState) =>
  state.privateService.privatePass.allIds;

export const getRelatedPrivatePassListBase: (
  state: RootState,
) => Array<PrivatePass> = createSelector(
  [_getRelatedPrivatePassData, _getRelatedPrivatePassListIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getRelatedPrivatePassAvailable = createSelector(
  getRelatedPrivatePassListBase,
  (pp) => {
    return pp.filter((p) => p.available);
  },
);

export const getPrivatePassMassExtensionList = (state: RootState) => {
  return state.privateService.privatePass.massExtension.allIds.map(
    (id) => state.privateService.privatePass.massExtension.byId[id],
  );
};
