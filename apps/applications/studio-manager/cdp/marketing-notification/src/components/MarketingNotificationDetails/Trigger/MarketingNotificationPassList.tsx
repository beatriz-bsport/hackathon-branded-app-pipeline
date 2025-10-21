import { useEffect } from "react";

import { Card, List } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { usePassListByPassType } from "#src/hooks/actions/use-pass-list-by-pass-type";
import { useFormatMarketingNotificationPassList } from "#src/hooks/layout/use-format-marketing-notification-pass-list";
import { useTranslation } from "#src/utils/i18n";

type MarketingNotificationPassesListProps = {
  passType: "appointment" | "payment";
  notification: MarketingNotification;
};

export const MarketingNotificationPassList = ({
  passType,
  notification,
}: MarketingNotificationPassesListProps) => {
  const { t } = useTranslation("marketingNotificationDetails");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const { formatPassesInListItems, passIds, allPassesIncluded } =
    useFormatMarketingNotificationPassList({
      passType,
      notification,
    });
  const { paginationParams, passesById, appointmentPassesById } =
    usePassListByPassType({
      passType,
      passIds,
      currentPage,
      currentPageSize,
      setPageSettings,
    });

  const listItems = formatPassesInListItems({
    passesById,
    appointmentPassesById,
  });

  useEffect(() => {
    setPageSettings(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
  }, []);

  return (
    <Card padding="none">
      <List
        className="w-full overflow-x-scroll"
        key={notification.id}
        id={`${passType}-passes-list-notification-${notification.id}`}
        items={listItems}
        paginationProps={
          allPassesIncluded || passIds.length <= currentPageSize
            ? undefined
            : paginationParams
        }
        emptyStateProps={{
          isEmpty: listItems.length === 0,
          emptyConfig: {
            title: t("drawer.trigger.content.passes.emptyList.title"),
            subtitle: t("drawer.trigger.content.passes.emptyList.description"),
          },
        }}
      />
    </Card>
  );
};
