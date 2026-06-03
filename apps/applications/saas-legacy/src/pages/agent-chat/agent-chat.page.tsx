import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Membership } from '#src/libs/membership/types';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
import { Convo } from './convo';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { connect, type ConnectedProps } from 'react-redux';
import { RootState } from '#src/reducers';
import { fetchProfile as fetchProfileAction } from '#src/libs/consumer-space/actions';
import {
  fetchConversations as fetchConversationsAction,
  createConversation as createConversationAction,
  createMessage as createMessageAction,
  fetchMessages as fetchMessagesAction,
} from '#src/libs/communication-v2/actions';
import { getConsumerProfile } from '#src/libs/consumer-space/selectors';
import {
  getConversationById as getConversationByIdSelector,
  getConversationIds as getConversationIdsSelector,
  getMessageById as getMessageByIdSelector,
  getMessageIdsByConversationId as getMessageIdsByConversationIdSelector,
  getOldestPulledMessageId as getOldestPulledMessageIdSelector,
  hasMoreOlderMessages as hasMoreOlderMessagesSelector,
  isCreatingConversation as isCreatingConversationSelector,
  isCreatingMessage as isCreatingMessageSelector,
  getNewestMessageId as getNewestMessageIdSelector,
} from '#src/libs/communication-v2/selectors';
interface OwnProps {
  membership: Membership;
  queryParams?: { consumerspacecontext: ConsumerSpaceContextEnum };
}

type Props = OwnProps & ConnectedProps<typeof connector>;

export const AgentChat: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('agentChat');
  const {
    fetchProfile,
    fetchConversations,
    fetchMessages,
    createConversation,
    createMessage,
    membership,
    profile,
    conversation,
    isCreatingConversation,
    messages,
    isCreatingMessage,
    hasMoreOlderMessages,
    oldestPulledMessageId,
    newestMessageId,
  } = props;
  const companyId = membership?.company;

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (companyId != null) {
      fetchConversations(companyId);
    }
  }, [companyId, fetchConversations]);

  const [message, setMessage] = useState<string>('');
  const convoContainerRef = useRef<HTMLDivElement>(null);

  const scrollToLastMessage = useCallback(() => {
    const lastMessageElement = document.getElementById(
      `message-${newestMessageId}`,
    );
    lastMessageElement?.scrollIntoView({ behavior: 'smooth' });
  }, [newestMessageId]);

  useEffect(() => {
    if (conversation?.uuid) {
      fetchMessages(conversation.uuid, undefined, {
        onSuccess: () => {
          scrollToLastMessage();
        },
      });
    }
  }, [conversation?.uuid, fetchMessages, scrollToLastMessage]);

  const sendMessage = (newMessage: string) => {
    if (companyId == null) {
      return;
    }

    newMessage = newMessage.trim();
    if (newMessage === '') {
      setMessage('');
      return;
    }

    if (conversation == null) {
      createConversation(
        {
          company_id: companyId,
          message_text: newMessage,
        },
        {
          onSuccess: () => {
            setMessage('');
          },
        },
      );
    } else {
      createMessage(
        conversation.uuid,
        { message_text: newMessage },
        {
          onSuccess: () => {
            setMessage('');
            scrollToLastMessage();
          },
        },
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      !isCreatingConversation &&
      !isCreatingMessage
    ) {
      event.preventDefault();
      sendMessage(message);
    }
  };

  const fetchOlderMessages = () => {
    if (
      conversation?.uuid &&
      oldestPulledMessageId &&
      convoContainerRef.current
    ) {
      const previousScrollHeight = convoContainerRef.current.scrollHeight;
      const previousScrollTop = convoContainerRef.current.scrollTop;

      fetchMessages(
        conversation.uuid,
        {
          message_id: oldestPulledMessageId,
          direction: 'older',
        },
        {
          onSuccess: () => {
            // dont jump around when older messages load, keep the scroll position relative to the previously loaded messages
            requestAnimationFrame(() => {
              if (!convoContainerRef.current) {
                return;
              }

              const nextScrollHeight = convoContainerRef.current.scrollHeight;
              convoContainerRef.current.scrollTop =
                previousScrollTop + (nextScrollHeight - previousScrollHeight);
            });
          },
        },
      );
    }
  };

  return (
    <div>
      <div
        ref={convoContainerRef}
        style={{ maxHeight: '70vh', overflowY: 'auto', marginBottom: '16px' }}
      >
        {hasMoreOlderMessages && (
          <Button onClick={fetchOlderMessages} variant="contained">
            {t('loadMoreButton')}
          </Button>
        )}
        <Convo memberProfile={profile} messages={messages} />
      </div>
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
          disabled={
            message.trim() === '' || isCreatingConversation || isCreatingMessage
          }
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
const mapStateToProps = (state: RootState) => {
  const conversationId = getConversationIdsSelector(state)[0] ?? '';
  const messageIds = getMessageIdsByConversationIdSelector(
    state,
    conversationId,
  );
  const messages = messageIds
    .map((id) => getMessageByIdSelector(state, id))
    .filter((msg): msg is NonNullable<typeof msg> => msg != null);
  return {
    profile: getConsumerProfile(state),
    // Right now, there is only one conversation per member, so we just get the first one.
    conversation: getConversationByIdSelector(state, conversationId),
    isCreatingConversation: isCreatingConversationSelector(state),
    messages,
    isCreatingMessage: isCreatingMessageSelector(state),
    oldestPulledMessageId: getOldestPulledMessageIdSelector(
      state,
      conversationId,
    ),
    hasMoreOlderMessages: conversationId
      ? hasMoreOlderMessagesSelector(state, conversationId)
      : false,
    newestMessageId: getNewestMessageIdSelector(state, conversationId),
  };
};

// actions will show up as props in the component, and will dispatch the action when called
const mapDispatchToProps = {
  fetchProfile: fetchProfileAction,
  fetchConversations: fetchConversationsAction,
  fetchMessages: fetchMessagesAction,
  createConversation: createConversationAction,
  createMessage: createMessageAction,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

const AgentChatPage = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(AgentChat);

export const AgentChatWidget = compose(connector)(AgentChatPage);
