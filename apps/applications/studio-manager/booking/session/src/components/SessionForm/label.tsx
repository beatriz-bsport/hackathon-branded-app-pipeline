import clsx from "clsx";
import { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

export const Label: FC<{ text: string; isRequired?: boolean }> = ({
  text,
  isRequired = true,
}) => {
  return (
    <div className={clsx("flex", { "gap-2xs": isRequired })}>
      <Body size="md" htmlVariant="p">
        {text}
      </Body>
      {isRequired && (
        <span className="text-onsurface-status-critical-strong text-body-sm leading-xs">
          *
        </span>
      )}
    </div>
  );
};
