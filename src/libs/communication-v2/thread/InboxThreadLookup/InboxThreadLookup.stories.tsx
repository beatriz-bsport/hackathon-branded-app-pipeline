import React, { useState } from 'react';
import InboxThreadLookup, {
  Props,
} from '#libs/communication-v2/thread/InboxThreadLookup/InboxThreadLookup.component';
import { INBOX_ALL_MESSAGES } from '#libs/communication-v2/constants';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';

const CustomTemplate = (args: Props) => {
  // following label harcoded to avoid using useTranslation because of
  // this error: "Rendered more hooks than during the previous render."
  const [value, setValue] = useState({
    value: INBOX_ALL_MESSAGES,
    label: 'Tous les messages',
  });
  const [contextSelected, setContextSelected] = useState(
    ChatThreadKinds.Member,
  );
  return (
    <InboxThreadLookup
      handleFilterChange={setValue}
      filterValue={value}
      contextSelected={contextSelected}
      handleContextThreadChange={setContextSelected}
      {...args}
    />
  );
};

export const ThreadLookup = CustomTemplate.bind({});

export default {
  title: 'Library/Communication-V2/InboxThreadLookup',
  component: InboxThreadLookup,
  argTypes: {
    searchThread: { action: 'searchThread' },
    createNewThread: { action: 'createNewThread' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
