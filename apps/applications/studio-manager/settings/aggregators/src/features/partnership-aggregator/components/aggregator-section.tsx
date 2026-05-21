import type { FC, ReactNode } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

type Props = {
  logo: ReactNode;
  subtitle: string;
  children: ReactNode;
};

export const AggregatorSection: FC<Props> = ({ logo, subtitle, children }) => (
  <section className="flex flex-col gap-md w-full items-start">
    <div className="flex flex-col gap-xs px-md">
      <div className="h-xl w-auto">{logo}</div>
      <Body color="weak" size="lg" weight="weak">
        {subtitle}
      </Body>
    </div>
    {children}
  </section>
);
