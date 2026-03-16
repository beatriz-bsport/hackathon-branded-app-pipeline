import { TagsEligibility } from './available-payment.type';

const isEmpty = <T>(arr?: T): boolean =>
  !Array.isArray(arr) || arr.length === 0;

export const filterIneligibleTags = <T extends TagsEligibility>(
  eligibles: T[],
  {
    memberTagIdsList = [],
    authenticated,
  }: { memberTagIdsList: number[]; authenticated: boolean },
): T[] => {
  if (isEmpty(eligibles)) return [];

  const items = eligibles.filter((item) => !!item);

  if (!authenticated) {
    return items.filter(
      (pack) => isEmpty(pack.whitelist_tags) && isEmpty(pack.blacklist_tags),
    );
  }

  if (isEmpty(memberTagIdsList)) {
    return items.filter((item) => isEmpty(item.whitelist_tags));
  }

  return items.filter((item) => {
    const blacklisted =
      !isEmpty(item.blacklist_tags) &&
      item.blacklist_tags.some((tag) => memberTagIdsList.includes(tag));
    const whitelisted =
      isEmpty(item.whitelist_tags) ||
      item.whitelist_tags.some((tag) => memberTagIdsList.includes(tag));

    return !blacklisted && whitelisted;
  });
};
