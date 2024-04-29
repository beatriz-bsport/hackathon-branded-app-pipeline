import React from 'react';
import Tooltip, { TooltipStorybook } from './Tooltip.component';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HorizontalEnum, VerticalEnum } from '#Fabrique/constants';
import { ButtonBaseStorybook } from '#Fabrique/ButtonBaseV2';
import Typography from '#Fabrique/Typography';
import { colorEnum, placementEnum } from './constants';
import { MuiThemeToCssVarsHOC } from '#hocs/marketplace-css.hoc';
TooltipStorybook.displayName = 'Tooltip';

export default {
  title: 'Fabrique/Tooltip/Stories',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: {
      description: 'Text in the tooltip.',
      defaultValue: 'Placeholder text',
      control: { type: 'text' },
    },
    anchorOriginHorizontal: {
      description:
        'Refers to the x coordinate on the anchor where the menu will attach to.',
      control: { type: 'inline-radio' },
      options: [
        HorizontalEnum.CENTER,
        HorizontalEnum.LEFT,
        HorizontalEnum.RIGHT,
      ],
    },
    anchorOriginVertical: {
      description:
        'Refers to the y coordinate on the anchor where the menu will attach to.',
      control: { type: 'inline-radio' },
      options: [VerticalEnum.CENTER, VerticalEnum.BOTTOM, VerticalEnum.TOP],
    },
    color: {
      description: 'The color of the tooltip.',
      control: { type: 'inline-radio' },
      options: [colorEnum.WEAK, colorEnum.STRONG],
    },
    placement: {
      description: 'Simple positioning for the tooltip.',
      control: { type: 'radio' },
      options: [
        placementEnum.TOP,
        placementEnum.TOP_LEFT,
        placementEnum.TOP_RIGHT,
        placementEnum.BOTTOM,
        placementEnum.BOTTOM_LEFT,
        placementEnum.BOTTOM_RIGHT,
        placementEnum.LEFT,
        placementEnum.RIGHT,
      ],
    },
    transformOriginHorizontal: {
      description:
        "Refers to the x coordinate of the menu that will attach to the anchor's origin.",
      control: { type: 'inline-radio' },
      options: [
        HorizontalEnum.CENTER,
        HorizontalEnum.LEFT,
        HorizontalEnum.RIGHT,
      ],
    },
    transformOriginVertical: {
      description:
        "Refers to the y coordinate of the menu that will attach to the anchor's origin.",
      control: { type: 'inline-radio' },
      options: [VerticalEnum.CENTER, VerticalEnum.TOP, VerticalEnum.BOTTOM],
    },
    id: {
      defaultValue: 'tooltip',
      description: 'The id of the tooltip.',
    },
    children: {
      description: 'The targeted element.',
    },
    classes: {
      description: 'Override or extend the styles applied to the children.',
    },
    className: {
      description: 'Override or extend the styles applied to the tooltip',
    },
    wrapperId: {
      description:
        'The id used to identify the div element wrapping the tooltip.',
    },
    targetElementId: {
      description:
        'The id used to identify the DOM element where the tooltip will be rendered.',
    },
    wrapperClass: {
      description:
        'An optional string to set the class of the div element wrapping the tooltip.',
    },
  },
  decorators: [
    (Story) => (
      <MuiThemeToCssVarsHOC>
        <div
          style={{ margin: '10em', display: 'flex', justifyContent: 'center' }}
        >
          {Story()}
        </div>
      </MuiThemeToCssVarsHOC>
    ),
  ],
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (
  args: React.ComponentProps<typeof Tooltip>,
) => (
  <TooltipStorybook {...args}>
    <ButtonBaseStorybook
      aria-haspopup="true"
      style={{ border: '2px solid black', padding: '16px' }}
    >
      <Typography variant="body-lg">Hover to show Tooltip</Typography>
    </ButtonBaseStorybook>
  </TooltipStorybook>
);

export const Defaultcolor = Template.bind({});
Defaultcolor.args = {};

export const Strongcolor = Template.bind({});
Strongcolor.args = {
  ...Defaultcolor.args,
  color: colorEnum.STRONG,
  text: 'Strong color',
};

export const Topleft = Template.bind({});
Topleft.args = {
  text: 'Top left',
  anchorOriginHorizontal: HorizontalEnum.LEFT,
  anchorOriginVertical: VerticalEnum.TOP,
  transformOriginHorizontal: HorizontalEnum.RIGHT,
  transformOriginVertical: VerticalEnum.BOTTOM,
};

export const Topright = Template.bind({});
Topright.args = {
  text: 'Top right',
  anchorOriginHorizontal: HorizontalEnum.RIGHT,
  anchorOriginVertical: VerticalEnum.TOP,
  transformOriginHorizontal: HorizontalEnum.LEFT,
  transformOriginVertical: VerticalEnum.BOTTOM,
};

export const Bottomleft = Template.bind({});
Bottomleft.args = {
  text: 'Bottom left',
  anchorOriginHorizontal: HorizontalEnum.LEFT,
  anchorOriginVertical: VerticalEnum.BOTTOM,
  transformOriginHorizontal: HorizontalEnum.RIGHT,
  transformOriginVertical: VerticalEnum.TOP,
};

export const Bottomright = Template.bind({});
Bottomright.args = {
  text: 'Bottom right',
  anchorOriginHorizontal: HorizontalEnum.RIGHT,
  anchorOriginVertical: VerticalEnum.BOTTOM,
  transformOriginHorizontal: HorizontalEnum.LEFT,
  transformOriginVertical: VerticalEnum.TOP,
};
