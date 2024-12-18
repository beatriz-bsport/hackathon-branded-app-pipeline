import React from 'react';

import UniversalPassDetailsCard, {
  UniversalPassDetailsCardStorybook,
} from './UniversalPassDetailsCard.component';
import {
  UNIVERSAL_PASS_DETAILS_CARD_PREVIEW,
  UNIVERSAL_PASS_DETAILS_CARD_CONFIGURATION,
} from './custom_css_variants';

export {
  UniversalPassDetailsCardStorybook,
  UNIVERSAL_PASS_DETAILS_CARD_PREVIEW,
  UNIVERSAL_PASS_DETAILS_CARD_CONFIGURATION,
};
export type UniversalPassDetailsCardProps = React.ComponentProps<
  typeof UniversalPassDetailsCard
>;

export default UniversalPassDetailsCard;
