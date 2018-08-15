import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import PackForm from './PackForm.component';

storiesOf('Packs/PackForm', module)
  .addDecorator(checkA11y)
  .add('default', () => {
    const activities = [
      { name: 'Activity 1', id: 1 },
      { name: 'Activity 2', id: 2 },
    ];
    const categories = [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
    ];
    return (
      <PackForm
        categories={categories}
        activities={activities}
        onSubmit={action('onSubmit')}
      />
    );
  });
