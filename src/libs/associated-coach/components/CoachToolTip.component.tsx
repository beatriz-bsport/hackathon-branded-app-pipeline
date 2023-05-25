import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import type { Coach } from '#libs/associated-coach/types';

type Props = {
  coach: Coach;
};

export const CoachToolTip: React.FC<Props> = React.memo(({ coach }) => {
  const classes = useStyles();
  return (
    <>
      {coach && coach?.name && (
        <Typography display="block" className={classes.bold} variant="caption">
          {coach.name}
        </Typography>
      )}
      {coach && coach?.notes && (
        <Typography
          display="block"
          align="left"
          className={classes.italic}
          variant="caption"
        >
          {coach.notes}
        </Typography>
      )}
    </>
  );
});

type AdditionalCoachesToolTipProps = {
  coaches: Coach[];
};

export const AdditionalCoachesTooltipTitle: React.FC<AdditionalCoachesToolTipProps> =
  React.memo(({ coaches }) => {
    return (
      <>
        {coaches &&
          coaches.map((coach) => (
            <Typography display="block" variant="caption">
              {coach?.name}
            </Typography>
          ))}
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
