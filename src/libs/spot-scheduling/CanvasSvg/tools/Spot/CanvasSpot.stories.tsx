import React from 'react';

import CanvasSpot from './CanvasSpot.component';

const CustomTemplate = (args) => {
  <svg width="1000" height="1000">
    <CanvasSpot {...args} />
  </svg>;
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
