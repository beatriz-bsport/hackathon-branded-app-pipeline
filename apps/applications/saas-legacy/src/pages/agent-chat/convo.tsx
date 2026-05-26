import { Message } from './message';

import React from 'react';
import { Profile } from '#src/libs/consumer-space/types';
import { ConversationMessage } from '#src/libs/communication-v2/types';

type ConvoProps = {
  messages: ConversationMessage[];
  memberProfile?: Profile;
};

export const Convo: React.FC<ConvoProps> = ({
  messages,
  memberProfile,
}: ConvoProps) => {
  return (
    <div>
      {messages.map((message) => (
        <div key={message.id} style={{ marginBottom: '16px' }}>
          <Message memberProfile={memberProfile} message={message} />
        </div>
      ))}
    </div>
  );
};
