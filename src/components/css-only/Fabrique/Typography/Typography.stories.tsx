import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TypographyStorybook } from './Typography.component';
import { TypographyTextAlign, TypographyVariant } from './constants';
const TypographyStorybookTemplate: ComponentStory<
  typeof TypographyStorybook
> = (args) => (
  <TypographyStorybook {...args}>
    The quick brown fox jumps over the lazy dog
  </TypographyStorybook>
);

// displayName must be overriden for preview code to actually work on mdx document.

TypographyStorybook.displayName = 'Typography';

export const Displaylg = TypographyStorybookTemplate.bind({});
Displaylg.args = {
  variant: TypographyVariant.DISPLAY_LG,
};

export const Displaymd = TypographyStorybookTemplate.bind({});
Displaymd.args = {
  variant: TypographyVariant.DISPLAY_MD,
};

export const Displaysm = TypographyStorybookTemplate.bind({});
Displaysm.args = {
  variant: TypographyVariant.DISPLAY_SM,
};

export const Titlelg = TypographyStorybookTemplate.bind({});
Titlelg.args = {
  variant: TypographyVariant.TITLE_LG,
};

export const Titlemd = TypographyStorybookTemplate.bind({});
Titlemd.args = {
  variant: TypographyVariant.TITLE_MD,
};

export const Titlesm = TypographyStorybookTemplate.bind({});
Titlesm.args = {
  variant: TypographyVariant.TITLE_SM,
};

export const Bodylg = TypographyStorybookTemplate.bind({});
Bodylg.args = {
  variant: TypographyVariant.BODY_LG,
};

export const Bodymd = TypographyStorybookTemplate.bind({});
Bodymd.args = {
  variant: TypographyVariant.BODY_MD,
};

export const Bodysm = TypographyStorybookTemplate.bind({});
Bodysm.args = {
  variant: TypographyVariant.BODY_SM,
};

export const Bodyxs = TypographyStorybookTemplate.bind({});
Bodyxs.args = {
  variant: TypographyVariant.BODY_XS,
};

export const Bodytwoxs = TypographyStorybookTemplate.bind({});
Bodytwoxs.args = {
  variant: TypographyVariant.BODY_2XS,
};

// TODO : Storybook doesn't have a feature that allows to hide stories from the
// drawer. Thus, when creating stories with the purpose only to have a well-designed
// mdx document, stories are duplicates.
export default {
  title: 'Fabrique/Typography/Stories',
  component: TypographyStorybook,
  argTypes: {
    children: {
      description: 'The text to be displayed',
      control: 'text',
    },
    variant: {
      description: 'The theme typography style',
      control: { type: 'inline-radio' },
      options: [
        TypographyVariant.DISPLAY_LG,
        TypographyVariant.DISPLAY_MD,
        TypographyVariant.DISPLAY_SM,
        TypographyVariant.TITLE_LG,
        TypographyVariant.TITLE_MD,
        TypographyVariant.TITLE_SM,
        TypographyVariant.BODY_LG,
        TypographyVariant.BODY_MD,
        TypographyVariant.BODY_SM,
        TypographyVariant.BODY_XS,
        TypographyVariant.BODY_2XS,
      ],
    },
    align: {
      description: 'Css text-align property used for the typography',
      control: { type: 'inline-radio' },
      options: [
        TypographyTextAlign.INHERIT,
        TypographyTextAlign.LEFT,
        TypographyTextAlign.CENTER,
        TypographyTextAlign.RIGHT,
        TypographyTextAlign.JUSTIFY,
      ],
    },
  },
} as ComponentMeta<typeof TypographyStorybook>;
