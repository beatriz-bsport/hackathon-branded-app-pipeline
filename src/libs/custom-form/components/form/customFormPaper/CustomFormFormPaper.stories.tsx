import React from 'react';
import moment from 'moment-timezone';
import Grid from '@material-ui/core/Grid';
import CustomFormPaper from './CustomFormPaper.component';
import {
  CUSTOM_FORM_FIELDS_OPTIONS,
} from '../../../utils';
import type { TagGroupAPI, Tag } from '../../../../tag/types'
import type { CustomForm } from '../../../types'

interface argTypes {
  initial: CustomForm;
  tag_groups: Array<TagGroupAPI>;
  tag: Array<Tag>;
}

const CustomTemplate = (args: argTypes) => (
  <Grid
    container
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '10px',
      paddingTop: '10px',
    }}
  >
    <Grid item xs={6}>
      <CustomFormPaper {...args} />
    </Grid>
  </Grid>
);

export const CompleteInitialState = CustomTemplate.bind({});

const fieldOptionsBuilder = () => {
  return CUSTOM_FORM_FIELDS_OPTIONS.map((option, index) => {
    return {
      id: index,
      kind: option.value,
      label: option.label,
      disabled: false,
      link_to_note: false,
      mandatory: false,
      choices: [],
      custom_form_field_tag_rule: [],
    };
  });
};


CompleteInitialState.args = {
  tag_groups: [
    {
      id: 1,
      name: 'YOGA LVL',
      tags: [
        { id: 1, name: 'Novice' },
        { id: 2, name: 'Expert' },
        { id: 3, name: 'Senior' },
      ],
    },
    {
      id: 2,
      name: 'Member origin',
      tags: [
        { id: 4, name: 'Gimlib' },
        { id: 5, name: 'ClassPass' },
        { id: 6, name: 'Familly' },
      ],
    },
  ],
  tags: [
    { id: 1, name: 'Novice' },
    { id: 2, name: 'Expert' },
    { id: 3, name: 'Senior' },
    { id: 4, name: 'Gimlib' },
    { id: 5, name: 'ClassPass' },
    { id: 6, name: 'Familly' },
  ],
  initial: {
    name: 'Custom Form StoryBook',
    id: 1,
    date_created: moment(),
    disabled: false,
    custom_form_field: [...fieldOptionsBuilder()],
  },
};


export default {
  title: 'Library/Custom-Form/Builder',
  component: CustomFormPaper,
  parameters: {
    docs: {
      page: null
    }
  },
};
