import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ThemePersonalizeForm from '../../ThemePersonalizeForm.component';
import themeFactory from '../../../factories';

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
};

const fakeTheme = themeFactory.companyTheme.create();

export default {
  title: 'library/Theme/Theme Personalize Form',
  component: ThemePersonalizeForm,
  argTypes: {
    onSubmit: actionsData.onSubmit,
  },
  args: {
    theme: fakeTheme,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '50%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof ThemePersonalizeForm>;

const ThemePersonalizeFormTemplate: ComponentStory<
  typeof ThemePersonalizeForm
> = (args) => <ThemePersonalizeForm {...args} />;

export const EmptyForm = ThemePersonalizeFormTemplate.bind({});
