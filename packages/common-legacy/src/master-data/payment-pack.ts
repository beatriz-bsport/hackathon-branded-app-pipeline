import { PaymentPack } from './available-payment.type';

export const START_ON_FIRST_BOOKING = 0;
export const START_ON_FIRST_ATTENDANCE = 1;
export const START_ON_PURCHASE = 2;

const isEmpty = <T>(arr?: T): boolean =>
  !Array.isArray(arr) || arr.length === 0;

export const filterUnaccessiblePaymentPack = (
  paymentPacks: PaymentPack[],
  {
    memberTagIdsList = [],
    authenticated,
  }: { memberTagIdsList: number[]; authenticated: boolean },
) => {
  if (isEmpty(paymentPacks)) return [];

  const packs = paymentPacks.filter((pack) => !!pack);

  if (!authenticated) {
    return packs.filter(
      (pack) => isEmpty(pack.whitelist_tags) && isEmpty(pack.blacklist_tags),
    );
  }

  if (isEmpty(memberTagIdsList)) {
    return packs.filter((pack) => isEmpty(pack.whitelist_tags));
  }

  return packs.filter((pack) => {
    const blacklisted =
      !isEmpty(pack.blacklist_tags) &&
      pack.blacklist_tags.some((tag) => memberTagIdsList.includes(tag));
    const whitelisted =
      isEmpty(pack.whitelist_tags) ||
      pack.whitelist_tags.some((tag) => memberTagIdsList.includes(tag));

    return !blacklisted && whitelisted;
  });
};
