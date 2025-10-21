import { Body, Title } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useFormatNotificationTriggerName } from "#src/hooks/layout/use-format-notification-trigger-name";
import { useTranslation } from "#src/utils/i18n";
import { getMarketingNotificationType } from "#src/utils/marketingNotification";

export const MarketingNotificationTriggerDetails = ({
  notification,
}: {
  notification: MarketingNotification;
}) => {
  const { formatNotificationTriggerName, formatNotificationTriggerTiming } =
    useFormatNotificationTriggerName();
  const { groupActivitiesById, smartlistsById } =
    useGetMarketingNotificationDependenciesData();
  const { t } = useTranslation("marketingNotificationDetails");
  const notificationType = getMarketingNotificationType({
    kind: notification.kind,
    eventRules: notification.event_rules,
    availableGroupActivitiesById: groupActivitiesById,
  });
  const triggerType = formatNotificationTriggerName({
    marketingNotification: notification,
    triggerType: notificationType,
  });
  const triggerDate = formatNotificationTriggerTiming({
    marketingNotification: notification,
    triggerType: notificationType,
  });

  const getSmartlistNamesAggregated = (ids: number[] | null) => {
    const smartlistNames = ids
      ? ids.map((id) => smartlistsById[id]?.name || undefined).filter(Boolean)
      : [];
    return (
      smartlistNames.join(", ") ||
      t("drawer.trigger.content.smartlist.noSmartlistsFiltering")
    );
  };

  return (
    <div className="flex flex-col gap-sm">
      <Title htmlVariant="h3" weight="strong">
        {t("drawer.trigger.title")}
      </Title>
      <div className="flex flex-col gap-xs">
        <div className="flex flex-col gap-2xs">
          <Body htmlVariant="p" size="sm" color="weak">
            {t("drawer.trigger.content.triggeredBy")}
          </Body>
          <Body htmlVariant="p" weight="strong" size="md">
            {triggerType}
          </Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body htmlVariant="p" size="sm" color="weak">
            {t("drawer.trigger.content.triggeredWhen")}
          </Body>
          <Body htmlVariant="p" weight="strong" size="md">
            {triggerDate}
          </Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body htmlVariant="p" size="sm" color="weak">
            {t("drawer.trigger.content.smartlist.excluding")}
          </Body>
          <Body htmlVariant="p" weight="strong" size="md">
            {getSmartlistNamesAggregated(
              notification.event_rules.smartlist_exclude,
            )}
          </Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body htmlVariant="p" size="sm" color="weak">
            {t("drawer.trigger.content.smartlist.including")}
          </Body>
          <Body htmlVariant="p" weight="strong" size="md">
            {getSmartlistNamesAggregated(
              notification.event_rules.smartlist_include,
            )}
          </Body>
        </div>
      </div>
    </div>
  );
};
