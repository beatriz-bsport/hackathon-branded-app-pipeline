import {
  Body,
  Button,
  type GenericTableColumn,
  type IconName,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type CustomFormHandler = ({
  formId,
  formName,
}: {
  formId: number;
  formName: string;
}) => void;

type TableColumn = GenericTableColumn<CustomFormTableRowData>;

export type CustomFormTableRowData = {
  id: number;
  name: string;
  questions: number;
  link: string;
};

export type TableColumnsParams = {
  handleArchive?: CustomFormHandler;
  handleDuplicate?: CustomFormHandler;
  handleRestore?: CustomFormHandler;
  mode: "archived" | "active";
};

type RowActions = {
  id: string;
  tooltip: string;
  handler?: CustomFormHandler;
  icon: IconName;
};

export const useCustomFormTableColumns = ({
  handleArchive,
  handleDuplicate,
  handleRestore,
  mode,
}: TableColumnsParams) => {
  const { t } = useTranslation("common");

  const columnName: TableColumn = {
    header: t("table.headers.name"),
    id: "column-name",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <Body
          className="flex flex-row gap-sm items-center"
          htmlVariant="p"
          size="lg"
        >
          {row.name}
        </Body>
      );
    },
  };

  const columnQuestions: TableColumn = {
    header: t("table.headers.questions"),
    id: "column-questions",
    type: "custom",
    align: "center",
    render: (row) => {
      return (
        <Body htmlVariant="p" size="lg">
          {row.questions}
        </Body>
      );
    },
  };

  const columnActions: TableColumn = {
    header: "",
    id: "column-actions",
    type: "custom",
    align: "end",
    render: (row) => {
      const actionsToDisplay: RowActions[] =
        mode === "archived"
          ? [
              {
                id: `restore-custom-form-${row.id}`,
                tooltip: t("table.tooltips.restore"),
                icon: "unarchive",
                handler: handleRestore,
              },
            ]
          : [
              {
                id: `duplicate-custom-form-${row.id}`,
                tooltip: t("table.tooltips.duplicate"),
                icon: "copy-03",
                handler: handleDuplicate,
              },
              {
                id: `archive-custom-form-${row.id}`,
                tooltip: t("table.tooltips.archive"),
                icon: "archive",
                handler: handleArchive,
              },
            ];
      return (
        <>
          {actionsToDisplay
            .filter((buttonConfig) => !!buttonConfig?.handler)
            .map(({ id, tooltip, icon, handler }) => {
              return (
                <Tooltip key={id} label={tooltip} placement="bottom-right">
                  <Button
                    color="default"
                    intent="flat"
                    size="md"
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handler?.({ formId: row.id, formName: row.name });
                    }}
                    iconLeft={icon}
                  />
                </Tooltip>
              );
            })}
        </>
      );
    },
  };

  return [columnName, columnQuestions, columnActions];
};
