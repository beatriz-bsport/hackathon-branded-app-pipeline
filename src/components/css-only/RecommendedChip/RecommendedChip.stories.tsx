import React from 'react';

import { RecommendedChipForStoryBook } from './index';

const RecommendedChipTemplate = () => <RecommendedChipForStoryBook />;

export const RecommendedChip = RecommendedChipTemplate.bind({});

export default {
  title: 'Components/CssOnly/RecommendedChip',
  component: RecommendedChipForStoryBook,
};
