import React from 'react';

import CommunicationFeedNumberRecipients, {
  Props,
} from './CommunicationFeedNumberRecipients.component';
import MembersFactory from '../../member/factories/Member';

const CustomTemplate = (args: Props) => (
  <CommunicationFeedNumberRecipients {...args} />
);

export const NoPictureToDisplay = CustomTemplate.bind({});

NoPictureToDisplay.args = {
  members: [],
};

export const OnePictureToDisplay = CustomTemplate.bind({});

OnePictureToDisplay.args = {
  members: MembersFactory(1),
  numberRecipients: 1,
};

export const FourPicturesToDIsplay = CustomTemplate.bind({});

FourPicturesToDIsplay.args = {
  members: MembersFactory(10),
  numberRecipients: 15,
};

export const LessThanFourPicturesToDisplay = CustomTemplate.bind({});

LessThanFourPicturesToDisplay.args = {
  members: MembersFactory(2),
  numberRecipients: 2,
};

export const CompactMode = CustomTemplate.bind({});

CompactMode.args = {
  members: MembersFactory(10),
  numberRecipients: 10,
  compactText: true,
  compactAvatars: true,
};

export default {
  title: 'Library/Communication-V2/FeedNumberRecipients',
  component: CommunicationFeedNumberRecipients,
  parameters: {
    docs: {
      page: null,
    },
  },
};
