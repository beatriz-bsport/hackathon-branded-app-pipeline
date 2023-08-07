import React from 'react';

import Card, { Props as CardProps } from '../Card.component';
import CardContent, { Props as CardContentProps } from '../CardContent';

import './stories.styles.css';

const CardTemplate = (args: CardProps) => (
  <Card {...args} classes={{ 'bs-card': 'bs-card' }} />
);

export const CardWithoutContent = CardTemplate.bind({});

const CardWithContentTemplate = (
  args: CardProps,
  contentCardArgs: CardContentProps,
) => (
  <Card {...args} classes={{ 'bs-card': 'bs-card' }}>
    <CardContent {...contentCardArgs}>
      <div className="bs-card-content__child">Child 1</div>
      <div className="bs-card-content__child">Child 2</div>
      <div className="bs-card-content__child">Child 3</div>
    </CardContent>
  </Card>
);

export const CardWithContent = CardWithContentTemplate.bind({});

export default {
  title: 'Components/CssOnly/Card',
  component: Card,
  parameters: {
    docs: {
      page: null,
    },
  },
};
