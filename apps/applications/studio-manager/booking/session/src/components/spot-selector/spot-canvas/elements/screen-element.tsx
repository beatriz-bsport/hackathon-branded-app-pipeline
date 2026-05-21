import React from "react";

import type { CanvasElement, CanvasScreenData } from "@bsport/api-book";

import { useTranslation } from "#src/utils/i18n";

import { translateRotate } from "../canvas-transformer";
import { DEFAULT_SCREEN_STROKE } from "../spot-styles";

export type ScreenElementProps = { element: CanvasElement<CanvasScreenData> };

// Legacy parity: saas-legacy `CanvasScreen` renders the screen as a thick
// rounded-cap polyline (the "chalkboard" look), not a filled rectangle. The
// hardcoded polyline runs `(15,20) → (115,20)` with `strokeWidth: 15`, so the
// useful width is 100 and the centred height is 15.
const SCREEN_DEFAULT_WIDTH = 100;
const SCREEN_DEFAULT_STROKE_WIDTH = 15;
// Distance from the polyline centre (drawn at y=0 in our local frame) to the
// "Screen" label, mirroring legacy's 30px gap between the polyline (y=20)
// and the label baseline (y=50) in its 130×65 bounding box.
const SCREEN_LABEL_OFFSET = 30;
const SCREEN_LABEL_FONT_SIZE = 18;

const ScreenElementComponent: React.FC<ScreenElementProps> = ({ element }) => {
  const { t } = useTranslation("sessionManagement");
  const { width, stroke, fill, strokeWidth, strokeLinecap } = element.data;
  const w = width ?? SCREEN_DEFAULT_WIDTH;
  const half = w / 2;
  return (
    <g transform={translateRotate(element.data)}>
      <polyline
        points={`${-half},0 ${half},0`}
        stroke={stroke ?? DEFAULT_SCREEN_STROKE}
        fill={fill ?? "transparent"}
        strokeWidth={strokeWidth ?? SCREEN_DEFAULT_STROKE_WIDTH}
        strokeLinecap={strokeLinecap ?? "round"}
      />
      {/* Legacy parity (saas-legacy CanvasScreen.component): a centred
          "Screen" label sits below the polyline so users can identify the
          element. Legacy resolves the label via `t('toolsMenu.screen')`. */}
      <text
        x={0}
        y={SCREEN_LABEL_OFFSET}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={SCREEN_LABEL_FONT_SIZE}
        fill="var(--kz-color-onsurface-default)"
        className="pointer-events-none select-none"
      >
        {t("spotSelector.screenLabel")}
      </text>
    </g>
  );
};

export const ScreenElement = React.memo(ScreenElementComponent);
