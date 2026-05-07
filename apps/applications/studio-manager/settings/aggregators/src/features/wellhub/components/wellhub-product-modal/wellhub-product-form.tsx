// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/components/WellhubProductModal/WellhubProductForm.tsx
import React, { useEffect, useMemo, useState } from "react";

import type {
  OfferMissingWellhubProduct,
  UpdateWellhubProductIdPayload,
} from "@bsport/api-book";
import {
  Alert,
  Body,
  Loader,
  Select,
  Toggle,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useFetchActivePartnershipAccountForOffer } from "../../hooks/use-fetch-active-partnership-account-for-offer";
import { useFetchSimilarSessions } from "../../hooks/use-fetch-similar-sessions";
import { useFetchWellhubProductsByAccount } from "../../hooks/use-fetch-wellhub-products-by-account";
import { SessionSummaryList } from "./session-summary-list";

type Props = {
  offer: OfferMissingWellhubProduct;
  onPayloadChange: (payload: UpdateWellhubProductIdPayload | null) => void;
};

export const WellhubProductForm: React.FC<Props> = ({
  offer,
  onPayloadChange,
}) => {
  const { t } = useTranslation("common");

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [applySimilar, setApplySimilar] = useState(false);
  const [selectedSimilarIds, setSelectedSimilarIds] = useState<string[]>([
    `${offer.id}`,
  ]);

  const onPayloadChangeRef = React.useRef(onPayloadChange);
  React.useLayoutEffect(() => {
    onPayloadChangeRef.current = onPayloadChange;
  });

  const { data: accountData, isLoading: accountLoading } =
    useFetchActivePartnershipAccountForOffer(offer.id);

  const { data: similarSessions, isLoading: similarLoading } =
    useFetchSimilarSessions(offer.id, applySimilar);

  const externalId = accountData?.[0]?.external_id ?? null;

  const { data: products, isLoading: productsLoading } =
    useFetchWellhubProductsByAccount(
      externalId
        ? {
            partnershipAccountExternalId: externalId,
            isLivestream: offer.is_broadcast,
          }
        : { enabled: false },
    );

  const selectItems = useMemo(
    () =>
      products?.map(({ id, label }) => ({
        id,
        label: `${id} - ${label}`,
      })) ?? [],
    [products],
  );

  useEffect(() => {
    setSelectedProductId(null);
    setApplySimilar(false);
    setSelectedSimilarIds([`${offer.id}`]);
  }, [offer.id]);

  useEffect(() => {
    if (selectedProductId === null) {
      onPayloadChangeRef.current(null);
      return;
    }
    const ids = applySimilar ? selectedSimilarIds.map(Number) : [offer.id];
    onPayloadChangeRef.current({
      wellhub_product_id: selectedProductId,
      custom_selection_ids: ids,
    });
  }, [selectedProductId, applySimilar, selectedSimilarIds, offer.id]);

  const noAccountFound = !accountLoading && !externalId;
  const noProductsFound =
    !productsLoading &&
    !accountLoading &&
    !!externalId &&
    !!products &&
    products.length === 0;

  return (
    <div className="flex flex-col gap-lg">
      {noAccountFound && (
        <Alert status="critical">
          <Body htmlVariant="p" size="md">
            {t("wellhub.productModal.form.noAccountError")}
          </Body>
        </Alert>
      )}

      <Select
        label={t("wellhub.productModal.form.productLabel")}
        items={selectItems}
        value={selectedProductId !== null ? `${selectedProductId}` : undefined}
        onChange={(id) => setSelectedProductId(Number(id))}
        disabled={noAccountFound || !products || products.length === 0}
        loadingProps={{
          isLoading: accountLoading || productsLoading,
          message: t("wellhub.productModal.form.loadingProducts"),
        }}
        errorText={
          noProductsFound
            ? t("wellhub.productModal.form.noProductsError")
            : undefined
        }
        className="min-w-component-select"
      />

      <Toggle
        id="wellhub-apply-similar"
        label={t("wellhub.productModal.form.applySimilarLabel")}
        checked={applySimilar}
        onToggleChange={(checked) => {
          setApplySimilar(checked);
          setSelectedSimilarIds([`${offer.id}`]);
        }}
      />

      {applySimilar && (
        <>
          {similarLoading ? (
            <div className="flex justify-center py-md">
              <Loader size="sm" />
            </div>
          ) : (
            <SessionSummaryList
              sessions={similarSessions ?? []}
              originalSessionId={offer.id}
              isSelectable
              selectedIds={selectedSimilarIds}
              setSelectedIds={setSelectedSimilarIds}
              title={t("wellhub.productModal.form.similarSessionsTitle")}
            />
          )}
        </>
      )}
    </div>
  );
};
