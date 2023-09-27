import React from 'react';

import CardContent, { Props } from '../CardContent';

import './stories.styles.css';

const CardContentTemplate = (args: Props) => (
  <div className="container">
    <CardContent {...args} classes={{ 'bs-card-content': 'bs-card-content' }}>
      <div className="bs-card-content__children">
        <div className="bs-card-content__child">Child 1</div>
        <div className="bs-card-content__child">Child 2</div>
        <div className="bs-card-content__child">Child 3</div>
      </div>
    </CardContent>
  </div>
);

export const CardContentTemplateExample = CardContentTemplate.bind({});

export default {
  title: 'Components/CssOnly/CardContent',
  component: CardContent,
  parameters: {
    docs: {
      page: null,
    },
  },
};
