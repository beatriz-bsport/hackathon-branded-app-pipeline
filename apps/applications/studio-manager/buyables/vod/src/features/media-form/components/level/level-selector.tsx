import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchLevels } from "#src/hooks/api/level/use-fetch-levels";
import { useLevelName } from "#src/hooks/api/level/use-level-name";
import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../../types";
import { LevelItemRightSlot } from "./level-item-right-slot";

export type LevelSelectorProps = {
  fieldIdPrefix: string;
  onLevelSelect?: (levelId: number) => void;
  openCreateLevelModal: () => void;
  openEditLevelModal: (levelId: number) => void;
  openDeleteLevelModal: (levelId: number) => void;
};

const ColorIndicator: FC<{ color: string }> = ({ color }) => (
  <div
    className="w-element-sm h-element-sm rounded-sm"
    style={{ backgroundColor: color }}
  />
);

export const LevelSelector: FC<LevelSelectorProps> = ({
  fieldIdPrefix,
  onLevelSelect,
  openCreateLevelModal,
  openEditLevelModal,
  openDeleteLevelModal,
}) => {
  const { t } = useTranslation("media-form");
  const getLevelName = useLevelName();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { data: levels, isLoading } = useFetchLevels(companyId);

  const { watch } = useFormContext<MediaFormData>();
  const selectedLevelId = watch("level");

  const selectedLevel =
    selectedLevelId != null ? levels?.[selectedLevelId] : null;

  const levelsList = levels ? Object.values(levels) : [];

  const defaultLevelItems: Item[] = levelsList
    .filter((level) => !level.company)
    .map((level) => ({
      id: level.id.toString(),
      label: getLevelName({ levelId: level.id, levelName: level.name }),
    }));

  const customLevelItems: Item[] = levelsList
    .filter((level) => !!level.company)
    .map((level) => ({
      id: level.id.toString(),
      label: level.name,
      leftSlot: level.color ? (
        <ColorIndicator color={level.color} />
      ) : undefined,
      rightSlot: (
        <LevelItemRightSlot
          levelId={level.id}
          openEditLevelModal={openEditLevelModal}
          openDeleteLevelModal={openDeleteLevelModal}
        />
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const items: Item[] = [
    { type: "title", label: t("formFields.level.byDefault") },
    ...defaultLevelItems,
    { type: "divider" },
    { type: "title", label: t("formFields.level.custom") },
    ...customLevelItems,
  ];

  return (
    <Popover fullWidth>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <div className="flex flex-col gap-xs">
            <label className="text-body-md text-onsurface-primary">
              {t("formFields.level.label")}
            </label>
            <Button
              id={`${fieldIdPrefix}-level-selector`}
              label={
                selectedLevel
                  ? getLevelName({
                      levelId: selectedLevel.id,
                      levelName: selectedLevel.name,
                    })
                  : t("formFields.level.placeholder")
              }
              intent="default"
              color="main"
              size="md"
              iconRight="chevron-down"
              onClick={() => setIsPopoverOpened(true)}
              className="max-w-component-select justify-between"
            />
          </div>
        )}
      </Popover.Anchor>
      <Popover.Content
        placement="bottom-left"
        className="min-w-component-select overflow-hidden !p-0 !gap-0"
      >
        {({ setIsPopoverOpened }) =>
          isLoading ? null : (
            <div className="flex max-h-component-popover-max flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto p-xs">
                <Menu
                  items={items}
                  onSelectOption={(levelId) => {
                    onLevelSelect?.(Number(levelId));
                    setIsPopoverOpened(false);
                  }}
                />
              </div>
              <div className="shrink-0 p-sm bg-surface-default-weakest shadow-[0px_2px_8px_0px_var(--kz-color-shadow-weak)_inset]">
                <Menu
                  items={[
                    {
                      type: "button",
                      id: "create-level-button",
                      label: t("formFields.level.create"),
                      iconLeft: "plus",
                      onClick: openCreateLevelModal,
                    },
                  ]}
                />
              </div>
            </div>
          )
        }
      </Popover.Content>
    </Popover>
  );
};
