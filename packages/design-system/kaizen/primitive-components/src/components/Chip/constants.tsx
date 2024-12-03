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
] as const;

export const variants = {
  size: {
    sm: ["rounded-xs", "text-body-sm"],
    lg: ["rounded-sm", "text-body-md", "py-2xs"],
  },
  colorByType: {
    "weak:default": [
      "bg-surface-default-weaker",
      "text-onsurface-default",
      "shadow-border-thin-default",
    ],
    "weak:main": [
      "bg-surface-main-weak",
      "text-onsurface-main-onweak",
      "shadow-border-thin-main",
    ],
    "weak:info": [
      "bg-surface-status-info-weak",
      "text-onsurface-status-info-strong",
      "shadow-border-thin-info",
    ],
    "weak:positive": [
      "bg-surface-status-positive-weak",
      "text-onsurface-status-positive-strong",
      "shadow-border-thin-positive",
    ],
    "weak:warning": [
      "bg-surface-status-warning-weak",
      "text-onsurface-status-warning-strong",
      "shadow-border-thin-warning",
    ],
    "weak:critical": [
      "bg-surface-status-critical-weak",
      "text-onsurface-status-critical-strong",
      "shadow-border-thin-critical",
    ],
    "weak:onstrong": ["bg-surface-page", "text-onsurface-default-onstrong"],
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

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
