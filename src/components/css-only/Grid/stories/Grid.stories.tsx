// @ts-nocheck
import React from 'react';

import Grid, { Props as GridProps } from '../';
import GridItem, {
  Props as GridItemProps,
  Alignment,
  Direction,
  Justification,
} from '../GridItem';
import './stories.styles.css';
const GridTemplate = (
  args: GridProps & GridItemProps & { numberOfGridItems: number },
) => {
  return (
    <Grid>
      {Array.from(Array(args.numberOfGridItems).keys()).map((item, index) => (
        <GridItem
          key={index}
          justification={args.justification}
          alignment={args.alignment}
          direction={args.direction}
          classes={{ 'bs-storybook-item': 'bs-storybook-item' }}
        >
          <div>
            <p>GRID ITEM {item} - L1</p>
          </div>
          <div>
            <p>GRID ITEM {item} - L2</p>
          </div>
          <div>
            <p>GRID ITEM {item} - L3</p>
          </div>
        </GridItem>
      ))}
    </Grid>
  );
};

export const GridTemplateExample = GridTemplate.bind({});

export default {
  title: 'Components/CssOnly/Grid',
  component: Grid,
  subcomponents: { GridItem },
  parameters: {
    docs: {
      page: null,
    },
  },
  argTypes: {
    numberOfGridItems: {
      control: 'number',
    },
    justification: {
      control: 'select',
      options: Object.values(Justification),
    },
    alignment: {
      control: 'select',
      options: Object.values(Alignment),
    },
    direction: {
      control: 'select',
      options: Object.values(Direction),
    },
  },
};
