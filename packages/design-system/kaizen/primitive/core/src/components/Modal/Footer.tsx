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

  return (
    <div
      className={`flex justify-end p-md gap-xs border-t-stroke-divider border-t-stroke-thin border-opacity-md ${
        footerDirection === "column" ? "flex-col-reverse" : "flex-row"
      }`}
    >
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
