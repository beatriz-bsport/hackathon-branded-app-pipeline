import type { FC, ReactNode } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

type SectionItemProps = {
  title: string;
  titleNode?: ReactNode;
  className?: string;
  children: ReactNode | string;
};

export const SectionItem: FC<SectionItemProps> = ({
  title,
  titleNode,
  children,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex flex-row items-center gap-xs mb-2xs">
        <Body weight="weak" color="weak" size="sm">
          {title}
        </Body>
        {titleNode}
      </div>

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
