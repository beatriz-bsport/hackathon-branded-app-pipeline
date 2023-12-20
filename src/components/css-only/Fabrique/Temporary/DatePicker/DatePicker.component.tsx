import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment-timezone';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Menu, { MenuProps } from '#Fabrique/Menu';
import MarketplaceDatePickerDay from '#libs/marketplace/components/@Date/MarketplaceDatePicker/MarketplaceDatePickerDay.component';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from '#components/untitledui';
import { ButtonBase } from '#Fabrique/ButtonBaseV2/ButtonBase.component';
import YearPicker from './YearPicker';
import Typography from '#Fabrique/Typography';
import './styles.css';

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
  const [dateDisplayed, setDateDisplayed] = useState<Moment | null>(null);

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
      setDateDisplayed(dateDisplayed.clone().year(year));
      handleCloseYearPicker();
    },
    [dateDisplayed, handleCloseYearPicker],
  );

  // Initialize date sate
  useEffect(() => {
    if (!dateDisplayed) {
      setDateDisplayed(moment(dateSelected));
    }
  }, [dateDisplayed, dateSelected, isOpen, handleCloseMenu]);

  const handlerDateMap = useMemo(
    () => ({
      add: dateDisplayed?.clone().add(1, 'month'),
      subtract: dateDisplayed?.clone().subtract(1, 'month'),
    }),
    [dateDisplayed],
  );

  const handleChangeDateDisplayed = useCallback(
    (type: 'add' | 'subtract') =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setDateDisplayed(handlerDateMap[type]);
      },
    [handlerDateMap],
  );

  const handleSelect = useCallback(
    (date: string) => () => {
      onSelect(moment(date).format('YYYY-MM-DD'));
      handleCloseMenu();
    },
    [handleCloseMenu, onSelect],
  );

  const startOfMonth = useMemo(
    () => moment(dateDisplayed).startOf('month'),
    [dateDisplayed],
  );

  const startingDay = useMemo(() => {
    const dayOfWeek = startOfMonth.weekday();
    return startOfMonth?.clone().subtract(dayOfWeek, 'day');
  }, [startOfMonth]);

  const nbDisplayedWeeks = useMemo(() => {
    const endOfMonth = moment(dateDisplayed).endOf('month');
    const dayOfWeek = startOfMonth.weekday();
    const endingDate = endOfMonth?.clone().add(6 - dayOfWeek, 'day');

    return Math.ceil(endingDate.diff(startingDay, 'week'));
  }, [dateDisplayed, startOfMonth, startingDay]);

  const isDayDisabled = useCallback(
    (dayString: string) =>
      disablePast &&
      moment(dayString)
        .startOf('day')
        .isBefore(moment().startOf('day').format()),
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
      <div className="bs-fabrique-date-picker__menu">
        <div className="bs-fabrique-date-picker__menu__header">
          <ButtonBase onClick={toggleYearPicker}>
            <Typography variant="title-sm">
              {dateDisplayed.format('MMMM YYYY')}
            </Typography>
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
          {Array(7)
            .fill(0)
            .map((value, i) => (
              <Typography
                key={`header-${i}`}
                className="bs-fabrique-date-picker__menu__calendar__day bs-fabrique-date-picker__menu__calendar__day--header"
                variant="body-md"
              >
                {moment()
                  .weekday(value + i)
                  .format('ddd')
                  .slice(0, 1)}
              </Typography>
            ))}
          {Array(nbDisplayedWeeks)
            .fill(0)
            .map((trashValueWeek, weekNumber) => {
              const weekStartingDay = startingDay
                .clone()
                .add(7 * weekNumber + trashValueWeek, 'day');

              return (
                <>
                  {Array(7)
                    .fill(0)
                    .map((trashValueDay, dayNumber) => {
                      const day = weekStartingDay
                        .clone()
                        .add(trashValueDay + dayNumber, 'day');
                      const dayString = day.format('YYYY-MM-DD');
                      return (
                        <MarketplaceDatePickerDay
                          key={dayString}
                          date={dayString}
                          dateDisplayed={dateDisplayed.format('YYYY-MM-DD')}
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
    </Menu>
  );
};

export const DatePickerStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof DatePicker>>()(DatePicker);
export default React.memo(DatePicker);
