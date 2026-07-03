import { type FC, useId, useState } from "react";

import {
  Alert,
  Body,
  Button,
  Checkbox,
  Chip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type {
  ChecklistItemDefinition,
  ChecklistItemOwner,
} from "../data/phases";

const OWNER_CHIP_COLOR: Record<
  ChecklistItemOwner,
  "main" | "info" | "default"
> = {
  you: "main",
  bsport: "info",
  thirdParty: "default",
};

export interface ChecklistItemProps {
  item: ChecklistItemDefinition;
  completed: boolean;
  onToggle: () => void;
}

export const ChecklistItem: FC<ChecklistItemProps> = ({
  item,
  completed,
  onToggle,
}) => {
  const { t } = useTranslation("common");
  const checkboxId = useId();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const title = t(`items.${item.id}.title`);
  const note = t(`items.${item.id}.note`);
  const timeline = item.hasTimeline
    ? t(`items.${item.id}.timeline`)
    : undefined;

  return (
    <div
      id={`checklist-item-${item.id}`}
      className="flex gap-sm rounded-md border-stroke-thin border-stroke-default p-sm"
    >
      <Checkbox
        id={checkboxId}
        value={completed ? "checked" : "unchecked"}
        aria-label={title}
        onChange={onToggle}
      />
      <div className="flex flex-1 flex-col gap-2xs">
        <div className="flex flex-wrap items-center gap-xs">
          <Body size="md" weight="strong">
            {title}
          </Body>
          <Chip
            type="weak"
            size="sm"
            color={OWNER_CHIP_COLOR[item.owner]}
            label={t(`owners.${item.owner}`)}
          />
        </div>
        <Body size="sm" color="weak">
          {note}
        </Body>
        {item.warning && (
          <Alert status="warning" type="weak" layout="inline">
            {note}
          </Alert>
        )}
        {item.parallel && (
          <Alert status="info" type="weak" layout="inline">
            {t("parallelNote")}
          </Alert>
        )}
        {timeline && (
          <Alert status="default" type="weak" layout="inline">
            {`${t("timelineLabel")} ${timeline}`}
          </Alert>
        )}
        {item.hasVideo && (
          <div>
            <Button
              label={t("video.toggle", { label: t(`items.${item.id}.video`) })}
              intent="flat"
              color="main"
              size="sm"
              onClick={() => setIsVideoOpen((prev) => !prev)}
            />
            {isVideoOpen && (
              <Body size="sm" color="weak" className="p-sm">
                {t("video.comingSoon")}
              </Body>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
