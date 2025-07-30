import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import { ShopItem } from '#src/libs/shop/types';
import { Giftcard } from '#src/libs/giftcard/types';
import { Contract } from '#src/libs/subscription/types';
import { QuicksaleItemColor, QuicksaleSectionColor } from './constants';
import { ErrorAndLoading } from '../types';

export type QuicksaleItem = {
  object_id: number;
  buyable_item_identifier: QuicksaleBasketItem;
  color: QuicksaleItemColor;
  variants?: Array<{
    variant_id: number;
    color: QuicksaleItemColor;
  }>;
};

export type QuicksaleSection = {
  section_id: string;
  section_name: string;
  section_icon: string;
  section_color: QuicksaleSectionColor;
  items: Array<QuicksaleItem>;
  disabled: boolean;
};

export type QuicksaleCardInfo = {
  id: string; // `${buyable_item_identifier} ${object_id}`
  title?: string;
  subtitle?: string;
  price?: number;
  recurrence?: string;
  color?: QuicksaleItemColor;
  sectionId: string;
  outOfStock?: boolean;
  restricted?: boolean;
  tax?: string;
  lowestVariantPrice?: number | null;
  numberOfVariants?: number;
  allVariantsFollowBasePrice?: boolean | null;
  variants?: Array<{
    variant_id: number;
    color: QuicksaleItemColor;
  }>;
};

type QuicksaleItemsByCategory = {
  id: number | null;
  name: string;
  items: Array<QuicksaleCardInfo>;
};

export type QuicksaleItemsByItemIdentifierByCategory = {
  [key in QuicksaleBasketItem]: {
    hasCategories: boolean;
    itemsByCategory: Array<QuicksaleItemsByCategory>;
  };
};

type ObjectByCategory<T> = {
  hasCategories: boolean;
  itemsByCategory: Array<{
    id: number | null;
    name: string;
    items: Array<T>;
  }>;
};

export type QuicksaleObjectsByItemIdentifierByCategory = {
  [QuicksaleBasketItem.PaymentPackIdentifier]: ObjectByCategory<PaymentPack>;
  [QuicksaleBasketItem.PrivatePassIdentifier]: ObjectByCategory<PrivatePass>;
  [QuicksaleBasketItem.PaymentComboIdentifier]: ObjectByCategory<PaymentCombo>;
  [QuicksaleBasketItem.ShopItemIdentifier]: ObjectByCategory<ShopItem>;
  [QuicksaleBasketItem.GiftcardIdentifier]: ObjectByCategory<Giftcard>;
  [QuicksaleBasketItem.SubscriptionIdentifier]: ObjectByCategory<Contract>;
};

export type QuicksaleConfiguration = {
  name: string;
  company: number;
  configuration: Array<QuicksaleSection>;
};

export type QuicksaleObjectsByItemIdentifierById = {
  [QuicksaleBasketItem.PaymentPackIdentifier]: { [id: number]: PaymentPack };
  [QuicksaleBasketItem.PrivatePassIdentifier]: { [id: number]: PrivatePass };
  [QuicksaleBasketItem.PaymentComboIdentifier]: { [id: number]: PaymentCombo };
  [QuicksaleBasketItem.ShopItemIdentifier]: { [id: number]: ShopItem };
  [QuicksaleBasketItem.GiftcardIdentifier]: { [id: number]: Giftcard };
  [QuicksaleBasketItem.SubscriptionIdentifier]: { [id: number]: Contract };
};

export type QuicksaleState = ErrorAndLoading & {
  updateLoading: boolean;
  updateError: Error | null;
  configurationName: string;
  sections: {
    allIds: string[];
    byId: { [section_id: string]: QuicksaleSection };
  };
  items: {
    allIdsAndItemIdentifiers: [QuicksaleBasketItem, number][]; // buyable_item_identifier, object_id
    byItemIdentifierById: {
      [buyableItemIdentifier in QuicksaleBasketItem]: {
        [objectId: number]: QuicksaleItem;
      };
    };
  };
};
