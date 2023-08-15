import React from 'react';

import { RecommendedChipForStoryBook } from './index';

// @ts-expect-error
const RecommendedChipTemplate = () => <RecommendedChipForStoryBook />;

export const RecommendedChip = RecommendedChipTemplate.bind({});

export default {
  title: 'Components/CssOnly/RecommendedChip',
  component: RecommendedChipForStoryBook,
};
