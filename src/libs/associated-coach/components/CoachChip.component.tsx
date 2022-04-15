import React from 'react';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';

import { Coach } from '../types';

type Props = {
  loading: boolean;
  onDelete?: () => void;
  coach: Coach;
};

export const CoachChip: React.FC<Props> = ({ loading, onDelete, coach }) => {
  return (
    <Chip
      avatar={
        loading ? (
          <Skeleton animation="wave" variant="circle" />
        ) : (
          <Avatar alt={coach.name} src={coach.photo} />
        )
      }
      label={
        loading ? <Skeleton animation="wave" variant="text" /> : coach.name
      }
      onDelete={onDelete}
      variant="outlined"
    />
  );
};

export default CoachChip;
