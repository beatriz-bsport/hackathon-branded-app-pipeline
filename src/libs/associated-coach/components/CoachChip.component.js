// @flow
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

export const CoachChip = (props: Props) => {
  return (
    <Chip
      avatar={<Avatar alt={props.coach.name} src={props.coach.photo} />}
      label={props.coach.name}
      onDelete={props.onDelete}
      variant="outlined"
    />
  );
};

export default CoachChip;
