import React from 'react';

import Chip, { ChipStorybook } from './Chip.component';
import type { ChipColor, ChipSize, ChipVariant } from './types';

import {
  FABRIQUE_CHIP_CONFIGURATION,
  FABRIQUE_CHIP_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_CHIP_CONFIGURATION, FABRIQUE_CHIP_PREVIEW };
export { ChipStorybook };

export type { ChipColor, ChipSize, ChipVariant };
export type Props = React.ComponentProps<typeof Chip>;
export default Chip;
