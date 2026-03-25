import React from 'react';
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
  isVirtualOffer: boolean;
  partnershipAccountExternalId: string | null;
  selectedProductId: number | null;
  styles?: string;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onSelect: (product: WellhubProductId | null) => void;
  setIsWellhubProductRequired?: (isRequired: boolean) => void;
};

const PartnershipAccountProductSelectorBase: React.FC<Props> = React.memo(
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

    const wellhubProductOptions: WellhubProductOption[] = React.useMemo(() => {
      return (
        (partnershipAccountExternalId
          ? productsByExternalId?.[partnershipAccountExternalId]
          : undefined
        )
          ?.filter((product) => isVirtualOffer == product.virtual)
          .map((product) => ({
            label: product.name,
            value: product.product_id,
          })) ?? []
      );
    }, [isVirtualOffer, productsByExternalId, partnershipAccountExternalId]);

    const selectedProductOption: WellhubProductOption | null =
      React.useMemo(() => {
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
      }, [
        productsByExternalId,
        selectedProductId,
        partnershipAccountExternalId,
      ]);

    const handleChange = React.useCallback(
      (option: WellhubProductOption) => onSelect?.(option?.value || null),
      [onSelect],
    );

    const formatOptionLabel = React.useCallback(
      (option: WellhubProductOption) => (
        <WellhubProductOptionRenderer
          productId={option.value}
          productName={option.label}
        />
      ),
      [],
    );

    if (!isLoading && wellhubProductOptions?.length < 2) {
      setIsWellhubProductRequired?.(false);
      return null;
    }

    setIsWellhubProductRequired?.(true);

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

const PartnershipAccountProductSelector: React.FC<Props> = (props) => {
  return <PartnershipAccountProductSelectorBase {...props} />;
};

export default React.memo(PartnershipAccountProductSelector);
