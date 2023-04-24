// @ts-nocheck
export const interpolateHTMLWithTags = (
  HTMLToInterpolate: string,
  tagsGroups: { [key: string]: string },
) => {
  if (!tagsGroups || Object.keys(tagsGroups).length === 0) {
    return HTMLToInterpolate;
  }

  let newString = HTMLToInterpolate;
  Object.keys(tagsGroups).forEach((key) => {
    const regex = new RegExp(key, 'g');
    newString = newString.replace(regex, tagsGroups?.[key]);
  });

  return newString;
};

export const findMemberAssociatedTagsInTagsGroups = (
  memberFirstname: string,
  memberLastname: string,
  tagsGroups: Array<Record<string, string>>,
) => {
  // We use firstname and lastname of the member to find in the tags groups its own tags
  const filteringTags = [
    { key: '{firstname}', value: memberFirstname },
    { key: '{lastname}', value: memberLastname },
  ];
  return tagsGroups.find((tags) => hasKeysSetTo(tags, filteringTags));
};

const hasKeysSetTo = (
  obj: Object,
  filteringItems: Array<{ key: string; value: string }>,
) => {
  return filteringItems.every(
    (item) =>
      Object.prototype.hasOwnProperty.call(obj, item.key) &&
      // @ts-ignore
      obj[item.key] === item.value,
  );
};
