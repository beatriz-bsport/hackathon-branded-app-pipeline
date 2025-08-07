import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';
import chroma from 'chroma-js';
import { TFunction } from 'i18next';

import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { Contract } from '#src/libs/subscription/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { Basket } from '#src/libs/checkout/types';
import type { Member } from '#src/libs/member/types';
import type { TranslationProps } from '#src/components/DialogWithBigIcon/DialogWithBigIcon.component';
import type { Tag } from '#src/libs/tag/types';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import type {
  QuicksaleCardInfo,
  QuicksaleItem,
  QuicksaleSection,
} from './types';
import { QuicksaleItemColor, QuicksaleSectionColor } from './constants';

export const getBorderColorFromBackgroundColor = (backgroundColor: string) => {
  // This function retrieves the border color of an item card of the quicksale
  // configuration based on the background color of the card.
  const colorKey = Object.keys(QuicksaleItemColor).find(
    (key: keyof typeof QuicksaleItemColor) =>
      QuicksaleItemColor[key] === backgroundColor,
  );
  if (colorKey)
    return QuicksaleSectionColor[
      colorKey as keyof typeof QuicksaleSectionColor
    ];
  return QuicksaleSectionColor.Black;
};

const DEFAULT_BRIGHTNESS_THRESHOLD = 0.27;

export function determinePropertyFromBrightness<T>(
  color: string,
  highBrightnessProperty: T,
  lowBrightnessProperty: T,
  threshold: number = DEFAULT_BRIGHTNESS_THRESHOLD,
): T {
  // If the color's brightness is above the threshold, returns the high brightness property
  // Otherwise, returns the low brightness property
  return chroma(color).luminance() > threshold
    ? highBrightnessProperty
    : lowBrightnessProperty;
}

export const getBuyableItemFromIdentifierAndId = (
  buyableItemIdentifier: QuicksaleBasketItem,
  id: number,
  paymentPackById: { [key: number]: PaymentPack },
  privatePassById: { [key: number]: PrivatePass },
  paymentComboById: { [key: number]: PaymentCombo },
  shopItemById: { [key: number]: ShopItem },
  subscriptionById: { [key: number]: Contract },
  giftcardById: { [key: number]: Giftcard },
) => {
  switch (buyableItemIdentifier) {
    case QuicksaleBasketItem.PaymentPackIdentifier:
      return paymentPackById[id]?.is_usable_by_staff &&
        !paymentPackById[id]?.disabled
        ? paymentPackById[id]
        : undefined;
    case QuicksaleBasketItem.PrivatePassIdentifier:
      return privatePassById[id]?.is_usable_by_staff &&
        privatePassById[id]?.available
        ? privatePassById[id]
        : undefined;
    case QuicksaleBasketItem.PaymentComboIdentifier:
      return paymentComboById[id]?.is_usable_by_staff &&
        paymentComboById[id]?.available
        ? paymentComboById[id]
        : undefined;
    case QuicksaleBasketItem.ShopItemIdentifier:
      return shopItemById[id];
    case QuicksaleBasketItem.SubscriptionIdentifier:
      return subscriptionById[id]?.is_usable_by_staff &&
        !subscriptionById[id]?.disabled
        ? subscriptionById[id]
        : undefined;
    default:
      return !giftcardById[id]?.disabled ? giftcardById[id] : undefined;
  }
};

export type BuyableItemAndIdentifier =
  | {
      buyableItemIdentifier: QuicksaleBasketItem.PaymentPackIdentifier;
      buyableItem: PaymentPack;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.PrivatePassIdentifier;
      buyableItem: PrivatePass;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.PaymentComboIdentifier;
      buyableItem: PaymentCombo;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.ShopItemIdentifier;
      buyableItem: ShopItem;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.SubscriptionIdentifier;
      buyableItem: Contract;
    }
  | {
      buyableItemIdentifier: QuicksaleBasketItem.GiftcardIdentifier;
      buyableItem: Giftcard;
    };

export const getCardInfoFromBuyableItem = (
  { buyableItemIdentifier, buyableItem }: BuyableItemAndIdentifier,
  t: TFunction, // defined with the namespace 'quicksale'
  color?: string,
  sectionId?: string,
  outOfStock?: boolean,
  restricted?: boolean,
  variants?: Array<{
    variant_id: number;
    color: QuicksaleItemColor;
  }>,
  title?: string,
): QuicksaleCardInfo => {
  const id = `${buyableItemIdentifier} ${buyableItem.id}`;
  const itemColor = (color ?? QuicksaleItemColor.Gray) as QuicksaleItemColor;
  switch (buyableItemIdentifier) {
    case QuicksaleBasketItem.PaymentPackIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: `${t('objectCard.subtitle.paymentPack')} - ${
          buyableItem.credits === null
            ? t('objectCard.subtitle.unlimited')
            : `${getCreditsDividedDisplay(buyableItem.credits)} ${t(
                'objectCard.subtitle.credit',
                {
                  count: getCreditsDividedValue(buyableItem.credits),
                },
              )}`
        }`,
        price: Number(buyableItem.price),
        color: itemColor,
        sectionId: sectionId ?? '',
        outOfStock,
        restricted,
        tax: buyableItem.tax.toString(),
      };
    case QuicksaleBasketItem.PrivatePassIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: `${t('objectCard.subtitle.privatePass')} - ${
          buyableItem.credits === null
            ? t('objectCard.subtitle.unlimited')
            : `${getCreditsDividedDisplay(buyableItem.credits)} ${t(
                'objectCard.subtitle.credit',
                {
                  count: getCreditsDividedValue(buyableItem.credits),
                },
              )}`
        }`,
        price: Number(buyableItem.price),
        color: itemColor,
        sectionId: sectionId ?? '',
        outOfStock,
        restricted,
        tax: buyableItem.tax.toString(),
      };
    case QuicksaleBasketItem.PaymentComboIdentifier: {
      const numberOfProducts =
        buyableItem.payment_packs.length +
        buyableItem.private_passes.length +
        buyableItem.shop_items.length;
      return {
        id,
        title: buyableItem.name,
        subtitle: `${t(
          'objectCard.subtitle.paymentCombo',
        )} - ${numberOfProducts} ${t('objectCard.subtitle.product', {
          count: numberOfProducts,
        })}`,
        price: Number(buyableItem.price),
        color: itemColor,
        sectionId: sectionId ?? '',
        outOfStock,
        restricted,
        tax: buyableItem.tax.toString(),
      };
    }
    case QuicksaleBasketItem.ShopItemIdentifier:
      return {
        id,
        title: title ?? buyableItem.name,
        subtitle: t('objectCard.subtitle.shopProduct'),
        price: Number(buyableItem.price),
        color: itemColor,
        sectionId: sectionId ?? '',
        outOfStock,
        restricted,
        tax: buyableItem.tva.toString(),
        lowestVariantPrice: buyableItem?.lowest_variant_price,
        numberOfVariants: buyableItem?.number_of_variants,
        allVariantsFollowBasePrice: buyableItem?.all_variants_follow_base_price,
        is_base_item:
          !buyableItem.is_standalone_item && buyableItem.base_item === null,
        variants: variants?.length
          ? variants
          : buyableItem.variant_ids?.map((variantId) => ({
              variant_id: variantId,
              color: QuicksaleItemColor.Gray, // Default color, can be customized later
            })),
      };
    case QuicksaleBasketItem.SubscriptionIdentifier:
      return {
        id,
        title: buyableItem.name,
        subtitle: t('objectCard.subtitle.subscription'),
        price: Number(buyableItem.recurrent_price),
        recurrence: t(`objectCard.recurrence.${buyableItem.interval}`, {
          count: buyableItem.recurrence_basis,
          recurrence_basis: buyableItem.recurrence_basis,
        }),
        color: itemColor,
        sectionId: sectionId ?? '',
        outOfStock,
        restricted,
        tax: '0',
      };
    default:
      return {
        id,
        title: buyableItem.name,
        subtitle: t('objectCard.subtitle.giftcard'),
        price: Number(buyableItem.price),
        color: itemColor,
        sectionId: sectionId ?? '',
        outOfStock,
        restricted,
        tax: '0',
      };
  }
};

// This function is helpful when using Fuse. The result of fuse.search has the type
// ```
// X[] | Fuse.FuseResultWithMatches<X>[] | Fuse.FuseResultWithScore<X>[] |
// (Fuse.FuseResultWithMatches<...> & Fuse.FuseResultWithScore<...>)[]
// ```
// according to TS (where X is the type of the items you give to the search),
// but it's actually never X[] directly, so this is used to make TS understand that.
export function isNotQuicksaleCardInfoList<T extends Object[]>(
  object: T,
): object is Exclude<T, QuicksaleCardInfo[]> {
  return object.length > 0 && 'item' in object[0];
}

export const getQuicksaleCardInfoFromQuicksaleItem = (
  item: QuicksaleItem,
  paymentPackById: { [key: number]: PaymentPack },
  privatePassById: { [key: number]: PrivatePass },
  paymentComboById: { [key: number]: PaymentCombo },
  shopItemById: { [key: number]: ShopItem },
  contractById: { [key: number]: Contract },
  giftcardById: { [key: number]: Giftcard },
  t: TFunction, // defined with the namespace 'quicksale'
  section?: QuicksaleSection,
  currentBasket?: Basket,
  memberById?: { [key: number]: Member },
): QuicksaleCardInfo | undefined => {
  // This function is used to convert the quicksale items stored
  // in the database into QuickSaleCardInfo objects to display them
  const buyableItem = getBuyableItemFromIdentifierAndId(
    item.buyable_item_identifier,
    item.object_id,
    paymentPackById,
    privatePassById,
    paymentComboById,
    shopItemById,
    contractById,
    giftcardById,
  );
  if (buyableItem === undefined) return undefined;

  const unauthenticated =
    !currentBasket || memberById[currentBasket?.member]?.is_pos;

  const isConcernedByNewMemberRestriction =
    [
      QuicksaleBasketItem.PaymentPackIdentifier,
      QuicksaleBasketItem.PrivatePassIdentifier,
      QuicksaleBasketItem.PaymentComboIdentifier,
    ].includes(item.buyable_item_identifier) &&
    (buyableItem as PaymentPack | PrivatePass | PaymentCombo).new_member_only;

  const authenticatedMemberIsNotNew =
    memberById[currentBasket?.member]?.has_bought_pack;

  const isConcernedByTagsRestriction =
    item.buyable_item_identifier ===
      QuicksaleBasketItem.PaymentPackIdentifier &&
    ((buyableItem as PaymentPack).whitelist_tags.length > 0 ||
      (buyableItem as PaymentPack).blacklist_tags.length > 0);

  const authenticatedMemberIsMissingRequiredTag = !memberById[
    currentBasket?.member
  ]?.tags?.some((tagId) =>
    (buyableItem as PaymentPack).whitelist_tags?.includes(tagId),
  );

  const authenticatedMemberHasForbiddenTag = memberById[
    currentBasket?.member
  ]?.tags?.some((tagId) =>
    (buyableItem as PaymentPack).blacklist_tags?.includes(tagId),
  );

  const shopItemVariants =
    item.buyable_item_identifier === QuicksaleBasketItem.ShopItemIdentifier &&
    Array.isArray(item.variants) &&
    Array.isArray((buyableItem as ShopItem).variant_ids)
      ? item.variants
          ?.map((configuredVariant) => {
            const existsInBuyableItem = (
              buyableItem as ShopItem
            ).variant_ids?.includes(configuredVariant.variant_id);

            if (!existsInBuyableItem) return null;

            return {
              variant_id: configuredVariant.variant_id,
              color:
                (configuredVariant.color as QuicksaleItemColor) ??
                QuicksaleItemColor.Gray,
            };
          })
          .filter(Boolean)
      : undefined;

  return getCardInfoFromBuyableItem(
    {
      buyableItemIdentifier: item.buyable_item_identifier,
      buyableItem,
    } as BuyableItemAndIdentifier,
    t,
    item.color,
    section?.section_id ?? '',
    item.buyable_item_identifier === QuicksaleBasketItem.ShopItemIdentifier &&
      ((buyableItem as ShopItem).current_stock ?? 0) <= 0 &&
      (buyableItem as ShopItem).number_of_variants === 0,
    (isConcernedByNewMemberRestriction &&
      (unauthenticated || authenticatedMemberIsNotNew)) ||
      (isConcernedByTagsRestriction &&
        (unauthenticated ||
          authenticatedMemberIsMissingRequiredTag ||
          authenticatedMemberHasForbiddenTag)),
    shopItemVariants,
  );
};

export const getMemberRestrictionModalSubTexts = (
  buyableItemIdentifier: QuicksaleBasketItem,
  t: TFunction, // defined with the namespace 'quicksale'
  currentBasket?: Basket,
  member?: Member,
  buyableItem?: PaymentPack | PrivatePass | PaymentCombo,
  tagsById?: { [key: number]: Tag },
): TranslationProps[][] => {
  // This function aims at building the subtexts of the modal
  // that opens whenever a staff member tries to add to a basket
  // a quicksale item that is either restricted to new members
  // or to members with/without specific tags
  const isUnauthenticated = !currentBasket || member?.is_pos;

  // Check if the item is restricted to new members
  const isNewMemberRestricted =
    [
      QuicksaleBasketItem.PaymentPackIdentifier,
      QuicksaleBasketItem.PrivatePassIdentifier,
      QuicksaleBasketItem.PaymentComboIdentifier,
    ].includes(buyableItemIdentifier) &&
    (buyableItem as PaymentPack | PrivatePass | PaymentCombo).new_member_only &&
    member?.has_bought_pack;

  // Check if the item is restricted by whitelist tags
  const isWhitelistTagsRestricted =
    buyableItemIdentifier === QuicksaleBasketItem.PaymentPackIdentifier &&
    (buyableItem as PaymentPack).whitelist_tags.length > 0;

  // Check if the member is missing the required tag for whitelist restriction
  const isMissingRequiredTag =
    isWhitelistTagsRestricted &&
    !member?.tags?.some((tagId) =>
      (buyableItem as PaymentPack).whitelist_tags?.includes(tagId),
    );

  // Get the name of the required not owned tag
  const requiredNotOwnedTagName =
    isMissingRequiredTag && tagsById
      ? tagsById[
          (buyableItem as PaymentPack).whitelist_tags?.find(
            (tag) => !member?.tags.includes(tag),
          )
        ]?.name
      : undefined;

  // Check if the item is restricted by blacklist tags
  const isBlacklistTagsRestricted =
    buyableItemIdentifier === QuicksaleBasketItem.PaymentPackIdentifier &&
    (buyableItem as PaymentPack).blacklist_tags.length > 0;

  // Check if the member has a forbidden tag for blacklist restriction
  const hasForbiddenTag =
    isBlacklistTagsRestricted &&
    member?.tags?.some((tagId) =>
      (buyableItem as PaymentPack).blacklist_tags?.includes(tagId),
    );

  // Get the name of the forbidden owned tag
  const forbiddenOwnedTagName =
    hasForbiddenTag && tagsById
      ? tagsById[
          (buyableItem as PaymentPack).blacklist_tags.find((tag) =>
            member?.tags?.includes(tag),
          )
        ]?.name
      : undefined;

  const subTexts: TranslationProps[][] = [];

  // Building subtexts for restricted members
  if (
    isNewMemberRestricted &&
    (requiredNotOwnedTagName || forbiddenOwnedTagName)
  ) {
    subTexts.push(
      isUnauthenticated
        ? ['quicksale:interface.authenticationRequired.subTextListItem']
        : ['quicksale:interface.cannotAdd.subTextListItem'],
    );

    if (isUnauthenticated) {
      subTexts.push([
        'quicksale:interface.authenticationRequired.newMember.subTextListItem',
        'quicksale:interface.authenticationRequired.tag.subTextListItem',
      ]);
    } else {
      const optionalBeginning: TranslationProps[] = [
        {
          translationKey: 'quicksale:interface.cannotAdd.newMember.subText',
          options: { name: member?.name },
        },
      ];

      if (requiredNotOwnedTagName && forbiddenOwnedTagName) {
        optionalBeginning.push({
          translationKey:
            'quicksale:interface.cannotAdd.tag.hasTagAndDoesNotHaveTag',
          options: {
            name: member?.name,
            ownedTagName: forbiddenOwnedTagName,
            notOwnedTagName: requiredNotOwnedTagName,
          },
        });
      } else if (requiredNotOwnedTagName) {
        optionalBeginning.push({
          translationKey: 'quicksale:interface.cannotAdd.tag.doesNotHaveTag',
          options: { name: member?.name, tagName: requiredNotOwnedTagName },
        });
      } else {
        optionalBeginning.push({
          translationKey: 'quicksale:interface.cannotAdd.tag.hasTag',
          options: { name: member?.name, tagName: forbiddenOwnedTagName },
        });
      }

      subTexts.push(optionalBeginning);
    }
  } else if (isNewMemberRestricted) {
    subTexts.push(
      isUnauthenticated
        ? ['quicksale:interface.authenticationRequired.newMember.subText']
        : [
            {
              translationKey: 'quicksale:interface.cannotAdd.newMember.subText',
              options: {
                name: member?.name,
                optionalBeginning: t(
                  'quicksale:interface.cannotAdd.subTextListItem',
                ) as string,
              },
            },
          ],
    );
  } else if (isUnauthenticated) {
    subTexts.push(['quicksale:interface.authenticationRequired.tag.subText']);
  } else {
    const optionalBeginning = t(
      'quicksale:interface.cannotAdd.subTextListItem',
    ) as string;

    if (requiredNotOwnedTagName && forbiddenOwnedTagName) {
      subTexts.push([
        {
          translationKey:
            'quicksale:interface.cannotAdd.tag.hasTagAndDoesNotHaveTag',
          options: {
            name: member?.name,
            ownedTagName: forbiddenOwnedTagName,
            notOwnedTagName: requiredNotOwnedTagName,
            optionalBeginning,
          },
        },
      ]);
    } else if (requiredNotOwnedTagName) {
      subTexts.push([
        {
          translationKey: 'quicksale:interface.cannotAdd.tag.doesNotHaveTag',
          options: {
            name: member?.name,
            tagName: requiredNotOwnedTagName,
            optionalBeginning,
          },
        },
      ]);
    } else {
      subTexts.push([
        {
          translationKey: 'quicksale:interface.cannotAdd.tag.hasTag',
          options: {
            name: member?.name,
            tagName: forbiddenOwnedTagName,
            optionalBeginning,
          },
        },
      ]);
    }
  }

  // Add bottom subtext for unauthenticated members
  if (isUnauthenticated) {
    subTexts.push(['quicksale:interface.authenticationRequired.bottomSubText']);
  }

  return subTexts;
};

export const getIdsFromQuicksaleCardInfoId = (item?: QuicksaleCardInfo) => {
  return item?.id?.split(' ');
};

export const getQuicksaleCardInfoIdFromIds = (
  buyableItemIdentifier: QuicksaleBasketItem,
  buyableItemId: number,
) => {
  return `${buyableItemIdentifier} ${buyableItemId}`;
};
