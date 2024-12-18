import React from 'react';

import withFormik from '@bbbtech/storybook-formik';
import { ComponentMeta, ComponentStory, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CommunicationSentGroupConfigSmartlistSelectionPanel from '.';
import { SmartList } from '#src/libs/smart-list/types';
import Immutable from 'seamless-immutable';
const actionsData = { onSave: action('onSave') };

export default {
  title:
    'Library/CommunicationSentGroupConfig/General/CommunicationSentGroupConfigMemberSelectionPanel',
  component: CommunicationSentGroupConfigSmartlistSelectionPanel,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        sendToAllMembers: false,
        companiesWithSmartLists: [
          {
            companyId: 1,
            companyName: 'Company 1',
            smartListId: 1,
            toggleSend: false,
          },
          {
            companyId: 2,
            companyName: 'Company 2',
            smartListId: 2,
            toggleSend: false,
          },
        ],
      },
    },
  },
  argTypes: {
    onSave: actionsData.onSave,
  },
  args: {
    disabled: false,
    smartLists: Immutable([
      { name: 'smartList 1', id: 1, company: 1 } as SmartList,
      { name: 'smartList 2', id: 2, company: 2 } as SmartList,
    ]),
  },
} as ComponentMeta<typeof CommunicationSentGroupConfigSmartlistSelectionPanel>;

const CommunicationSentGroupConfigSmartlistSelectionPanelTemplate: ComponentStory<
  typeof CommunicationSentGroupConfigSmartlistSelectionPanel
> = (args) => <CommunicationSentGroupConfigSmartlistSelectionPanel {...args} />;

export const MemberSelectionPanel =
  CommunicationSentGroupConfigSmartlistSelectionPanelTemplate.bind({});
