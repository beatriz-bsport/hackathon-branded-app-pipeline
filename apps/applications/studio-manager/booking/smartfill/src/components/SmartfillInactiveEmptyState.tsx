import type { FC } from "react";

import { useEmptyState } from "@bsport/kaizen-primitive-core";

import { useSmartfillConfigToggle } from "#src/hooks/use-smartfill-config-toggle";
import { useTranslation } from "#src/utils/i18n";

export const SmartfillInactiveEmptyState: FC = () => {
  const { t } = useTranslation("smartfill");
  const { mutate: toggleSmartfillConfig, isPending } =
    useSmartfillConfigToggle();

  const { EmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: {
      title: t("inactiveEmptyState.title"),
      subtitle: t("inactiveEmptyState.subtitle"),
      className: "w-full max-w-screen-lg",
      ctaButtonConfig: {
        label: t("section.activate"),
        loading: isPending,
        disabled: isPending,
        onClick: () => {
          toggleSmartfillConfig("activate");
        },
      },
    },
  });

  return (
    <div className="grid min-h-[560px] w-full place-content-center p-xl">
      <EmptyState />
    </div>
  );
};
