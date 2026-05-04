import { DateTime } from "luxon";
import { type FC, useState } from "react";

import {
  Body,
  ErrorFallback,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";

import { SmartfillTargetedOfferDetailDrawer } from "#src/components/SmartfillTargetedOfferDetailDrawer";
import {
  type SmartfillTargetedOffer,
  useSmartfillTargetedOffers,
} from "#src/hooks/use-smartfill-targeted-offers";
import { useTranslation } from "#src/utils/i18n";

export const SmartfillTargetedOffersList: FC = () => {
  const { t, i18n } = useTranslation("smartfill");
  const locale = i18n.language;
  const { data, isLoading, isError, refetch, paginationProps } =
    useSmartfillTargetedOffers(true);
  const [selectedTargetedOfferId, setSelectedTargetedOfferId] = useState<
    number | null
  >(null);

  if (isLoading) {
    return (
      <div className="grid min-h-[560px] w-full place-content-center p-xl">
        <Loader size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-[560px] w-full place-content-center p-xl">
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
      </div>
    );
  }

  const results = data?.results ?? [];

  const rows = results.map((targetedOffer) => ({
    ...targetedOffer,
    isActive: targetedOffer.id === selectedTargetedOfferId,
    onRowClick: () => setSelectedTargetedOfferId(targetedOffer.id),
  }));

  return (
    <>
      <div className="[&_[data-component='Kaizen-Table-Cell']:nth-child(2)]:w-full">
        <Table<
          SmartfillTargetedOffer & { isActive: boolean; onRowClick: () => void }
        >
          id="smartfill-targeted-offers-list"
          columns={[
            {
              header: t("targetedOffersList.columns.date"),
              id: "date",
              type: "custom",
              render: (row) => {
                if (!row.offer) {
                  return (
                    <Body size="sm" color="weak">
                      —
                    </Body>
                  );
                }
                const dt = DateTime.fromISO(row.offer.date_start, {
                  zone: row.offer.timezone_name,
                }).setLocale(locale);
                return (
                  <div className="flex flex-col gap-xs">
                    <Body size="md">{dt.toFormat("ccc, d LLL yyyy")}</Body>
                    <Body size="sm" color="weak">
                      {dt.toFormat("HH:mm")}
                    </Body>
                  </div>
                );
              },
            },
            {
              header: t("targetedOffersList.columns.session"),
              id: "session",
              type: "custom",
              render: (row) => {
                if (!row.offer) {
                  return (
                    <Body size="sm" color="weak">
                      {t("targetedOffersList.unknownSession", {
                        offerId: row.offer_id,
                      })}
                    </Body>
                  );
                }
                return (
                  <div className="flex flex-col gap-xs">
                    <Body size="md" weight="strong">
                      {row.offer.activity_name}
                    </Body>
                    {row.offer.teacher_name && (
                      <Body size="sm" color="weak">
                        {row.offer.teacher_name}
                      </Body>
                    )}
                  </div>
                );
              },
            },
            {
              header: t("targetedOffersList.columns.analytics"),
              id: "analytics",
              type: "custom",
              render: (row) => (
                <div className="flex flex-row gap-xl">
                  <div className="flex flex-col gap-2xs">
                    <Body size="lg" weight="strong">
                      {row.notifications_count}
                    </Body>
                    <Body size="sm" color="weak">
                      {row.notifications_count === 1
                        ? t("targetedOffersList.analytics.message")
                        : t("targetedOffersList.analytics.messages")}
                    </Body>
                  </div>
                  <div className="flex flex-col gap-2xs">
                    <Body size="lg" weight="strong">
                      {row.booked_count}
                    </Body>
                    <Body size="sm" color="weak">
                      {row.booked_count === 1
                        ? t("targetedOffersList.analytics.booking")
                        : t("targetedOffersList.analytics.bookings")}
                    </Body>
                  </div>
                </div>
              ),
            },
          ]}
          rows={rows}
          paginationProps={paginationProps}
        />
      </div>
      <SmartfillTargetedOfferDetailDrawer
        targetedOfferId={selectedTargetedOfferId}
        onClose={() => setSelectedTargetedOfferId(null)}
      />
    </>
  );
};
