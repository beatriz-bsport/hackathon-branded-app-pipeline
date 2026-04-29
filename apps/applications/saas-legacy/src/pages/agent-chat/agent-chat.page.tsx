import React, { useState } from 'react';
import { Membership } from '#src/libs/membership/types';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
import { Convo } from './convo';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MESSAGE_ROLES, MessagePayload } from './chat-types';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';

interface Props {
  membership?: Membership;
  queryParams?: { consumerspacecontext: ConsumerSpaceContextEnum };
}

export const AgentChat: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation('agentChat');

  const [messages, setMessages] = useState<MessagePayload[]>([
    {
      role: MESSAGE_ROLES.AGENT,
      message: 'Hello! How can I assist you today?',
    },
    {
      role: MESSAGE_ROLES.MEMBER,
      message: 'Hi! I have a question about my account.',
    },
    {
      role: MESSAGE_ROLES.STUDIO_MANAGER,
      message:
        "Sure, I'd be happy to help with that. What seems to be the issue?",
    },
  ]);
  const [message, setMessage] = useState<string>('');

  const sendMessage = (newMessage: string) => {
    newMessage = newMessage.trim();
    if (newMessage === '') {
      setMessage('');
      return;
    }
    addMessage({ role: MESSAGE_ROLES.MEMBER, message: newMessage });
    setMessage('');
  };

  const addMessage = (newMessage: MessagePayload) => {
    setMessages((prevMessages) => {
      const allMessages = [...prevMessages, newMessage];
      return allMessages;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      sendMessage(message);
    }
  };

  return (
    <div>
      <Convo messages={messages} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <TextField
          multiline
          inputProps={{ 'aria-label': t('messageInputAriaLabel') }}
          onChange={(e) => {
            setMessage((e.target as HTMLTextAreaElement).value);
          }}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
          value={message}
          variant="outlined"
        />
        <Button
          color="primary"
          disabled={message.trim() === ''}
          onClick={() => {
            sendMessage(message);
          }}
          variant="contained"
        >
          {t('sendButton')}
        </Button>
      </div>
    </div>
  );
};

export const AgentChatWithCss = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(AgentChat);
