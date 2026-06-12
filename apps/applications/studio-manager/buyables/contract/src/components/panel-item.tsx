import type { FC, ReactNode } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

type PanelItemProps = {
  title: string;
  className?: string;
  children: ReactNode | string;
};

export const PanelItem: FC<PanelItemProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={className}>
      <Body weight="weak" color="weak" size="sm">
        {title}
      </Body>
      {typeof children === "string" ? (
        <Body weight="strong" size="lg">
          {children}
        </Body>
      ) : (
        children
      )}
    </div>
  );
};
