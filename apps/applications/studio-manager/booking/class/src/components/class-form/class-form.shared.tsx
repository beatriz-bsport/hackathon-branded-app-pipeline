import { type FC, type ReactNode } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

export const FormSection: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-lg w-full">{children}</div>
);

interface FormSectionHeaderProps {
  title: string;
  description?: string;
  level?: "h4" | "h5";
}

export const FormSectionHeader: FC<FormSectionHeaderProps> = ({
  title,
  description,
  level = "h4",
}) => (
  <div className="flex flex-col gap-2xs">
    <Title htmlVariant={level} weight="strong">
      {title}
    </Title>
    {description && (
      <Body size="sm" weight="weak" color="weak">
        {description}
      </Body>
    )}
  </div>
);
