import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

import type { Fetch } from "@bsport/fetch";
import { Alert, Body, Loader, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SpotCanvas } from "../spot-canvas";
import { isSpotElement } from "../spot-canvas/canvas-transformer";
import { composeLabel } from "../spot-canvas/spot-label";
import { summarizeSpots } from "../spot-canvas/spot-summary";
import { SpotLegend } from "./spot-legend";
import { SpotStatusLegend } from "./spot-status-legend";
import { useSpotSelectorData } from "./use-spot-selector-data";

export type SpotSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (spotIndex: number) => void;
  sessionId: number | null;
  fetch: Fetch;
  /** Index of the spot the participant currently holds, if any. Rendered
   *  with a primary-tinted "Current spot" fill so the manager can spot it
   *  immediately on the floor plan. */
  currentSpot?: number | null;
  /** True while the parent's set-spot mutation is in flight. Disables the
   *  confirm button so rapid clicks can't queue duplicate POSTs. */
  isConfirming?: boolean;
};

export const SpotSelectorModal: React.FC<SpotSelectorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sessionId,
  fetch,
  currentSpot,
  isConfirming = false,
}) => {
  const { t } = useTranslation("sessionManagement");

  const [selection, setSelection] = useState<{
    index: number;
    spotTypeId: number;
  } | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const data = useSpotSelectorData({ sessionId, fetch, enabled: isOpen });

  useEffect(() => {
    if (!isOpen) {
      setSelection(null);
      setConflictMessage(null);
    }
  }, [isOpen]);

  const selectedSpotType =
    selection !== null
      ? data.spotTypes.find((s) => s.id === selection.spotTypeId)
      : undefined;

  let selectedIndexType: string | number | null | undefined;
  if (selection !== null && data.roomBlueprint) {
    for (const el of data.roomBlueprint.canvas.elements ?? []) {
      if (isSpotElement(el) && el.data.index === selection.index) {
        selectedIndexType = el.data.indexType;
        break;
      }
    }
  }

  const selectedSpotLabel =
    selection !== null
      ? composeLabel(
          selectedSpotType?.prefix,
          selectedIndexType,
          selection.index,
          selectedSpotType?.suffix,
        )
      : "";

  const submitLabel =
    selection === null
      ? t("spotSelector.bookPlaceholder")
      : t("spotSelector.book", { label: selectedSpotLabel });

  // Counts (free/taken/total) + used SpotTypes computed in a single pass over
  // the blueprint's spot elements. Shared with `FloorPlanBlock` so the
  // interactive modal and the read-only session-panel preview agree on what
  // "in use" means.
  const summary = useMemo(
    () =>
      summarizeSpots({
        roomBlueprint: data.roomBlueprint,
        takenSpots: data.takenSpots,
        spotTypes: data.spotTypes,
      }),
    [data.roomBlueprint, data.takenSpots, data.spotTypes],
  );
  const { freeCount, takenCount, totalCount, usedSpotTypes } = summary;

  // Look up the actual element data for the current/selected indices so the
  // legend can render real swatches (matching SpotType / image / state) for
  // those chips, rather than a representative SpotType[0] that may not match
  // what the user actually picked.
  const currentSpotElement = useMemo(() => {
    if (currentSpot == null || !data.roomBlueprint) return null;
    for (const el of data.roomBlueprint.canvas.elements ?? []) {
      if (isSpotElement(el) && el.data.index === currentSpot) return el;
    }
    return null;
  }, [currentSpot, data.roomBlueprint]);

  const selectedSpotElement = useMemo(() => {
    if (selection === null || !data.roomBlueprint) return null;
    for (const el of data.roomBlueprint.canvas.elements ?? []) {
      if (isSpotElement(el) && el.data.index === selection.index) return el;
    }
    return null;
  }, [selection, data.roomBlueprint]);

  // Legacy parity (saas-legacy SpotSelectorDialog): clicking a taken spot
  // surfaces an inline "spot is taken" alert rather than silently no-op-ing.
  // The takenSpots ref is read inside the callback so the callback identity
  // can stay stable; reading data.takenSpots directly would re-create the
  // callback on every refetch and defeat <SpotElement>'s React.memo.
  const takenSpotsRef = useRef(data.takenSpots);
  takenSpotsRef.current = data.takenSpots;

  const handleSelectSpot = useCallback(
    (index: number, spotTypeId: number) => {
      if (takenSpotsRef.current.includes(index)) {
        setConflictMessage(t("spotSelector.takenSpotError"));
        return;
      }
      setSelection({ index, spotTypeId });
      setConflictMessage(null);
    },
    [t],
  );

  const handleSubmit = useCallback(() => {
    if (selection === null) return;
    // Guard the race between a refetch flipping the selection to taken and the
    // cleanup effect below clearing it: a click landing inside that frame
    // would otherwise book a stale index.
    if (data.takenSpots.includes(selection.index)) {
      setSelection(null);
      setConflictMessage(t("spotSelector.takenSpotError"));
      return;
    }
    onConfirm(selection.index);
  }, [selection, data.takenSpots, onConfirm, t]);

  // If a session_status refetch turns the user's selection into a taken spot
  // (another manager booked it in the meantime), drop the selection. The
  // spot's visual flip to the taken style is the implicit signal; submit
  // becomes disabled again because selection === null.
  useEffect(() => {
    if (selection !== null && data.takenSpots.includes(selection.index)) {
      setSelection(null);
    }
  }, [data.takenSpots, selection]);

  const showTypeLegend = usedSpotTypes.length > 1;

  let subtitle: string | null = null;
  if (data.roomBlueprint && totalCount > 0) {
    subtitle =
      freeCount === 0
        ? t("spotSelector.allTaken")
        : t("spotSelector.availabilityCount", {
            free: freeCount,
            total: totalCount,
          });
  }

  return (
    <Modal
      open={isOpen}
      size="xl"
      title={t("spotSelector.title")}
      onCloseButtonClick={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "main",
        label: submitLabel,
        disabled: selection === null || isConfirming,
        onClick: handleSubmit,
      }}
      cancelButton={{
        label: t("spotSelector.cancel"),
        onClick: onClose,
      }}
    >
      {data.isLoading ? (
        <div className="flex h-[480px] items-center justify-center">
          <Loader size="md" />
        </div>
      ) : data.error ? (
        <Alert status="critical">{t("spotSelector.loadError")}</Alert>
      ) : !data.hasBlueprint ? (
        <Alert status="info">{t("spotSelector.noBlueprint")}</Alert>
      ) : data.roomBlueprint ? (
        // The column targets 80dvh (capped at 720px) so the canvas has a
        // useful working size, but `max-h-[calc(90dvh-10rem)]` clamps it
        // to the modal body's available space on short viewports / high
        // zoom. (10rem ≈ Dialog header + footer + body padding; Dialog
        // itself is `max-h-[90%]` of the viewport.) `max-h-full` would
        // be cleaner, but percentage max-heights don't resolve through
        // the body's flex-grow-derived height — so a dvh-based cap is
        // required. The canvas wrapper uses `flex-1 min-h-0` to shrink
        // first; the legend below is `flex-shrink-0`.
        <div className="flex h-[min(80dvh,720px)] max-h-[calc(90dvh-10rem)] flex-col gap-xs">
          {subtitle ? (
            <Body size="sm" weight="weak" color="weak">
              {subtitle}
            </Body>
          ) : null}

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-stroke-thin border-stroke-default bg-surface-default">
            <SpotCanvas
              roomBlueprint={data.roomBlueprint}
              assets={data.assets}
              spotTypes={data.spotTypes}
              takenSpots={data.takenSpots}
              selectedSpot={selection?.index ?? null}
              currentSpot={currentSpot}
              onSelectSpot={handleSelectSpot}
              coach={data.coach}
            />

            {conflictMessage ? (
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
            ) : null}
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
              currentSpotElement={currentSpotElement}
              selectedSpotElement={selectedSpotElement}
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
        </div>
      ) : null}
    </Modal>
  );
};
