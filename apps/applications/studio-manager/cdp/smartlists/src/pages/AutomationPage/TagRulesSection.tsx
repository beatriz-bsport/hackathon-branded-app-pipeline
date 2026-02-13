import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";

import {
  Body,
  Button,
  Card,
  Chip,
  DropdownMenu,
  type DropdownMenuItems,
  type GenericTableColumn,
  Icon,
  IconName,
  Table,
} from "@bsport/kaizen-primitive-core";

import { TagRuleKind } from "#src/api/constants";
import { type TagRuleWithTag, useTagRules } from "#src/api/use-tag-rules";
import { DeleteTagRuleModal } from "#src/components/DeleteTagRuleModal";
import { useTranslation } from "#src/utils/i18n";

import { invariant } from "../../utils/invariant";

type TableRow = TagRuleWithTag & {
  id: number;
};

const COLUMN_IDS = {
  CREATED_ON: "created-on",
  CONDITION: "condition",
  TAG: "tag",
  ACTIONS: "actions",
};

const TagRulesContent = (
  { compact }: { compact?: boolean } = { compact: false },
) => {
  const { smartlistId } = useOutletContext<{ smartlistId: string }>();
  const tagRules = useTagRules(smartlistId);

  const { t, i18n } = useTranslation("details");

  const [tagRuleToDelete, setTagRuleToDelete] = useState<TableRow | null>(null);

  const handleCloseDeleteModal = () => {
    setTagRuleToDelete(null);
  };

  const columns: GenericTableColumn<TableRow>[] = useMemo(() => {
    const allColumns: GenericTableColumn<TableRow>[] = [
      {
        id: COLUMN_IDS.CREATED_ON,
        header: t("automation.tagRules.columns.createdOn"),
        type: "date",
        keyPath: "date_created",
      },
      {
        id: COLUMN_IDS.CONDITION,
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
              <Body
                size="md"
                color="weak"
                className="whitespace-normal break-words"
              >
                {text}
              </Body>
            </div>
          );
        },
      },
      {
        id: COLUMN_IDS.TAG,
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
      {
        id: COLUMN_IDS.ACTIONS,
        type: "custom",
        align: "end",
        header: "",
        render: (row) => {
          const items: DropdownMenuItems = [
            {
              id: "edit",
              label: t("automation.tagRules.actions.edit"),
              iconLeft: "edit-02",
            },
            {
              id: "delete",
              label: t("automation.tagRules.actions.delete"),
              iconLeft: "trash-01",
            },
          ];

          return (
            <DropdownMenu
              items={items}
              onSelectOption={({ setIsPopoverOpened, id }) => {
                setIsPopoverOpened(false);
                if (id === "delete") {
                  setTagRuleToDelete(row);
                }
              }}
              placement="bottom-right"
              target={({ setIsPopoverOpened }) => (
                <Button
                  kind="icon-button"
                  intent="flat"
                  icon="dots-vertical"
                  onClick={() => setIsPopoverOpened(true)}
                  color="default"
                  label={t("automation.tagRules.actions.menu")}
                  size="md"
                />
              )}
            />
          );
        },
      },
    ];

    return compact
      ? allColumns.filter((col) => col.id !== COLUMN_IDS.CREATED_ON)
      : allColumns;

    // we should't add t as dependency, instead we add the language
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact, i18n.language]);

  const rows: TableRow[] = useMemo(
    () =>
      tagRules.map((rule: TagRuleWithTag) => ({
        ...rule,
        id: rule.id,
      })),
    [tagRules],
  );

  return (
    <>
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
      {tagRuleToDelete && (
        <DeleteTagRuleModal
          isOpen
          onClose={handleCloseDeleteModal}
          smartlistId={smartlistId}
          tagRule={tagRuleToDelete}
        />
      )}
    </>
  );
};

export const TagRulesSection = TagRulesContent;
