import mapValues from "lodash/mapValues";
import { FOCUS_CLASSES } from "../../constants";

const nonFlatDisabledStyle = [
  "disabled:text-onsurface-default",
  "disabled:fill-onsurface-default",
  "disabled:opacity-md",
  "disabled:shadow-action-default-rest",
] as const;

export const defaultClasses = [
  "border-0",
  "gap-0",
  "transition ease-in duration-200",
  "cursor-pointer",
  "font-weak",
  // Flex config
  "flex flex-row items-center justify-center",
  // Disabled
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
      "disabled:bg-surface-action-main-strong-disabled",
      ...nonFlatDisabledStyle,
    ],
    default: ["disabled:bg-surface-action-disabled", ...nonFlatDisabledStyle],
    flat: [
      // Background
      "bg-none",
      // Disabled
      "disabled:bg-none",
      "disabled:text-onsurface-action-main-disabled",
      "disabled:fill-onsurface-action-main-disabled",
      "disabled:opacity-md",
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
      // Border
      "border-0",
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
      "text-onsurface-default",
      "fill-onsurface-default",
      // Background
      "active:bg-surface-action-default-flat-pressed/md",
      "hover:bg-surface-action-default-flat-hovered/lg",
    ],
    "flat-main": [
      "text-onsurface-link-rest",
      "fill-onsurface-link-rest",
      // Background
      "active:bg-surface-action-main-weak-pressed/md",
      "hover:bg-surface-action-main-weak-hovered/lg",
    ],
    "flat-critical": [
      "text-onsurface-action-critical",
      "fill-onsurface-action-critical",
      // Background
      "active:bg-surface-action-critical-weak-pressed/md",
      "hover:bg-surface-action-critical-weak-hovered/lg",
    ],
    "flat-onstrong": [
      // Text
      "text-onsurface-default-onstrong",
      "fill-onsurface-default-onstrong",
      // Background
      "active:bg-surface-action-default-onstrong-pressed/md",
      "hover:bg-surface-action-default-onstrong-hovered/lg",
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

/**
 * Sizes available for the button
 */
export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
/**
 * Intents available for the button
 */
export const intents = mapValues(variants.intent, (_, key) => key) as {
  [key in keyof typeof variants.intent]: key;
};
/**
 * Colors available by the intent of the button
 */
export const colorsByIntent = {
  "call-to-action": ["main", "critical"],
  flat: ["default", "main", "critical", "onstrong"],
  default: ["main", "selected"],
} as const;
