import React from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import WellhubProductLoadingIndicator from './WellhubProductLoadingIndicator.component';
import WellhubProductOptionRenderer from './WellhubProductOptionRenderer.component';
import {
  useWellhubProduct,
  WellhubProductProvider,
} from './useWellhubProductContext.hook';

import type {
  WellhubProductId,
  WellhubProductOption,
} from '#src/libs/wellhub/types';

// Types for Component Props
type Props = {
  id?: string;
  isVirtualOffer: boolean;
  selectedProductId: number | null;
  styles?: string;
  wellhubGymUuid: string;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onSelect: (product: WellhubProductId | null) => void;
  setIsWellhubProductRequired?: (isRequired: boolean) => void;
};

// Main WellhubProductSelectorBase Component
const WellhubProductSelectorBase: React.FC<Props> = React.memo(
  ({
    id,
    isVirtualOffer,
    selectedProductId,
    styles,
    wellhubGymUuid,
    onBlur,
    onSelect,
    setIsWellhubProductRequired,
  }) => {
    const { t } = useTranslation('partnership');

    const { productsByWellhubGymUuid, isLoading } = useWellhubProduct();

    const wellhubProductOptions: WellhubProductOption[] = React.useMemo(
      () =>
        productsByWellhubGymUuid?.[wellhubGymUuid]
          ?.filter((product) => isVirtualOffer == product.virtual)
          .map((product) => ({
            label: product.name,
            value: product.product_id,
          })) ?? [],
      [isVirtualOffer, productsByWellhubGymUuid, wellhubGymUuid],
    );

    const selectedProductOption: WellhubProductOption | null =
      React.useMemo(() => {
        if (!selectedProductId || !wellhubGymUuid) return null;

        const wellhubProductSelected = productsByWellhubGymUuid?.[
          wellhubGymUuid
        ]?.find((product) => product.product_id === selectedProductId);

        if (wellhubProductSelected) {
          return {
            label: wellhubProductSelected.name,
            value: wellhubProductSelected.product_id,
          };
        }

        return null;
      }, [productsByWellhubGymUuid, selectedProductId, wellhubGymUuid]);

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
        onChange={handleChange}
        options={wellhubProductOptions}
        placeholder={t('wellhub.productSelection.selector.placeholder')}
        value={selectedProductOption}
      />
    );
  },
);

// Main WellhubProductSelector Component with Context Provider
const WellhubProductSelector: React.FC<Props> = (props) => {
  return (
    <WellhubProductProvider>
      <WellhubProductSelectorBase {...props} />
    </WellhubProductProvider>
  );
};

export default React.memo(WellhubProductSelector);
