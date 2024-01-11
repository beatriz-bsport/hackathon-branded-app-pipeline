import React from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';
import CadenceListItemWIP from './CadenceListItemWIP.component';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/styles';
import { listWorkflowFactory } from '../factories';
import { action } from '@storybook/addon-actions';

// displayName must be overriden for preview code to actually work on mdx document.
CadenceListItemWIP.displayName = 'AudienceListItemWIP';

const fakeCadences = listWorkflowFactory(3);

const actions = {
  onOpenCadenceDetails: action('onOpenCadenceDetails'),
  onMetricsButtonClick: action('onMetricsButtonClick'),
  onShow: action('onShow'),
  onEdit: action('onEdit'),
  onDelete: action('onDelete'),
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
  status: '1',
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
  title: 'Components/Cadences/CadenceListItemWIP',
  component: CadenceListItemWIP,
  argTypes: {
    onOpenCadenceDetails: actions.onOpenCadenceDetails,
    onMetricsButtonClick: actions.onMetricsButtonClick,
    onShow: actions.onShow,
    onEdit: actions.onEdit,
    onDelete: actions.onDelete,
    status: {
      control: {
        type: 'inline-radio',
      },
      options: ['1', '2', '3'],
      defaultValue: '1',
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
