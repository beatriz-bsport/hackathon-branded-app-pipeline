import React, { useCallback, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import WellhubProductLoadingIndicator from '#src/libs/wellhub/components/WellhubProductSelector/WellhubProductLoadingIndicator.component';
import WellhubProductOptionRenderer from '#src/libs/wellhub/components/WellhubProductSelector/WellhubProductOptionRenderer.component';
import { usePartnershipAccountProduct } from './usePartnershipAccountProductContext.hook';

import type {
  WellhubProductId,
  WellhubProductOption,
} from '#src/libs/wellhub/types';

type Props = {
  id?: string;
  isVirtualOffer: boolean | undefined;
  partnershipAccountExternalId: string | null;
  selectedProductId: number | null;
  styles?: string;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onSelect: (product: WellhubProductId | null) => void;
  setIsWellhubProductRequired?: (isRequired: boolean) => void;
};

const PartnershipAccountProductSelector: React.FC<Props> = React.memo(
  ({
    id,
    isVirtualOffer,
    partnershipAccountExternalId,
    selectedProductId,
    styles,
    onBlur,
    onSelect,
    setIsWellhubProductRequired,
  }) => {
    const { t } = useTranslation('partnership');

    const { productsByExternalId, isLoading } = usePartnershipAccountProduct();

    const wellhubProductOptions: WellhubProductOption[] = useMemo(() => {
      return (
        (partnershipAccountExternalId
          ? productsByExternalId?.[partnershipAccountExternalId]
          : undefined
        )
          ?.filter((product) => isVirtualOffer === product.virtual)
          .map((product) => ({
            label: product.name,
            value: product.product_id,
          })) ?? []
      );
    }, [isVirtualOffer, productsByExternalId, partnershipAccountExternalId]);

    const selectedProductOption: WellhubProductOption | null = useMemo(() => {
      if (!selectedProductId || !partnershipAccountExternalId) return null;

      const selected = productsByExternalId?.[
        partnershipAccountExternalId
      ]?.find((product) => product.product_id === selectedProductId);

      if (selected) {
        return {
          label: selected.name,
          value: selected.product_id,
        };
      }

      return null;
    }, [productsByExternalId, selectedProductId, partnershipAccountExternalId]);

    const handleChange = useCallback(
      (option: WellhubProductOption) => onSelect?.(option?.value || null),
      [onSelect],
    );

    const formatOptionLabel = useCallback(
      (option: WellhubProductOption) => (
        <WellhubProductOptionRenderer
          productId={option.value}
          productName={option.label}
        />
      ),
      [],
    );

    useEffect(() => {
      if (isLoading) return;
      setIsWellhubProductRequired?.(wellhubProductOptions.length >= 2);
    }, [isLoading, wellhubProductOptions.length, setIsWellhubProductRequired]);

    if (!isLoading && wellhubProductOptions.length < 2) {
      return null;
    }

    return (
      <Select<WellhubProductOption>
        className={styles}
        components={{
          LoadingIndicator: isLoading
            ? WellhubProductLoadingIndicator
            : undefined,
        }}
        formatOptionLabel={formatOptionLabel}
        id={id}
        isLoading={isLoading}
        onBlur={onBlur}
        onChange={handleChange as any}
        options={wellhubProductOptions}
        placeholder={t('wellhub.productSelection.selector.placeholder')}
        value={selectedProductOption}
      />
    );
  },
);

export default React.memo(PartnershipAccountProductSelector);
