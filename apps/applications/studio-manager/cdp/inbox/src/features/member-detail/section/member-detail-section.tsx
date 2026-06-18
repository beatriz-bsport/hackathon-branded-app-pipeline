import { type ReactNode } from "react";

import { Accordion, Body } from "@bsport/kaizen-primitive-core";

export type MemberDetailSectionProps = {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
};

export function MemberDetailSection({
  title,
  children,
  initiallyOpen = true,
}: MemberDetailSectionProps) {
  return (
    <Accordion.Item
      ariaLabel={title}
      initiallyOpen={initiallyOpen}
      header={
        <Body htmlVariant="span" size="lg" weight="strong" color="weak">
          {title}
        </Body>
      }
    >
      <div className="pt-xs">{children}</div>
    </Accordion.Item>
  );
}
