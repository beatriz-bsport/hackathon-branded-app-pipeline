import { useMemo } from "react";
import { useOutletContext } from "react-router";

import {
  Body,
  Card,
  Chip,
  type GenericTableColumn,
  Icon,
  IconName,
  Table,
} from "@bsport/kaizen-primitive-core";

import { TagRuleKind } from "#src/api/constants";
import { type TagRuleWithTag, useTagRules } from "#src/api/use-tag-rules";
import { useTranslation } from "#src/utils/i18n";

import { invariant } from "../../utils/invariant";

type TableRow = TagRuleWithTag & {
  id: number;
};

const TagRulesContent = () => {
  const { smartlistId } = useOutletContext<{ smartlistId: string }>();
  const tagRules = useTagRules(smartlistId);

  const { t, i18n } = useTranslation("details");

  const columns: GenericTableColumn<TableRow>[] = useMemo(
    () => [
      {
        id: "created-on",
        header: t("automation.tagRules.columns.createdOn"),
        type: "date",
        keyPath: "date_created",
      },
      {
        id: "condition",
        header: t("automation.tagRules.columns.condition"),
        type: "custom",
        render: (row) => {
          const ruleKindConfig = {
            [TagRuleKind.TAG_ON_JOIN_AND_UNTAG_ON_LEFT]: {
              icon: "log-in-03",
              text: t("automation.tagRules.conditions.joins.text"),
              color: "text-onsurface-status-positive-weak",
            },
            [TagRuleKind.TAG_ON_JOIN_AND_KEEP_TAG]: {
              icon: "users-check",
              text: t("automation.tagRules.conditions.present.text"),
              color: "text-onsurface-status-info-weak",
            },
            [TagRuleKind.TAG_ON_LEFT]: {
              icon: "log-out-01",
              text: t("automation.tagRules.conditions.leaves.text"),
              color: "text-onsurface-status-critical-weak",
            },
          } as const satisfies Record<
            TagRuleKind,
            { icon: IconName; text: string; color: string }
          >;

          invariant(
            ruleKindConfig[row.kind],
            `There is no support for the tag kind: ${row.kind}`,
          );

          const { icon, text, color } = ruleKindConfig[row.kind];

          return (
            <div className="flex items-center gap-xs">
              <Icon icon={icon} size="sm" className={color} />
              <Body size="md" color="weak">
                {text}
              </Body>
            </div>
          );
        },
      },
      {
        id: "tag",
        header: t("automation.tagRules.columns.tag"),
        type: "custom",
        render: (row) => (
          <Chip
            label={
              row.tagGroupName
                ? `${row.tagGroupName}: ${row.tagName}`
                : row.tagName
            }
            customColor={row.tagColor}
            type="weak"
            size="lg"
            rounded="lg"
            color="default"
          />
        ),
      },
    ],
    [i18n.language],
  );

  const rows: TableRow[] = useMemo(
    () =>
      tagRules.map((rule: TagRuleWithTag) => ({
        ...rule,
        id: rule.id,
      })),
    [tagRules],
  );

  return (
    <Card padding="none" className="overflow-hidden">
      <Table
        rowHeight="lg"
        columns={columns}
        rows={rows}
        emptyStateProps={{
          isEmpty: rows.length === 0,
          emptyConfig: {
            title: t("automation.tagRules.emptyState"),
          },
        }}
      />
    </Card>
  );
};

export const TagRulesSection = TagRulesContent;
