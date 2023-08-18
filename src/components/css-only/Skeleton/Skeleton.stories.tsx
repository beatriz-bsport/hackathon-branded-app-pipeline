import React from 'react';

import { ComponentMeta } from '@storybook/react';

import Skeleton, { type Props, SkeletonAnimation, SkeletonVariant } from '.';
import { MuiThemeToCssVarsHOC } from '#hocs/marketplace-css.hoc';

import './styles-storybook.css';

const SkeletonAvatarTemplate = (args: Props) => (
  <MuiThemeToCssVarsHOC>
    <div className="bs-skeleton-storybook-avatar__container">
      <Skeleton variant="circle" {...args} />
      <div className="bs-skeleton-storybook-avatar__container__text">
        <Skeleton
          className="bs-skeleton-storybook__title"
          variant={SkeletonVariant.RECTANGLE}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__subtitle"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
      </div>
    </div>
  </MuiThemeToCssVarsHOC>
);

const SkeletonParagraphTemplate = (args: Props) => (
  <MuiThemeToCssVarsHOC>
    <div className="bs-skeleton-storybook__paragraphs__container">
      <div className="bs-skeleton-storybook__paragraph__container">
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
      </div>

      <div className="bs-skeleton-storybook__paragraph__container">
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
        <Skeleton
          className="bs-skeleton-storybook__paragraph__row"
          variant={SkeletonVariant.TEXT}
          {...args}
        />
      </div>
    </div>
  </MuiThemeToCssVarsHOC>
);

export const SkeletonAvatar = SkeletonAvatarTemplate.bind({});

export const SkeletonParagraph = SkeletonParagraphTemplate.bind({});

export default {
  title: 'Components/CssOnly/Skeleton',
  component: Skeleton,
  argTypes: {
    animation: {
      description: 'The animation to use when something is loading',
      defaultValue: { summary: SkeletonAnimation.PULSE },
      options: [
        SkeletonAnimation.PULSE,
        SkeletonAnimation.WAVE,
        SkeletonAnimation.NONE,
        undefined,
      ],
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof Skeleton>;
