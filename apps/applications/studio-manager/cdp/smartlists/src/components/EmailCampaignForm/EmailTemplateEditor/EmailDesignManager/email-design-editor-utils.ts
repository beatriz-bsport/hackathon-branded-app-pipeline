import type { CommunicationVariable } from "@bsport/api-cdp/notification-rule";

import { i18nInstance } from "#src/utils/i18n";

type MergeTag = {
  name: string;
  value: string;
};

type MergeTagCategory = {
  name: string;
  mergeTags: Record<string, MergeTag>;
};

type MergeTagsResult = Record<string, MergeTagCategory>;

/**
 * Builds Unlayer merge tags grouped by communication variable category.
 */
export const getMergeTags = ({
  communicationVariables,
}: {
  communicationVariables: CommunicationVariable;
}): MergeTagsResult | null => {
  if (
    !communicationVariables ||
    Object.keys(communicationVariables).length === 0
  ) {
    return null;
  }

  return Object.entries(communicationVariables).reduce<MergeTagsResult>(
    (acc, [tagCategory, tagList]) => ({
      ...acc,
      [tagCategory]: {
        name: i18nInstance.t(`communicationVariable.${tagCategory}.name`, {
          ns: "sm-smartlists_communicationVariables",
          defaultValue: tagCategory,
        }),
        mergeTags: tagList.reduce<Record<string, MergeTag>>(
          (tagListAcc, tag) => ({
            ...tagListAcc,
            [tag]: {
              name: i18nInstance.t(
                `communicationVariable.${tagCategory}.tags.${tag}`,
                {
                  ns: "sm-smartlists_communicationVariables",
                  defaultValue: tag,
                },
              ),
              value: `{${tag}}`,
            },
          }),
          {},
        ),
      },
    }),
    {},
  );
};
