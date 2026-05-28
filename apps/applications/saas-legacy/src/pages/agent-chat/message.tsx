import { Card } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Profile } from '#src/libs/consumer-space/types';
import {
  ConversationMessage,
  MESSAGE_AUTHOR_TYPES,
} from '#src/libs/communication-v2/types';

type MessageProps = {
  message: ConversationMessage;
  memberProfile?: Profile;
};

export const Message: React.FC<MessageProps> = ({
  message,
  memberProfile,
}: MessageProps) => {
  const { t } = useTranslation('agentChat');

  const isValidMember =
    message.author_type === MESSAGE_AUTHOR_TYPES.member && memberProfile;
  const participantName = isValidMember
    ? `${memberProfile.first_name} ${memberProfile.last_name} (${memberProfile.email})`
    : t(`roles.${message.author_type}`);

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary">{participantName}</Typography>
        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body2">
          {message.message_text}
        </Typography>
      </CardContent>
    </Card>
  );
};
