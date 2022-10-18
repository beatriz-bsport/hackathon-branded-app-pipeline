import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import type { RootState } from '../../reducers';
import { getPageMetaActivities } from '#libs/meta-activity/selectors';
import { getAll as getAllPaymentPack } from '#libs/payment-packs/selectors';
import { getAllCoaches } from '#libs/associated-coach/selectors';
import {
  getAllEstablishments,
  getEstablishmentBillingroup,
} from '#libs/establishment/selectors';
import { getAllMembers } from '#libs/member/selectors';
import { getPrivatePassListBase } from '#libs/private-service/selectors/private-pass';
import { _getPrivateServices as getPrivateServices } from '#libs/private-service/selectors/private-service';
import { getAllPrivateSlots } from '#libs/private-service/selectors/private-slot';
import { getAllGiftcardList } from '#libs/giftcard/selectors';
import { getAllCoupons } from '#libs/coupon/selectors';
import { getVideoList } from '#libs/video/selectors';
import { getAvailableContractList } from '#libs/subscription/selectors';
import { getTheme } from '#libs/theme/selectors';
import { getSubShopsByCompany } from '#libs/shop/selectors';
import { getUsersWithRole } from '#libs/role/selectors';
import {
  getDynamicDataLoading,
  getDynamicDataHasBeenLoaded,
} from '#libs/datatype-filtering/selectors';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';

import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#libs/role/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#libs/meta-activity/actions';
import { refreshFilteredMembers as refreshFilteredMembersAction } from '#libs/member/actions';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '#libs/payment-packs/actions';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#libs/establishment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#libs/associated-coach/actions';
import {
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchAllPrivateSlots as fetchAllPrivateSlotsAction,
  fetchPrivatePassList as fetchPrivatePassListAction,
} from '#libs/private-service/actions';
import { fetchGiftcardList as fetchGiftcardListAction } from '#libs/giftcard/actions';
import { fetchCoupons as fetchCouponsAction } from '#libs/coupon/actions';
import { fetchVideoList as fetchVideoListAction } from '#libs/video/actions';
import { fetchContractList as fetchContractListAction } from '#libs/subscription/actions';
import { fetchAllSubShop as fetchAllSubShopAction } from '#libs/shop/actions/subshop';
import { fetchFranchise as fetchFranchiseAction } from '#libs/franchise/actions';
import {
  setDynamicDataHasBeenLoaded as setDynamicDataHasBeenLoadedAction,
  resetDynamicDataHasBeenLoaded as resetDynamicDataHasBeenLoadedAction,
} from '#libs/datatype-filtering/actions';
import { getFranchiseCompanies } from '../franchise/selectors';

type DynamicConnectedProps = ConnectedProps<typeof connector>;

export type withDatatypeDynamicDataProps = DynamicConnectedProps & {
  handleGetDynamicDataForFilters: (type: DynamicFilterDataType) => any[];
};

const connector = connect(
  (state: RootState) => ({
    // Selectors for dynamic data
    companyId: getTheme(state).company,
    dynamicDataLoading: getDynamicDataLoading(state),
    dynamicDataHasBeenLoaded: getDynamicDataHasBeenLoaded(state),
    metaActivities: getPageMetaActivities(state),
    paymentPacks: getAllPaymentPack(state),
    coaches: getAllCoaches(state),
    establishments: getAllEstablishments(state),
    users: getAllMembers(state),
    privatePasses: getPrivatePassListBase(state),
    privateServices: getPrivateServices(state),
    privateSlots: getAllPrivateSlots(state),
    giftCards: getAllGiftcardList(state),
    coupons: getAllCoupons(state),
    billingGroups: getEstablishmentBillingroup(state),
    videos: getVideoList(state),
    contracts: getAvailableContractList(state),
    subshops: getSubShopsByCompany(state, getTheme(state).company),
    staffs: getUsersWithRole(state),
    franchiseCompanies: getFranchiseCompanies(state),
  }),
  {
    // Actions for dynamic data
    setDynamicDataHasBeenLoaded: setDynamicDataHasBeenLoadedAction,
    resetDynamicDataHasBeenLoaded: resetDynamicDataHasBeenLoadedAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchEstablishments: fetchEstablishmentsAction,
    refreshFilteredMembers: refreshFilteredMembersAction,
    fetchAllPaymentPacks: fetchPaymentPackListAction,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    fetchAllPrivateServices: fetchAllPrivateServicesAction,
    fetchAllPrivateSlots: fetchAllPrivateSlotsAction,
    fetchPrivatePassList: fetchPrivatePassListAction,
    fetchGiftcardList: fetchGiftcardListAction,
    fetchCoupons: fetchCouponsAction,
    fetchVideoList: fetchVideoListAction,
    fetchContractList: fetchContractListAction,
    fetchAllSubShop: fetchAllSubShopAction,
    fetchCompanyUserRoles: fetchCompanyUserRolesAction,
    fetchFranchise: fetchFranchiseAction,
  },
);

export default function withDatatypeDynamicData(
  WrappedComponent: React.ComponentType,
) {
  return compose(
    connector,
    withHandlers({
      handleGetDynamicDataForFilters:
        (props: DynamicConnectedProps) => (type: DynamicFilterDataType) => {
          if (
            !props.dynamicDataLoading[type] &&
            !props.dynamicDataHasBeenLoaded[type]
          ) {
            switch (type) {
              case 'activity':
                props.fetchActivitiesCompany(
                  props.companyId,
                  {},
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('activity');
                    },
                  },
                );
                break;
              case 'payment_pack':
                props.fetchAllPaymentPacks(
                  { page_size: 70000, disabled: false },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('payment_pack');
                    },
                  },
                );
                break;
              case 'coach':
                props.fetchAssociatedCoachesList(
                  {},
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('coach');
                    },
                  },
                );
                break;
              case 'billing_establishment':
              case 'establishment':
                props.fetchEstablishments(
                  {},
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('establishment');
                      props.setDynamicDataHasBeenLoaded(
                        'billing_establishment',
                      );
                    },
                  },
                );
                break;

              case 'billing_group':
                props.fetchAllEstablishmentBillingGroup({
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('billing_group');
                  },
                });
                break;
              case 'private_service':
                props.fetchAllPrivateServices(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('private_service');
                    },
                  },
                );
                break;
              case 'private_slot':
                props.fetchAllPrivateSlots(
                  { page_size: null, company: props.companyId },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('private_slot');
                    },
                  },
                );
                break;

              case 'private_pass':
                props.fetchPrivatePassList(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('private_pass');
                    },
                  },
                );
                break;
              case 'giftcard':
                props.fetchGiftcardList(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('giftcard');
                    },
                  },
                );
                break;
              case 'coupon':
                props.fetchCoupons(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('coupon');
                    },
                  },
                );
                break;
              case 'video':
                props.fetchVideoList({ page_size: null }, 1, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('video');
                  },
                });
                break;

              case 'contract':
                props.fetchContractList(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('contract');
                    },
                  },
                );
                break;
              case 'subshop':
                props.fetchAllSubShop(props.companyId, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('subshop');
                  },
                });
                break;
              case 'staff':
                props.fetchCompanyUserRoles({
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('staff');
                  },
                });
                break;
              case 'company':
                props.fetchFranchise({
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('company');
                  },
                });
                break;
              default:
            }
          }

          if (
            props.dynamicDataLoading[type] &&
            !props.dynamicDataHasBeenLoaded[type]
          ) {
            return null;
          }

          switch (type) {
            case 'activity':
              return props.metaActivities.map((m) => ({
                label: m.name,
                value: m.id,
              }));
            case 'payment_pack':
              return props.paymentPacks.map((p) => ({
                label: p.name,
                value: p.id,
              }));
            case 'coach':
              return props.coaches.map((c) => ({
                label: c.name,
                value: c.id,
              }));
            case 'billing_establishment':
              return props.establishments.map((e) => ({
                label: e.location.address,
                value: e.id,
              }));
            case 'establishment':
              return props.establishments.map((e) => ({
                label: e.title,
                value: e.id,
              }));
            case 'private_service':
              return props.privateServices.map((ps) => ({
                label: ps.name,
                value: ps.id,
              }));
            case 'private_slot':
              return props.privateSlots.map((ps) => ({
                label: ps.name,
                value: ps.id,
              }));
            case 'private_pass':
              return props.privatePasses
                .filter((pp) => pp.credits > 0)
                .map((pp) => ({
                  label: pp.name,
                  value: pp.id,
                }));
            case 'giftcard':
              return props.giftCards.map((gc) => ({
                label: gc.name,
                value: gc.id,
              }));
            case 'coupon':
              return props.coupons.map((c) => ({
                label: c.name,
                value: c.id,
              }));
            case 'video':
              return props.videos.map((v) => ({
                label: v.name,
                value: v.id,
              }));
            case 'billing_group':
              return props.billingGroups.map((bg) => ({
                label: bg.name,
                value: bg.id,
              }));
            case 'contract':
              return props.contracts.map((contract) => ({
                label: contract.name,
                value: contract.id,
              }));
            case 'subshop':
              return (
                props.subshops?.map((subshop) => ({
                  label: subshop.name,
                  value: subshop.id,
                })) ?? []
              );
            case 'staff':
              return props.staffs.map((staff) => ({
                value: staff.id,
                label: `${staff.first_name} ${staff.last_name}`,
              }));
            case 'company':
              return (
                props.franchiseCompanies?.map((c) => ({
                  label: c.name,
                  value: c.id,
                })) ?? []
              );
            default:
              return [];
          }
        },
    }),
  )(WrappedComponent);
}
