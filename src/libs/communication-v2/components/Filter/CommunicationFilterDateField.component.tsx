import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
import { Moment as MomentType } from 'moment-timezone';
import DateInput from '#components/input/DateInput.component';

type DateProps = {
  fieldStartValue: MomentType;
  fieldStartSetter: (newDate: MomentType) => void;
  fieldEndValue: MomentType;
  fieldEndSetter: (newDate: MomentType) => void;
};

export const CommunicationFilterDateField = (props: DateProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);
  return (
    <Grid container className={classes.container} spacing={1}>
      <Grid item sm={3} xs={12}>
        <Typography className={classes.title} variant="body2">
          {t('filter.dateFilter.title')}
        </Typography>
      </Grid>
      <Grid item className={classes.datePickerContainer} sm={4} xs={12}>
        <DateInput
          clearable
          className={classes.datePicker}
          label={t('filter.dateFilter.dateStart')}
          onChange={props.fieldStartSetter}
          value={props.fieldStartValue}
        />
        <KeyboardArrowDown className={classes.arrowIcon} />
      </Grid>
      <Grid item className={classes.datePickerContainer} sm={4} xs={12}>
        <DateInput
          clearable
          className={classes.datePicker}
          label={t('filter.dateFilter.dateEnd')}
          onChange={props.fieldEndSetter}
          value={props.fieldEndValue}
        />
        <KeyboardArrowDown className={classes.arrowIcon} />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  arrowIcon: {
    marginLeft: '-25px',
    marginTop: '-5px',
    color: theme.palette.grey[400],
  },
  container: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  datePicker: {
    width: '90%',
  },
  datePickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  selector: {
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  title: {
    color: theme.palette.text.secondary,
  },
}));

export default CommunicationFilterDateField;
