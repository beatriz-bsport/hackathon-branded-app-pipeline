import React from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';
import CadenceListItem from './CadenceListItem.component';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/styles';
import { cadenceListFactory } from '#src/libs/sequential_marketing/factories';
import { action } from '@storybook/addon-actions';
import type { Cadence } from '../types';

// displayName must be overriden for preview code to actually work on mdx document.
CadenceListItem.displayName = 'AudienceListItem';

const fakeCadences = cadenceListFactory(3);

const actions = {
  onDelete: action('onDelete'),
  onEdit: action('onEdit'),
  onOpen: action('onOpen'),
  onRestore: action('onRestore'),
  onSelect: action('onSelect'),
};

const CadenceListItemTemplate: ComponentStory<typeof CadenceListItem> = (
  args: React.ComponentProps<typeof CadenceListItem> & {
    cadenceList: Cadence[];
  },
) => {
  const classes = useStyles();
  return (
    <List
      classes={{
        root: classes.root,
      }}
    >
      {args.cadenceList.map((cadence) => (
        <CadenceListItem
          key={cadence.id}
          cadence={cadence}
          dense={args.dense}
          sortable={args.sortable}
          archived={args.archived}
          hasInvalidPaths={args.hasInvalidPaths}
          onDelete={args.onDelete}
          onEdit={args.onEdit}
          onOpen={args.onOpen}
          onRestore={args.onRestore}
          onSelect={args.onSelect}
        />
      ))}
    </List>
  );
};

const baseArgs = {
  dense: true,
  sortable: true,
  cadenceList: fakeCadences,
};

export const CadenceListItemDefault = CadenceListItemTemplate.bind({});
CadenceListItemDefault.args = baseArgs;

export const CadenceListItemArchived = CadenceListItemTemplate.bind({});
CadenceListItemArchived.args = {
  ...baseArgs,
  archived: true,
  onRestore: actions.onRestore,
};

export default {
  title: 'Components/Cadences/LandingPage/CadenceListItem',
  component: CadenceListItem,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'List item for a workflow',
    },
    backgrounds: {
      default: 'light-grey',
      values: [
        { name: 'light-grey', value: '#f7f7f7' },
        { name: 'grey', value: '#e2e2e2' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    onOpen: actions.onOpen,
    onEdit: actions.onEdit,
    onDelete: actions.onDelete,
    onSelect: actions.onSelect,
    selected: {
      control: { type: 'boolean' },
      description: 'Specifies whether the list item is selected or not.',
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof CadenceListItem>;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
}));
