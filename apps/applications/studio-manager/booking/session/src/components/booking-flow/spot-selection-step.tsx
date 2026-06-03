import { type FC, useEffect, useMemo, useRef, useState } from "react";

import { Alert, Body, Loader } from "@bsport/kaizen-primitive-core";

import { isSpotElement } from "#src/components/spot-selector/spot-canvas/canvas-transformer";
import { SpotCanvas } from "#src/components/spot-selector/spot-canvas/spot-canvas";
import { summarizeSpots } from "#src/components/spot-selector/spot-canvas/spot-summary";
import { SpotLegend } from "#src/components/spot-selector/spot-selector-modal/spot-legend";
import { SpotStatusLegend } from "#src/components/spot-selector/spot-selector-modal/spot-status-legend";
import { useSpotSelectorData } from "#src/components/spot-selector/spot-selector-modal/use-spot-selector-data";
import { useFetchMember } from "#src/hooks/member/fetch/use-fetch-member";
import { setSpot } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { MemberCard } from "./member-card";

type SpotSelectionStepProps = {
  sessionId: number;
};

export const SpotSelectionStep: FC<SpotSelectionStepProps> = ({
  sessionId,
}) => {
  const { t } = useTranslation("sessionManagement");

  const memberId = useBookingFlowStore((state) => state.memberId);
  const spotIndex = useBookingFlowStore((state) => state.spotIndex);

  const { data: member } = useFetchMember({ memberId: memberId! });

  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const data = useSpotSelectorData({ sessionId, fetch });

  const { freeCount, takenCount, usedSpotTypes } = summarizeSpots({
    roomBlueprint: data.roomBlueprint,
    takenSpots: data.takenSpots,
    spotTypes: data.spotTypes,
  });

  const selectedSpotElement = useMemo(() => {
    if (spotIndex === null || !data.roomBlueprint) return null;
    for (const element of data.roomBlueprint.canvas.elements ?? []) {
      if (isSpotElement(element) && element.data.index === spotIndex)
        return element;
    }
    return null;
  }, [spotIndex, data.roomBlueprint]);

  // Stable ref so the callback identity doesn't change on every refetch.
  const takenSpotsRef = useRef(data.takenSpots);
  takenSpotsRef.current = data.takenSpots;

  const handleSelectSpot = (index: number, _spotTypeId: number) => {
    if (takenSpotsRef.current.includes(index)) {
      setConflictMessage(t("spotSelector.takenSpotError"));
      return;
    }
    setSpot(index);
    setConflictMessage(null);
  };

  // If a refetch turns the selection into a taken spot, drop it.
  useEffect(() => {
    if (spotIndex !== null && data.takenSpots.includes(spotIndex)) {
      setSpot(null as unknown as number);
    }
  }, [data.takenSpots, spotIndex]);

  const showTypeLegend = usedSpotTypes.length > 1;

  const selectedLabel =
    spotIndex !== null
      ? t("bookingFlow.spotSelection.selectedSpot", { spot: spotIndex })
      : t("bookingFlow.spotSelection.selectedNone");

  if (data.isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Loader size="md" />
      </div>
    );
  }

  if (data.error) {
    return <Alert status="critical">{t("spotSelector.loadError")}</Alert>;
  }

  return (
    <div className="flex w-full flex-col gap-lg">
      {member && <MemberCard member={member} />}

      <div className="flex flex-col gap-2xs">
        <Body size="lg" weight="weak">
          {t("bookingFlow.spotSelection.title")}
        </Body>
        <Body size="sm" weight="weak" color="weak">
          {selectedLabel}
        </Body>
      </div>

      {data.roomBlueprint && (
        <div className="flex flex-col h-3/4 gap-xs">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-stroke-thin border-stroke-default bg-surface-default">
            <SpotCanvas
              roomBlueprint={data.roomBlueprint}
              assets={data.assets}
              spotTypes={data.spotTypes}
              takenSpots={data.takenSpots}
              selectedSpot={spotIndex}
              onSelectSpot={handleSelectSpot}
              coach={data.coach}
            />

            {conflictMessage && (
              <div className="pointer-events-none absolute inset-x-sm bottom-sm flex justify-center">
                <div className="pointer-events-auto w-full max-w-lg">
                  <Alert
                    status="warning"
                    layout="banner"
                    onClearClick={() => setConflictMessage(null)}
                  >
                    {conflictMessage}
                  </Alert>
                </div>
              </div>
            )}
          </div>

          {/* Status + type legends share one flex-wrap row so items don't
              orphan on narrow viewports (an isolated "Selected" chip on its
              own line looked broken). A thin vertical divider separates the
              two groups when both are present. `flex-shrink-0` so the
              canvas above gives way before the legend does. */}

          <div className="flex flex-shrink-0 flex-wrap items-center gap-md">
            <SpotStatusLegend
              spotTypes={usedSpotTypes}
              assets={data.assets}
              freeCount={freeCount}
              takenCount={takenCount}
              selectedSpotElement={selectedSpotElement}
            />
            {showTypeLegend && (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-px bg-[var(--kz-color-stroke-default)]"
                />
                <SpotLegend spotTypes={usedSpotTypes} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
