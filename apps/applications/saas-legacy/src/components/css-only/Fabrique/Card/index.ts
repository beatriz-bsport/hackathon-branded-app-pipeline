import Card, { CardStorybook, type CardProps } from './Card.component';

import type { CardVariant, CardType } from './types';

import {
  FABRIQUE_CARD_CONFIGURATION,
  FABRIQUE_CARD_PREVIEW,
} from './custom_css_variant';

export { CardStorybook, FABRIQUE_CARD_CONFIGURATION, FABRIQUE_CARD_PREVIEW };
export type { CardProps, CardVariant, CardType };
export default Card;
