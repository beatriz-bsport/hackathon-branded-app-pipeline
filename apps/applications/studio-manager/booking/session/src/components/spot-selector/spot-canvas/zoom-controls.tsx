import type React from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  const { t } = useTranslation("sessionManagement");

  return (
    <div className="absolute top-sm right-sm z-10 flex flex-col gap-xs rounded-md bg-surface-default p-2xs shadow-md">
      <Button
        kind="icon-button"
        icon="plus"
        size="md"
        intent="flat"
        color="default"
        label={t("spotSelector.zoomIn")}
        onClick={onZoomIn}
      />
      <Button
        kind="icon-button"
        icon="minus"
        size="md"
        intent="flat"
        color="default"
        label={t("spotSelector.zoomOut")}
        onClick={onZoomOut}
      />
      <Button
        kind="icon-button"
        icon="maximize-02"
        size="md"
        intent="flat"
        color="default"
        label={t("spotSelector.resetView")}
        onClick={onReset}
      />
    </div>
  );
};
