import { Message } from './message';

import React from 'react';
import { MessagePayload } from './chat-types';

type ConvoProps = {
  messages: MessagePayload[];
};

export const Convo: React.FC<ConvoProps> = ({ messages }: ConvoProps) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <Message message={message} />
        </div>
      ))}
    </div>
  );
};
