import { type FC } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

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
