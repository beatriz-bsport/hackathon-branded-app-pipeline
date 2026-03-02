import capitalize from "lodash/capitalize";

import type { MetaActivity } from "@bsport/api-book";
import {
  Avatar,
  Body,
  Chip,
  GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useTranslation } from "#src/utils/i18n";

export const useSessionActivityColumns = <
  RowType extends MetaActivity,
>(): GenericTableColumn<RowType>[] => {
  const { t } = useTranslation("sessionCreation");

  return [
    {
      header: t("addSessionModal.steps.chooseActivity.table.columns.activity"),
      id: "activity",
      keyPath: "activity",
      type: "custom",
      render: (item: RowType) => {
        const name = capitalize(item.name);
        return (
          <div className="flex flex-row items-center gap-sm">
            <Avatar
              alt={item.alt_cover_main}
              shape="squared"
              size="lg"
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
      header: t("addSessionModal.steps.chooseActivity.table.columns.type"),
      id: "activityType",
      keyPath: "activityType",
      type: "string",
    },
    {
      // No header for the features column
      header: "",
      id: "features",
      keyPath: "features",
      type: "custom",
      render: (item: RowType) => {
        return item.is_broadcast ? (
          <div className="flex flex-row gap-sm">
            <div key="group-activity-broadcast-chip" className="flex">
              <ResponsiveTooltip
                label={t(
                  "addSessionModal.steps.chooseActivity.table.features.livestream.popoverLabel",
                )}
                placement="bottom-right"
              >
                <Chip
                  color="default"
                  size="lg"
                  type="weak"
                  iconLeft="video-recorder"
                />
              </ResponsiveTooltip>
            </div>
          </div>
        ) : null;
      },
    },
  ];
};
