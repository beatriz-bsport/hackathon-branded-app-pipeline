import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

type Props = {
  disabled?: boolean;
  handleCheckIn: () => void;
};

const CheckInButton: React.FC<Props> = ({ disabled, handleCheckIn }) => {
  const { t } = useTranslation('accessControl');

  return (
    <Button
      color="primary"
      disabled={disabled}
      onClick={handleCheckIn}
      startIcon={<MeetingRoomIcon />}
    >
      <Typography>{t('memberEntry')}</Typography>
    </Button>
  );
};

export default React.memo(CheckInButton);
