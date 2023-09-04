import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EditReferralProgramSettingsForm from './EditReferralProgramSettingsForm.component';
import { referralProgramFactory } from '#libs/referral/factories/ReferralProgram';
import { tagWithoutGroupListFactory } from '#libs/tag/factory';
import withFormik from '@bbbtech/storybook-formik';
import EditReferralProgramSettingsFormValidationSchema from './EditReferralProgramSettingsFormValidationSchema';

const referralProgram = referralProgramFactory();
const tagList = tagWithoutGroupListFactory(5);
const companyTheme = {
  company: referralProgram.company,
  is_referral_program_activated: true,
};

const initialValues = {
  id: referralProgram.id,
  name: referralProgram.name,
  is_referral_program_activated: companyTheme.is_referral_program_activated,
  minimum_basket_amount: referralProgram.minimum_basket_amount,
  maximum_referral_uses: referralProgram.maximum_referral_uses,
  amount_off_referred: referralProgram.amount_off_referred,
  percent_off_referred: referralProgram.percent_off_referred,
  referred_voucher_type: referralProgram.referred_voucher_type,
  application_time_limit_intervals:
    referralProgram.application_time_limit_intervals,
  application_time_limit_unit: referralProgram.application_time_limit_unit,
  amount_reward_referring: referralProgram.amount_reward_referring,
  redirect_link: referralProgram.redirect_link,
  tag_referred_member: referralProgram.tag_referred_member,
};

export default {
  title: 'Components/Forms/EditReferralProgramSettingsForm',
  component: EditReferralProgramSettingsForm,
  decorators: [withFormik],
  argTypes: {
    theme: {
      description: 'Company theme',
    },
    referralProgram: {
      description:
        'The current referral program of the company, used for displaying the values in the form. The first time the manager opens the page, the referral already exists : it is created with default values by the backend.',
    },
    tagList: {
      description: 'The list of the tags of the company',
    },
    onSubmit: {
      action: 'onClick',
      description: 'The function that will be called on submit of the form',
    },
  },
  parameters: {
    formik: {
      initialValues,
      onSubmit: () => {},
      validateOnChange: false,
      validationSchema: EditReferralProgramSettingsFormValidationSchema,
    },
    docs: {
      page: null,
      description: {
        component:
          "This form is the form allowing the managers to activate and edit their referral program. It's used in the 'Referral' settings page, url `/settings/referral`",
      },
    },
  },
} as ComponentMeta<typeof EditReferralProgramSettingsForm>;

const Template: ComponentStory<typeof EditReferralProgramSettingsForm> = (
  args,
) => (
  <EditReferralProgramSettingsForm
    companyTheme={companyTheme}
    referralProgram={referralProgram}
    tagList={tagList}
    {...args}
  />
);

export const EditReferralProgramForm = Template.bind({});
