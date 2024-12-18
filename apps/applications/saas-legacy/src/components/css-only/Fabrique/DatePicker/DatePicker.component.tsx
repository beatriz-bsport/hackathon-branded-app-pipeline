import React, { useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MarketplaceDatePickerDay from '#src/libs/marketplace/components/@Date/MarketplaceDatePicker/MarketplaceDatePickerDay.component';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from '#src/components/untitledui';
import { ButtonBase } from '#Fabrique/ButtonBaseV2/ButtonBase.component';
import Menu from '#Fabrique/Menu';
import { getLocaleWeekdays } from '#src/utils/datetime';

import type { LuxonDateTime } from '#src/types';
import YearPicker from './YearPicker';

import './styles.css';

type MenuProps = React.ComponentProps<typeof Menu>;

export type DatePickerProps = {
  /** If `true` only the content of the calendar will be returned */
  isContentOnly?: boolean;
  dateSelected: string;
  disablePast?: boolean;
  onSelect: (date: string) => void;
} & Partial<Omit<MenuProps, 'children'>>;

type DatePickerMenuContentProps = {
  dateDisplayed: LuxonDateTime;
  isYearPickerOpen: boolean;
  nbDisplayedWeeks: number;
  startingDay: LuxonDateTime;
  dateSelected: string;
  toggleYearPicker: () => void;
  handleChangeDateDisplayed: (
    type: 'add' | 'subtract',
  ) => (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSelectYear: (year: number) => void;
  isDayDisabled: (dayString: string) => boolean;
  handleSelect: (date: string) => () => void;
};

const DatePickerMenuContent: React.FC<DatePickerMenuContentProps> = React.memo(
  ({
    dateDisplayed,
    isYearPickerOpen,
    nbDisplayedWeeks,
    startingDay,
    dateSelected,
    toggleYearPicker,
    handleChangeDateDisplayed,
    handleSelectYear,
    isDayDisabled,
    handleSelect,
  }) => (
    <div className="bs-fabrique-date-picker__menu">
      <div className="bs-fabrique-date-picker__menu__header">
        <ButtonBase
          className="bs-fabrique-date-picker__menu__header__date"
          onClick={toggleYearPicker}
        >
          {dateDisplayed.toFormat('MMMM yyyy')}
          <span
            className={classNames(
              'bs-fabrique-date-picker__menu__header__date__icon',
              {
                'bs-fabrique-date-picker__menu__header__date__icon--year-picker-open':
                  isYearPickerOpen,
                'bs-fabrique-date-picker__menu__header__date__icon--year-picker-close':
                  !isYearPickerOpen,
              },
            )}
          >
            {!isYearPickerOpen ? (
              <ChevronDown stroke="currentColor" />
            ) : (
              <ChevronUp stroke="currentColor" />
            )}
          </span>
        </ButtonBase>
        <div
          className={classNames(
            'bs-fabrique-date-picker__menu__header__buttons',
            {
              'bs-fabrique-date-picker__menu__header__buttons--hidden':
                isYearPickerOpen,
            },
          )}
        >
          <button
            className="bs-fabrique-date-picker__menu__header__buttons__left"
            onClick={handleChangeDateDisplayed('subtract')}
            type="button"
          >
            <ChevronLeft />
          </button>
          <button
            className="bs-fabrique-date-picker__menu__header__buttons__right"
            onClick={handleChangeDateDisplayed('add')}
            type="button"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <YearPicker isOpen={isYearPickerOpen} onSelectYear={handleSelectYear} />
      <div
        className={classNames('bs-fabrique-date-picker__menu__calendar', {
          'bs-fabrique-date-picker__menu__calendar--hidden': isYearPickerOpen,
        })}
      >
        {getLocaleWeekdays('narrow').map((value, i) => (
          <div
            key={`header-${i}`}
            className="bs-fabrique-date-picker__menu__calendar__day bs-fabrique-date-picker__menu__calendar__day--header"
          >
            {value}
          </div>
        ))}
        {Array(nbDisplayedWeeks)
          .fill(0)
          .map((trashValueWeek, weekNumber) => {
            const weekStartingDay = startingDay.plus({
              days: 7 * weekNumber + trashValueWeek,
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
                    return (
                      <MarketplaceDatePickerDay
                        key={dayString}
                        date={dayString}
                        dateDisplayed={dateDisplayed.toISODate()}
                        dateSelected={dateSelected}
                        handleSelect={handleSelect}
                        isDisabled={isDayDisabled(dayString)}
                      />
                    );
                  })}
              </>
            );
          })}
      </div>
    </div>
  ),
);

const DatePicker: React.FC<DatePickerProps> = ({
  anchorEl,
  dateSelected,
  disablePast,
  isOpen,
  id,
  isContentOnly,
  onClose,
  onSelect,
}) => {
  const [dateDisplayed, setDateDisplayed] = useState<LuxonDateTime | null>(
    DateTime.fromISO(dateSelected),
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
        setDateDisplayed(
          dateDisplayed.plus({ months: type === 'subtract' ? -1 : 1 }),
        );
      },
    [dateDisplayed],
  );

  const handleSelect = useCallback(
    (date: string) => () => {
      onSelect(date);
      handleCloseMenu();
    },
    [handleCloseMenu, onSelect],
  );

  const startOfMonth = useMemo(
    () => dateDisplayed.startOf('month'),
    [dateDisplayed],
  );

  const startingDay = useMemo(() => {
    const dayOfWeek = startOfMonth.weekday;
    return startOfMonth.minus({ days: dayOfWeek });
  }, [startOfMonth]);

  const nbDisplayedWeeks = useMemo(() => {
    const endOfMonth = dateDisplayed.endOf('month');
    const dayOfWeek = startOfMonth.weekday;
    const endingDate = endOfMonth.plus({ days: 6 - dayOfWeek });

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
  if (isContentOnly) {
    return (
      <DatePickerMenuContent
        dateDisplayed={dateDisplayed}
        dateSelected={dateSelected}
        handleChangeDateDisplayed={handleChangeDateDisplayed}
        handleSelect={handleSelect}
        handleSelectYear={handleSelectYear}
        isDayDisabled={isDayDisabled}
        isYearPickerOpen={isYearPickerOpen}
        nbDisplayedWeeks={nbDisplayedWeeks}
        startingDay={startingDay}
        toggleYearPicker={toggleYearPicker}
      />
    );
  }

  return (
    <Menu
      anchorEl={anchorEl}
      id={id}
      isOpen={isOpen && !!dateDisplayed}
      onClose={handleCloseMenu}
    >
      <DatePickerMenuContent
        dateDisplayed={dateDisplayed}
        dateSelected={dateSelected}
        handleChangeDateDisplayed={handleChangeDateDisplayed}
        handleSelect={handleSelect}
        handleSelectYear={handleSelectYear}
        isDayDisabled={isDayDisabled}
        isYearPickerOpen={isYearPickerOpen}
        nbDisplayedWeeks={nbDisplayedWeeks}
        startingDay={startingDay}
        toggleYearPicker={toggleYearPicker}
      />
    </Menu>
  );
};

export const DatePickerStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof DatePicker>>()(DatePicker);
export default React.memo(DatePicker);
