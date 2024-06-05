import React, { useState, useRef } from 'react';
import { compose } from 'recompose';
import { DateTime } from 'luxon';
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
import { DateFilterRangeEnum } from '#src/libs/datatype-filtering/types';
import {
  AlertError,
  DateField,
  defaultHandleSubmit,
  // @ts-expect-error
} from '#src/components/forms';

const RAPID_SELECTIONS = [
  {
    timePeriod: 'week',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ days: 7 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'month',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ months: 1 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'trimester',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ months: 3 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'year',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now()
        .minus({ years: 1 })
        .startOf('day')
        .toUnixInteger(),
      dateEnd: DateTime.now().endOf('day').toUnixInteger(),
    }),
  },
  {
    timePeriod: 'next_week',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ days: 7 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_month',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ months: 1 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_trimester',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ months: 3 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
  {
    timePeriod: 'next_year',
    getStartEndTimestamps: () => ({
      dateStart: DateTime.now().startOf('day').toUnixInteger(),
      dateEnd: DateTime.now().plus({ years: 1 }).endOf('day').toUnixInteger(),
    }),
    futureOnly: true,
  },
];

const getStartEndDates: (
  timePeriod: DateFilterRangeEnum,
  date_start?: number,
  date_end?: number,
) => {
  dateStart: DateTime;
  dateEnd: DateTime;
  timePeriod: DateFilterRangeEnum;
} = (timePeriod, date_start, date_end) => {
  const matchingRapidSelection = RAPID_SELECTIONS.find(
    (selection) => selection.timePeriod === timePeriod,
  );
  if (matchingRapidSelection) {
    const timestamps = matchingRapidSelection.getStartEndTimestamps();
    return {
      dateStart: DateTime.fromSeconds(timestamps.dateStart),
      dateEnd: DateTime.fromSeconds(timestamps.dateEnd),
      timePeriod,
    };
  }
  return {
    dateStart: date_start ? DateTime.fromSeconds(date_start) : DateTime.now(),
    dateEnd: date_end ? DateTime.fromSeconds(date_end) : DateTime.now(),
    timePeriod,
  };
};

export type Props = {
  date_start: number;
  date_end: number;
  isDisabled?: boolean;
  futureOnly?: boolean;
  timePeriod: DateFilterRangeEnum;
  // eslint-disable-next-line react/no-unused-prop-types
  isEndDateBeforeCurrentDate?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (values: Values) => void;
};

export type Values = {
  dateStart: DateTime;
  dateEnd: DateTime;
  timePeriod: DateFilterRangeEnum;
  isEndDateBeforeCurrentDate: boolean;
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

        return dateStart <= dateEnd;
      },
    )
    .test(
      'is-end-before-current',
      'errors.endBeforeCurrent',
      function checkIsEndDateBeforeCurrentDate(dateEnd) {
        const { isEndDateBeforeCurrentDate } = this.parent;

        if (isEndDateBeforeCurrentDate) {
          // @ts-expect-error
          return dateEnd <= DateTime.now().endOf('day');
        }
        return true;
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
      setFieldValue('dateEnd', DateTime.fromSeconds(dateEnd), false);
      // setTimeout to push the action at the end of the js loop and have the dateEnd selected
      setTimeout(() => {
        // Only check after all variable are set
        setFieldValue('dateStart', DateTime.fromSeconds(dateStart), true);
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
        <Typography color="textSecondary" display="inline">
          {t('header.fromInDateContext')}
        </Typography>
        <Typography display="inline">
          {values.dateStart.toFormat('D')}
        </Typography>
        <Typography color="textSecondary" display="inline">
          {t('header.toInDateContext')}
        </Typography>
        <Typography display="inline">{values.dateEnd.toFormat('D')}</Typography>
      </>
    );
  };

  const handleResetTimePeriod = () => {
    setFieldValue('timePeriod', 'custom');
  };

  const onSubmit = () => {
    // @ts-expect-error
    handleSubmit(values);
    setIsOpen(false);
  };

  return (
    <Form>
      {/* @ts-expect-error */}
      <ButtonBase
        ref={menuRef}
        className={classes.container}
        onClick={handleOpen}
      >
        <CalendarTodayIcon className={classes.icon} color="disabled" />
        {getDisplayDate()}
      </ButtonBase>
      <Popover
        anchorEl={menuRef?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleClose}
        open={isOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper>
          <div className={classes.menu}>
            <Typography className={classes.row} color="textSecondary">
              {t('header.selectDateRange')}
            </Typography>
            <div className={classes.row}>
              <div>
                <DateField
                  label={t('header.start')}
                  name="dateStart"
                  onChange={handleResetTimePeriod}
                />
                <AlertError name="dateStart" />
              </div>
              <div>
                <DateField
                  outsideErrorDisplay
                  label={t('header.end')}
                  name="dateEnd"
                  onChange={handleResetTimePeriod}
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
                  key={selection.timePeriod}
                  className={classes.button}
                  // @ts-expect-error
                  onClick={handleSelection(selection)}
                >
                  <Typography>
                    {t(`header.helper.${selection.timePeriod}`)}
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    {t('header.fromToInDateContext', {
                      to: DateTime.fromSeconds(
                        selection.getStartEndTimestamps().dateEnd,
                      ).toFormat('D'),
                      from: DateTime.fromSeconds(
                        selection.getStartEndTimestamps().dateStart,
                      ).toFormat('D'),
                    })}
                  </Typography>
                </ButtonBase>
              ))}
            </div>
            <Button
              className={classes.submit}
              color="primary"
              disabled={!isValid}
              onClick={onSubmit}
              variant="contained"
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
  withFormik<Props, Values>({
    mapPropsToValues: ({
      date_start,
      date_end,
      timePeriod,
      isEndDateBeforeCurrentDate,
    }) => {
      const { dateStart, dateEnd } = getStartEndDates(
        timePeriod,
        date_start,
        date_end,
      );
      return {
        dateStart,
        dateEnd,
        timePeriod,
        isEndDateBeforeCurrentDate,
      };
    },
    validationSchema: DateRangeSelectorSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(DateRangeSelector);
