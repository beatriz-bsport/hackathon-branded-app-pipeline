import mapValues from "lodash/mapValues";

export const colors = [
  "default",
  "main",
  "info",
  "positive",
  "warning",
  "critical",
  "onstrong",
] as const;

export const defaultClasses = [
  "inline-flex items-center justify-center",
  "gap-2xs",
  "px-xs",
  "leading-xs",
  "box-border"
] as const;

export const variants = {
  size: {
    sm: ["rounded-xs", "text-body-sm"],
    lg: ["rounded-sm", "text-body-md", "py-2xs"],
  },
  type: {
    weak: "border-stroke-thin",
    strong: "border-none",
  },
  colorByType: {
    "weak:default": [
      "bg-surface-default-weaker",
      "text-onsurface-default",
      "border-stroke-strong",
    ],
    "weak:main": [
      "bg-surface-main-weak",
      "text-onsurface-action-main-rest",
      "border-stroke-main",
    ],
    "weak:info": [
      "bg-surface-status-info-weak",
      "text-onsurface-status-info-strong",
      "border-stroke-status-info",
    ],
    "weak:positive": [
      "bg-surface-status-positive-weak",
      "text-onsurface-status-positive-strong",
      "border-stroke-status-positive",
    ],
    "weak:warning": [
      "bg-surface-status-warning-weak",
      "text-onsurface-status-warning-strong",
      "border-stroke-status-warning",
    ],
    "weak:critical": [
      "bg-surface-status-critical-weak",
      "text-onsurface-status-critical-strong",
      "border-stroke-status-critical",
    ],
    "weak:onstrong": [
      "bg-surface-default-weakest",
      "text-onsurface-default",
      "border-stroke-default",
    ],
    "strong:default": [
      "bg-surface-default-strong",
      "text-onsurface-default-onstrong",
    ],
    "strong:main": [
      "bg-surface-main-strong",
      "text-onsurface-default-onstrong",
    ],
    "strong:info": [
      "bg-surface-status-info-strong",
      "text-onsurface-default-onstrong",
    ],
    "strong:positive": [
      "bg-surface-status-positive-strong",
      "text-onsurface-default-onstrong",
    ],
    "strong:warning": [
      "bg-surface-status-warning-strong",
      "text-onsurface-default-onstrong",
    ],
    "strong:critical": [
      "bg-surface-status-critical-strong",
      "text-onsurface-default-onstrong",
    ],
    "strong:onstrong": ["bg-surface-default", "text-onsurface-default"],
  },
} as const;

/**
 * Types available for the chip
 */
export const types = mapValues(variants.type, (_, key) => key) as {
  [key in keyof typeof variants.type]: key;
};

/**
 * Sizes available for the chip
 */
export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
