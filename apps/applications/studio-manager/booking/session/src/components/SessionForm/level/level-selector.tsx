import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Button, Item, Menu, Popover } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useLevelName } from "#src/hooks/level/useLevelName";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { Label } from "../label";
import { LevelItemRightSlot } from "./level-item-right-slot";

export type LevelSelectorProps = {
  fieldIdPrefix: string;
  onLevelSelect?: (levelId: number) => void;
  openCreateLevelModal: () => void;
  openEditLevelModal: (levelId: number) => void;
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
}) => {
  const { t } = useTranslation("sessionCreation");

  const getLevelName = useLevelName();

  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: levels, isLoading } = useFetchLevels(companyId);

  const { watch } = useFormContext<SessionCreationFormData>();

  const selectedLevelId = watch("level");

  const selectedLevel = levels?.[selectedLevelId];

  const levelsList = levels ? Object.values(levels) : [];

  const defaultLevelItems: Item[] = levelsList
    .filter((level) => !level.company)
    .map((level) => {
      return {
        id: level.id.toString(),
        label: getLevelName({ levelId: level.id, levelName: level.name }),
      };
    });

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
        />
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const items: Item[] = [
    {
      type: "title",
      label: t(
        "addSessionModal.steps.configureSession.settings.level.byDefault",
      ),
    },
    ...defaultLevelItems,
    { type: "divider" },
    {
      type: "title",
      label: t("addSessionModal.steps.configureSession.settings.level.custom"),
    },
    ...customLevelItems,
    { type: "divider" },
    {
      type: "button",
      onClick: openCreateLevelModal,
      label: t("addSessionModal.steps.configureSession.settings.level.add"),
      id: "create-level-button",
      iconLeft: "plus",
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <div className="flex flex-col gap-xs">
            <Label
              text={t(
                "addSessionModal.steps.configureSession.settings.level.label",
              )}
            />
            <Button
              id={`${fieldIdPrefix}-level-selector`}
              label={getLevelName({
                levelId: selectedLevel?.id,
                levelName: selectedLevel?.name,
              })}
              intent="default"
              color="main"
              size="md"
              iconRight="chevron-down"
              onClick={() => setIsPopoverOpened(true)}
              className="min-w-component-select justify-between"
            />
          </div>
        )}
      </Popover.Anchor>
      <Popover.Content
        placement="bottom-left"
        className="min-w-component-select"
      >
        {({ setIsPopoverOpened }) =>
          isLoading ? null : (
            <Menu
              items={items}
              onSelectOption={(levelId) => {
                onLevelSelect?.(Number(levelId));
                setIsPopoverOpened(false);
              }}
            />
          )
        }
      </Popover.Content>
    </Popover>
  );
};
