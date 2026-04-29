import { Card } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessagePayload } from './chat-types';

type MessageProps = {
  message: MessagePayload;
};
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

export const Message: React.FC<MessageProps> = ({ message }: MessageProps) => {
  const { t } = useTranslation('agentChat');
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary">
          {t(`roles.${message.role}`)}
        </Typography>
        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body2">
          {message.message}
        </Typography>
      </CardContent>
    </Card>
  );
};
