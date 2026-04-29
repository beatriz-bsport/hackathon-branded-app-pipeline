import { Card } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MESSAGE_ROLES, MessagePayload } from './chat-types';

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Profile } from '#src/libs/consumer-space/types';

type MessageProps = {
  message: MessagePayload;
  memberProfile?: Profile;
};

export const Message: React.FC<MessageProps> = ({
  message,
  memberProfile,
}: MessageProps) => {
  const { t } = useTranslation('agentChat');

  const isValidMember = message.role === MESSAGE_ROLES.MEMBER && memberProfile;
  const participantName = isValidMember
    ? `${memberProfile.first_name} ${memberProfile.last_name} (${memberProfile.email})`
    : t(`roles.${message.role}`);

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary">{participantName}</Typography>
        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body2">
          {message.message}
        </Typography>
      </CardContent>
    </Card>
  );
};
