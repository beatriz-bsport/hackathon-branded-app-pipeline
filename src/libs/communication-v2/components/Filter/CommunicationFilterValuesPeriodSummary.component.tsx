// @ts-nocheck
import React from 'react';
import moment, { Moment as MomentType } from 'moment-timezone';
import { makeStyles, Theme, Chip, Typography } from '@material-ui/core';
import Close from '@material-ui/icons/Close';

type PeriodProps = {
  title: string;
  dateStart: MomentType;
  dateEnd: MomentType;
  resetDates: () => void;
};

export const CommunicationFilterValuesPeriodSummary = (props: PeriodProps) => {
  const { title, dateStart, dateEnd, resetDates } = props;
  const months = moment.months();
  const classes = useStyles();

  const dateEndBase = dateEnd ?? moment();
  const monthEnd = months[dateEndBase.month()];
  const dateEndFormat = `${dateEndBase.date()} ${monthEnd.substring(
    0,
    3,
  )}. ${dateEndBase.year()}`;

  const dateStartFormat = dateStart
    ? `${dateStart.date()} ${months[dateStart.month()].substring(0, 3)}. ${
        dateStart.year() !== dateEndBase.year() ? dateStart.year() : ''
      } - `
    : ' < '; // If no starting date, get all messages before the ending date
  const periodFormat = dateStartFormat + dateEndFormat;
  return (
    <div className={classes.container}>
      <Typography variant="body2" className={classes.title}>
        {title}
      </Typography>
      <div className={classes.valuesContainer}>
        <Chip
          clickable={false}
          label={periodFormat}
          onDelete={resetDates}
          size="small"
          className={classes.chip}
          deleteIcon={<Close className={classes.icon} />}
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
