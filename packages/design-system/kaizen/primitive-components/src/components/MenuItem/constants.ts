export const menuItemTypes = {
  title: "title",
  button: "button",
  radio: "radio",
  checkBox: "checkBox",
  divider: "divider",
} as const;

export const baseMenuItemClasses = [
  "group",
  "h-xl min-h-xl",
  "rounded-sm",
  "p-2xs",
  "gap-xs",
  "cursor-pointer w-full",
  "transition ease-out duration-long",
  // Flex config
  "flex flex-row items-center justify-start",
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
  "focus-visible:bg-surface-default-strong/xl outline-none",
  // Hover
  "hover:bg-surface-default-strong/xl",
  // Active
  "active:bg-surface-default-strong/lg",
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
      "h-xl min-h-xl",
      "rounded-sm",
      "p-2xs",
      "gap-xs",
      "cursor-pointer w-full",
      "transition ease-out duration-long",
      "flex flex-row items-center justify-start",
      "border-stroke-thin",
      "border-stroke-action-default-selected/2xs",
      "bg-surface-action-selected-rest/lg",
      "hover:bg-surface-action-selected-rest/md",
      "focus-visible:bg-surface-action-selected-rest/md",
      "active:bg-surface-action-selected-rest/sm",
    ],
    false: [
      "border-stroke-thin",
      "border-stroke-action-default-selected/transparent",
      ...menuItemStateClasses,
    ],
  },
} as const;
