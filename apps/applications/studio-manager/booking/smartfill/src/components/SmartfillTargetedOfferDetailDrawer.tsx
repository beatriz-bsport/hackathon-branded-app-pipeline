import { DateTime } from "luxon";
import type { FC } from "react";

import {
  Avatar,
  Badge,
  Body,
  DetailDrawer,
  ErrorFallback,
  Link,
  Loader,
  Title,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import {
  type SmartfillNotification,
  useSmartfillTargetedOfferDetail,
} from "#src/hooks/use-smartfill-targeted-offer-detail";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  targetedOfferId: number | null;
  onClose: () => void;
};

const NotificationRow: FC<{
  notification: SmartfillNotification;
  locale: string;
}> = ({ notification, locale }) => {
  const { t } = useTranslation("smartfill");
  const dateFormat = "d LLL, HH:mm";
  const subtitle =
    notification.date_sent != null
      ? t("notifications.subtitle.sent", {
          date: DateTime.fromISO(notification.date_sent)
            .setLocale(locale)
            .toFormat(dateFormat),
        })
      : t("notifications.subtitle.scheduled", {
          date: DateTime.fromISO(notification.date_created)
            .setLocale(locale)
            .toFormat(dateFormat),
        });

  return (
    <li className="flex items-center gap-md p-md">
      <Avatar
        size="md"
        shape="round"
        src={notification.member?.avatar_url ?? ""}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Body size="md" weight="strong">
          {notification.member?.full_name ??
            t("notifications.unknownMember", {
              memberId: notification.member_id,
            })}
        </Body>
        <Body size="sm" color="weak">
          {subtitle}
        </Body>
      </div>
      {notification.booked && (
        <Tooltip label={t("notifications.bookedBadge.tooltip")}>
          <Badge
            size="sm"
            color="main"
            icon="check"
            text={t("notifications.bookedBadge.label")}
          />
        </Tooltip>
      )}
    </li>
  );
};

export const SmartfillTargetedOfferDetailDrawer: FC<Props> = ({
  targetedOfferId,
  onClose,
}) => {
  const { t, i18n } = useTranslation("smartfill");
  const locale = i18n.language;
  const { data, isLoading, isError, refetch } =
    useSmartfillTargetedOfferDetail(targetedOfferId);

  return (
    <DetailDrawer
      id="smartfill-targeted-offer-detail"
      isOpen={targetedOfferId != null}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="grid h-full w-full place-content-center">
          <Loader size="md" />
        </div>
      ) : null}

      {isError ? (
        <ErrorFallback
          title={t("error.title")}
          subtitle=""
          description={t("error.description")}
          actionProps={{
            label: t("error.retry"),
            onClick: () => {
              void refetch();
            },
          }}
        />
      ) : null}

      {data ? (
        <div className="flex flex-col gap-md">
          {data.offer ? (
            <div className="flex items-start justify-between gap-md">
              <div className="flex min-w-0 flex-col gap-xs">
                <Title htmlVariant="h3">{data.offer.activity_name}</Title>
                <Body size="md" color="weak">
                  {[
                    data.offer.teacher_name,
                    DateTime.fromISO(data.offer.date_start, {
                      zone: data.offer.timezone_name,
                    })
                      .setLocale(locale)
                      .toFormat("ccc, d LLL yyyy - HH:mm"),
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </Body>
              </div>
              <Link
                href={`/offer/${data.offer_id}`}
                target="_blank"
                rel="noopener noreferrer"
                icon="link-external-02"
                color="inherit"
                aria-label={t("targetedOfferDetail.openOffer")}
              />
            </div>
          ) : (
            <Title htmlVariant="h3">
              {t("targetedOffersList.unknownSession", {
                offerId: data.offer_id,
              })}
            </Title>
          )}

          <Title htmlVariant="h4">
            {t("notifications.title", { count: data.notifications_count })}
          </Title>

          <ul className="flex flex-col divide-y divide-stroke-weak border-stroke-thin border-stroke-weak rounded-sm border">
            {data.notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                locale={locale}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </DetailDrawer>
  );
};
