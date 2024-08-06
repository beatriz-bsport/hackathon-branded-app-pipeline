import React, { useCallback } from 'react';
import { DateTime } from 'luxon';
import { useFormikContext } from 'formik';

import makeStyles from '@material-ui/core/styles/makeStyles';

import DateRangeSelector from '#src/components/date/DateRangeSelector.component';
import DatePickerSelector from '#src/components/date/DatePickerSelector.component';
import TimeRangeSelector from '#src/components/time/TimeRangeSelector.component';
import QuickDateSelector from '#src/components/date/QuickDateSelector.component';

import type { ReportDateType } from '#src/libs/reporting/common/constants';
import type { FormikValues } from '#src/libs/reporting/v2/components/ReportDetailContent/ReportDetailContentHeader.component';
import type {
  DateFilterEnum,
  DateFilterRangeEnum,
} from '#src/libs/datatype-filtering/types';

import {
  RANGED_RAPID_SELECTIONS,
  SINGLE_RAPID_SELECTIONS,
} from '#src/components/date/constants';

type Props = {
  dateType: ReportDateType;
  dateInputDisabled: boolean;
  timeWindowFilteringEnabled: boolean;
};

const ReportDetailDateSelectors: React.FC<Props> = ({
  dateType,
  dateInputDisabled,
  timeWindowFilteringEnabled,
}) => {
  const classes = useStyles();
  const { values, setValues } = useFormikContext<FormikValues>();

  const handleRangeDatePickerSubmit = useCallback(
    (_values) => {
      setValues((prev) => ({
        ...prev,
        dateStart: _values.dateStart.toISODate(),
        dateEnd: _values.dateEnd.toISODate(),
        timePeriod: 'custom',
      }));
    },
    [setValues],
  );

  const handleSingleDatePickerSubmit = useCallback(
    (_values) => {
      setValues((prev) => ({
        ...prev,
        dateStart: (typeof _values.date === 'number'
          ? DateTime.fromSeconds(_values.date)
          : _values.date
        ).toISODate(),
        timePeriod: 'custom',
      }));
    },
    [setValues],
  );

  const handleTimeSelectorSubmit = useCallback(
    (_values) => {
      setValues((prev) => ({
        ...prev,
        timeStart: _values.timeStart,
        timeEnd: _values.timeEnd,
        timeWindowPeriod: _values.timeWindowPeriod,
      }));
    },
    [setValues],
  );

  const handleQuickRangeDateSelectorChange = useCallback(
    (timePeriod: string) => {
      const periodSelected = RANGED_RAPID_SELECTIONS.find(
        (selection) => selection.timePeriod === timePeriod,
      );
      if (periodSelected) {
        const { dateStart, dateEnd } = periodSelected.getStartEndTimestamps();
        setValues((prev) => ({
          ...prev,
          dateStart: DateTime.fromSeconds(dateStart).toISODate(),
          dateEnd: DateTime.fromSeconds(dateEnd).toISODate(),
          timePeriod: periodSelected.timePeriod,
        }));
      }
    },
    [setValues],
  );

  const handleQuickSingleDateSelectorChange = useCallback(
    (timePeriod: string) => {
      const periodSelected = SINGLE_RAPID_SELECTIONS.find(
        (selection) => selection.timePeriod === timePeriod,
      );
      if (periodSelected) {
        const dateStart = periodSelected.getTimeStamp();
        setValues((prev) => ({
          ...prev,
          dateStart: DateTime.fromSeconds(dateStart).toISODate(),
          timePeriod: periodSelected.timePeriod,
        }));
      }
    },
    [setValues],
  );

  return (
    <div className={classes.dateWrapper}>
      {dateType === 'range' && (
        <>
          <QuickDateSelector
            initialTimePeriod={values.timePeriod}
            isDisabled={dateInputDisabled}
            onChange={handleQuickRangeDateSelectorChange}
            type="range"
          />
          <DateRangeSelector
            date_end={DateTime.fromISO(values.dateEnd).toUnixInteger()}
            date_start={DateTime.fromISO(values.dateStart).toUnixInteger()}
            isDisabled={dateInputDisabled}
            isRapidSelectionDisplayed={false}
            onSubmit={handleRangeDatePickerSubmit}
            timePeriod={values.timePeriod as DateFilterRangeEnum}
          />
        </>
      )}
      {dateType === 'single' && (
        <>
          <QuickDateSelector
            initialTimePeriod={values.timePeriod}
            isDisabled={dateInputDisabled}
            onChange={handleQuickSingleDateSelectorChange}
            type="single"
          />
          <DatePickerSelector
            date={DateTime.fromISO(values.dateStart).toUnixInteger()}
            isDisabled={dateInputDisabled}
            isRapidSelectionDisplayed={false}
            onSubmit={handleSingleDatePickerSubmit}
            timePeriod={values.timePeriod as DateFilterEnum}
          />
        </>
      )}
      {timeWindowFilteringEnabled && (
        <TimeRangeSelector
          isDisabled={dateInputDisabled}
          onSubmit={handleTimeSelectorSubmit}
          originalTimeEnd={values.timeEnd}
          originalTimeStart={values.timeStart}
          originalTimeWindowPeriod={values.timeWindowPeriod}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  dateWrapper: { display: 'flex', gap: theme.spacing(1), flexWrap: 'wrap' },
}));

export default React.memo(ReportDetailDateSelectors);
