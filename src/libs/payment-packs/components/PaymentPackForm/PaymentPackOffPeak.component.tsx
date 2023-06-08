import React, { useCallback, useMemo, memo } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import moment, { Moment } from 'moment-timezone';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { ButtonBase, Collapse, alpha } from '@material-ui/core';
import classNames from 'classnames';
import { OffPeakSchedule, OffPeakIsoWeekdays } from '#libs/payment-packs/types';
// @ts-expect-error
import { TimeField, RadioGroupField } from '#components/forms';

type FieldValueSetter = (
  field: string,
  value: any,
  shouldValidate?: boolean,
) => void;

type Props = {
  group: OffPeakSchedule;
  setFieldValue: FieldValueSetter;
  index: number;
  multipleGroups: boolean;
  onGroupDelete: () => void;
};

type OffPeakRecurrenceWeekDay = '1' | '2' | '3' | '4' | '5' | '6' | '7';

type WeekDayButtonProps = {
  day: WeekDay;
  setFieldValue: FieldValueSetter;
  recurrenceWeekDay: OffPeakIsoWeekdays;
  index: number;
};

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const WEEK_DAYS: WeekDay[] = [0, 1, 2, 3, 4, 5, 6];

type OffPeaktimeSlotsRowProps = {
  index: number;
  setFieldValue: FieldValueSetter;
  timeSlots: Moment[][];
};

const OffPeakButtonDay: React.FC<WeekDayButtonProps> = memo(
  ({ day, recurrenceWeekDay, setFieldValue, index }) => {
    const classes = useStyles();
    const { t } = useTranslation('datetime');

    const isoWeekDay = useMemo(() => {
      const isoweekday = moment().startOf('week').add(day, 'days').isoWeekday();
      return isoweekday.toString() as OffPeakRecurrenceWeekDay;
    }, [day]);

    const handleToggleWeekday = useCallback(
      (weekDay: OffPeakRecurrenceWeekDay) => {
        setFieldValue(`off_peak_schedule[${index}].recurrenceWeekDay`, {
          ...recurrenceWeekDay,
          [weekDay]: !recurrenceWeekDay[weekDay],
        });
      },
      [recurrenceWeekDay, index, setFieldValue],
    );

    const recurrenceWeekDayState = recurrenceWeekDay[isoWeekDay];

    const handleOnClick = useCallback(
      () => handleToggleWeekday(isoWeekDay),
      [handleToggleWeekday, isoWeekDay],
    );

    return (
      <Button
        key={day}
        variant="contained"
        className={classNames(
          classes.buttonBase,
          {
            [classes.activeWeekDayButton]: recurrenceWeekDayState,
          },
          {
            [classes.weekDayButton]: !recurrenceWeekDayState,
          },
        )}
        onClick={handleOnClick}
        disableRipple
        disableElevation
      >
        {t(`time.isoWeekdayNumber.${isoWeekDay}`).slice(0, 1)}
      </Button>
    );
  },
);

const OffPeaktimeSlotsRow: React.FC<OffPeaktimeSlotsRowProps> = memo(
  ({ index, timeSlots, setFieldValue }) => {
    const classes = useStyles();
    const hideDelete = timeSlots.length > 1;

    const deletetimeSlot = useCallback(
      (rowIndex: number) => () => {
        timeSlots.splice(rowIndex, 1);
        setFieldValue(`off_peak_schedule[${index}].timeSlots`, timeSlots);
      },
      [setFieldValue, timeSlots, index],
    );
    return (
      <div>
        <div className={classes.column}>
          {timeSlots.map((_, rowIndex) => {
            const start_time_name = `off_peak_schedule[${index}].timeSlots['${rowIndex}'][0]`;
            const end_time_name = `off_peak_schedule[${index}].timeSlots['${rowIndex}'][1]`;

            return (
              <div className={classes.row}>
                <TimeField name={start_time_name} />
                <TimeField name={end_time_name} className={classes.timeField} />
                {hideDelete && (
                  <ButtonBase
                    color="primary"
                    className={classes.deleteIcon}
                    onClick={deletetimeSlot(rowIndex)}
                  >
                    <CloseIcon />
                  </ButtonBase>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

const OffPeaktimeSlotGroup = (props: Props) => {
  const { group, setFieldValue, index, multipleGroups, onGroupDelete } = props;
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');

  const weekDaysButtons = useMemo(() => {
    return WEEK_DAYS.map((day: WeekDay) => (
      <OffPeakButtonDay
        key={`${day} - ${index}`}
        day={day}
        setFieldValue={setFieldValue}
        recurrenceWeekDay={group.recurrenceWeekDay}
        index={index}
      />
    ));
  }, [group.recurrenceWeekDay, index, setFieldValue]);

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

  const handleAddtimeSlot = useCallback(() => {
    const newGroup = group.timeSlots;
    const newRow = [
      moment().hours(6).minutes(0).seconds(0),
      moment().hours(7).minutes(0).seconds(0),
    ];
    newGroup.push(newRow);
    setFieldValue(`off_peak_schedule[${index}]`, group);
  }, [group, index, setFieldValue]);

  return (
    <div className={classes.container}>
      {multipleGroups && (
        <ButtonBase
          color="primary"
          className={classNames(classes.deleteIcon, classes.groupDelete)}
          onClick={onGroupDelete}
        >
          <CloseIcon />
        </ButtonBase>
      )}
      <div className={classes.row}>{weekDaysButtons}</div>
      <div className={classes.row}>
        <RadioGroupField
          name={`off_peak_schedule[${index}].slotDurationChoice`}
          choices={SLOT_DURATION_CHOICE}
          isRow
        />
      </div>
      <div>
        <Collapse in={time_slot_choice}>
          <OffPeaktimeSlotsRow
            setFieldValue={setFieldValue}
            index={index}
            timeSlots={group.timeSlots}
          />
          <ButtonBase
            color="primary"
            className={classes.buttonAdd}
            onClick={handleAddtimeSlot}
          >
            <AddIcon color="primary" />
            {t('addPaymentPack.offPeak.addTimeSlot')?.toUpperCase()}
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
    fontWeight: 'bold',
  },
}));

export default React.memo(OffPeaktimeSlotGroup);
