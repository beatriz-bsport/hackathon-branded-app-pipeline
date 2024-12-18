import { ResolvedGenericTags } from './types';

export const replaceGenericTagsInTemplate = (
  resolvedGenericTags: ResolvedGenericTags,
  contentTemplate: string,
) => {
  const newContentTemplate = Object.entries(resolvedGenericTags || {}).reduce(
    (acc, [tagName, tagValue]) => {
      const replaced = acc.replace(new RegExp(`${tagName}`, 'g'), tagValue);
      return replaced;
    },
    contentTemplate || '',
  );
  return newContentTemplate;
};
