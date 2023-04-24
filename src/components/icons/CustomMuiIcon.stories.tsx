// @ts-nocheck
import React from 'react';
import EmailIcon from '@material-ui/icons/Email';
import AccessibleIcon from '@material-ui/icons/Accessible';

import CustomMuiIcon, { Props } from './CustomMuiIcon.component';

export const CustomTemplate = (args: Props) => (
  <CustomMuiIcon {...args} MuiIcon={AccessibleIcon} />
);

export const FirstStepTemplate = CustomTemplate.bind({});

FirstStepTemplate.args = {
  MuiIcon: EmailIcon,
};

export default {
  title: 'Components/Commons/icons/CustomMuiIcon',
  component: CustomMuiIcon,
  parameters: {
    docs: {
      page: null,
      inlineStories: true,
    },
  },
};
