import { useState } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import type { Fetch } from "@bsport/fetch";
import { Body, Button, Card, Icon, Title } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
import { formatDate } from "#src/utils/date";

import { useFetchAvailableGiftcards } from "../../hooks";
import { AddGiftCardCode } from "./add-gift-card-code";

type GiftCardProps = {
  fetch: Fetch;
  memberId: number;
};

const formatExpirationDate = (value: string | null): string => {
  if (!value) return "";
  return formatDate(value, i18nInstance.language);
};

const formatGiftCardAmounts = (
  availableAmount: number,
  totalAmount: number,
): string =>
  `${getCurrencyDisplayWithPrice(availableAmount)}/${getCurrencyDisplayWithPrice(totalAmount)}`;

export const GiftCard: React.FC<GiftCardProps> = ({
  fetch,
  memberId,
}: GiftCardProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const {
    giftcards,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useFetchAvailableGiftcards({
    fetch,
    memberId,
    enabled: true,
  });

  const [selectedGiftCardId, setSelectedGiftCardId] = useState<number | null>(
    null,
  );

  const giftCardsGridClassName =
    giftcards.length === 1 ? "grid-cols-1" : "grid-cols-2";

  if (isLoading) {
    return (
      <Body htmlVariant="p" size="md" color="weaker">
        {t("paymentFlowModal.giftCards.loading")}
      </Body>
    );
  }

  return (
    <div className="flex flex-col items-start gap-sm self-stretch">
      <div className="flex justify-between w-full">
        <Title htmlVariant="h4" color="default" weight="strong">
          {t("paymentFlowModal.giftCards.title")}
        </Title>
        {hasNextPage && (
          <Button
            intent="flat"
            size="sm"
            color="default"
            disabled={isFetchingNextPage}
            label={
              isFetchingNextPage
                ? t("paymentFlowModal.giftCards.loadingMore")
                : t("paymentFlowModal.giftCards.loadMore")
            }
            onClick={() => fetchNextPage()}
          />
        )}
      </div>

      {giftcards.length > 0 && (
        <div className={`grid ${giftCardsGridClassName} gap-xs self-stretch`}>
          {giftcards.map((giftcard, index) => (
            <Card
              key={`${giftcard.id}-${index}`}
              actionable
              elevated
              selected={selectedGiftCardId === giftcard.id}
              onClick={() => setSelectedGiftCardId(giftcard.id)}
            >
              <div className="flex items-center gap-sm">
                <Icon icon="gift-02" size="md" />
                <div className="flex min-w-0 flex-1 flex-col gap-2xs">
                  <Title htmlVariant="h5" color="default" weight="strong">
                    {giftcard.label}
                  </Title>
                  <Body htmlVariant="p" size="lg" color="default">
                    {formatGiftCardAmounts(
                      giftcard.availableAmount,
                      giftcard.totalAmount,
                    )}
                    {giftcard.expirationDate
                      ? ` - ${t("paymentFlowModal.giftCards.expiresOn", {
                          date: formatExpirationDate(giftcard.expirationDate),
                        })}`
                      : ""}
                  </Body>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddGiftCardCode
        fetch={fetch}
        memberId={memberId}
        onApplied={() => setSelectedGiftCardId(null)}
      />
    </div>
  );
};
