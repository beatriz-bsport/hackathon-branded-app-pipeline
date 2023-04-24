// @ts-nocheck
import React from 'react';
import SchoolIcon from '@material-ui/icons/School';
import { Badge } from '@material-ui/core';

type Props = {
  nbTutorialAlerting: number;
};

const TutorialIconWithAlertings: React.FC<Props> = (props: Props) => {
  const { nbTutorialAlerting } = props;
  return (
    <Badge badgeContent={nbTutorialAlerting || null} color="error">
      <SchoolIcon />
    </Badge>
  );
};

export default TutorialIconWithAlertings;
