// @ts-nocheck
import React from 'react';
import './stories.styles.css';
import GridItem, { Props } from '../GridItem';

const GridTemplate = (args: Props) => {
  return (
    <GridItem {...args} classes={{ 'bs-storybook-item': 'bs-storybook-item' }}>
      <div>
        <p>GRID ITEM - L1</p>
      </div>
      <div>
        <p>GRID ITEM - L2</p>
      </div>
      <div>
        <p>GRID ITEM - L3</p>
      </div>
    </GridItem>
  );
};

export const GridTemplateExample = GridTemplate.bind({});

export default {
  title: 'Components/CssOnly/GridItem',
  component: GridItem,
  parameters: {
    docs: {
      page: null,
    },
  },
};
