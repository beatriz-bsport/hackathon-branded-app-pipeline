// @flow
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';

export const CoachChip = (props: Props) => {
  return (
    <Chip
      avatar={
        props.loading ? (
          <Skeleton animation="wave" variant="circle" />
        ) : (
          <Avatar alt={props.coach.name} src={props.coach.photo} />
        )
      }
      label={
        props.loading ? (
          <Skeleton animation="wave" variant="text" />
        ) : (
          props.coach.name
        )
      }
      onDelete={props.onDelete}
      variant="outlined"
    />
  );
};

export default CoachChip;
