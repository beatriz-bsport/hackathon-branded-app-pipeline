import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';
import withFormik from '@bbbtech/storybook-formik';

import { NewsletterV2FieldsKind } from '#libs/marketplace/constants';
import { NewsletterFormBase } from '.';

const NewsletterFormTemplate: ComponentStory<typeof NewsletterFormBase> = (
  args,
) => <NewsletterFormBase {...args} onSubmit={() => {}} />;

export const Emptyform = NewsletterFormTemplate.bind({});

export const Customtextform = NewsletterFormTemplate.bind({});
Customtextform.args = {
  title: faker.lorem.words(3),
  showTitle: true,
  subtitle: faker.lorem.words(5),
  showSubtitle: true,
};

export const Customfieldstypeform = NewsletterFormTemplate.bind({});
Customfieldstypeform.args = {
  fieldsType: 'emailOnly',
  showSubtitle: true,
};

export default {
  title: 'Components/CssOnly/NewsletterFormV2',
  component: NewsletterFormBase,
  decorators: [withFormik],
  argTypes: {
    fieldsType: {
      description:
        'The variant aka the fields to display: Full name and email, email only etc',
      control: { type: 'inline-radio' },
      options: [
        NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL,
        NewsletterV2FieldsKind.FIRST_NAME_AND_EMAIL,
        NewsletterV2FieldsKind.EMAIL_ONLY,
      ],
    },
    title: {
      description:
        'The custom title text, displayed if `showTitle` is set to `true`',
      control: { type: 'text' },
    },
    showTitle: {
      description:
        'If `true`, displays the title. If no custom text provided, a default one is provided as fallback.',
      control: { type: 'boolean' },
    },
    subtitle: {
      description:
        'The custom subtitle text, displayed if `showSubtitle` is set to `true`',
      control: { type: 'text' },
    },
    showSubtitle: {
      description:
        'If `true`, displays the subtitle. If no custom text provided, a default one is provided as fallback.',
      control: { type: 'boolean' },
    },
    onSubmit: {
      description:
        'The action to perform once the form is submitted. The field values from formik are passed into the handler.',
    },
  },
} as ComponentMeta<typeof NewsletterFormBase>;
