import React from 'react';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import Pagination, { Props as PaginationProps } from '.';
// @ts-expect-error
import PaginationCss from './styles.css?raw';

// static on purpose to always have 5 pages in preview
const PAGINATION_ITEMS_COUNT = 150;

const fabriquePaginationVariationRegistry = [
  {
    label: 'hidePaginationControls',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): PaginationProps => {
  const hidePaginationControlSelected =
    variationsSelected?.hidePaginationControls?.value === 'true';
  const isDisabledSelected = variationsSelected?.isDisabled?.value === 'true';

  return {
    hidePaginationControls: hidePaginationControlSelected,
    count: PAGINATION_ITEMS_COUNT,
    pageSize: 30,
    currentPage: 1,
    disabled: isDisabledSelected,
    onPageChange: () => {},
  };
};

export const FABRIQUE_PAGINATION_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_PAGINATION,
    css: PaginationCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriquePaginationVariationRegistry,
  };

export const FABRIQUE_PAGINATION_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return <Pagination {...componentProps} />;
});
