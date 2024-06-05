import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';
import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
} from '#src/libs/booker-module/types';
import { consumerPaymentPackListFactory } from '#src/libs/consumer-payment-pack/factories';

import {
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
} from '#src/libs/marketplace/constants';
import {
  paymentPackFactory,
  paymentPackListFactory,
} from '#src/libs/payment-packs/factory';
import { paymentComboListFactory } from '#src/libs/payment-combo/factory';
import { contractListFactory } from '#src/libs/subscription/factory';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { ContractWithPaymentPack } from '#src/libs/subscription/types';
// @ts-expect-error
import MarketplaceBookerModuleBuyableItemsCss from './styles.css?raw';
import MarketplaceBookerModuleBuyableItems from '.';
import { generateRandomName } from '../../../../../utils/factories';

const consumerPacks = consumerPaymentPackListFactory(1);

const getBuyableItemCategories: () => BuyableItemCategory[] = () => {
  const paymentPackList = paymentPackListFactory(2) as PaymentPack[];
  const paymentComboList = paymentComboListFactory(2) as PaymentCombo[];
  const contractList = contractListFactory(2).map((contract) => {
    return {
      ...contract,
      payment_pack: paymentPackFactory(),
      payment_combo: null,
      private_pass: null,
    };
  }) as ContractWithPaymentPack[];

  return [
    {
      index: faker.number.int(10000),
      id: faker.number.int(10000).toString(),
      name: generateRandomName(faker),
      identifier: PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
      values: [
        paymentPackList[0],
        { ...paymentPackList[1], highlighted_as_recommended: true },
      ],
    },
    {
      index: faker.number.int(10000),
      id: faker.number.int(10000).toString(),
      name: generateRandomName(faker),
      identifier: PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
      values: paymentComboList,
    },
    {
      index: faker.number.int(10000),
      id: faker.number.int(10000).toString(),
      name: generateRandomName(faker),
      identifier: CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
      values: contractList,
    },
  ];
};
const buyableItemsCategories = getBuyableItemCategories();
const VariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  theme: CompanyTheme,
): React.ComponentProps<typeof MarketplaceBookerModuleBuyableItems> => {
  const [selectedItem, setSelectedItem] = React.useState<BookerItem>(null);
  const [selectedBuyableItemCategory, setSelectedBuyableItemCategory] =
    React.useState<BuyableItemCategory>(null);
  const [isShowBuyableItems, setIsShowBuyableItems] = React.useState(true);

  const handleClickBuyableItem = React.useCallback(
    (
      buyableItem: BookerModuleBuyableItem,
      itemIdentifier: BuyableItemIdentifier,
    ) => setSelectedItem({ data: buyableItem, itemIdentifier }),
    [],
  );

  const handleClickCategory = React.useCallback(
    (item: BuyableItemCategory) => setSelectedBuyableItemCategory(item),
    [],
  );

  const handleToggleShowBuyableItems = React.useCallback(
    () => setIsShowBuyableItems((prevState) => !prevState),
    [],
  );

  const isLoading = variationsSelected?.loading?.value === 'true';

  return {
    isLoading,
    // @ts-expect-error
    availableConsumerPacks: consumerPacks,
    isShowBuyableItems,
    buyableItemCategories: buyableItemsCategories,
    selectedItem,
    selectedBuyableItemCategory,
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    hideCreditsForCustomers: theme.hide_credits_for_customers,
    // @ts-expect-error
    onSelectConsumerPaymentPack: handleClickBuyableItem,
    onClickShowBuyableItems: handleToggleShowBuyableItems,
    hideUnnecessaryCompatiblePurchaseMethod:
      theme.hide_unnecessary_compatible_purchase_method,
    onClickCategory: handleClickCategory,
    onClickBuyableItem: handleClickBuyableItem,
    onClickAll: () => {},
  };
};

export const BOOKER_MODULE_BUYABLE_ITEMS_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEMS_LIST,
    css: MarketplaceBookerModuleBuyableItemsCss,
    pages: [MarketplacePage.BOOKING_PAGE],
    defaultState: {},
    variations: VariationRegistry,
  };

export const BOOKER_MODULE_BUYABLE_ITEMS_LIST_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <MarketplaceBookerModuleBuyableItems {...componentProps} />;
});
