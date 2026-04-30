import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type React from "react";
import {
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import type {
  AssetForBlueprint,
  CanvasElement,
  RoomBlueprint,
  SpotType,
} from "@bsport/api-book";

import {
  applyTakenState,
  isDoorElement,
  isLineElement,
  isRectElement,
  isScreenElement,
  isSpotElement,
  isTeacherElement,
} from "./canvas-transformer";
import { DoorElement } from "./elements/door-element";
import { LineElement } from "./elements/line-element";
import { RectElement } from "./elements/rect-element";
import { ScreenElement } from "./elements/screen-element";
import { SpotElement } from "./elements/spot-element";
import { TeacherElement } from "./elements/teacher-element";
import { useContainerSize } from "./use-container-size";
import { computeViewBox } from "./view-box";
import { ZoomControls } from "./zoom-controls";

export type SpotCanvasProps = {
  roomBlueprint: RoomBlueprint;
  assets: AssetForBlueprint[];
  spotTypes: SpotType[];
  takenSpots: number[];
  selectedSpot?: number | null;
  /** Index of the spot the user currently holds (if any). Shown with a
   *  distinctive primary-tinted fill so users can spot "their" booking at
   *  a glance. */
  currentSpot?: number | null;
  onSelectSpot?: (index: number, spotTypeId: number) => void;
  coach?: { id: number; name: string };
  className?: string;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

const PANNING_CONFIG = { disabled: false } as const;
const DOUBLE_CLICK_CONFIG = { disabled: false, mode: "zoomIn" } as const;

// Legacy parity (saas-legacy CanvasViewController): paint decorative shapes
// (lines/rects) under interactive shapes (spots/teacher/screen/door) so spots
// can't be visually occluded by a rect authored later in the elements list.
const Z_ORDER: Record<string, number> = {
  line: 1,
  rect: 1,
  spot: 99,
  teacher: 99,
  screen: 99,
  door: 99,
};

export const SpotCanvas: React.FC<SpotCanvasProps> = ({
  roomBlueprint,
  assets,
  spotTypes,
  takenSpots,
  selectedSpot,
  currentSpot,
  onSelectSpot,
  coach,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const didCenterRef = useRef(false);
  const size = useContainerSize(containerRef);

  const elements = useMemo(
    () => applyTakenState({ roomBlueprint, takenSpots }),
    [roomBlueprint, takenSpots],
  );

  const orderedElements = useMemo(() => {
    return [...elements].sort(
      (a, b) => (Z_ORDER[a.type] ?? 1) - (Z_ORDER[b.type] ?? 1),
    );
  }, [elements]);

  const spotTypeById = useMemo(
    () => new Map(spotTypes.map((st) => [st.id, st])),
    [spotTypes],
  );

  const assetByIdentifier = useMemo(
    () => new Map(assets.map((a) => [a.identifier, a.asset])),
    [assets],
  );

  const coachHeight = roomBlueprint.canvas.coachHeight ?? 1;
  const viewBox = useMemo(
    () => computeViewBox(elements, coachHeight),
    [elements, coachHeight],
  );

  useEffect(() => {
    // Centre once on the initial layout. Subsequent container resizes
    // (sidebar toggles, window resize) must not throw away the user's pan/zoom.
    if (didCenterRef.current) return;
    if (size.width === 0 || size.height === 0) return;
    transformRef.current?.resetTransform();
    didCenterRef.current = true;
  }, [size.width, size.height]);

  const renderElement = useCallback(
    (el: CanvasElement<unknown>): React.ReactNode => {
      if (isSpotElement(el)) {
        const spotType = spotTypeById.get(el.data.spotTypeId);
        const isSelected =
          selectedSpot != null && selectedSpot === el.data.index;
        // Legacy parity: taken OR selected personalized spots resolve the
        // "spot_taken" overlay asset (see applyTakenState for the taken case;
        // selection is per-render here so the spot list stays memo-stable).
        // Free spots fall back to "spot_free" — but only after the
        // taken/selected branch has had a chance, so an unavailable spot never
        // accidentally renders the free image.
        const effectiveIdentifier =
          (el.data.taken || isSelected
            ? "spot_taken"
            : el.data.asset_identifier) ?? "spot_free";
        const assetUrl = effectiveIdentifier
          ? assetByIdentifier.get(effectiveIdentifier)
          : undefined;
        return (
          <SpotElement
            key={el.id}
            element={el}
            spotType={spotType}
            assetUrl={assetUrl}
            selected={isSelected}
            isCurrent={currentSpot != null && currentSpot === el.data.index}
            onClick={onSelectSpot}
          />
        );
      }
      if (isTeacherElement(el)) {
        return (
          <TeacherElement
            key={el.id}
            element={el}
            coachHeight={roomBlueprint.canvas.coachHeight ?? 1}
            coach={coach}
          />
        );
      }
      if (isScreenElement(el))
        return <ScreenElement key={el.id} element={el} />;
      if (isDoorElement(el)) return <DoorElement key={el.id} element={el} />;
      if (isLineElement(el)) return <LineElement key={el.id} element={el} />;
      if (isRectElement(el)) return <RectElement key={el.id} element={el} />;
      return null;
    },
    [
      spotTypeById,
      assetByIdentifier,
      onSelectSpot,
      selectedSpot,
      currentSpot,
      roomBlueprint.canvas.coachHeight,
      coach,
    ],
  );

  const handleZoomIn = () => transformRef.current?.zoomIn();
  const handleZoomOut = () => transformRef.current?.zoomOut();
  const handleReset = () => transformRef.current?.resetTransform();

  return (
    <div
      ref={containerRef}
      className={clsx("relative h-full w-full overflow-hidden", className)}
    >
      <TransformWrapper
        ref={transformRef}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        initialScale={1}
        centerOnInit
        panning={PANNING_CONFIG}
        doubleClick={DOUBLE_CLICK_CONFIG}
      >
        <TransformComponent
          wrapperClass="!h-full !w-full"
          contentClass="!h-full !w-full"
        >
          <svg
            viewBox={viewBox}
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {orderedElements.map(renderElement)}
          </svg>
        </TransformComponent>
      </TransformWrapper>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
};
