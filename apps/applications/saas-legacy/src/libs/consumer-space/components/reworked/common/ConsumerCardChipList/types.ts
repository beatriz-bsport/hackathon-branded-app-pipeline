import React from 'react';

import type {
  ChipColor,
  ChipVariant,
} from '#src/components/css-only/Fabrique/Chip';

export type ChipData = {
  shouldDisplay?: boolean;
  chipColor: ChipColor;
  leftIcon?: React.ReactNode;
  variant?: ChipVariant;
  text: string;
  chipClassName: string;
};
