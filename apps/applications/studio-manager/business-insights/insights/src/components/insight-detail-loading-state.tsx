import type { FC } from "react";

import { Body, Card, Loader } from "@bsport/kaizen-primitive-core";

const METRIC_CARD_COUNT = 4;

type InsightDetailLoadingStateProps = {
  loadingMessage: string;
};

export const InsightDetailLoadingState: FC<InsightDetailLoadingStateProps> = ({
  loadingMessage,
}) => {
  return (
    <div className="flex h-full w-full flex-col gap-md overflow-y-auto bg-surface-default-weaker p-md">
      <div className="flex w-full flex-col gap-md sm:flex-row sm:overflow-x-auto">
        {Array.from({ length: METRIC_CARD_COUNT }).map((_, index) => (
          <Card
            key={index}
            className="flex min-h-[160px] flex-1 items-center justify-center bg-surface-default"
          >
            <Loader size="md" />
          </Card>
        ))}
      </div>
      <Card
        padding="none"
        className="flex min-h-[360px] flex-1 flex-col items-center justify-center gap-sm border-none bg-surface-default p-lg"
      >
        <Loader size="md" />
        <Body color="weak" size="md">
          {loadingMessage}
        </Body>
      </Card>
    </div>
  );
};
