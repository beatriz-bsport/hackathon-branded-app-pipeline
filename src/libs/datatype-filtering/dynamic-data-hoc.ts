// @ts-nocheck
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import type { RootState } from '../../reducers';
import { getPageMetaActivities } from '#libs/meta-activity/selectors';
import {
  getAll as getAllPaymentPack,
  getAllPaymentPackCategory,
} from '#libs/payment-packs/selectors';
import { getAllCoaches } from '#libs/associated-coach/selectors';
import {
  getAllEstablishments,
  getEstablishmentBillingroups,
} from '#libs/establishment/selectors';
import { getAllMembers } from '#libs/member/selectors';
import { getPrivatePassListBase } from '#libs/private-service/selectors/private-pass';
import { _getPrivateServices as getPrivateServices } from '#libs/private-service/selectors/private-service';
import { getPrivatePassCategories } from '#libs/private-service/selectors/private-pass-category';
import { getAllPrivateSlots } from '#libs/private-service/selectors/private-slot';
import { getAllGiftcardList } from '#libs/giftcard/selectors';
import { getAllCoupons } from '#libs/coupon/selectors';
import { getVideoList } from '#libs/video/selectors';
import { getAvailableContractList } from '#libs/subscription/selectors';
import { getTheme } from '#libs/theme/selectors';
import { getSubShopsByCompany } from '#libs/shop/selectors';
import { getUsersWithRole } from '#libs/role/selectors';
import { getBookkeepingAccountList } from '#libs/payment/selectors';
import {
  getDynamicDataLoading,
  getDynamicDataHasBeenLoaded,
} from '#libs/datatype-filtering/selectors';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';

import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#libs/role/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#libs/meta-activity/actions';
import { refreshFilteredMembers as refreshFilteredMembersAction } from '#libs/member/actions';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchAllPaymentPackCategory as fetchAllPaymentPackCategoryAction,
} from '#libs/payment-packs/actions';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#libs/establishment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#libs/associated-coach/actions';
import {
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchAllPrivateSlots as fetchAllPrivateSlotsAction,
  fetchPrivatePassList as fetchPrivatePassListAction,
  fetchAllPrivatePassCategory as fetchAllPrivatePassCategoryAction,
} from '#libs/private-service/actions';
import { fetchGiftcardList as fetchGiftcardListAction } from '#libs/giftcard/actions';
import { fetchCoupons as fetchCouponsAction } from '#libs/coupon/actions';
import { fetchVideoList as fetchVideoListAction } from '#libs/video/actions';
import { fetchContractList as fetchContractListAction } from '#libs/subscription/actions';
import { fetchAllSubShop as fetchAllSubShopAction } from '#libs/shop/actions/subshop';
import { fetchFranchise as fetchFranchiseAction } from '#libs/franchise/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#libs/payment/actions';
import {
  setDynamicDataHasBeenLoaded as setDynamicDataHasBeenLoadedAction,
  resetDynamicDataHasBeenLoaded as resetDynamicDataHasBeenLoadedAction,
} from '#libs/datatype-filtering/actions';
import { getFranchiseCompanies } from '../franchise/selectors';
import { ReportFilterableDataType } from './constants';
import { OptionTypeBase } from '#components/Selector/MaterialUISelector.component';

type DynamicConnectedProps = ConnectedProps<typeof connector>;

export type handleGetDynamicDataForFiltersReturn =
  | OptionTypeBase[]
  | string
  | null;

export type withDatatypeDynamicDataProps = DynamicConnectedProps & {
  handleGetDynamicDataForFilters: (
    type: DynamicFilterDataType,
    valueId: number[],
    columnName: string,
  ) => handleGetDynamicDataForFiltersReturn;
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
    billingGroups: getEstablishmentBillingroups(state),
    videos: getVideoList(state),
    contracts: getAvailableContractList(state),
    subshops: getSubShopsByCompany(state, getTheme(state).company),
    staffs: getUsersWithRole(state),
    franchiseCompanies: getFranchiseCompanies(state),
    paymentPackCategories: getAllPaymentPackCategory(state),
    privatePassCategories: getPrivatePassCategories(state),
    bookkeepingAccounts: getBookkeepingAccountList(state),
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
    fetchAllPaymentPackCategory: fetchAllPaymentPackCategoryAction,
    fetchAllPrivatePassCategory: fetchAllPrivatePassCategoryAction,
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  },
);

export default function withDatatypeDynamicData(
  WrappedComponent: React.ComponentType,
) {
  return compose(
    connector,
    withHandlers({
      handleGetDynamicDataForFilters:
        (props: DynamicConnectedProps) =>
        (
          type: DynamicFilterDataType,
          valueId?: number[],
          columnName: string,
        ) => {
          if (
            !props.dynamicDataLoading[type] &&
            !props.dynamicDataHasBeenLoaded[type]
          ) {
            switch (type) {
              case ReportFilterableDataType.ACTIVITY:
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
              case ReportFilterableDataType.PAYMENT_PACK:
                props.fetchAllPaymentPacks(
                  { page_size: 70000, disabled: false },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('payment_pack');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
                props.fetchAllPaymentPackCategory(props.companyId, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('payment_pack_category');
                  },
                });
                break;
              case ReportFilterableDataType.COACH:
                props.fetchAssociatedCoachesList(
                  {},
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('coach');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.BILLING_ESTABLISHMENT:
              case ReportFilterableDataType.ESTABLISHMENT:
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

              case ReportFilterableDataType.BILLING_GROUP:
              case ReportFilterableDataType.BILLING_GROUP_ADDRESS:
                props.fetchAllEstablishmentBillingGroup({
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('billing_group');
                    props.setDynamicDataHasBeenLoaded('billing_group_address');
                  },
                });
                break;
              case ReportFilterableDataType.PRIVATE_SERVICE:
                props.fetchAllPrivateServices(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('private_service');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.PRIVATE_SLOT:
                props.fetchAllPrivateSlots(
                  { page_size: null, company: props.companyId },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('private_slot');
                    },
                  },
                );
                break;

              case ReportFilterableDataType.PRIVATE_PASS:
                props.fetchPrivatePassList(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('private_pass');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.PRIVATE_PASS_CATEGORY:
                props.fetchAllPrivatePassCategory(props.companyId, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('private_pass_category');
                  },
                });
                break;
              case ReportFilterableDataType.GIFTCARD:
                props.fetchGiftcardList(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('giftcard');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.COUPON:
                props.fetchCoupons(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('coupon');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.VIDEO:
                props.fetchVideoList({ page_size: null }, 1, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('video');
                  },
                });
                break;

              case ReportFilterableDataType.CONTRACT:
                props.fetchContractList(
                  { page_size: null },
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('contract');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.SUBSHOP:
                props.fetchAllSubShop(props.companyId, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('subshop');
                  },
                });
                break;
              case ReportFilterableDataType.STAFF:
                props.fetchCompanyUserRoles(
                  {},
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('staff');
                    },
                  },
                );
                break;
              case ReportFilterableDataType.COMPANY:
                props.fetchFranchise({
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('company');
                  },
                });
                break;
              case ReportFilterableDataType.BOOKKEEPING_ACCOUNT:
                props.fetchBookkeepingAccountList(
                  {},
                  {
                    onSuccess: () => {
                      props.setDynamicDataHasBeenLoaded('bookkeeping_account');
                    },
                  },
                );
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
          if (valueId?.length) {
            const stringifiedValue = valueId[0].toString();
            switch (type) {
              case ReportFilterableDataType.ACTIVITY:
                return props.metaActivities.find(
                  (metaActivity) =>
                    metaActivity.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.PAYMENT_PACK:
                return props.paymentPacks.find(
                  (paymentPack) =>
                    paymentPack.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
                return props.paymentPackCategories.find(
                  (paymentPackCategories) =>
                    paymentPackCategories.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.COACH:
                return props.coaches.find(
                  (coach) => coach.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.BILLING_ESTABLISHMENT: {
                const matchingBillingEstablishment = (
                  props.establishments || []
                ).find(
                  (establishment) =>
                    establishment?.id?.toString() === stringifiedValue,
                )?.location?.address;
                return matchingBillingEstablishment || null;
              }

              case ReportFilterableDataType.ESTABLISHMENT:
                return props.establishments.find(
                  (establishment) =>
                    establishment.id.toString() === stringifiedValue,
                )?.title;

              case ReportFilterableDataType.PRIVATE_SERVICE:
                return props.privateServices.find(
                  (privateService) =>
                    privateService.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.PRIVATE_SLOT:
                return props.privateSlots.find(
                  (privateSlot) =>
                    privateSlot.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.PRIVATE_PASS:
                return props.privatePasses
                  .filter((pp) => pp.credits > 0)
                  .find(
                    (privatePass) =>
                      privatePass.id.toString() === stringifiedValue,
                  )?.name;

              case ReportFilterableDataType.PRIVATE_PASS_CATEGORY:
                return props.privatePassCategories.find(
                  (privatePassCategory) =>
                    privatePassCategory.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.GIFTCARD:
                return props.giftCards.find(
                  (giftCard) => giftCard.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.COUPON:
                return props.coupons.find(
                  (coupon) => coupon.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.VIDEO:
                return props.videos.find(
                  (video) => video.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.BILLING_GROUP:
                return props.billingGroups.find(
                  (billingGroup) =>
                    billingGroup.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.BILLING_GROUP_ADDRESS:
                return props.billingGroups.find(
                  (billingGroup) =>
                    billingGroup.id.toString() === stringifiedValue,
                )?.address;

              case ReportFilterableDataType.CONTRACT:
                return props.contracts.find(
                  (contract) => contract.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.SUBSHOP:
                return props.subshops.find(
                  (subshop) => subshop.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.STAFF: {
                const staff = props.staffs.find(
                  (staffUser) => staffUser.id.toString() === stringifiedValue,
                );
                if (staff) {
                  const firstName = staff.first_name || '';
                  const lastName = staff.last_name || '';

                  return `${firstName} ${lastName}`.trim() || null;
                }

                return null;
              }

              case ReportFilterableDataType.COMPANY: {
                const matchingFranchiseCompany = (
                  props.franchiseCompanies ?? []
                ).find(
                  (franchiseCompany) =>
                    franchiseCompany?.id?.toString() === stringifiedValue,
                )?.name;
                return matchingFranchiseCompany || null;
              }
              default:
                return null;
            }
          }
          switch (type) {
            case ReportFilterableDataType.ACTIVITY:
              return props.metaActivities.map((m) => ({
                label: m.name,
                value: m.id,
                columnName,
              }));
            case ReportFilterableDataType.PAYMENT_PACK:
              return props.paymentPacks.map((p) => ({
                label: p.name,
                value: p.id,
                columnName,
              }));
            case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
              return props.paymentPackCategories.map((paymentPackCategory) => ({
                label: paymentPackCategory.name,
                value: paymentPackCategory.id,
              }));
            case ReportFilterableDataType.COACH:
              return props.coaches.map((c) => ({
                label: c.name,
                value: c.id,
                columnName,
              }));
            case ReportFilterableDataType.BILLING_ESTABLISHMENT:
              return props.establishments.map((e) => ({
                label: e.location.address,
                value: e.id,
                columnName,
              }));
            case ReportFilterableDataType.ESTABLISHMENT:
              return props.establishments.map((e) => ({
                label: e.title,
                value: e.id,
                columnName,
              }));
            case ReportFilterableDataType.PRIVATE_SERVICE:
              return props.privateServices.map((ps) => ({
                label: ps.name,
                value: ps.id,
                columnName,
              }));
            case ReportFilterableDataType.PRIVATE_SLOT:
              return props.privateSlots.map((ps) => ({
                label: ps.name,
                value: ps.id,
                columnName,
              }));
            case ReportFilterableDataType.PRIVATE_PASS:
              return props.privatePasses
                .filter((pp) => pp.credits > 0)
                .map((pp) => ({
                  label: pp.name,
                  value: pp.id,
                  columnName,
                }));
            case ReportFilterableDataType.PRIVATE_PASS_CATEGORY:
              return props.privatePassCategories.map((privatePassCategory) => ({
                label: privatePassCategory.name,
                value: privatePassCategory.id,
                columnName,
              }));
            case ReportFilterableDataType.GIFTCARD:
              return props.giftCards.map((gc) => ({
                label: gc.name,
                value: gc.id,
                columnName,
              }));
            case ReportFilterableDataType.COUPON:
              return props.coupons.map((c) => ({
                label: c.name,
                value: c.id,
                columnName,
              }));
            case ReportFilterableDataType.VIDEO:
              return props.videos.map((v) => ({
                label: v.name,
                value: v.id,
                columnName,
              }));
            case ReportFilterableDataType.BILLING_GROUP:
              return props.billingGroups.map((bg) => ({
                label: bg.name,
                value: bg.id,
                columnName,
              }));
            case ReportFilterableDataType.BILLING_GROUP_ADDRESS:
              return props.billingGroups.map((bg) => ({
                label: bg.address,
                value: bg.id,
                columnName,
              }));
            case ReportFilterableDataType.CONTRACT:
              return props.contracts.map((contract) => ({
                label: contract.name,
                value: contract.id,
                columnName,
              }));
            case ReportFilterableDataType.SUBSHOP:
              return (
                props.subshops?.map((subshop) => ({
                  label: subshop.name,
                  value: subshop.id,
                  columnName,
                })) ?? []
              );
            case ReportFilterableDataType.STAFF:
              return props.staffs.map((staff) => ({
                value: staff.id,
                label: `${staff.first_name} ${staff.last_name}`,
                columnName,
              }));
            case ReportFilterableDataType.COMPANY:
              return (
                props.franchiseCompanies?.map((c) => ({
                  label: c.name,
                  value: c.id,
                  columnName,
                })) ?? []
              );
            case ReportFilterableDataType.BOOKKEEPING_ACCOUNT:
              if (columnName === 'bookkeeping_account_name') {
                return props.bookkeepingAccounts.map((bookkeepingAccount) => ({
                  label: bookkeepingAccount.account_name,
                  value: bookkeepingAccount.account_name,
                  columnName,
                }));
              }
              return props.bookkeepingAccounts.map((bookkeepingAccount) => ({
                label: bookkeepingAccount.account_number,
                value: bookkeepingAccount.account_number,
                columnName,
              }));
            default:
              return [];
          }
        },
    }),
  )(WrappedComponent);
}
