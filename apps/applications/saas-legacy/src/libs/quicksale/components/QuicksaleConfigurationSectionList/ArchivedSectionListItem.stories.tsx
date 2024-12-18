import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TFunction } from 'i18next';
import ArchivedSectionListItem from './ArchivedSectionListItem.component';
import createQuicksaleSection from '../../factories/QuicksaleSection';

const actionsData = {
  onSectionRestore: action('onSectionRestore'),
};

const fakeT = (key: string, params: { count: number }) =>
  params.count > 1 ? 'items' : 'item';

export default {
  title: 'Components/Quicksale/ArchivedSectionListItem',
  component: ArchivedSectionListItem,
  argTypes: {
    onSectionRestore: actionsData.onSectionRestore,
  },
  args: {
    section: createQuicksaleSection(),
    t: fakeT as TFunction,
    dividerAbove: false,
  },
} as ComponentMeta<typeof ArchivedSectionListItem>;

const ArchivedSectionListItemTemplate: ComponentStory<
  typeof ArchivedSectionListItem
> = (args) => <ArchivedSectionListItem {...args} />;

export const ArchivedSectionListItemDefault =
  ArchivedSectionListItemTemplate.bind({});
