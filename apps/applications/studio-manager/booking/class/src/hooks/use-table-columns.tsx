import type { MetaActivity } from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  useFormatDatetime,
} from "@bsport/datetime-formatting";
import {
  Body,
  GenericTableColumn,
  Media,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import useSCT from "./use-sct";

const useTableColumns = <RowType extends MetaActivity>({
  includeNextClass = true,
}: { includeNextClass?: boolean } = {}): GenericTableColumn<RowType>[] => {
  const { t, i18n } = useTranslation("list");
  const { sctMap } = useSCT();
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const { formatDateTime } = useFormatDatetime();

  return [
    {
      header: t("list.table.header.columns.name"),
      id: "name",
      keyPath: "name",
      type: "custom",
      render: (item: RowType) => {
        return (
          <div className="flex flex-row items-center gap-sm">
            <Media
              alt={item.alt_cover_main}
              shape="squared"
              size="sm"
              ratio="1:1"
              src={item.cover_main}
            />
            <Body
              htmlVariant="p"
              title={item.name}
              className="max-w-[220px] truncate"
            >
              {item.name}
            </Body>
          </div>
        );
      },
    },
    {
      header: t("list.table.header.columns.category"),
      id: "category",
      keyPath: "category",
      type: "custom",
      render: (item: RowType) => {
        const categoryName = sctMap.get(item.SCT) ?? "—";
        return <Body htmlVariant="p">{categoryName}</Body>;
      },
    },
    {
      header: t("list.table.header.columns.type"),
      id: "type",
      keyPath: "type",
      type: "custom",
      render: (item: RowType) => {
        return (
          <Body htmlVariant="p">
            {item.is_workshop
              ? t("list.table.item.type.workshop")
              : t("list.table.item.type.groupActivity")}
          </Body>
        );
      },
    },
    ...(includeNextClass
      ? [
          {
            header: t("list.table.header.columns.nextClass.name"),
            id: "nextClass",
            keyPath: "next_slot",
            align: "center" as const,
            type: "custom" as const,
            render: (item: RowType) => {
              if (!item.next_slot) {
                return (
                  <Tooltip
                    label={t(
                      "list.table.header.columns.nextClass.noUpcomingSession.tooltip",
                    )}
                  >
                    <Body
                      htmlVariant="p"
                      size="lg"
                      className="text-center inline-block w-full"
                    >
                      -
                    </Body>
                  </Tooltip>
                );
              }

              const date = formatDateTime(
                item.next_slot,
                DATETIME_FORMATS.MEDIUM_DATE,
                {
                  locale: i18n.language,
                  timeZone: companyTimezone,
                },
              );

              const time = formatDateTime(
                item.next_slot,
                DATETIME_FORMATS.TIME_SIMPLE,
                {
                  locale: i18n.language,
                  timeZone: companyTimezone,
                },
              );

              return (
                <div className="flex flex-col gap-2xs">
                  <Body htmlVariant="span" size="lg">
                    {date}
                  </Body>
                  <Body htmlVariant="span" size="md" color="weak">
                    {time}
                  </Body>
                </div>
              );
            },
          },
        ]
      : []),
  ];
};

export default useTableColumns;
