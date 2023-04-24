// @ts-nocheck
import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import type {
  PrivatePass,
  PrivatePassWithService,
  PrivatePassTemplate,
  PrivatePassTemplateAPI,
  PrivatePassTemplateInstance,
  ServiceCompatibilityPass,
} from '../types';
import { _getPrivateServiceDict } from './private-service';
import { getAllPrivateSlotsDict } from './private-slot';
import { RootState } from '../../../reducers';

import {
  getAllowedFranchisees,
  getFranchiseCompanyById,
  withAllowed,
} from '../../franchise/selectors';

import { getAllPaymentPacks } from '#libs/payment-packs/selectors';
import { FranchiseCompany } from '#libs/franchise/types';

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
          private_services: pass.private_services.map((ps) => servicesById[ps]),
        }));
      }
      if (passesList) {
        return {
          ...passesList,
          private_services: passesList.private_services.map(
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
          ...servicesById[c.private_service],
          slots: servicesById[c.private_service]
            ? servicesById[c.private_service].slots.map((s) => slotData[s])
            : [],
        },
        included_slots:
          servicesById[c.private_service] && c.excluded_slot_ids
            ? servicesById[c.private_service].slots
                .filter((s) => !c.excluded_slot_ids.includes(s))
                .map((s) => slotData[s])
            : null,
      }));
    }
    if (compatibilityList) {
      return {
        ...compatibilityList,
        private_service: {
          ...servicesById[compatibilityList.private_service],
          slots: servicesById[compatibilityList.private_service]
            ? servicesById[compatibilityList.private_service].slots.map(
                (s) => slotData[s],
              )
            : [],
        },
        included_slots:
          servicesById[compatibilityList.private_service] &&
          compatibilityList.excluded_slot_ids
            ? servicesById[compatibilityList.private_service].slots
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
