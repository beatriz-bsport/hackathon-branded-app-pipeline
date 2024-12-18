import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TermsAndConditionsCard, {
  TermsAndConditionsCardStorybook,
} from '../ConsumerProfileCards/TermsAndConditionsCard';
import type { TermsAndConditionsCardProps } from '../types';

export default {
  title: 'ConsumerSpace/TermsAndConditionsCard',
  component: TermsAndConditionsCard,
} as ComponentMeta<typeof TermsAndConditionsCardStorybook>;

const Template: ComponentStory<typeof TermsAndConditionsCard> = (
  args: TermsAndConditionsCardProps,
) => <TermsAndConditionsCardStorybook {...args} />;

export const Default = Template.bind({});
Default.args = {
  dateJoined: '25/04/1974',
  generalTermsAndConditionsDateAccepted: '16/03/1990',
  openTermsAndConditionsDialog: () => {},
  openTermsOfUseDialog: () => {},
};
