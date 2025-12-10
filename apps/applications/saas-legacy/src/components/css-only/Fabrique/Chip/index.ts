import React from 'react';

import Chip, { ChipStorybook } from './Chip.component';
import type { ChipColor, ChipSize, ChipVariant } from './types';

export { ChipStorybook };

export type { ChipColor, ChipSize, ChipVariant };
export type Props = React.ComponentProps<typeof Chip>;
export default Chip;
