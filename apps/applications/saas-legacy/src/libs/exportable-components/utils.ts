/**
 * This file re-exports common utilities and adds CSS-related functions.
 *
 * ⚠️ WARNING: This file imports CSS_COMPONENTS which loads faker.
 * For components in the main bundle (navigation, app shell), import from './utils-common' instead.
 */
import { CSS_COMPONENTS } from '#src/libs/exportable-components/custom_css_variants';
import { MarketplacePage, VariantionConfiguration } from './types';

// Re-export common utilities for backwards compatibility
export {
  getDefaultTitleForComponent,
  getDefaultMarketplaceTabTitle,
  getDefaultConfigByIdentifier,
  checkExportableComponentConfig,
  EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS,
} from './utils-common';

/**
 * CSS-related utilities - only import these in lazy-loaded components
 */
export const getCssComponentsForPage = (page: MarketplacePage) => {
  return CSS_COMPONENTS.filter((c) => c.pages.includes(page));
};

export const getCssComponentByLabel = (label: string) => {
  return (
    CSS_COMPONENTS.find((c) => c.label === label) ?? {
      css: '',
      label: '',
      pages: [] as MarketplacePage[],
      showAsFlex: false,
      defaultState: {},
      variations: [] as VariantionConfiguration[],
    }
  );
};
