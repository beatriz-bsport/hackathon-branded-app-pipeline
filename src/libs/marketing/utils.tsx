import { TFunction } from 'i18next';
import memoize from 'memoize-one';

export const getMergeTags = memoize(
  (tags: { [tag_name: string]: string[] }, t: TFunction) => {
    if (tags) {
      return [
        ...Object.entries(tags).reduce((acc, [tagCategory, tagList]) => {
          acc.push({
            label: t(`notificationRule:tag.${tagCategory}.name`),
            options: [...tagList].map((tag) => ({
              label: t(`notificationRule:tag.${tagCategory}.tags.${tag}`),
              value: `{${tag}}`,
            })),
          });
          return acc;
        }, []),
      ];
    }
    return null;
  },
);
