import { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";
import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { TagSelectorField } from "./tag-selector-field";

const TagSelectorForm: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  return (
    <>
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h5" weight="strong">
          {t("addSessionModal.steps.advancedOptions.tags.title")}
        </Title>
        <Body weight="weaker" size="sm">
          {t("addSessionModal.steps.advancedOptions.tags.subTitle")}
        </Body>
      </div>
      <TagSelectorField
        label={t(
          "addSessionModal.steps.advancedOptions.tags.whiteListTagsLabel",
        )}
        id={`${fieldIdPrefix}-whitelist-tags`}
        name="whitelist_tags"
      />
      <TagSelectorField
        label={t(
          "addSessionModal.steps.advancedOptions.tags.blackListTagsLabel",
        )}
        id={`${fieldIdPrefix}-blacklist-tags`}
        name="blacklist_tags"
      />
    </>
  );
};

export default TagSelectorForm;
