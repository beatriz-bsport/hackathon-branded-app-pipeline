import React, { useCallback, useMemo, memo } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { ButtonBase, Collapse, alpha, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { ErrorMessage } from 'formik';
import { DateTime } from 'luxon';
import {
  OffPeakSchedule,
  OffPeakIsoWeekdays,
} from '#src/libs/payment-packs/types';
// @ts-expect-error
import { TimeField, RadioGroupField } from '#src/components/forms';

type FieldValueSetter = (
  field: string,
  value: any,
  shouldValidate?: boolean,
) => void;

type Props = {
  group: OffPeakSchedule;
  setFieldValue: FieldValueSetter;
  index: number;
  hasMultipleGroups: boolean;
  onGroupDelete: () => void;
  disabled?: boolean;
  baseName?: string;
};

type OffPeakRecurrenceWeekDay = '1' | '2' | '3' | '4' | '5' | '6' | '7';

type WeekDayButtonProps = {
  day: WeekDay;
  setFieldValue: FieldValueSetter;
  recurrenceWeekDay: OffPeakIsoWeekdays;
  index: number;
  disabled?: boolean;
  baseName?: string;
};

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const WEEK_DAYS: WeekDay[] = [0, 1, 2, 3, 4, 5, 6];

type OffPeaktimeSlotsRowProps = {
  index: number;
  setFieldValue: FieldValueSetter;
  timeSlots: string[][];
  disabled?: boolean;
  baseName?: string;
};

const OffPeakButtonDay: React.FC<WeekDayButtonProps> = memo(
  ({ day, recurrenceWeekDay, setFieldValue, index, disabled, baseName }) => {
    const classes = useStyles();
    const { t } = useTranslation('datetime');

    const isoWeekDay = useMemo(() => {
      const isoweekday = DateTime.now()
        .startOf('week', { useLocaleWeeks: true })
        .plus({ days: day }).weekday;
      return isoweekday.toString() as OffPeakRecurrenceWeekDay;
    }, [day]);

    const basePrefix = baseName && baseName.length ? `${baseName}.` : '';

    const handleToggleWeekday = useCallback(
      (weekDay: OffPeakRecurrenceWeekDay) => {
        setFieldValue(
          basePrefix + `off_peak_schedule[${index}].recurrenceWeekDay`,
          {
            ...recurrenceWeekDay,
            [weekDay]: !recurrenceWeekDay[weekDay],
          },
        );
      },
      [recurrenceWeekDay, index, setFieldValue, basePrefix],
    );

    const recurrenceWeekDayState = recurrenceWeekDay[isoWeekDay];

    const handleOnClick = useCallback(
      () => handleToggleWeekday(isoWeekDay),
      [handleToggleWeekday, isoWeekDay],
    );

    return (
      <Button
        key={day}
        disableElevation
        disableRipple
        className={clsx(
          classes.buttonBase,
          {
            [classes.activeWeekDayButton]: recurrenceWeekDayState,
          },
          {
            [classes.weekDayButton]: !recurrenceWeekDayState,
          },
        )}
        disabled={disabled}
        onClick={handleOnClick}
        variant="contained"
      >
        {t(`time.isoWeekdayNumber.${isoWeekDay}`).slice(0, 1)}
      </Button>
    );
  },
);

const OffPeaktimeSlotsRow: React.FC<OffPeaktimeSlotsRowProps> = ({
  index,
  timeSlots,
  setFieldValue,
  disabled,
  baseName,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');
  const hideDelete = timeSlots.length > 1;
  const basePrefix = baseName && baseName.length ? `${baseName}.` : '';
  const deleteTimeSlot = useCallback(
    (rowIndex: number) => () => {
      const newSlots = timeSlots.filter((_, i) => i !== rowIndex);
      setFieldValue(
        basePrefix + `off_peak_schedule[${index}].timeSlots`,
        newSlots,
      );
    },
    [setFieldValue, timeSlots, index, basePrefix],
  );

  return (
    <div>
      <div className={classes.column}>
        {timeSlots.map((_, rowIndex) => {
          const start_time_name =
            basePrefix +
            `off_peak_schedule[${index}].timeSlots[${rowIndex}][0]`;
          const end_time_name =
            basePrefix +
            `off_peak_schedule[${index}].timeSlots[${rowIndex}][1]`;

          return (
            <div>
              <div className={classes.row}>
                <TimeField
                  outsideErrorDisplay
                  disabled={disabled}
                  name={start_time_name}
                />
                <TimeField
                  outsideErrorDisplay
                  className={classes.timeField}
                  disabled={disabled}
                  name={end_time_name}
                />
                {hideDelete && (
                  <ButtonBase
                    className={classes.deleteIcon}
                    color="primary"
                    disabled={disabled}
                    onClick={deleteTimeSlot(rowIndex)}
                  >
                    <CloseIcon />
                  </ButtonBase>
                )}
              </div>
              <div>
                <ErrorMessage
                  name={
                    basePrefix +
                    `off_peak_schedule[${index}].timeSlots[${rowIndex}]`
                  }
                >
                  {(error_msg) => (
                    <Typography color="error" variant="caption">
                      {t(`${error_msg}`)}
                    </Typography>
                  )}
                </ErrorMessage>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OffPeaktimeSlotGroup = (props: Props) => {
  const {
    group,
    setFieldValue,
    index,
    hasMultipleGroups,
    onGroupDelete,
    disabled,
    baseName,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');

  const weekDaysButtons = useMemo(() => {
    return WEEK_DAYS.map((day: WeekDay) => (
      <OffPeakButtonDay
        key={`${day} - ${index}`}
        baseName={baseName}
        day={day}
        disabled={disabled}
        index={index}
        recurrenceWeekDay={group.recurrenceWeekDay}
        setFieldValue={setFieldValue}
      />
    ));
  }, [group.recurrenceWeekDay, index, setFieldValue, disabled, baseName]);

  const SLOT_DURATION_CHOICE = [
    {
      label: t('addPaymentPack.offPeak.choice.timeSlot'),
      value: 'time_slot',
    },
    { label: t('addPaymentPack.offPeak.choice.allDay'), value: 'all_day' },
  ];

  const time_slot_choice = useMemo(
    () => group.slotDurationChoice === 'time_slot',
    [group.slotDurationChoice],
  );

  const basePrefix = baseName && baseName.length ? `${baseName}.` : '';

  const handleAddtimeSlot = useCallback(() => {
    const newRow = [
      DateTime.now().set({ hour: 6 }).startOf('hour').toISO(),
      DateTime.now().set({ hour: 7 }).startOf('hour').toISO(),
    ];
    const newSlots = [...(group.timeSlots ?? []), newRow];
    setFieldValue(basePrefix + `off_peak_schedule[${index}]`, {
      ...group,
      timeSlots: newSlots,
    });
  }, [group, index, setFieldValue, basePrefix]);

  const addTimeSlotLabel = t(
    'addPaymentPack.offPeak.addTimeSlot',
  )?.toUpperCase();

  return (
    <div className={classes.container}>
      {hasMultipleGroups && (
        <ButtonBase
          className={clsx(classes.deleteIcon, classes.groupDelete)}
          color="primary"
          disabled={disabled}
          onClick={onGroupDelete}
        >
          <CloseIcon />
        </ButtonBase>
      )}
      <div className={classes.row}>{weekDaysButtons}</div>
      <div>
        <ErrorMessage
          name={basePrefix + `off_peak_schedule[${index}].recurrenceWeekDay`}
        >
          {(error_msg) => (
            <Typography color="error" variant="caption">
              {t(`${error_msg}`)}
            </Typography>
          )}
        </ErrorMessage>
      </div>
      <div className={classes.row}>
        <RadioGroupField
          isRow
          choices={SLOT_DURATION_CHOICE}
          disabled={disabled}
          name={basePrefix + `off_peak_schedule[${index}].slotDurationChoice`}
        />
      </div>
      <div>
        <Collapse in={time_slot_choice}>
          <OffPeaktimeSlotsRow
            baseName={baseName}
            disabled={disabled}
            index={index}
            setFieldValue={setFieldValue}
            timeSlots={group.timeSlots}
          />
          <ButtonBase
            className={classes.buttonAddTimeSlot}
            color="primary"
            disabled={disabled}
            onClick={handleAddtimeSlot}
          >
            <AddIcon color="primary" />
            <Typography className={classes.bold}>{addTimeSlotLabel}</Typography>
          </ButtonBase>
        </Collapse>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
    gap: theme.spacing(1),
    background: theme.palette.grey[100],
    marginLeft: theme.spacing(3.5),
    marginTop: theme.spacing(1.5),
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    width: 'fit-content',
    position: 'relative',
    paddingRight: theme.spacing(10),
  },
  buttonAddTimeSlot: { marginTop: theme.spacing(2) },
  timeField: { marginLeft: theme.spacing(2) },
  deleteIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  groupDelete: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1),
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexFlow: 'column',
  },
  activeWeekDayButton: {
    background: alpha(theme.palette.primary.main, 0.1),
    border: `1px solid ${theme.palette.primary.main}`,
  },
  weekDayButton: {
    background: theme.palette.grey[200],
  },
  buttonBase: {
    minWidth: 'inherit',
    textTransform: 'capitalize',
    borderRadius: theme.spacing(3),
    fontWeight: 400,
    marginRight: theme.spacing(1),
  },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
  },
  bold: {
    fontWeight: 500,
    fontSize: theme.spacing(1.75),
  },
  error: { color: theme.palette.error.main },
}));

export default React.memo(OffPeaktimeSlotGroup);
