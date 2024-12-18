import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuicksaleConfigurationSectionList from '.';
import createQuicksaleSection from '../../factories/QuicksaleSection';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const actionsData = {
  onSectionClick: action('onSectionClick'),
  onSectionEdit: action('onSectionEdit'),
  archiveSection: action('archiveSection'),
  openColorModal: action('openColorModal'),
  addSection: action('addSection'),
};

export default {
  title: 'Components/Quicksale/QuicksaleConfigurationSectionList',
  component: QuicksaleConfigurationSectionList,
  argTypes: {
    openColorModal: actionsData.openColorModal,
    archiveSection: actionsData.archiveSection,
    onSectionClick: actionsData.onSectionClick,
    onSectionEdit: actionsData.onSectionEdit,
    addSection: actionsData.addSection,
  },
  args: {
    sectionList: createQuicksaleSection(10),
    loading: false,
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '90vh' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof QuicksaleConfigurationSectionList>;

const QuicksaleConfigurationSectionListTemplate: ComponentStory<
  typeof QuicksaleConfigurationSectionList
> = (args) => <QuicksaleConfigurationSectionList {...args} />;

export const QuicksaleConfigurationSectionListDefault =
  QuicksaleConfigurationSectionListTemplate.bind({});

export const QuicksaleConfigurationSectionListLoading =
  QuicksaleConfigurationSectionListTemplate.bind({});
QuicksaleConfigurationSectionListLoading.args = {
  loading: true,
};

export const QuicksaleConfigurationSectionListIconEditionInteractionTest =
  QuicksaleConfigurationSectionListTemplate.bind({});

QuicksaleConfigurationSectionListIconEditionInteractionTest.play = async ({
  canvasElement,
  args,
}: {
  canvasElement: HTMLElement;
  args: React.ComponentProps<typeof QuicksaleConfigurationSectionList>;
}) => {
  const canvas = within(canvasElement);

  // The popover is not in the document by default
  expect(document.getElementById('section-icon-selector')).toBeNull();

  const container = await canvas.findByTestId(
    'quicksale-section-list',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const firstSectionIcon = container.querySelector(
    `#editable-card-icon-${args.sectionList[0].section_id}`,
  );
  await userEvent.click(firstSectionIcon);

  // The popover is now in the document
  const popover = document.getElementById('section-icon-selector');
  await expect(popover).not.toBeNull();

  // Clicking on the first icon should close the popover
  const firstIcon = within(popover).getAllByRole('button')[0];
  await userEvent.click(firstIcon);

  // The popover is not in the document anymore
  await expect(
    document.getElementById('section-icon-selector'),
  ).not.toBeVisible();
};
