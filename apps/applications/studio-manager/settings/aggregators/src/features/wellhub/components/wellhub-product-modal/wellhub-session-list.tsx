// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/components/WellhubProductModal/WellhubSessionList.tsx
import React, { useMemo } from "react";

import type { OfferMissingWellhubProduct } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { List, type ListProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const PAGE_SIZE = 10;

type Props = {
  offers: OfferMissingWellhubProduct[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedOfferId: number | null;
  onOfferClick: (offer: OfferMissingWellhubProduct) => void;
  onChangePage: (page: number) => void;
};

export const WellhubSessionList: React.FC<Props> = ({
  offers,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  selectedOfferId,
  onOfferClick,
  onChangePage,
}) => {
  const { i18n, t } = useTranslation("common");

  const items: ListProps["items"] = useMemo(
    () =>
      offers.map((offer) => {
        const date = formatDateTime(
          offer.date_start,
          DATETIME_FORMATS.MEDIUM_DATETIME,
          { locale: i18n.language, timeZone: offer.timezone_name },
        );
        const hours = Math.floor(offer.duration_minute / 60);
        const minutes = offer.duration_minute % 60;
        const duration =
          hours > 0 && minutes > 0
            ? `${hours}h ${minutes}min`
            : hours > 0
              ? `${hours}h`
              : `${minutes}min`;

        const meta = [offer.coach?.name ?? null, offer.etablissement.title]
          .filter(Boolean)
          .join(" · ");

        return {
          id: `${offer.id}`,
          title: offer.name,
          description: `${date} · ${duration}${meta ? ` · ${meta}` : ""}`,
          isActive: selectedOfferId === offer.id,
          onItemClick: () => onOfferClick(offer),
        };
      }),
    [offers, selectedOfferId, onOfferClick, i18n.language],
  );

  return (
    <List
      id="wellhub-session-list"
      items={items}
      loadingProps={{
        isLoading,
        message: t("wellhub.productModal.loadingOffers"),
      }}
      emptyStateProps={{
        isEmpty: !isLoading && offers.length === 0,
        emptyConfig: {
          title: t("wellhub.productModal.noOffersEmpty"),
        },
      }}
      paginationProps={
        totalPages > 1
          ? {
              currentPage,
              rowsPerPage: PAGE_SIZE,
              totalItems,
              onPageChange: onChangePage,
            }
          : undefined
      }
    />
  );
};
