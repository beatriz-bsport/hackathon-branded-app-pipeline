import React from "react";

import { Body, type BodyProps, Icon } from "@bsport/kaizen-primitive-core";

type CancelledSessionNameProps = {
  name: string;
  className?: string;
  /** Text size; omit to inherit the surrounding cell's size (e.g. table cells). */
  size?: BodyProps["size"];
};

export const CancelledSessionName: React.FC<CancelledSessionNameProps> = ({
  name,
  className,
  size,
}) => {
  return (
    <div className="flex items-center gap-xs">
      <Icon
        icon="x-circle-solid"
        size="sm"
        className="text-onsurface-action-weak-default"
      />
      <Body
        htmlVariant="span"
        size={size}
        color="inherit"
        className={`text-onsurface-action-weak-default line-through ${className ?? ""}`}
      >
        {name}
      </Body>
    </div>
  );
};
