import type { ButtonProps } from "#src/components/Button";
import { type IconName } from "#src/components/Icon";

import { confirmColors, footerDirections } from "./constants";

export type ConfirmColor = (typeof confirmColors)[number];
export type FooterDirection = (typeof footerDirections)[number];

type DefaultPropsWithConstraints = Omit<
  ButtonProps,
  "size" | "intent" | "color"
>;

export type ConfirmButtonProps = DefaultPropsWithConstraints & {
  color?: ConfirmColor;
};

export type CancelButtonProps = DefaultPropsWithConstraints;

export type StepConfig = {
  label: string;
  content: React.ReactNode;
  validate?: () => boolean;
  icon?: IconName;
};
