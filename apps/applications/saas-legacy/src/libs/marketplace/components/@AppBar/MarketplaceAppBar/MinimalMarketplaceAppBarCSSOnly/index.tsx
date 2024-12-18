import React from 'react';
import MinimalMarketplaceAppBarCSSOnly, {
  MinimalMarketplaceAppBarCSSOnlyStorybook,
} from './MinimalMarketplaceAppBarCSSOnly.component';

import {
  MARKETPLACE_MINIMAL_APPBAR_CONFIGURATION,
  MARKETPLACE_MINIMAL_APPBAR_PREVIEW,
} from './custom_css_variant';

export { MinimalMarketplaceAppBarCSSOnlyStorybook };

export type Props = React.ComponentProps<
  typeof MinimalMarketplaceAppBarCSSOnly
>;

export {
  MARKETPLACE_MINIMAL_APPBAR_CONFIGURATION,
  MARKETPLACE_MINIMAL_APPBAR_PREVIEW,
};

export default MinimalMarketplaceAppBarCSSOnly;
