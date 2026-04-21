import type { FC } from "react";

import { Card, useEmptyState } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const SmartfillActivatedEmptyState: FC = () => {
  const { t } = useTranslation("smartfill");

  const { EmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: {
      title: t("activatedEmptyState.title"),
      subtitle: t("activatedEmptyState.subtitle"),
      className: "w-full max-w-screen-lg",
    },
  });

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="grid min-h-[560px] w-full place-content-center p-xl">
        <EmptyState />
      </div>
    </Card>
  );
};
