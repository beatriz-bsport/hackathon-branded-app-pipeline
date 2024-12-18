import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SectionName from '.';
import { action } from '@storybook/addon-actions';
import { QuicksaleSectionColor } from '../../../constants';

const actionsData = {
  confirmNameChange: action('confirmNameChange'),
  confirmNameChangeWithEnter: action('confirmNameChangeWithEnter'),
  editName: action('editName'),
  startEditingName: action('startEditingName'),
  stopEventPropagation: action('stopEventPropagation'),
};

export default {
  title: 'Components/Quicksale/QuicksaleSectionCard/SectionName',
  component: SectionName,
  argTypes: {
    confirmNameChange: actionsData.confirmNameChange,
    confirmNameChangeWithEnter: actionsData.confirmNameChangeWithEnter,
    editName: actionsData.editName,
    startEditingName: actionsData.startEditingName,
    stopEventPropagation: actionsData.stopEventPropagation,
  },
  args: {
    admin: false,
    sectionId: 'section_id',
    sectionName: 'the name of the section',
    color: QuicksaleSectionColor.Gray,
    isEditingName: false,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '600px',
          display: 'flex',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof SectionName>;

const SectionNameTemplate: ComponentStory<typeof SectionName> = (args) => (
  <SectionName {...args} />
);

export const SectionNameDefault = SectionNameTemplate.bind({});
