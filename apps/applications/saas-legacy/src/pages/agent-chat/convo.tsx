import { Message } from './message';

import React from 'react';
import { MessagePayload } from './chat-types';
import { Profile } from '#src/libs/consumer-space/types';

type ConvoProps = {
  messages: MessagePayload[];
  memberProfile?: Profile;
};

export const Convo: React.FC<ConvoProps> = ({
  messages,
  memberProfile,
}: ConvoProps) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <Message memberProfile={memberProfile} message={message} />
        </div>
      ))}
    </div>
  );
};
