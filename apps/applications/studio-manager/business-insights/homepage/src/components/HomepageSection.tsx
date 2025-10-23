import type { FC, PropsWithChildren } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

type HomepageSectionProps = PropsWithChildren<{
  className?: string;
  title: string;
  noGap?: boolean;
}>;

export const HomepageSection: FC<HomepageSectionProps> = ({
  children,
  className = "",
  title,
  noGap = false,
}) => {
  return (
    <section className={className}>
      <Title htmlVariant="h2" weight="strong" className={noGap ? "" : "mb-md"}>
        {title}
      </Title>
      {children}
    </section>
  );
};
