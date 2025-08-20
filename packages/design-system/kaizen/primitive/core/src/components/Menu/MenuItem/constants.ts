export const menuItemTypes = {
  title: "title",
  button: "button",
  radio: "radio",
  checkbox: "checkbox",
  divider: "divider",
  text: "text",
} as const;

export const baseMenuItemClasses = [
  "group",
  "min-h-xl",
  "rounded-sm",
  "p-2xs",
  "gap-xs",
  "cursor-pointer w-full",
  "transition ease-out duration-long",
  "text-onsurface-action-weak-default",
  // Flex config
  "flex flex-row items-center",
  // Disabled
  "disabled:bg-none",
  "disabled:text-onsurface-disabled",
  "disabled:fill-onsurface-disabled",
  "disabled:opacity-sm",
  "disabled:shadow-none",
  "disabled:pointer-events-none",
] as const;

export const menuItemStateClasses = [
  // Focus
  "focus-visible:bg-surface-action-default-weak-hovered outline-none",
  // Hover
  "hover:bg-surface-action-default-weak-hovered",
  // Active
  "active:bg-surface-action-default-weak-pressed",
];

export const defaultMenuItemClasses = [
  ...baseMenuItemClasses,
  ...menuItemStateClasses,
] as const;

export const menuItemVariants = {
  disabled: {
    true: [
      // For button
      "disabled:bg-none",
      "disabled:text-onsurface-disabled",
      "disabled:fill-onsurface-disabled",
      "disabled:opacity-sm",
      "disabled:shadow-none",
      "disabled:pointer-events-none",
      // For other menu items components
      "bg-none",
      "text-onsurface-disabled",
      "fill-onsurface-disabled",
      "opacity-sm",
      "shadow-none",
      "pointer-events-none",
    ],
    false: [],
  },
  checked: {
    true: [
      "group",
      "min-h-xl",
      "rounded-sm",
      "p-2xs",
      "gap-xs",
      "cursor-pointer w-full",
      "transition ease-out duration-long",
      "flex flex-row items-center justify-start",
      "border-stroke-thin",
      "border-stroke-action-main-selected",
      "bg-surface-action-main-selected-rest",
      "hover:bg-surface-action-main-selected-hovered",
      "focus-visible:bg-surface-action-main-selected-hovered",
      "active:bg-surface-action-main-selected-pressed",
    ],
    false: [
      "border-stroke-thin",
      "border-[white]/transparent",
      ...menuItemStateClasses,
    ],
  },
} as const;
