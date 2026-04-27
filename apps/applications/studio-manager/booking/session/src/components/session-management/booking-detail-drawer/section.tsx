import { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

export const Section: FC<{ title?: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2xs">
      {title && (
        <Body size="md" weight="weak" color="weak">
          {title}
        </Body>
      )}
      <div className="px-md">{children}</div>
    </div>
  );
};
