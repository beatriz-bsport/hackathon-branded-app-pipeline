import React, { useId } from "react";

import type { CanvasElement, CanvasTeacherData } from "@bsport/api-book";

import { useTranslation } from "#src/utils/i18n";

import { translateRotate } from "../canvas-transformer";
import { DEFAULT_TEACHER_NAME_FILL } from "../spot-styles";
import {
  COACH_AVATAR_BASE_SIZE,
  type TeacherCoach,
} from "./teacher-dimensions";

export type { TeacherCoach };

export type TeacherElementProps = {
  element: CanvasElement<CanvasTeacherData>;
  /** Multiplier applied to {@link COACH_AVATAR_BASE_SIZE} (and any per-element
   *  `data.height` override) to size the rendered avatar. Mirrors legacy
   *  `CanvasTeacherComponent` semantics where `coachHeight` is a scale, not a
   *  pixel size. */
  coachHeight: number;
  coach?: TeacherCoach;
};
const MARGIN_BETWEEN_AVATAR_AND_TEXT = 15;
const DEFAULT_NAME_FONT_SIZE = 14;

// Inline SVG fallback when the coach has no photo. Renders a neutral
// silhouette over a soft grey background — visually equivalent to the legacy
// default_profile_picture.svg without depending on environment-specific URLs.
const FALLBACK_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#E5E7EB"/><circle cx="40" cy="32" r="14" fill="#9CA3AF"/><path d="M14 70c0-14.359 11.641-26 26-26s26 11.641 26 26" fill="#9CA3AF"/></svg>`;
const FALLBACK_AVATAR_URL = `data:image/svg+xml;base64,${btoa(FALLBACK_AVATAR_SVG)}`;

const TeacherElementComponent: React.FC<TeacherElementProps> = ({
  element,
  coachHeight,
  coach,
}) => {
  const { t } = useTranslation("sessionManagement");
  const {
    x,
    y,
    rotation,
    height,
    fontSize,
    fontStyle,
    fontColor,
    fontWeight,
    textOffsetX,
    textOffsetY,
    textStroke,
    textStrokeWidth,
  } = element.data;

  // Legacy parity: `(height ?? 80) * coachHeight`. coachHeight is a scale
  // factor (production blueprints typically ship `coachHeight: 1`), not a
  // pixel size.
  const avatarSize = (height ?? COACH_AVATAR_BASE_SIZE) * coachHeight;
  // Legacy parity (saas-legacy CanvasTeacher.component): the inner <svg> is
  // offset by `-avatarSize/4` in both axes, placing the avatar's centre at
  // `(x + avatarSize/4, y + avatarSize/4)`. We collapse that into the outer
  // translation so the circle stays centred on the local origin.
  const quarter = avatarSize / 4;
  const half = avatarSize / 2;

  const photoHref = coach?.photo || FALLBACK_AVATAR_URL;
  // `useId()` instead of `element.id`: two SpotCanvas instances rendering
  // the same blueprint in the same document would otherwise share a
  // pattern ID, causing `url(#...)` to resolve to whichever pattern the
  // browser indexed first — visible as a "no photo" teacher inheriting
  // its sibling's coach picture in side-by-side stories.
  const patternId = `teacher-photo-${useId()}`;

  // Marketplace coach-display modes (FIRST_NAME / FULL_NAME) live in
  // common-legacy; in the backoffice spot selector we always have the full
  // coach record, so name resolution is straightforward.
  const coachName = coach?.name ?? coach?.firstname ?? null;
  const ariaLabel = coachName
    ? t("spotSelector.coachAriaLabel", { name: coachName })
    : t("spotSelector.coachPositionAriaLabel");

  return (
    <g
      transform={translateRotate({ x: x + quarter, y: y + quarter, rotation })}
      aria-label={ariaLabel}
      role="img"
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={avatarSize}
          height={avatarSize}
          x={-half}
          y={-half}
        >
          <image
            href={photoHref}
            width={avatarSize}
            height={avatarSize}
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>
      <circle r={half} fill={`url(#${patternId})`} />
      {coachName ? (
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          x={textOffsetX ?? 0}
          y={(textOffsetY ?? 0) + half + MARGIN_BETWEEN_AVATAR_AND_TEXT}
          fontSize={fontSize ?? DEFAULT_NAME_FONT_SIZE}
          fontStyle={fontStyle}
          fontWeight={fontWeight ?? 600}
          fill={fontColor ?? DEFAULT_TEACHER_NAME_FILL}
          stroke={textStroke}
          strokeWidth={textStrokeWidth}
          style={{
            // paint-order draws the stroke halo behind the fill so labels
            // stay legible on any background. Mirrors the spot-element rule.
            paintOrder: "stroke fill",
          }}
          className="pointer-events-none select-none"
        >
          {coachName}
        </text>
      ) : null}
    </g>
  );
};

export const TeacherElement = React.memo(TeacherElementComponent);
