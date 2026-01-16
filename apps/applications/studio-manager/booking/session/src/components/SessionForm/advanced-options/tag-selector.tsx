import { FC } from "react";

import {
  Autocomplete,
  ColorIndicator,
  MenuOption,
} from "@bsport/kaizen-primitive-core";

import { useGroupedTags } from "#src/hooks/tags/use-grouped-tags";
import { useTranslation } from "#src/utils/i18n";

import { Label } from "../label";

export const TagSelector: FC<{ id: string; label: string }> = ({
  id,
  label,
}) => {
  const { t } = useTranslation("sessionCreation");

  const groupedTags = useGroupedTags();

  const items: { title: string; options: MenuOption[] }[] = groupedTags.map(
    (group) => ({
      title: group.name,
      options: group.tags.map((tag) => ({
        label: tag.name,
        id: String(tag.id),
        rightSlot: <ColorIndicator color={tag.color} size="sm" type="block" />,
      })),
    }),
  );

  return (
    <div className="flex flex-col gap-xs">
      <Label text={label} isRequired={false} />
      <Autocomplete
        key={id}
        multiSelect
        popoverPlacement="bottom-right"
        items={items}
        textfieldProps={{
          placeholder: t("addSessionModal.steps.advancedOptions.tags.addTags"),
          iconRight: "chevron-down",
          id: `${id}-textfield`,
        }}
      />
    </div>
  );
};
