import type { FC } from "react";

import {
  Card,
  type GenericTableColumn,
  Icon,
  Table,
} from "@bsport/kaizen-primitive-core";

import { PLAN_KEYS } from "#src/types/plan";
import type { Feature, PlanKey } from "#src/types/plan";

type FeatureRow = Feature;

interface FeatureComparisonTableProps {
  features: Feature[];
  headers: Record<"feature" | PlanKey, string>;
}

const FeatureComparisonTable: FC<FeatureComparisonTableProps> = ({
  features,
  headers,
}) => {
  const columns: GenericTableColumn<FeatureRow>[] = [
    {
      id: "feature",
      header: headers.feature,
      type: "string",
      keyPath: "label",
    },
    ...PLAN_KEYS.map(
      (plan): GenericTableColumn<FeatureRow> => ({
        id: plan,
        header: headers[plan],
        type: "custom",
        align: "center",
        colClassName: "w-[120px]",
        render: (row) =>
          row.includedIn[plan] ? (
            <Icon
              size="sm"
              icon="check-circle-solid"
              className="mt-[2px] text-onsurface-main-strong"
            />
          ) : (
            <Icon size="sm" icon="minus" className="text-onsurface-weaker" />
          ),
      }),
    ),
  ];

  const rows: FeatureRow[] = features;

  return (
    <Card padding="none" className="min-w-0 w-full overflow-x-auto">
      <Table
        columns={columns}
        rows={rows}
        selectable={false}
        rowHeight="sm"
        withHorizontalDivider
      />
    </Card>
  );
};

export default FeatureComparisonTable;
