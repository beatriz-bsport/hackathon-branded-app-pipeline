import { PaymentPack } from './available-payment.type';

export const START_ON_FIRST_BOOKING = 0;
export const START_ON_FIRST_ATTENDANCE = 1;
export const START_ON_PURCHASE = 2;

export const filterUnaccessiblePaymentPack = (
  paymentPacks: PaymentPack[],
  {
    memberTagIdsList = [],
    authenticated,
  }: { memberTagIdsList: number[]; authenticated: boolean },
) => {
  if (Array.isArray(paymentPacks)) {
    if (!authenticated) {
      return paymentPacks
        ? paymentPacks
            .filter((pack) => !!pack)
            .filter(
              (pack) =>
                pack.whitelist_tags &&
                pack.whitelist_tags.length === 0 &&
                pack.blacklist_tags &&
                pack.blacklist_tags.length === 0,
            )
        : [];
    }
    if (memberTagIdsList.length === 0) {
      return paymentPacks
        ? paymentPacks.filter(
            (pack) => pack.whitelist_tags && pack.whitelist_tags.length === 0,
          )
        : [];
    }
    return paymentPacks
      ? paymentPacks
          .filter((pack) => !!pack)
          .filter(
            (pack) =>
              ((pack.blacklist_tags &&
                pack.blacklist_tags.length !== 0 &&
                !pack.blacklist_tags.some((tag) =>
                  memberTagIdsList.includes(tag),
                )) ||
                !pack.blacklist_tags ||
                pack.blacklist_tags.length === 0) &&
              ((pack.whitelist_tags &&
                pack.whitelist_tags.length !== 0 &&
                pack.whitelist_tags.some((tag) =>
                  memberTagIdsList.includes(tag),
                )) ||
                !pack.whitelist_tags ||
                pack.whitelist_tags.length === 0),
          )
      : [];
  }
  return paymentPacks;
};
