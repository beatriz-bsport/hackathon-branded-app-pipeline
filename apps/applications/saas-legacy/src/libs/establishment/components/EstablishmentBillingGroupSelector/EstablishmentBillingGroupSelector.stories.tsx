import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EstablishmentBillingGroupSelector, {
  type Props,
} from './EstablishmentBillingGroupSelector.component';
import { establishmentBillingGroupFactory } from '#src/libs/establishment/factory';

export default {
  title: 'Library/Establishment/EstablishmentBillingGroupSelector',
  component: EstablishmentBillingGroupSelector,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Dropdown selector for establishment billing groups.',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof EstablishmentBillingGroupSelector>;

const Template: ComponentStory<typeof EstablishmentBillingGroupSelector> = (
  args: Props,
) => <EstablishmentBillingGroupSelector {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  establishmentBillingGroups: establishmentBillingGroupFactory(10),
  selectedEstablishmentBillingGroup: null,
  isDisabled: false,
  closeMenuOnSelect: true,
  isClearable: true,
  nullCurrentValue: true,
  isLoading: false,
  selectOption: () => {},
};
