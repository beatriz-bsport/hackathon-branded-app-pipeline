import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import FranchiseSubshopTemplateDialog from '.';
import { subshopFactory } from '#libs/shop/factory';
import { FranchiseSubshopTemplateDialogEnum } from './constants';

const SUBSHOP_TEMPLATE = subshopFactory({ isFranchise: true });

export default {
  title: 'Libs/Components/FranchiseSubshopTemplateDialog',
  component: FranchiseSubshopTemplateDialog,
  argTypes: {
    isOpen: {
      description: 'If set to true the dialog will be open',
      control: 'boolean',
      defaultValue: true,
    },
    dialogType: {
      description:
        'The context of the dialog. Created so we can know the behavior/content to display',
      options: [
        FranchiseSubshopTemplateDialogEnum.CREATE,
        FranchiseSubshopTemplateDialogEnum.UPDATE,
        FranchiseSubshopTemplateDialogEnum.DELETE,
      ],
      control: { type: 'select' },
    },
    selectedSubshopTemplate: {
      description: 'The associated subshop template data if any existing',
    },
    handleSubmit: {
      description: 'The action to perform once the form has been submitted',
      action: 'handleSubmit',
    },
    handleClose: {
      description: 'The action to perform once the dialog is closed',
      action: 'handleClose',
    },
  },
} as ComponentMeta<typeof FranchiseSubshopTemplateDialog>;

const Template: ComponentStory<typeof FranchiseSubshopTemplateDialog> = (
  args,
) => <FranchiseSubshopTemplateDialog {...args} />;

export const CreateSubshopTemplate = Template.bind({});
CreateSubshopTemplate.args = {
  dialogType: FranchiseSubshopTemplateDialogEnum.CREATE,
};

export const UpdateSubshopTemplate = Template.bind({});
UpdateSubshopTemplate.args = {
  dialogType: FranchiseSubshopTemplateDialogEnum.UPDATE,
  selectedSubshopTemplate: SUBSHOP_TEMPLATE,
};

export const DeleteSubshopTemplate = Template.bind({});
DeleteSubshopTemplate.args = {
  dialogType: FranchiseSubshopTemplateDialogEnum.DELETE,
  selectedSubshopTemplate: SUBSHOP_TEMPLATE,
};
