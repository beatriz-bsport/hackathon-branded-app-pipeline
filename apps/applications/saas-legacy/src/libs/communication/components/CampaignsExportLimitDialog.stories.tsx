import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { fakerEN as faker } from '@faker-js/faker';

import CampaignsExportLimitDialog from './CampaignsExportLimitDialog.component';

const actionData = {
  onClose: action('onClose'),
  generateAnyway: action('generateAnyway'),
};

const Template: ComponentStory<typeof CampaignsExportLimitDialog> = (
  args: React.ComponentProps<typeof CampaignsExportLimitDialog>,
) => <CampaignsExportLimitDialog {...args} />;

export const ExportLimitDialog = Template.bind({});

ExportLimitDialog.args = {
  open: true,
  recipientsCount: faker.number.int(),
  handleClose: actionData.onClose,
  exportAllCampaignsBackground: actionData.generateAnyway,
};

export default {
  title: 'Library/Communication/CampaignsExport/ExportLimitDialog',
  component: CampaignsExportLimitDialog,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
    description: {
      component:
        'Dialog to be shown in the SmartlistDetailCampaign page when the number of recipients to export is too big for excel files. Asks the user if he wants to try to export anyway.',
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Either if the dialog is open or not.',
    },
    recipientsCount: {
      description: 'Total number of recipients in the campaign.',
    },
    handleClose: {
      description: 'Action to trigger when closing the dialog.',
    },
    exportAllCampaignsBackground: {
      description:
        'Action to trigger when the user wants to generate the report even after seeing the warning.',
    },
  },
} as ComponentMeta<typeof CampaignsExportLimitDialog>;
