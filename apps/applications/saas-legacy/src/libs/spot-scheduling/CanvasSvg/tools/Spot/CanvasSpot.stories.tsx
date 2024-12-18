import React from 'react';

import CanvasSpot, { CanvasSpotProps } from './CanvasSpot.component';

const CustomTemplate = (args: CanvasSpotProps) => {
  return (
    <svg width="1000" height="1000">
      {/* @ts-expect-error */}
      <CanvasSpot {...args} />
    </svg>
  );
};

export const Circular = CustomTemplate.bind({});

Circular.args = {
  x: 500,
  y: 500,
  index: 1,
  asset_identifier: '',
  selected: false,
  type: 'circular',
};

export default {
  title: 'Spotscheduling/Spot/Circular',
  component: CanvasSpot,
  parameters: {
    docs: {
      page: null,
    },
  },
};
