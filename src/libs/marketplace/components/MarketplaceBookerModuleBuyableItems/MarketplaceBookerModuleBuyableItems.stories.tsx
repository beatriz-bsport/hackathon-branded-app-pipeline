import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import { MarketplaceBookerModuleBuyableItemsForStorybook, Props } from '.';
import { consumerPaymentPackListFactory } from '#libs/consumer-payment-pack/factories';
import { generateRandomName } from '../../../../utils/factories';

import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
} from '#libs/booker-module/types';
import {
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
} from '#libs/marketplace/constants';
import {
  paymentPackFactory,
  paymentPackListFactory,
} from '#libs/payment-packs/factory';
import { paymentComboListFactory } from '#libs/payment-combo/factory';
import { contractListFactory } from '#libs/subscription/factory';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { ContractWithPaymentPack } from '#libs/subscription/types';

const consumerPacks = consumerPaymentPackListFactory(3);

const getBuyableItemCategories: () => BuyableItemCategory[] = () => {
  const paymentPackList = paymentPackListFactory(5) as PaymentPack[];
  const paymentComboList = paymentComboListFactory(5) as PaymentCombo[];
  const contractList = contractListFactory(5).map((contract) => {
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
      values: paymentPackList,
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

const BookerModuleBuyableItemsTemplate = (args: Props) => {
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

  return (
    // @ts-expect-error
    <MarketplaceBookerModuleBuyableItemsForStorybook
      selectedItem={selectedItem}
      isShowBuyableItems={isShowBuyableItems}
      selectedBuyableItemCategory={selectedBuyableItemCategory}
      onClickBuyableItem={handleClickBuyableItem}
      onSelectConsumerPaymentPack={handleClickBuyableItem}
      onClickShowBuyableItems={handleToggleShowBuyableItems}
      onClickCategory={handleClickCategory}
      {...args}
    />
  );
};

const baseArgs = {
  isLoading: false,
  isWaitingList: false,
  availableConsumerPacks: consumerPacks,
  buyableItemCategories: getBuyableItemCategories(),
  isExcludingTax: false,
};

export const BuyableItemsLoading = BookerModuleBuyableItemsTemplate.bind({});
BuyableItemsLoading.args = {
  ...baseArgs,
  isLoading: true,
};

export const BuyableItemsWaitingList = BookerModuleBuyableItemsTemplate.bind(
  {},
);
BuyableItemsWaitingList.args = {
  ...baseArgs,
  isWaitingList: true,
};

export const BuyableItemsIdle = BookerModuleBuyableItemsTemplate.bind({});
BuyableItemsIdle.args = baseArgs;

export default {
  title:
    'Components/Marketplace/OfferBooker/MarketplaceBookerModuleBuyableItems',
  component: MarketplaceBookerModuleBuyableItemsForStorybook,
  argTypes: {},
  parameters: {
    docs: {
      page: null,
    },
  },
};
