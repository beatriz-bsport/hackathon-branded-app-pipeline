import React, { useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Menu from '#Fabrique/Menu';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from '#src/components/untitledui';
import { ButtonBase } from '#Fabrique/ButtonBaseV2/ButtonBase.component';
import Typography from '#Fabrique/Typography';
import YearPicker from './YearPicker';
import './styles.css';

type MenuProps = React.ComponentProps<typeof Menu>;

export type DatePickerProps = {
  dateSelected: string;
  disablePast?: boolean;
  onSelect: (date: string) => void;
} & Omit<MenuProps, 'children'>;

const DatePicker: React.FC<DatePickerProps> = ({
  anchorEl,
  dateSelected,
  disablePast,
  isOpen,
  id,
  onClose,
  onSelect,
}) => {
  const [dateDisplayed, setDateDisplayed] = useState<DateTime | null>(
    dateSelected ? DateTime.fromISO(dateSelected) : null,
  );

  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  const handleCloseYearPicker = useCallback(() => {
    setIsYearPickerOpen(false);
  }, []);

  const toggleYearPicker = useCallback(() => {
    setIsYearPickerOpen((prevState) => !prevState);
  }, []);

  const handleCloseMenu = useCallback(() => {
    onClose?.();
    handleCloseYearPicker();
  }, [onClose, handleCloseYearPicker]);

  const handleSelectYear = useCallback(
    (year: number) => {
      setDateDisplayed(dateDisplayed.set({ year }));
      handleCloseYearPicker();
    },
    [dateDisplayed, handleCloseYearPicker],
  );

  const handleChangeDateDisplayed = useCallback(
    (type: 'add' | 'subtract') =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        switch (type) {
          case 'add':
            setDateDisplayed((prevDateDisplayed) =>
              prevDateDisplayed.plus({ month: 1 }),
            );
            break;
          case 'subtract':
            setDateDisplayed((prevDateDisplayed) =>
              prevDateDisplayed.minus({ month: 1 }),
            );
            break;
          default:
            break;
        }
      },
    [],
  );

  const handleSelect = useCallback(
    (date: string) => () => {
      onSelect(DateTime.fromISO(date).toISODate());
      handleCloseMenu();
    },
    [handleCloseMenu, onSelect],
  );

  const startOfMonth = useMemo(
    () => dateDisplayed.startOf('month'),
    [dateDisplayed],
  );

  const startingDay = useMemo(() => {
    const dayOfWeek = startOfMonth.weekday - 1;
    return startOfMonth?.minus({ day: dayOfWeek });
  }, [startOfMonth]);

  const nbDisplayedWeeks = useMemo(() => {
    const endOfMonth = dateDisplayed.endOf('month');
    const dayOfWeek = startOfMonth.weekday - 1;
    const endingDate = endOfMonth?.plus({ day: 6 - dayOfWeek });

    return Math.floor(endingDate.diff(startingDay, 'weeks').as('weeks'));
  }, [dateDisplayed, startOfMonth, startingDay]);

  const isDayDisabled = useCallback(
    (dayString: string) =>
      disablePast &&
      DateTime.fromISO(dayString).startOf('day') <
        DateTime.now().startOf('day'),
    [disablePast],
  );

  if (!dateDisplayed) return null;
  return (
    <Menu
      anchorEl={anchorEl}
      id={id}
      isOpen={isOpen && !!dateDisplayed}
      onClose={handleCloseMenu}
    >
      <div className="bs-fabrique-date-picker">
        <div className="bs-fabrique-date-picker__header">
          <ButtonBase onClick={toggleYearPicker}>
            <Typography variant="title-sm">
              {dateDisplayed.toFormat('MMMM yyyy')}
            </Typography>
            <span
              className={clsx('bs-fabrique-date-picker__header__date__icon', {
                'bs-fabrique-date-picker__header__date__icon--year-picker-open':
                  isYearPickerOpen,
                'bs-fabrique-date-picker__header__date__icon--year-picker-close':
                  !isYearPickerOpen,
              })}
            >
              {!isYearPickerOpen ? (
                <ChevronDown stroke="currentColor" />
              ) : (
                <ChevronUp stroke="currentColor" />
              )}
            </span>
          </ButtonBase>
          <div
            className={clsx('bs-fabrique-date-picker__header__buttons', {
              'bs-fabrique-date-picker__header__buttons--hidden':
                isYearPickerOpen,
            })}
          >
            <button
              className="bs-fabrique-date-picker__header__buttons__left"
              onClick={handleChangeDateDisplayed('subtract')}
              type="button"
            >
              <ChevronLeft />
            </button>
            <button
              className="bs-fabrique-date-picker__header__buttons__right"
              onClick={handleChangeDateDisplayed('add')}
              type="button"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <YearPicker isOpen={isYearPickerOpen} onSelectYear={handleSelectYear} />
        <div
          className={clsx('bs-fabrique-date-picker__calendar', {
            'bs-fabrique-date-picker__calendar--hidden': isYearPickerOpen,
          })}
        >
          {Array(7)
            .fill(0)
            .map((value, i) => (
              <Typography
                key={`header-${i}`}
                className="bs-fabrique-date-picker__calendar__day bs-fabrique-date-picker__calendar__day--header"
                variant="body-md"
              >
                {DateTime.now()
                  .set({ localWeekday: value + i + 1 })
                  .weekdayShort.slice(0, 1)}
              </Typography>
            ))}
          {Array(nbDisplayedWeeks)
            .fill(0)
            .map((trashValueWeek, weekNumber) => {
              const weekStartingDay = startingDay.plus({
                day: 7 * weekNumber + trashValueWeek,
              });

              return (
                <>
                  {Array(7)
                    .fill(0)
                    .map((trashValueDay, dayNumber) => {
                      const day = weekStartingDay.plus({
                        days: trashValueDay + dayNumber,
                      });
                      const dayString = day.toISODate();
                      const daySelected =
                        DateTime.fromISO(dateSelected).startOf('day');

                      if (!dayString) return null;

                      return (
                        <div
                          key={dayString}
                          className={clsx(
                            'bs-fabrique-date-picker__calendar__day__container',
                          )}
                        >
                          <button
                            className={clsx(
                              'bs-fabrique-date-picker__calendar__day',
                              {
                                'bs-fabrique-date-picker__calendar__day--today':
                                  DateTime.now().startOf('day').toSeconds() ===
                                  DateTime.fromISO(dayString)
                                    .startOf('day')
                                    .toSeconds(),
                                'bs-fabrique-date-picker__calendar__day--selected':
                                  daySelected.toSeconds() ===
                                  DateTime.fromISO(dayString).toSeconds(),
                                'bs-fabrique-date-picker__calendar__day--disabled':
                                  DateTime.fromISO(dateDisplayed.toISODate())
                                    .month -
                                    DateTime.fromISO(dayString).month !==
                                  0,
                                'bs-fabrique-date-picker__calendar__day--disabled-past':
                                  isDayDisabled(dayString),
                              },
                            )}
                            disabled={isDayDisabled(dayString)}
                            onClick={handleSelect(dayString)}
                            type="button"
                          >
                            <Typography color="default" variant="body-md">
                              {DateTime.fromISO(dayString).toFormat('d')}
                            </Typography>
                          </button>
                        </div>
                      );
                    })}
                </>
              );
            })}
        </div>
      </div>
    </Menu>
  );
};

export const DatePickerStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof DatePicker>>()(DatePicker);
export default React.memo(DatePicker);
