import React, { useState, useRef } from 'react';
import { compose } from 'recompose';
import moment, { Moment } from 'moment-timezone';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {
  Button,
  ButtonBase,
  makeStyles,
  Paper,
  Popover,
  Theme,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { DateFilterRangeEnum } from '#libs/datatype-filtering/types';

import { AlertError, DateField, defaultHandleSubmit } from '#components/forms';

const RAPID_SELECTIONS = [
  {
    timePeriod: 'week',
    getStartEndTimestamps: () => ({
      dateStart: moment().subtract(1, 'week').startOf('day').unix(),
      dateEnd: moment().endOf('day').unix(),
    }),
  },
  {
    timePeriod: 'month',
    getStartEndTimestamps: () => ({
      dateStart: moment().subtract(1, 'months').startOf('day').unix(),
      dateEnd: moment().endOf('day').unix(),
    }),
  },
  {
    timePeriod: 'trimester',
    getStartEndTimestamps: () => ({
      dateStart: moment().subtract(3, 'months').startOf('day').unix(),
      dateEnd: moment().endOf('day').unix(),
    }),
  },
  {
    timePeriod: 'year',
    getStartEndTimestamps: () => ({
      dateStart: moment().subtract(1, 'year').startOf('day').unix(),
      dateEnd: moment().endOf('day').unix(),
    }),
  },
  {
    timePeriod: 'next_week',
    getStartEndTimestamps: () => ({
      dateStart: moment().startOf('day').unix(),
      dateEnd: moment().add(1, 'week').endOf('day').unix(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_month',
    getStartEndTimestamps: () => ({
      dateStart: moment().startOf('day').unix(),
      dateEnd: moment().add(1, 'month').endOf('day').unix(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_trimester',
    getStartEndTimestamps: () => ({
      dateStart: moment().startOf('day').unix(),
      dateEnd: moment().add(3, 'month').endOf('day').unix(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_year',
    getStartEndTimestamps: () => ({
      dateStart: moment().startOf('day').unix(),
      dateEnd: moment().add(1, 'year').endOf('day').unix(),
    }),
    futureOnly: true,
  },
];

const getStartEndDates: (
  timePeriod: DateFilterRangeEnum,
  date_start: number,
  date_end: number,
) => { dateStart: Moment; dateEnd: Moment; timePeriod: DateFilterRangeEnum } = (
  timePeriod,
  date_start,
  date_end,
) => {
  const matchingRapidSelection = RAPID_SELECTIONS.find(
    (selection) => selection.timePeriod === timePeriod,
  );
  if (matchingRapidSelection) {
    const timestamps = matchingRapidSelection.getStartEndTimestamps();
    return {
      dateStart: moment.unix(timestamps.dateStart),
      dateEnd: moment.unix(timestamps.dateEnd),
      timePeriod,
    };
  }
  return {
    dateStart: moment.unix(date_start),
    dateEnd: moment.unix(date_end),
    timePeriod,
  };
};

export type Props = {
  date_start: number;
  date_end: number;
  isDisabled?: boolean;
  futureOnly?: boolean;
  timePeriod: DateFilterRangeEnum;
  onSubmit: (values: Values) => void;
};

type Values = {
  dateStart: Moment;
  dateEnd: Moment;
  timePeriod: DateFilterRangeEnum;
};

const DateRangeSelectorSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;

        return moment(dateStart).isSameOrBefore(dateEnd);
      },
    ),
  timePeriod: Yup.string(),
});

export const TIME_PERIODS_RANGE = ['week', 'month', 'trimester', 'year'];

const DateRangeSelector: React.FC<Props & FormikProps<Values>> = ({
  values,
  isValid,
  date_start,
  date_end,
  timePeriod,
  isDisabled = false,
  futureOnly = false,
  setFieldValue,
  handleSubmit,
}) => {
  const classes = useStyles();

  const { t } = useTranslation(['reporting']);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setFieldValue('timePeriod', timePeriod);
    const { dateStart, dateEnd } = getStartEndDates(
      timePeriod,
      date_start,
      date_end,
    );
    setFieldValue('dateStart', dateStart);
    setFieldValue('dateEnd', dateEnd);
  };

  const handleOpen = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  const handleSelection =
    (selection: {
      timePeriod: DateFilterRangeEnum;
      getStartEndTimestamps: () => { dateStart: number; dateEnd: number };
    }) =>
    () => {
      setFieldValue('timePeriod', selection.timePeriod, false);
      const { dateStart, dateEnd } = selection.getStartEndTimestamps();
      // Not sure about this one: startOf('day') or endOf('day') ?
      setFieldValue('dateEnd', moment.unix(dateEnd), false);
      // setTimeout to push the action at the end of the js loop and have the dateEnd selected
      setTimeout(() => {
        // Only check after all variable are set
        setFieldValue('dateStart', moment.unix(dateStart), true);
      }, 0);
    };

  const getDisplayDate = () => {
    const selection = RAPID_SELECTIONS.find(
      (s) => s.timePeriod === values.timePeriod,
    );

    if (selection)
      return (
        <Typography display="inline">
          {' '}
          {t(`header.helper.${selection.timePeriod}`)}
        </Typography>
      );

    return (
      <>
        <Typography display="inline" color="textSecondary">
          {t('header.from')}
        </Typography>
        <Typography display="inline">{values.dateStart.format('L')}</Typography>
        <Typography display="inline" color="textSecondary">
          {t('header.to')}
        </Typography>
        <Typography display="inline">{values.dateEnd.format('L')}</Typography>
      </>
    );
  };

  const handleResetTimePeriod = () => {
    setFieldValue('timePeriod', 'custom');
  };

  const onSubmit = () => {
    handleSubmit(values);
    setIsOpen(false);
  };

  return (
    <Form>
      <ButtonBase
        ref={menuRef}
        onClick={handleOpen}
        className={classes.container}
      >
        <CalendarTodayIcon color="disabled" className={classes.icon} />
        {getDisplayDate()}
      </ButtonBase>

      <Popover
        open={isOpen}
        anchorEl={menuRef?.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper>
          <div className={classes.menu}>
            <Typography className={classes.row} color="textSecondary">
              {t('header.selectRange')}
            </Typography>
            <div className={classes.row}>
              <div>
                <DateField
                  onChange={handleResetTimePeriod}
                  name="dateStart"
                  label={t('header.start')}
                />
                <AlertError name="dateStart" />
              </div>
              <div>
                <DateField
                  onChange={handleResetTimePeriod}
                  name="dateEnd"
                  outsideErrorDisplay
                  label={t('header.end')}
                />
                <AlertError name="dateEnd" />
              </div>
            </div>
            <div className={classes.rapidSelection}>
              <Typography color="textSecondary">
                {t('header.rapidChoice')}
              </Typography>
              {RAPID_SELECTIONS.filter((selection) =>
                futureOnly ? !!selection.futureOnly : !selection.futureOnly,
              ).map((selection) => (
                <ButtonBase
                  onClick={handleSelection(selection)}
                  className={classes.button}
                  key={selection.timePeriod}
                >
                  <Typography>
                    {t(`header.helper.${selection.timePeriod}`)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t('header.from_to', {
                      to: moment
                        .unix(selection.getStartEndTimestamps().dateEnd)
                        .format('L'),
                      from: moment
                        .unix(selection.getStartEndTimestamps().dateStart)
                        .format('L'),
                    })}
                  </Typography>
                </ButtonBase>
              ))}
            </div>
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmit}
              className={classes.submit}
              disabled={!isValid}
            >
              {t('header.save')}
            </Button>
          </div>
        </Paper>
      </Popover>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1) / 2,
    padding: theme.spacing(1),
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    backgroundColor: 'white',
  },
  icon: {
    marginRight: theme.spacing(1),
    height: 20,
    width: 20,
  },
  row: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  submit: {
    alignSelf: 'flex-end',
  },
  rapidSelection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
    width: '100%',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export default compose<any, Props>(
  withFormik({
    mapPropsToValues: ({ date_start, date_end, timePeriod }) => {
      const { dateStart, dateEnd } = getStartEndDates(
        timePeriod,
        date_start,
        date_end,
      );
      return { dateStart, dateEnd, timePeriod };
    },
    validationSchema: DateRangeSelectorSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(DateRangeSelector);
