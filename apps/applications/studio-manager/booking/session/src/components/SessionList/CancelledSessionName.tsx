import React from "react";

import { Body, Icon } from "@bsport/kaizen-primitive-core";

type CancelledSessionNameProps = {
  name: string;
  className?: string;
};

export const CancelledSessionName: React.FC<CancelledSessionNameProps> = ({
  name,
  className,
}) => {
  return (
    <div className="flex items-center gap-xs">
      <Icon
        icon="x-circle-solid"
        size="sm"
        className="text-onsurface-action-weak-default"
      />
      <Body
        htmlVariant="p"
        size="md"
        color="inherit"
        className={`text-onsurface-action-weak-default line-through ${className ?? ""}`}
      >
        {name}
      </Body>
    </div>
  );
};
