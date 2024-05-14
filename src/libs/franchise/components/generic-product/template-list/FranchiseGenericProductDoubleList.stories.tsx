import React from 'react';
import { DateTime } from 'luxon';
import FranchiseGenericProductDoubleList, {
  Props,
} from './FranchiseGenericProductDoubleList.component';
import { paymentPackListFactory } from '#libs/payment-packs/factory';
import { PaymentPackTemplate } from '#libs/payment-packs/types';
import { GiftcardTemplateListFactory } from '#libs/giftcard/factory';
import { GiftcardTemplate } from '#libs/giftcard/types';

// TODO: This story is crashing
const defaultArgs = {
  goToItemDetailPage: () => {},
  loading: false,
  openCreateDialog: () => {},
  openDeleteDialog: () => {},
  openEditDialog: () => {},
  activeItemListLabel: 'Disponible à la vente',
  inactiveItemListLabel: 'Indisponible à la vente',
};

const FranchisePaymentPackTemplateList = (args: Props) => (
  <FranchiseGenericProductDoubleList {...args} />
);

export const PaymentPackTemplateList = FranchisePaymentPackTemplateList.bind(
  {},
);

PaymentPackTemplateList.args = {
  ...defaultArgs,
  activeItemList: paymentPackListFactory(6),
  inactiveItemList: paymentPackListFactory(6, { isDisabled: true }),
  deleteTemplateDialogContent:
    'Tu vas supprimer ce payment pack template, tention',
  emptyExplainLabel: 'Aucune carte de cours',
  emptyButtonLabel: 'Ajouter une carte de cours',
  getItemPrimaryText: (ppt: PaymentPackTemplate) => ppt.name,
  getItemSecondaryText: (ppt: PaymentPackTemplate) =>
    `${!ppt.unlimited ? `${ppt.credits} crédits` : 'Illimité'} - ${
      ppt.price
    } € -  ${DateTime.now().toLocaleString()}`,
  getItemFranchiseCompanies: (ppt: PaymentPackTemplate) => ppt.companies,
};

const FranchiseGiftcardTemplateList = (args: Props) => (
  <FranchiseGenericProductDoubleList {...args} />
);

export const GiftcardTemplateList = FranchiseGiftcardTemplateList.bind({});

GiftcardTemplateList.args = {
  ...defaultArgs,
  activeItemList: GiftcardTemplateListFactory(6),
  withFuzzySearch: true,
  inactiveItemList: GiftcardTemplateListFactory(6, true),
  deleteTemplateDialogContent: 'Tu vas supprimer ce giftcard template',
  emptyExplainLabel: 'Aucune carte cadeau',
  emptyButtonLabel: 'Ajouter une nouvelle carte cadeau',
  getItemPrimaryText: (gc: GiftcardTemplate) => gc.name,
  getItemSecondaryText: (gc: GiftcardTemplate) =>
    `${gc.price} € - Valable ${
      gc.expiration_days ? `${gc.expiration_days} jours` : 'sans limite'
    }`,
  getItemCover: (gc: GiftcardTemplate) => gc?.cover,
  getItemFranchiseCompanies: (gc: GiftcardTemplate) => gc.companies,
};

const FranchiseGiftcardTemplateEmptyList = (args: Props) => (
  <FranchiseGenericProductDoubleList {...args} />
);

export const GiftcardTemplateEmptyList =
  FranchiseGiftcardTemplateEmptyList.bind({});

GiftcardTemplateEmptyList.args = {
  ...defaultArgs,
  activeItemList: [],
  inactiveItemList: [],
  deleteTemplateDialogContent: 'Tu vas supprimer ce giftcard template',
  emptyExplainLabel: 'Aucune carte cadeau',
  emptyButtonLabel: 'Ajouter une nouvelle carte cadeau',
  getItemPrimaryText: (gc: GiftcardTemplate) => gc.name,
  getItemSecondaryText: (gc: GiftcardTemplate) =>
    `${gc.price} € - Valable ${
      gc.expiration_days ? `${gc.expiration_days} jours` : 'sans limite'
    }`,
  getItemCover: (gc: GiftcardTemplate) => gc?.cover,
  getItemFranchiseCompanies: (gc: GiftcardTemplate) => gc.companies,
};

export default {
  title: 'Library/Franchise/GenericProduct/Template List',
  component: FranchiseGenericProductDoubleList,
  parameters: {
    docs: {
      page: null,
    },
  },
};
