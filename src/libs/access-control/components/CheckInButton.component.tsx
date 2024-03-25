import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

type Props = {
  handleCheckIn: () => void;
};

const CheckInButton: React.FC<Props> = ({ handleCheckIn }) => {
  const { t } = useTranslation('accessControl');

  return (
    <Button
      color="primary"
      onClick={handleCheckIn}
      startIcon={<MeetingRoomIcon />}
    >
      <Typography>{t('memberEntry')}</Typography>
    </Button>
  );
};

export default React.memo(CheckInButton);
