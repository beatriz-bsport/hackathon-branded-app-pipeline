import React from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';
import CadenceListItemWIP from './CadenceListItemWIP.component';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/styles';
import { cadenceListFactory } from '#libs/sequential_marketing/factories';
import { action } from '@storybook/addon-actions';
import { CadenceStatus } from '../constants';

// displayName must be overriden for preview code to actually work on mdx document.
CadenceListItemWIP.displayName = 'AudienceListItemWIP';

const fakeCadences = cadenceListFactory(3);

const actions = {
  onOpenCadenceDetails: action('onOpenCadenceDetails'),
  onMetricsButtonClick: action('onMetricsButtonClick'),
  onShow: action('onShow'),
  onEdit: action('onEdit'),
  onDelete: action('onDelete'),
  onSelect: action('onSelect'),
};

const CadenceListItemWIPStorybook: ComponentStory<typeof CadenceListItemWIP> = (
  args,
) => {
  const classes = useStyles();
  return (
    <List
      classes={{
        root: classes.root,
      }}
    >
      {fakeCadences.map((cadence) => (
        <CadenceListItemWIP key={cadence.id} {...args} cadence={cadence} />
      ))}
    </List>
  );
};

const baseArgs = {
  dense: true,
  sortable: true,
  status: CadenceStatus.ACTIVE,
};

export const CadenceListItemWIPDefault = CadenceListItemWIPStorybook.bind({});
CadenceListItemWIPDefault.args = baseArgs;

export const CadenceListItemWIPArchived = CadenceListItemWIPStorybook.bind({});
CadenceListItemWIPArchived.args = {
  ...baseArgs,
  archived: true,
  onRestore: () => {},
};

export default {
  title: 'Components/Cadences/LandingPage/CadenceListItemWIP',
  component: CadenceListItemWIP,
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
    onOpenCadenceDetails: actions.onOpenCadenceDetails,
    onMetricsButtonClick: actions.onMetricsButtonClick,
    onShow: actions.onShow,
    onEdit: actions.onEdit,
    onDelete: actions.onDelete,
    onSelect: actions.onSelect,
    status: {
      control: {
        type: 'inline-radio',
      },
      options: Object.values(CadenceStatus),
      defaultValue: CadenceStatus.ACTIVE,
    },
    selected: {
      control: { type: 'boolean' },
      description: 'Specifies whether the list item is selected or not.',
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof CadenceListItemWIP>;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
}));
