import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

import type { Fetch } from "@bsport/fetch";
import { Alert, Body, Loader, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SpotCanvas } from "../spot-canvas";
import { isSpotElement } from "../spot-canvas/canvas-transformer";
import { composeLabel } from "../spot-canvas/spot-label";
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
};

export const SpotSelectorModal: React.FC<SpotSelectorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sessionId,
  fetch,
  currentSpot,
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

  const counts = useMemo(() => {
    if (!data.roomBlueprint) return { free: 0, taken: 0, total: 0 };
    const takenSet = new Set(data.takenSpots);
    let total = 0;
    let taken = 0;
    for (const el of data.roomBlueprint.canvas.elements ?? []) {
      if (!isSpotElement(el)) continue;
      total += 1;
      if (takenSet.has(el.data.index)) taken += 1;
    }
    return { free: total - taken, taken, total };
  }, [data.roomBlueprint, data.takenSpots]);

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

  const showTypeLegend = data.spotTypes.length > 1;

  let subtitle: string | null = null;
  if (data.roomBlueprint && counts.total > 0) {
    subtitle =
      counts.free === 0
        ? t("spotSelector.allTaken")
        : t("spotSelector.availabilityCount", {
            free: counts.free,
            total: counts.total,
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
        disabled: selection === null,
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
        <div className="flex flex-col gap-xs">
          {subtitle ? (
            <Body size="sm" weight="weak" color="weak">
              {subtitle}
            </Body>
          ) : null}

          <div className="relative h-[min(55dvh,360px)] overflow-hidden rounded-md border border-stroke-thin border-stroke-default bg-surface-default sm:h-[520px] md:h-[600px]">
            <SpotCanvas
              roomBlueprint={data.roomBlueprint}
              assets={data.assets}
              spotTypes={data.spotTypes}
              takenSpots={data.takenSpots}
              selectedSpot={selection?.index ?? null}
              currentSpot={currentSpot}
              onSelectSpot={handleSelectSpot}
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

          <SpotStatusLegend
            freeCount={counts.free}
            takenCount={counts.taken}
            isSelectionActive={selection !== null}
            hasCurrent={currentSpot != null}
          />

          {showTypeLegend ? <SpotLegend spotTypes={data.spotTypes} /> : null}
        </div>
      ) : null}
    </Modal>
  );
};
