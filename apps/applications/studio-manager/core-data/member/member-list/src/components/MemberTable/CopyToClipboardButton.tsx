import React from "react";

import { Button, Tooltip, toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type CopyToClipboardButtonProps = {
  data?: string;
  toastMessage: string;
};

/** @todo Create Kaizen component (core or business) for this */
export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  data,
  toastMessage,
}) => {
  const { t } = useTranslation("common");

  if (!data) return null;

  const copyToClipboard = (event: React.MouseEvent) => {
    event.preventDefault();
    navigator.clipboard.writeText(data).then(() => {
      toast({
        status: "default",
        icon: "copy-07",
        title: toastMessage,
        buttonIcon: "x-close",
      });
    }, console.error);
  };

  return (
    <Tooltip label={t("memberTable.tooltips.clickToCopy")} placement="bottom">
      <Button
        color="default"
        size="lg"
        intent="flat"
        onClick={copyToClipboard}
        label={data}
      />
    </Tooltip>
  );
};
