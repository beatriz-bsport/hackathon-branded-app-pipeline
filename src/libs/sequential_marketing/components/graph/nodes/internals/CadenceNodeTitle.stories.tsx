import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceNodeTitle, {
  CadenceNodeTitleProps,
} from './CadenceNodeTitle.component';
import { triggerBatchFactory } from '#libs/sequential_marketing/factories';
import { smartlistFactory } from '#libs/smart-list/factories';

export default {
  title: 'Components/Cadences/CadenceNodes/Title',
  component: CadenceNodeTitle,
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '30em' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof CadenceNodeTitle>;

const CadenceNodeTitleTemplate: ComponentStory<typeof CadenceNodeTitle> = (
  args: CadenceNodeTitleProps,
) => <CadenceNodeTitle {...args} />;

const getSmartlist = (id: number) => smartlistFactory(id);

const handleClick = () => {};

export const Minimal = CadenceNodeTitleTemplate.bind({});
Minimal.args = {
  name: 'Cadence',
  icon: 'Email',
  color: 'purple',
};

export const WithTrigger = CadenceNodeTitleTemplate.bind({});
WithTrigger.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  triggerList: triggerBatchFactory(1),
  getSmartlist: getSmartlist,
};

export const WithDelete = CadenceNodeTitleTemplate.bind({});
WithDelete.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  actions: [{ label: 'Delete', icon: 'Delete', onClick: handleClick }],
};

export const WithMultipleActions = CadenceNodeTitleTemplate.bind({});
WithMultipleActions.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  actions: [
    { label: 'Photo', icon: 'AddAPhoto', onClick: handleClick },
    { label: 'Hotel', icon: 'LocalHotel', onClick: handleClick },
  ],
};

export const WithTriggerList = CadenceNodeTitleTemplate.bind({});
WithTriggerList.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  triggerList: triggerBatchFactory(3),
  getSmartlist: getSmartlist,
};
