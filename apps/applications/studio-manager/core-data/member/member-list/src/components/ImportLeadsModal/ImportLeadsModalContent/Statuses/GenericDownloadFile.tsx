import { clsx } from "clsx";
import React from "react";

import {
  Body,
  Button,
  Icon,
  type IconName,
} from "@bsport/kaizen-primitive-core";

type GenericDownloadFileProps = {
  caption: string;
  filename: string;
  pathname: string;
  iconName: Extract<IconName, "file-x-02" | "file-check-02">;
};

export const GenericDownloadFile: React.FC<GenericDownloadFileProps> = ({
  caption,
  filename,
  pathname,
  iconName,
}) => {
  return (
    <div className="w-full">
      <Body size="sm">{caption}</Body>
      <div
        className={clsx(
          "flex flex-row gap-xs justify-between",
          "p-md rounded-md w-full mt-xs",
          "border-stroke-thin border-solid border-stroke-default",
        )}
      >
        <div className="inline-flex items-center gap-2xs ">
          <Icon icon={iconName} size="sm" />
          <Body size="sm">{filename}</Body>
        </div>
        <Button
          color="default"
          intent="flat"
          iconLeft="download-01"
          size="sm"
          aria-label={`Download ${filename}`}
          onClick={() => {
            const link = document.createElement("a");
            link.href = pathname;
            link.download = filename;
            link.click();
          }}
        />
      </div>
    </div>
  );
};
