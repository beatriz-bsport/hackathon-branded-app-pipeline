import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

type Props = {
  bookingId: number;
  bookingName: string;
  memberId: number;
};

const AutoCheckedInBooking: React.FC<Props> = ({
  bookingId,
  bookingName,
  memberId,
}) => {
  return (
    <Typography variant="body1">
      <Link to={`/member/${memberId}/bookings/${bookingId}/`}>
        {bookingName}
      </Link>
    </Typography>
  );
};

export default AutoCheckedInBooking;
