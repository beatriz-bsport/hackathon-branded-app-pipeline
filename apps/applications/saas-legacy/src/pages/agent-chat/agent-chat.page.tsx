import React, { useEffect, useState } from 'react';
import { Membership } from '#src/libs/membership/types';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
import { Convo } from './convo';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MESSAGE_ROLES, MessagePayload } from './chat-types';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { connect, type ConnectedProps } from 'react-redux';
import { RootState } from '#src/reducers';
import { fetchProfile as fetchProfileAction } from '#src/libs/consumer-space/actions';
import { fetchConversations as fetchConversationsAction } from '#src/libs/communication-v2/actions';
import { getConsumerProfile } from '#src/libs/consumer-space/selectors';
import {
  getConversationById,
  getConversationIds,
} from '#src/libs/communication-v2/selectors';
interface OwnProps {
  membership: Membership;
  queryParams?: { consumerspacecontext: ConsumerSpaceContextEnum };
}

type Props = OwnProps & ConnectedProps<typeof connector>;

export const AgentChat: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('agentChat');
  const { fetchProfile, fetchConversations, membership } = props;
  const companyId = membership?.company;

  useEffect(() => {
    fetchProfile();
    if (companyId != null) {
      fetchConversations(companyId);
    }
  }, [fetchProfile, fetchConversations, companyId]);

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
      <Convo memberProfile={props.profile} messages={messages} />
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

// data from the state will show up as a prop in the component
const mapStateToProps = (state: RootState) => ({
  profile: getConsumerProfile(state),
  conversation: getConversationById(state, getConversationIds(state)[0] ?? ''),
});

// actions will show up as props in the component, and will dispatch the action when called
const mapDispatchToProps = {
  fetchProfile: fetchProfileAction,
  fetchConversations: fetchConversationsAction,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

const AgentChatPage = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(AgentChat);

export const AgentChatWidget = compose(connector)(AgentChatPage);
