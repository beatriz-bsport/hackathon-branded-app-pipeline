import type { FC } from "react";

import {
  ErrorFallback,
  Loader,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { SmartfillHeader } from "#src/components/SmartfillHeader";
import { SmartfillRunsList } from "#src/components/SmartfillRunsList";
import { useSmartfillConfigStatus } from "#src/hooks/use-smartfill-config-status";
import { useSmartfillConfigToggle } from "#src/hooks/use-smartfill-config-toggle";
import { flags, useFlag } from "#src/utils/feature-flags";
import { useTranslation } from "#src/utils/i18n";

const Content: FC = () => {
  const { t } = useTranslation("smartfill");
  const isSmartfillEnabled = useFlag(flags.smartfill);

  const { data, isLoading, isError, refetch } = useSmartfillConfigStatus();
  const { mutate: toggleSmartfillConfig, isPending } =
    useSmartfillConfigToggle();

  const isEnabled = data?.enabled;

  const { EmptyState: DisabledFeatureEmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: {
      title: t("page.title"),
      subtitle: t("page.disabled"),
    },
  });

  if (!isSmartfillEnabled) {
    return <DisabledFeatureEmptyState />;
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid h-full w-full place-content-center p-md">
        <ErrorFallback
          title={t("error.title")}
          subtitle=""
          description={t("error.description")}
          actionProps={{
            label: t("error.retry"),
            onClick: () => {
              void refetch();
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg p-lg">
      <SmartfillHeader
        isEnabled={Boolean(isEnabled)}
        isPending={isPending}
        onActivate={() => {
          toggleSmartfillConfig("activate");
        }}
        onDeactivate={() => {
          toggleSmartfillConfig("deactivate");
        }}
      />

      {isEnabled ? <SmartfillRunsList /> : null}
    </div>
  );
};

export default Content;
