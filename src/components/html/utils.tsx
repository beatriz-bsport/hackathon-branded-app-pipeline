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
