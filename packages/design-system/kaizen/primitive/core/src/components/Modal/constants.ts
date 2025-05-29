import { type IconName } from "#src/components/Icon";

export const confirmColors = ["main", "critical"] as const;
export const footerDirections = ["row", "column"] as const;

export type ConfirmColor = (typeof confirmColors)[number];
export type FooterDirection = (typeof footerDirections)[number];

export type StepConfig = {
  label: string;
  content: React.ReactNode;
  validate?: () => boolean;
  icon?: IconName;
};
