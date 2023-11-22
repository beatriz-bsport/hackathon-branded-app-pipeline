import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceOutputCollapse, {
  CadenceOutputCollapseProps,
} from './CadenceOutputCollapse.component';
import CadenceOutput from './CadenceOutput.component';
import {
  DestinationStatus,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import {
  triggerBatchFactory,
  triggerFactory,
} from '#libs/sequential_marketing/factories';
import { smartlistBatchFactory } from '#libs/smart-list/factories';

import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

export default {
  title: 'Components/Cadences/CadenceNodes/Output/Collapse',
  component: CadenceOutputCollapse,
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
} as ComponentMeta<typeof CadenceOutputCollapse>;

const EmptyTemplate: ComponentStory<typeof CadenceOutputCollapse> = (
  args: CadenceOutputCollapseProps,
) => (
  <CadenceOutputCollapse {...args}>
    <div>Hello</div>
    <div>You</div>
  </CadenceOutputCollapse>
);

export const Empty = EmptyTemplate.bind({});
Empty.args = {
  isOpen: false,
  disabled: false,
};

type NewProps = CadenceOutputCollapseProps & {
  triggerListWin: ConnectedTrigger[];
  triggerListFail: ConnectedTrigger[];
  getSmartlist: (id: number) => SmartList;
};

const smartlists = smartlistBatchFactory(5);
const smartlistIds = smartlists.map((smartlist) => smartlist.id);
const getSmartlist = (id: number) =>
  smartlists.find((smartlist) => smartlist.id === id);

const CadenceTemplate = (args: NewProps) => (
  <CadenceOutputCollapse {...args}>
    <CadenceOutput
      status={DestinationStatus.WIN}
      triggerList={args.triggerListWin}
      getSmartlist={args.getSmartlist}
    />
    <CadenceOutput
      status={DestinationStatus.FAIL}
      triggerList={args.triggerListFail}
      getSmartlist={args.getSmartlist}
    />
  </CadenceOutputCollapse>
);

export const Simple = CadenceTemplate.bind({});
Simple.args = {
  isOpen: false,
  disabled: false,
  getSmartlist: getSmartlist,
  triggerListWin: triggerBatchFactory(1, smartlistIds),
  triggerListFail: [triggerFactory(TriggerKind.ONLY_TIMEOUT)],
};

export const MultipleTriggers = CadenceTemplate.bind({});
MultipleTriggers.args = {
  isOpen: false,
  disabled: false,
  getSmartlist: getSmartlist,
  triggerListWin: triggerBatchFactory(6, smartlistIds),
  triggerListFail: triggerBatchFactory(3, smartlistIds),
};
