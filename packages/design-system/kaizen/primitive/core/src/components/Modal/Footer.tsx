import React from "react";

import Button from "#src/components/Button";

import { type ConfirmColor, type FooterDirection } from "./types";

export type FooterProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  confirmColor?: ConfirmColor;
  onConfirmClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  footerDirection: FooterDirection;
};

const Footer: React.FC<FooterProps> = ({
  cancelLabel,
  confirmLabel,
  confirmColor,
  onConfirmClick,
  onCancelClick,
  footerDirection,
}) => {
  if (!cancelLabel && !confirmLabel) return null;

  return (
    <div
      className={`flex justify-end p-md gap-xs border-t-stroke-divider border-t-stroke-thin border-opacity-md ${
        footerDirection === "column" ? "flex-col-reverse" : "flex-row"
      }`}
    >
      {cancelLabel && (
        <Button
          size="md"
          intent="flat"
          color="default"
          label={cancelLabel}
          onClick={onCancelClick}
        />
      )}

      {confirmLabel && (
        <Button
          size="md"
          intent="call-to-action"
          color={confirmColor ?? "main"}
          label={confirmLabel}
          onClick={onConfirmClick}
        />
      )}
    </div>
  );
};

export default Footer;
