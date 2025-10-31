import mapValues from "lodash/mapValues";

import { FOCUS_CLASSES } from "#src/constants";

export const defaultClasses = [
  "transition ease-out duration-default",
  "cursor-pointer",
  "font-weak",
  // Flex config
  "flex flex-row items-center justify-center",
  "whitespace-nowrap",
  // Disabled
  "disabled:opacity-md",
  "disabled:shadow-none",
  "disabled:cursor-not-allowed",
  // Focus
  ...FOCUS_CLASSES,
];

export const variants = {
  intent: {
    "call-to-action": [
      // Text
      "fill-onsurface-default-onstrong",
      "text-onsurface-default-onstrong",
      // Disabled
      "disabled:opacity-md",
    ],
    default: [],
    flat: [
      // Background
      "bg-none",
    ],
  },
  colorByIntent: {
    "call-to-action-main": [
      // Text
      "fill-onsurface-default-onstrong",
      "text-onsurface-default-onstrong",
      // Background
      "bg-surface-action-main-strong-rest",
      "active:bg-surface-action-main-strong-pressed",
      "hover:bg-surface-action-main-strong-hovered",
      // Shadow
      "shadow-action-call-to-action-rest",
      "active:shadow-action-call-to-action-pressed",
      "hover:shadow-action-call-to-action-hovered",
    ],
    "call-to-action-critical": [
      // Background
      "bg-surface-action-critical-strong-rest",
      "active:bg-surface-action-critical-strong-pressed",
      "hover:bg-surface-action-critical-strong-hovered",
      // Shadow
      "shadow-action-call-to-action-critical-rest",
      "active:shadow-action-call-to-action-critical-pressed",
      "hover:shadow-action-call-to-action-critical-hovered",
    ],
    "default-main": [
      // Background
      "bg-surface-action-default-elevated-rest",
      "active:bg-surface-action-default-elevated-pressed",
      "hover:bg-surface-action-default-elevated-hovered",
      // Shadow
      "shadow-action-default-rest",
      "active:shadow-action-default-pressed",
      "hover:shadow-action-default-hovered",
      // Text
      "text-onsurface-action-main-rest",
      "fill-onsurface-action-main-rest",
    ],
    "default-selected": [
      // Background
      "bg-surface-action-default-elevated-selected",
      "active:bg-surface-action-default-elevated-selected",
      "hover:bg-surface-action-default-elevated-selected",
      // Border
      "border-stroke-action-default-selected",
      "border-stroke-thin",
      // Shadow
      "shadow-action-default-selected",
      // Text
      "text-onsurface-action-main-selected",
      "fill-onsurface-action-main-selected",
    ],
    "flat-default": [
      "text-onsurface-action-weak-default",
      "fill-onsurface-action-weak-default",
      // Background
      "bg-action-default-weak-rest",
      "active:bg-surface-action-default-weak-pressed",
      "hover:bg-surface-action-default-weak-hovered",
    ],
    "flat-main": [
      "text-onsurface-link-rest",
      "fill-onsurface-link-rest",
      // Background
      "bg-action-main-weak-rest",
      "active:bg-surface-action-main-weak-pressed",
      "hover:bg-surface-action-main-weak-hovered",
    ],
    "flat-critical": [
      "text-onsurface-action-weak-critical",
      "fill-onsurface-action-weak-critical",
      // Background
      "bg-action-critical-weak-rest",
      "active:bg-surface-action-critical-weak-pressed",
      "hover:bg-surface-action-critical-weak-hovered",
    ],
    "flat-onstrong": [
      // Text
      "text-onsurface-action-weak-onstrong",
      "fill-onsurface-action-weak-onstrong",
      // Background
      "bg-action-default-onstrong-rest",
      "active:bg-surface-action-default-onstrong-pressed",
      "hover:bg-surface-action-default-onstrong-hovered",
    ],
  },
  size: {
    sm: [
      // Container
      "rounded-sm",
      // Text
      "text-body-md",
      "leading-xs",
    ],
    md: [
      // Container
      "rounded-md",
      // Text
      "text-body-md",
      "leading-xs",
    ],
    lg: [
      // Container
      "rounded-lg",
      // Text
      "text-body-lg",
      "leading-md",
    ],
  },
  // Internal variant only
  iconVariant: {
    "icon-only-sm": ["p-2xs"],
    "icon-only-md": ["p-xs"],
    "icon-only-lg": ["p-sm"],
    "default-sm": ["p-2xs"],
    "default-md": ["p-xs"],
    "default-lg": ["p-xs"],
  },
  widthMode: {
    default: [],
    "full-width": ["w-full"],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const intents = mapValues(variants.intent, (_, key) => key) as {
  [key in keyof typeof variants.intent]: key;
};
export const colorsByIntent = {
  "call-to-action": ["main", "critical"],
  flat: ["default", "main", "critical", "onstrong"],
  default: ["main", "selected"],
} as const;
