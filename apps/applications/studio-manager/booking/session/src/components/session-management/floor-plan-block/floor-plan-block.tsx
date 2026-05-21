import { useMemo } from "react";
import type React from "react";

import {
  Accordion,
  Alert,
  Card,
  Loader,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  SpotCanvas,
  SpotLegend,
  SpotStatusLegend,
  summarizeSpots,
  useCanvasData,
} from "#src/components/spot-selector";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export type FloorPlanBlockProps = {
  session: {
    id: number;
    room_blueprint: number | null;
    coach?: number | null;
    coach_override?: number | null;
  };
};

export const FloorPlanBlock: React.FC<FloorPlanBlockProps> = ({ session }) => {
  const { t } = useTranslation("sessionManagement");
  const blueprintId = session.room_blueprint;
  // Legacy parity (saas-legacy SpotPreview): the floor-plan view shows the
  // coach's avatar + name on the teacher position when a coach is assigned.
  const coachId = session.coach_override ?? session.coach ?? null;

  const {
    isLoading,
    error,
    roomBlueprint,
    assets,
    spotTypes,
    takenSpots,
    coach,
  } = useCanvasData({
    blueprintId,
    sessionId: session.id,
    fetch,
    coachId,
  });

  // Same summary the modal computes — keeps the read-only and interactive
  // views in lockstep about counts and which SpotTypes are in use.
  const { freeCount, takenCount, usedSpotTypes } = useMemo(
    () => summarizeSpots({ roomBlueprint, takenSpots, spotTypes }),
    [roomBlueprint, takenSpots, spotTypes],
  );
  const showTypeLegend = usedSpotTypes.length > 1;

  if (blueprintId === null) return null;

  return (
    <Card>
      <Accordion>
        <Accordion.Item
          ariaLabel={t("floorPlan.header")}
          header={
            <Title htmlVariant="h4" color="default" weight="strong">
              {t("floorPlan.header")}
            </Title>
          }
        >
          <div className="flex flex-col gap-xs pt-md">
            {isLoading ? (
              <Loader size="md" />
            ) : error ? (
              <Alert status="critical">{t("floorPlan.loadError")}</Alert>
            ) : roomBlueprint ? (
              <>
                <div className="h-[400px] overflow-hidden rounded-md border border-stroke-thin border-stroke-default bg-surface-default">
                  <SpotCanvas
                    roomBlueprint={roomBlueprint}
                    assets={assets}
                    spotTypes={spotTypes}
                    takenSpots={takenSpots}
                    coach={coach}
                  />
                </div>
                {/* Read-only legend. Current / Selected props are omitted —
                    managers viewing the session panel don't have a "their
                    spot" concept, so those chips never render. */}
                <div className="flex flex-wrap items-center gap-md">
                  <SpotStatusLegend
                    spotTypes={usedSpotTypes}
                    assets={assets}
                    freeCount={freeCount}
                    takenCount={takenCount}
                  />
                  {showTypeLegend ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-4 w-px bg-[var(--kz-color-stroke-default)]"
                      />
                      <SpotLegend spotTypes={usedSpotTypes} />
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};
