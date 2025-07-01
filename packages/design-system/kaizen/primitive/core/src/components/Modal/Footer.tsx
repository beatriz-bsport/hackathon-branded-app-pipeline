import cx from "classnames";
import React from "react";

import Button from "#src/components/Button";

import type {
  CancelButtonProps,
  ConfirmButtonProps,
} from "../ModalStepper/types";
import { type FooterDirection } from "./types";

export type FooterProps = {
  confirmButton?: ConfirmButtonProps;
  cancelButton?: CancelButtonProps;
  footerDirection: FooterDirection;
};

const Footer: React.FC<FooterProps> = ({
  confirmButton,
  cancelButton,
  footerDirection,
}) => {
  if (!cancelButton && !confirmButton) return null;

  const footerClassName = cx(
    "flex",
    "justify-end",
    "p-md",
    "gap-xs",
    "border-t-stroke-divider",
    "border-t-stroke-thin",
    "border-opacity-md",
    "bg-surface-default-weakest",
    "rounded-b-lg",
    "shadow-[0px_2px_8px_0px_var(--kz-color-shadow-weak)_inset]",
    {
      "flex-col-reverse": footerDirection === "column",
      "flex-row": footerDirection !== "column",
    },
  );

  return (
    <div className={footerClassName}>
      {cancelButton && (
        <Button {...cancelButton} size="md" intent="flat" color="default" />
      )}

      {confirmButton && (
        <Button
          {...confirmButton}
          size="md"
          intent="call-to-action"
          color={confirmButton.color ?? "main"}
        />
      )}
    </div>
  );
};

export default Footer;
