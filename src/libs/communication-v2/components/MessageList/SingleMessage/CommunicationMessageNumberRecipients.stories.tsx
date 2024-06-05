import React from 'react';

import CommunicationMessageNumberRecipients, {
  Props,
} from './CommunicationMessageNumberRecipients.component';
import MembersFactory from '#src/libs/member/factories/Member';

const CustomTemplate = (args: Props) => (
  <CommunicationMessageNumberRecipients {...args} />
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
  title: 'Library/Communication-V2/MessageNumberRecipients',
  component: CommunicationMessageNumberRecipients,
  parameters: {
    docs: {
      page: null,
    },
  },
};
