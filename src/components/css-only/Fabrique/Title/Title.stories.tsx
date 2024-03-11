import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { TitleStorybook } from './Title.component';
import { TitleSize } from './constants';

const TitleStorybookTemplate: ComponentStory<typeof TitleStorybook> = (
  args: React.ComponentProps<typeof TitleStorybook>,
) => <TitleStorybook title="Title" subtitle="Subtitle" {...args} />;

const collapsableArgs = {
  isCollapsable: true,
  childrenCollapsable: 'Content',
};

TitleStorybook.displayName = 'Title';

export const Lg = TitleStorybookTemplate.bind({});
Lg.args = {
  variant: TitleSize.LG,
};

export const Md = TitleStorybookTemplate.bind({});
Md.args = {
  variant: TitleSize.MD,
};

export const Sm = TitleStorybookTemplate.bind({});
Sm.args = {
  variant: TitleSize.SM,
};

export const Xs = TitleStorybookTemplate.bind({});
Xs.args = {
  variant: TitleSize.XS,
};

export const CollapsableLg = TitleStorybookTemplate.bind({});
CollapsableLg.args = {
  ...collapsableArgs,
  variant: TitleSize.LG,
};

export const CollapsableMd = TitleStorybookTemplate.bind({});
CollapsableMd.args = {
  ...collapsableArgs,
  variant: TitleSize.MD,
};

export const CollapsableSm = TitleStorybookTemplate.bind({});
CollapsableSm.args = {
  ...collapsableArgs,
  variant: TitleSize.SM,
};

export const CollapsableXs = TitleStorybookTemplate.bind({});
CollapsableXs.args = {
  ...collapsableArgs,
  variant: TitleSize.XS,
};

const componentMeta: ComponentMeta<typeof TitleStorybook> = {
  title: 'Fabrique/Title/Stories',
  component: TitleStorybook,
  argTypes: {
    title: {
      description: 'The title to be displayed.',
      control: 'text',
    },
    subtitle: {
      description: 'The subtitle to be displayed.',
      control: 'text',
    },
    childrenCollapsable: {
      description: 'The content to be displayed in the collapsable.',
      control: 'text',
    },
    isCollapsable: {
      description: 'If `true`, the title div will be collapsable.',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    variant: {
      description: 'The variant of the title.',
      control: { type: 'inline-radio' },
      options: [TitleSize.LG, TitleSize.MD, TitleSize.SM, TitleSize.XS],
      defaultValue: TitleSize.LG,
    },
  },
};

export default componentMeta;
