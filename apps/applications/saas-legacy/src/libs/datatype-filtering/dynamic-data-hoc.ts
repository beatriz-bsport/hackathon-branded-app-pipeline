import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { getPageMetaActivities } from '#src/libs/meta-activity/selectors';
import {
  getAll as getAllPaymentPack,
  getAllPaymentPackCategory,
} from '#src/libs/payment-packs/selectors';
import { getAllCoaches } from '#src/libs/associated-coach/selectors';
import {
  getAllEstablishments,
  getEstablishmentBillingroups,
  getEstablishmentGroups,
} from '#src/libs/establishment/selectors';
import { getMembersBasedOnListData } from '#src/libs/member/selectors';
import { getPrivatePassListBase } from '#src/libs/private-service/selectors/private-pass';
import { _getPrivateServices as getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import { getPrivatePassCategories } from '#src/libs/private-service/selectors/private-pass-category';
import { getAllPrivateSlots } from '#src/libs/private-service/selectors/private-slot';
import { getAllGiftcardList } from '#src/libs/giftcard/selectors';
import { getAllCoupons } from '#src/libs/coupon/selectors';
import { getVideoList } from '#src/libs/video/selectors';
import { getAvailableContractList } from '#src/libs/subscription/selectors';
import { getTheme } from '#src/libs/theme/selectors';
import {
  getShopItemStandaloneList,
  getSubShopsByCompany,
} from '#src/libs/shop/selectors';
import { getUsersWithRole } from '#src/libs/role/selectors';
import { getBookkeepingAccountList } from '#src/libs/payment/selectors';
import {
  getDynamicDataLoading,
  getDynamicDataHasBeenLoaded,
} from '#src/libs/datatype-filtering/selectors';
import { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';

import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#src/libs/role/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#src/libs/meta-activity/actions';
import { fetchMemberBulk as fetchMemberBulkAction } from '#src/libs/member/actions';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchAllPaymentPackCategory as fetchAllPaymentPackCategoryAction,
} from '#src/libs/payment-packs/actions';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#src/libs/establishment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#src/libs/associated-coach/actions';
import {
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchAllPrivateSlots as fetchAllPrivateSlotsAction,
  fetchPrivatePassList as fetchPrivatePassListAction,
  fetchAllPrivatePassCategory as fetchAllPrivatePassCategoryAction,
} from '#src/libs/private-service/actions';
import { fetchGiftcardList as fetchGiftcardListAction } from '#src/libs/giftcard/actions';
import { fetchCoupons as fetchCouponsAction } from '#src/libs/coupon/actions';
import { fetchVideoList as fetchVideoListAction } from '#src/libs/video/actions';
import { fetchContractList as fetchContractListAction } from '#src/libs/subscription/actions';
import { fetchAllSubShop as fetchAllSubShopAction } from '#src/libs/shop/actions/subshop';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  setDynamicDataHasBeenLoaded as setDynamicDataHasBeenLoadedAction,
  resetDynamicDataHasBeenLoaded as resetDynamicDataHasBeenLoadedAction,
} from '#src/libs/datatype-filtering/actions';
import { OptionTypeBase } from '#src/components/Selector/MaterialUISelector.component';
import { getFranchiseCompanies } from '../franchise/selectors';
import { ReportFilterableDataType } from './constants';
import type { RootState } from '#src/reducers';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import {
  REPORT_CATEGORIES_WITHOUT_ARCHIVED_MEMBERS,
  REPORT_CATEGORIES_WITH_DISABLED_PAYMENT_PACK,
} from '#src/libs/reporting/common/constants';
import { fetchShopItemStandaloneList as fetchShopItemStandaloneListAction } from '#src/libs/shop/actions/shopItemReworked';
import { fetchPaymentComboBulk as fetchPaymentComboBulkAction } from '#src/libs/payment-combo/actions';
import { getAllPaymentComboList } from '#src/libs/payment-combo/selectors';

type DynamicConnectedProps = ConnectedProps<typeof connector>;

export type handleGetDynamicDataForFiltersReturn =
  | OptionTypeBase[]
  | string
  | null;

export type handleGetDynamicDataForFiltersType = (
  type: DynamicFilterDataType,
  valueId?: number[],
  columnName?: string,
  reportCategory?: ReportCategoryEnum,
  withoutFetch?: boolean,
) => handleGetDynamicDataForFiltersReturn;

export type withDatatypeDynamicDataProps = DynamicConnectedProps & {
  handleGetDynamicDataForFilters: handleGetDynamicDataForFiltersType;
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
    membersListData: getMembersBasedOnListData(state),
    privatePasses: getPrivatePassListBase(state),
    privateServices: getPrivateServices(state),
    privateSlots: getAllPrivateSlots(state),
    giftCards: getAllGiftcardList(state),
    coupons: getAllCoupons(state),
    billingGroups: getEstablishmentBillingroups(state),
    videos: getVideoList(state),
    // @ts-expect-error
    contracts: getAvailableContractList(state),
    subshops: getSubShopsByCompany(state, getTheme(state).company),
    staffs: getUsersWithRole(state),
    franchiseCompanies: getFranchiseCompanies(state),
    paymentPackCategories: getAllPaymentPackCategory(state),
    privatePassCategories: getPrivatePassCategories(state),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    establishmentGroups: getEstablishmentGroups(state),
    standAloneshopItems: getShopItemStandaloneList(state),
    paymentCombos: getAllPaymentComboList(state),
  }),
  {
    // Actions for dynamic data
    setDynamicDataHasBeenLoaded: setDynamicDataHasBeenLoadedAction,
    resetDynamicDataHasBeenLoaded: resetDynamicDataHasBeenLoadedAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchEstablishments: fetchEstablishmentsAction,
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
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchMemberBulk: fetchMemberBulkAction,
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
    fetchPaymentComboBulk: fetchPaymentComboBulkAction,
  },
);

/**
 * This hoc only contains 1 handler which has 3 different purposes:
 *    - Calling method defined in actions files
 *    - Retrieve options through redux, to be used in Select component from React Select
 *    - Retrieve 1 value if valueId argument is given
 */
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
          columnName?: string,
          reportCategory?: ReportCategoryEnum,
          withoutFetch?: boolean,
        ) => {
          if (
            // @ts-expect-error
            !props.dynamicDataLoading[type] &&
            !props.dynamicDataHasBeenLoaded[type] &&
            !withoutFetch
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
                  {
                    page_size: 70000,
                    ...(!REPORT_CATEGORIES_WITH_DISABLED_PAYMENT_PACK.includes(
                      reportCategory,
                    ) && {
                      disabled: false,
                    }),
                  },
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
              case ReportFilterableDataType.PAYMENT_COMBO:
                props.fetchPaymentComboBulk(null, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('payment_combo');
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
              case ReportFilterableDataType.SHOP_ITEM:
                props.fetchShopItemStandaloneList(null, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('shop_item');
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
              case ReportFilterableDataType.USER:
                /** Member filtering is different than other filters
                 * Its value either comes from a searchable selector, or
                 * by fetching member when arriving on page
                 */

                valueId[0] &&
                !props.membersListData.find(
                  (member) => member.consumer === valueId[0],
                )
                  ? props.fetchMemberBulk(
                      {
                        consumer_id__in: valueId[0],
                        ...(REPORT_CATEGORIES_WITHOUT_ARCHIVED_MEMBERS.includes(
                          reportCategory,
                        ) && {
                          exclude_archived:
                            REPORT_CATEGORIES_WITHOUT_ARCHIVED_MEMBERS.includes(
                              reportCategory,
                            ),
                        }),
                      },
                      {
                        onSuccess: () => {
                          props.setDynamicDataHasBeenLoaded('user');
                        },
                      },
                    )
                  : props.setDynamicDataHasBeenLoaded('user');
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
              case ReportFilterableDataType.ESTABLISHMENT_GROUP:
                props.fetchAllEstablishmentGroup(props.companyId, {
                  onSuccess: () => {
                    props.setDynamicDataHasBeenLoaded('establishment_group');
                  },
                });
                break;
              default:
            }
          }

          if (
            // @ts-expect-error
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
                  // @ts-expect-error
                  (paymentPack) =>
                    paymentPack.id.toString() === stringifiedValue,
                )?.name;

              case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
                return props.paymentPackCategories.find(
                  // @ts-expect-error
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

              case ReportFilterableDataType.ESTABLISHMENT_GROUP:
                return props.establishmentGroups.find(
                  (establishmentGroup) =>
                    establishmentGroup.id.toString() === stringifiedValue,
                )?.name;

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

              case ReportFilterableDataType.PAYMENT_COMBO:
                return props.paymentCombos.find(
                  (paymentCombo) =>
                    paymentCombo.id.toString() === stringifiedValue,
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
              case ReportFilterableDataType.SHOP_ITEM:
                return props.standAloneshopItems.find(
                  (shopItem) => shopItem.id.toString() === stringifiedValue,
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
              case ReportFilterableDataType.USER: {
                const member = props.membersListData.find(
                  (memberListData) => memberListData.consumer === valueId[0],
                );

                if (member) {
                  return `${member.name}`.trim() || null;
                }

                return null;
              }
              case ReportFilterableDataType.COMPANY: {
                const matchingFranchiseCompany = (
                  props.franchiseCompanies ?? []
                )
                  // @ts-expect-error
                  .find(
                    // @ts-expect-error
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
              // @ts-expect-error
              return props.paymentPacks.map((p) => ({
                label: p.name,
                value: p.id,
                columnName,
              }));
            case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
              // @ts-expect-error
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

            case ReportFilterableDataType.PAYMENT_COMBO:
              return props.paymentCombos.map((paymentCombo) => ({
                label: paymentCombo.name,
                value: paymentCombo.id,
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
            case ReportFilterableDataType.SHOP_ITEM:
              return props.standAloneshopItems.map((shopItem) => ({
                label: shopItem.name,
                value: shopItem.id,
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
                // @ts-expect-error
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
                  value: bookkeepingAccount.id,
                  columnName,
                }));
              }
              return props.bookkeepingAccounts.map((bookkeepingAccount) => ({
                label: bookkeepingAccount.account_number,
                value: bookkeepingAccount.id,
                columnName,
              }));
            default:
              return [];
            case ReportFilterableDataType.ESTABLISHMENT_GROUP:
              return props.establishmentGroups.map((establishment_group) => ({
                label: establishment_group.name,
                value: establishment_group.id,
                columnName,
              }));
          }
        },
    }),
  )(WrappedComponent);
}
