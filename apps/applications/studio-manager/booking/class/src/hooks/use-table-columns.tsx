import type { MetaActivity } from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  useFormatDatetime,
} from "@bsport/datetime-formatting";
import {
  Body,
  Chip,
  GenericTableColumn,
  Media,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import useGetClassChips from "./use-get-class-chips";
import useSCT from "./use-sct";

const useTableColumns = <
  RowType extends MetaActivity,
>(): GenericTableColumn<RowType>[] => {
  const { t, i18n } = useTranslation("list");
  const { getChips } = useGetClassChips();
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
    {
      header: t("list.table.header.columns.nextSession"),
      id: "upcomingSession",
      keyPath: "next_slot",
      type: "custom",
      render: (item: RowType) => {
        if (!item.next_slot) return null;

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
    {
      header: t("list.table.header.columns.features"),
      id: "features",
      keyPath: "features",
      type: "custom",
      render: (item: RowType) => {
        const chips = getChips(
          item.on_booking_notification?.length > 0,
          item.is_broadcast,
        );
        return (
          <div className="flex flex-row gap-sm">
            {chips.map((chip) => (
              <div key={chip.id} className="flex">
                <Tooltip
                  label={chip.tooltipProps.label}
                  placement={chip.tooltipProps.placement}
                >
                  <Chip {...chip} />
                </Tooltip>
              </div>
            ))}
          </div>
        );
      },
    },
  ];
};

export default useTableColumns;
