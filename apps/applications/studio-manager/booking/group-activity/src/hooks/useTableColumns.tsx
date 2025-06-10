import capitalize from "lodash/capitalize";

import {
  Avatar,
  Body,
  Chip,
  GenericTableColumn,
} from "@bsport/kaizen-primitive-core";
import { MetaActivity } from "@bsport/store-booking-group-activity";

import { useTranslation } from "#src/utils/i18n";

import useGetActivityChips from "./useGetActivityChips";

const useTableColumns = <
  RowType extends MetaActivity,
>(): GenericTableColumn<RowType>[] => {
  const { t } = useTranslation();
  const { getChips } = useGetActivityChips();

  return [
    {
      header: t("list.columns.name"),
      id: "name",
      keyPath: "name",
      type: "custom",
      render: (item: RowType) => {
        const name = capitalize(item.name);
        return (
          <div className="flex flex-row items-center gap-sm">
            <Avatar
              alt={item.alt_cover_main}
              shape="squared"
              size="md"
              src={item.cover_main}
            />
            <Body
              htmlVariant="p"
              title={name}
              className="max-w-[180px] truncate"
            >
              {name}
            </Body>
          </div>
        );
      },
    },
    {
      header: t("list.columns.category"),
      id: "category",
      keyPath: "category",
      type: "string",
    },
    {
      header: t("list.columns.upcomingSession"),
      id: "upcomingSession",
      keyPath: "next_slot",
      type: "datetime",
    },
    {
      header: t("list.columns.features"),
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
                <Chip {...chip} />
              </div>
            ))}
          </div>
        );
      },
    },
  ];
};

export default useTableColumns;
