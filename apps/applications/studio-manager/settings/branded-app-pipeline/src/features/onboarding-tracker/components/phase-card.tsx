import type { FC } from "react";

import { Accordion, Body, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { PhaseDefinition } from "../data/phases";
import { ChecklistItem } from "./checklist-item";

export interface PhaseCardProps {
  phase: PhaseDefinition;
  isCurrent: boolean;
  isItemCompleted: (id: string) => boolean;
  onToggleItem: (id: string) => void;
}

export const PhaseCard: FC<PhaseCardProps> = ({
  phase,
  isCurrent,
  isItemCompleted,
  onToggleItem,
}) => {
  const { t } = useTranslation("common");
  const completedCount = phase.items.filter((item) =>
    isItemCompleted(item.id),
  ).length;

  return (
    <div className="rounded-md border-stroke-thin border-stroke-default bg-surface-default-elevated">
      <Accordion.Item
        ariaLabel={t(`phases.${phase.id}.title`)}
        initiallyOpen={isCurrent}
        header={
          <div className="flex flex-1 items-center gap-md p-md">
            <Title htmlVariant="h2" color="main">
              {phase.id}
            </Title>
            <div className="flex flex-1 flex-col gap-2xs">
              <Title htmlVariant="h5">{t(`phases.${phase.id}.title`)}</Title>
              <div className="flex items-center gap-xs">
                {phase.items.map((item) => (
                  <span
                    key={item.id}
                    className={
                      isItemCompleted(item.id)
                        ? "h-element-xs w-element-xs rounded-circle bg-surface-status-positive-strong"
                        : "h-element-xs w-element-xs rounded-circle bg-surface-default-strong"
                    }
                  />
                ))}
                <Body size="sm" color="weak">
                  {`${completedCount}/${phase.items.length} · ${t(`phases.${phase.id}.duration`)}`}
                </Body>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-sm p-md pt-0">
          {phase.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              completed={isItemCompleted(item.id)}
              onToggle={() => onToggleItem(item.id)}
            />
          ))}
        </div>
      </Accordion.Item>
    </div>
  );
};
