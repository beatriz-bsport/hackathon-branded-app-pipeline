import type { FC, PropsWithChildren } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

type HomepageSectionProps = PropsWithChildren<{
  className?: string;
  title: string;
}>;

export const HomepageSection: FC<HomepageSectionProps> = ({
  children,
  className = "",
  title,
}) => {
  return (
    <section className={className}>
      <Title htmlVariant="h2" weight="strong" className="mb-md">
        {title}
      </Title>
      {children}
    </section>
  );
};
