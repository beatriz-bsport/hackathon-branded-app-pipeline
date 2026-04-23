import { type FC, useState } from "react";

import {
  Card,
  ErrorFallback,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";

import { SmartfillActivatedEmptyState } from "#src/components/SmartfillActivatedEmptyState";
import { SmartfillRunDetailDrawer } from "#src/components/SmartfillRunDetailDrawer";
import {
  type SmartfillRun,
  useSmartfillRuns,
} from "#src/hooks/use-smartfill-runs";
import { useTranslation } from "#src/utils/i18n";

export const SmartfillRunsList: FC = () => {
  const { t } = useTranslation("smartfill");
  const { data, isLoading, isError, refetch } = useSmartfillRuns(true);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card padding="none" className="overflow-hidden">
        <div className="grid min-h-[560px] w-full place-content-center p-xl">
          <Loader size="md" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card padding="none" className="overflow-hidden">
        <div className="grid min-h-[560px] w-full place-content-center p-xl">
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
      </Card>
    );
  }

  const results = data?.results ?? [];

  if (results.length === 0) {
    return <SmartfillActivatedEmptyState />;
  }

  const rows = results.map((run) => ({
    ...run,
    isActive: run.id === selectedRunId,
    onRowClick: () => setSelectedRunId(run.id),
  }));

  return (
    <>
      <Card padding="none" className="overflow-hidden">
        <Table<SmartfillRun & { isActive: boolean; onRowClick: () => void }>
          id="smartfill-runs-list"
          columns={[
            {
              header: t("runsList.columns.date"),
              id: "date_created",
              keyPath: "date_created",
              type: "datetime",
            },
            {
              header: "Offer ID",
              id: "offer_id",
              keyPath: "offer_id",
              type: "string",
            },
          ]}
          rows={rows}
        />
      </Card>
      <SmartfillRunDetailDrawer
        runId={selectedRunId}
        onClose={() => setSelectedRunId(null)}
      />
    </>
  );
};
