import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import type { Coach } from '#src/libs/associated-coach/types';

type Props = {
  coach: Coach;
};

export const CoachToolTip: React.FC<Props> = React.memo(({ coach }) => {
  const classes = useStyles();
  return (
    <>
      {coach && coach?.name && (
        <Typography className={classes.bold} display="block" variant="caption">
          {coach.name}
        </Typography>
      )}
      {coach && coach?.notes && (
        <Typography
          align="left"
          className={classes.italic}
          display="block"
          variant="caption"
        >
          {coach.notes}
        </Typography>
      )}
    </>
  );
});

export default CoachToolTip;

const useStyles = makeStyles(() => ({
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  },
}));
