import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';
import { useMemo } from 'react';

import {
  getSearchItemIndicator,
  getSearchItemPrice,
  ItemType,
} from '#components/css-only/Search/PassSearch/utils';
import {
  MarketplaceSearchContractDataParams,
  MarketplaceSearchDataIdentifier,
  MarketplaceSearchPaymentComboDataParams,
  MarketplaceSearchPaymentPackDataParams,
  MarketplaceSearchPrivatePassDataParams,
} from './types';
import {
  BaseAdditionalData,
  SearchItemData,
} from '#components/css-only/Search/Search.component';

export const useMarketplaceSearchPaymentPackData = ({
  paymentPackList,
  actionIcon,
  isExcludingTax,
  showPaymentPackDetail,
  addPaymentPackToBasket,
}: MarketplaceSearchPaymentPackDataParams) => {
  const { t } = useTranslation('paymentPack');

  let paymentPackItems: Immutable.ImmutableObject<
    SearchItemData<BaseAdditionalData>
  >[] = [];

  paymentPackItems = useMemo(
    () =>
      paymentPackList?.map((paymentPack) =>
        Immutable({
          name: paymentPack.name,
          id: paymentPack.id,
          identifier: MarketplaceSearchDataIdentifier.PAYMENT_PACK,
          additionalData: {
            primary: paymentPack.name,
            secondary: getSearchItemIndicator(
              { item: paymentPack, itemType: ItemType.PAYMENT_PACK },
              t,
            ),
            tertiary: getSearchItemPrice(
              { item: paymentPack, itemType: ItemType.PAYMENT_PACK },
              t,
              isExcludingTax,
            ),
            actionIcon,
            onClick: () => showPaymentPackDetail(paymentPack.id),
            onActionClick: () => addPaymentPackToBasket(paymentPack.id),
          },
        }),
      ),
    [
      actionIcon,
      addPaymentPackToBasket,
      isExcludingTax,
      paymentPackList,
      showPaymentPackDetail,
      t,
    ],
  );

  return { paymentPackItems };
};

export const useMarketplaceSearchPrivatePassData = ({
  privatePassList,
  actionIcon,
  isExcludingTax,
  showPrivatePassDetail,
  addPrivatePassToBasket,
}: MarketplaceSearchPrivatePassDataParams) => {
  const { t } = useTranslation('paymentPack');

  let privatePassItems: Immutable.ImmutableObject<
    SearchItemData<BaseAdditionalData>
  >[] = [];

  privatePassItems = useMemo(
    () =>
      privatePassList?.map((privatePass) =>
        Immutable({
          name: privatePass.name,
          id: privatePass.id,
          identifier: MarketplaceSearchDataIdentifier.PRIVATE_PASS,
          additionalData: {
            primary: privatePass.name,
            secondary: getSearchItemIndicator(
              { item: privatePass, itemType: ItemType.PRIVATE_PASS },
              t,
            ),
            tertiary: getSearchItemPrice(
              { item: privatePass, itemType: ItemType.PRIVATE_PASS },
              t,
              isExcludingTax,
            ),
            actionIcon,
            onClick: () => showPrivatePassDetail(privatePass.id),
            onActionClick: () => addPrivatePassToBasket(privatePass.id),
          },
        }),
      ),
    [
      actionIcon,
      addPrivatePassToBasket,
      isExcludingTax,
      privatePassList,
      showPrivatePassDetail,
      t,
    ],
  );

  return { privatePassItems };
};

export const useMarketplaceSearchPaymentComboData = ({
  paymentComboList,
  actionIcon,
  isExcludingTax,
  showPaymentComboDetail,
  addPaymentComboToBasket,
}: MarketplaceSearchPaymentComboDataParams) => {
  const { t } = useTranslation('notificationRule');

  let paymentComboItems: Immutable.ImmutableObject<
    SearchItemData<BaseAdditionalData>
  >[] = [];

  paymentComboItems = useMemo(
    () =>
      paymentComboList?.map((paymentCombo) =>
        Immutable({
          name: paymentCombo.name,
          id: paymentCombo.id,
          identifier: MarketplaceSearchDataIdentifier.PAYMENT_COMBO,
          additionalData: {
            primary: paymentCombo.name,
            secondary: getSearchItemIndicator(
              { item: paymentCombo, itemType: ItemType.PAYMENT_COMBO },
              t,
            ),
            tertiary: getSearchItemPrice(
              { item: paymentCombo, itemType: ItemType.PAYMENT_COMBO },
              t,
              isExcludingTax,
            ),
            actionIcon,
            onClick: () => showPaymentComboDetail(paymentCombo.id),
            onActionClick: () => addPaymentComboToBasket(paymentCombo.id),
          },
        }),
      ),
    [
      actionIcon,
      addPaymentComboToBasket,
      isExcludingTax,
      paymentComboList,
      showPaymentComboDetail,
      t,
    ],
  );

  return { paymentComboItems };
};

export const useMarketplaceSearchContractData = ({
  contractList,
  actionIcon,
  isExcludingTax,
  showContractDetail,
  addContractToBasket,
}: MarketplaceSearchContractDataParams) => {
  const { t } = useTranslation('platformBilling');

  let contractItems: Immutable.ImmutableObject<
    SearchItemData<BaseAdditionalData>
  >[] = [];

  contractItems = useMemo(
    () =>
      contractList?.map((contract) =>
        Immutable({
          name: contract.name,
          id: contract.id,
          identifier: MarketplaceSearchDataIdentifier.CONTRACT,
          additionalData: {
            primary: contract.name,
            secondary: getSearchItemIndicator(
              { item: contract, itemType: ItemType.CONTRACT },
              t,
            ),
            tertiary: getSearchItemPrice(
              { item: contract, itemType: ItemType.CONTRACT },
              t,
              isExcludingTax,
            ),
            actionIcon,
            onClick: () => showContractDetail(contract.id),
            onActionClick: () => addContractToBasket(contract.id),
          },
        }),
      ),
    [
      actionIcon,
      addContractToBasket,
      contractList,
      isExcludingTax,
      showContractDetail,
      t,
    ],
  );

  return { contractItems };
};
