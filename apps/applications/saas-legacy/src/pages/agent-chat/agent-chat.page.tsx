import React, { useEffect, useState } from 'react';
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
} from '#src/libs/communication-v2/actions';
import { getConsumerProfile } from '#src/libs/consumer-space/selectors';
import {
  getConversationById,
  getConversationIds,
  getMessagesByConversationId,
  isCreatingConversation,
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

  const [message, setMessage] = useState<string>('');

  const sendMessage = (newMessage: string) => {
    if (companyId == null) {
      return;
    }

    newMessage = newMessage.trim();
    if (newMessage === '') {
      setMessage('');
      return;
    }

    if (props.conversation == null) {
      props.createConversation(
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
    }
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
      <Convo memberProfile={props.profile} messages={props.messages} />
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
          disabled={message.trim() === '' || props.isCreatingConversation}
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
  // Right now, there is only one conversation por member, so we just get the first one.
  conversation: getConversationById(state, getConversationIds(state)[0] ?? ''),
  isCreatingConversation: isCreatingConversation(state),
  messages: getMessagesByConversationId(
    state,
    getConversationIds(state)[0] ?? '',
  ),
});

// actions will show up as props in the component, and will dispatch the action when called
const mapDispatchToProps = {
  fetchProfile: fetchProfileAction,
  fetchConversations: fetchConversationsAction,
  createConversation: createConversationAction,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

const AgentChatPage = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(AgentChat);

export const AgentChatWidget = compose(connector)(AgentChatPage);
