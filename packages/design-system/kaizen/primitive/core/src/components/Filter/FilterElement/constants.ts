import { cva } from "class-variance-authority";

export const filterElementClasses = cva([
  "relative",
  "h-action-md",
  "border-stroke-thin border-stroke-default",
  "[&:not(:first-child)]:border-l-[0]",
  "first:rounded-l-md last:rounded-r-md",
  "cursor-pointer",
  "box-content",
]);

export const filterElementBtnClasses = [
  "flex",
  "w-full",
  "h-full",
  "px-xs",
  "gap-xs",
  "justify-center",
  "items-center",
  "text-onsurface-action-main-rest text-body-md leading-xs",
  "bg-transparent",
  "cursor-pointer",
  "border-stroke-thin border-[transparent]",
];

// TODO: This has been fixed to 500px for now, but we should validate this with design.
export const FILTER_MENU_MAX_HEIGHT = 500;
