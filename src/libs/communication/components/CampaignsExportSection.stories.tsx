import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import CampaignsExportSection from './CampaignsExportSection.component';

const actionData = {
  fetchRecipientsNumberAllCampaignsIncluded: action(
    'fetchRecipientsNumberAllCampaignsIncluded',
  ),
  exportAllCampaignsBackground: action('exportAllCampaignsBackground'),
};

const Template: ComponentStory<typeof CampaignsExportSection> = (
  args: React.ComponentProps<typeof CampaignsExportSection>,
) => <CampaignsExportSection {...args} />;

export const ExportSection = Template.bind({});
ExportSection.args = {
  csvExportLink: 'fake link',
  csvExportDate: moment(faker.date.past().toString()).format('DD/MM/YYYY'),
  csvExportLoading: false,
  fetchRecipientsNumber: actionData.fetchRecipientsNumberAllCampaignsIncluded,
};

export default {
  title: 'Library/Communication/CampaignsExport/ExportSection',
  component: CampaignsExportSection,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Section component for the SmartlistDetailCampaign page. It principally contains two buttons allowing to download a report of the smartlist communications, including all campaigns of this smartlist.',
    },
  },
  argTypes: {
    csvExportLink: {
      description: 'Link of the exported report.',
    },
    csvExportDate: {
      description: 'Date the report has been exported for the last time.',
    },
    csvExportLoading: {
      description: 'Either the export is loading or not.',
    },
    exportAllCampaignsBackground: {
      description: 'Action to trigger when exporting the report.',
    },
    fetchRecipientsNumberAllCampaignsIncluded: {
      description:
        'Action to trigger when the user wants to ge,nerate the report : we first check if the number of recipients is too big for xlsx files.',
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
} as ComponentMeta<typeof CampaignsExportSection>;
