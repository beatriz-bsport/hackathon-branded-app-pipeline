import React from 'react';
import { DateTime, Info } from 'luxon';
import { makeStyles, Theme, Chip, Typography } from '@material-ui/core';
import Close from '@material-ui/icons/Close';

type PeriodProps = {
  title: string;
  dateStart: DateTime;
  dateEnd: DateTime;
  resetDates: () => void;
};

export const CommunicationFilterValuesPeriodSummary = (props: PeriodProps) => {
  const { title, dateStart, dateEnd, resetDates } = props;
  const months = Info.months();
  const classes = useStyles();

  const dateEndBase = dateEnd ?? DateTime.now();
  const monthEnd = months[dateEndBase.month - 1];
  const dateEndFormat = `${dateEndBase.day} ${monthEnd.substring(0, 3)}. ${
    dateEndBase.year
  }`;

  const dateStartFormat = dateStart
    ? `${dateStart.day} ${months[dateStart.month - 1].substring(0, 3)}. ${
        dateStart.year !== dateEndBase.year ? dateStart.year : ''
      } - `
    : ' < '; // If no starting date, get all messages before the ending date
  const periodFormat = dateStartFormat + dateEndFormat;
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="body2">
        {title}
      </Typography>
      <div className={classes.valuesContainer}>
        <Chip
          className={classes.chip}
          clickable={false}
          deleteIcon={<Close className={classes.icon} />}
          label={periodFormat}
          onDelete={resetDates}
          size="small"
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    borderRadius: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
  },
  container: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  icon: {
    color: theme.palette.text.primary,
  },
  title: {
    color: theme.palette.text.disabled,
  },
  valuesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

export default CommunicationFilterValuesPeriodSummary;
