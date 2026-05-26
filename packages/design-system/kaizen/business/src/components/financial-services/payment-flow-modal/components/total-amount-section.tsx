import type { ReactNode } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

type TotalAmountSectionProps = {
  amountLabel: string;
  formattedAmount: string;
  caption?: ReactNode;
  scheduleDetail?: ReactNode;
};

export const TotalAmountSection = ({
  amountLabel,
  formattedAmount,
  caption,
  scheduleDetail,
}: TotalAmountSectionProps) => (
  <>
    <div className="flex w-full flex-col gap-xs">
      <div className="flex w-full">
        <Title htmlVariant="h3" color="default" weight="strong">
          {amountLabel}
        </Title>
      </div>

      <div className="flex w-full flex-row flex-wrap items-end gap-xs">
        <Title htmlVariant="h1" color="default" weight="strong">
          {formattedAmount}
        </Title>
        {caption && (
          <div className="min-w-0 flex-1">
            <Body htmlVariant="p" size="lg" weight="weak" color="weak">
              {caption}
            </Body>
          </div>
        )}
      </div>
    </div>

    {scheduleDetail && (
      <Body htmlVariant="p" size="md" weight="weak" color="info">
        {scheduleDetail}
      </Body>
    )}
  </>
);
