import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { DateTime } from 'luxon';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { EventWithElementTarget } from '#libs/marketplace/types';

import {
  formatAsDate,
  formatAsTitle,
  getLocaleWeekdays,
} from '#utils/datetime';

import type { LuxonDateTime } from '#src/types';
import MarketplaceDatePickerDay from './MarketplaceDatePickerDay.component';

import './MarketplaceDatePicker.css';

export type Props = {
  dateSelected: LuxonDateTime;
  disablePast?: boolean;
  rangeSize?: number;
  onSelect: (date: string) => void;
  isInputButton?: boolean;
  startWeekOnDaySelected?: boolean;
};

const MarketplaceDatePicker: React.FC<Props> = ({
  dateSelected,
  rangeSize = 7,
  onSelect,
  isInputButton,
  disablePast,
  startWeekOnDaySelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateDisplayed, setDateDisplayed] = useState<LuxonDateTime>(
    DateTime.now(),
  );
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenMenu = useCallback(() => {
    setDateDisplayed(dateSelected);
    setIsOpen(true);
  }, [dateSelected]);

  // Close menu on scroll outside of the menu
  useEffect(() => {
    // Initialize date sate
    if (!dateDisplayed) {
      setDateDisplayed(dateSelected);
    }

    const onScroll = throttle((event: EventWithElementTarget) => {
      if (
        isOpen &&
        event.target instanceof HTMLElement &&
        !event.target?.className?.includes('bs-marketplace-date-picker__menu')
      ) {
        handleCloseMenu();
      }
    }, 500);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [dateDisplayed, dateSelected, handleCloseMenu, isOpen]);

  const handleFastSelect = useCallback(
    (type: 'add' | 'subtract') => (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.stopPropagation();
      ev.preventDefault();
      onSelect(
        dateSelected
          .plus({ days: type === 'subtract' ? -rangeSize : rangeSize })
          .toISODate(),
      );
    },
    [dateSelected, onSelect, rangeSize],
  );

  const handleChangeDateDisplayed = useCallback(
    (type: 'add' | 'subtract') => (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.stopPropagation();
      ev.preventDefault();
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

  const getDateDisplay = useCallback(() => {
    const start = startWeekOnDaySelected
      ? dateSelected
      : dateSelected.startOf('week', { useLocaleWeeks: true });
    const end = startWeekOnDaySelected
      ? dateSelected.plus({
          days: rangeSize - 1,
        })
      : dateSelected
          .startOf('week', { useLocaleWeeks: true })
          .plus({ days: rangeSize - 1 });

    if (start.year !== end.year || start.year !== DateTime.now().year) {
      return `${start.toFormat('EEE dd/MM yyyy')} - ${end.toFormat(
        'EEE dd/MM yyyy',
      )}`;
    }

    return `${formatAsTitle(start)} - ${formatAsTitle(end)}`;
  }, [dateSelected, rangeSize, startWeekOnDaySelected]);

  const firstDayDisplayedInCalendar = dateDisplayed
    .startOf('month')
    .startOf('week', {
      useLocaleWeeks: true,
    });

  const lastDayDisplayedInCalendar = dateDisplayed
    .endOf('month')
    .endOf('week', { useLocaleWeeks: true });

  const nbDisplayedWeeks = useMemo(() => {
    return Math.ceil(
      lastDayDisplayedInCalendar
        .diff(firstDayDisplayedInCalendar, 'weeks')
        .as('weeks'),
    );
  }, [lastDayDisplayedInCalendar, firstDayDisplayedInCalendar]);

  const isDayDisabled = useCallback(
    (currentDayDate: string) =>
      disablePast &&
      DateTime.fromISO(currentDayDate).startOf('day').toSeconds() <
        DateTime.now().startOf('day').toSeconds(),
    [disablePast],
  );

  return (
    <>
      <div
        ref={anchorRef}
        className={classNames({
          'bs-marketplace-date-picker': !isInputButton,
          'bs-marketplace-date-picker--open': isOpen,
          'bs-marketplace-date-picker__input__button__container': isInputButton,
        })}
      >
        {!isInputButton && (
          <>
            <button
              className={classNames('bs-marketplace-date-picker__left-button', {
                'bs-marketplace-date-picker___left-button--open': isOpen,
              })}
              onClick={handleFastSelect('subtract')}
              type="button"
            >
              <ChevronLeftIcon color="inherit" />
            </button>
            <button
              className={classNames('bs-marketplace-date-picker__placeholder', {
                'bs-marketplace-date-picker__placeholder--open': isOpen,
              })}
              onClick={handleOpenMenu}
              type="button"
            >
              {getDateDisplay()}
            </button>
            <button
              className={classNames(
                'bs-marketplace-date-picker__right-button',
                {
                  'bs-marketplace-date-picker__right-button--open': isOpen,
                },
              )}
              onClick={handleFastSelect('add')}
              type="button"
            >
              <ChevronRightIcon color="inherit" />
            </button>
          </>
        )}

        {isInputButton && (
          <button
            className="bs-marketplace-date-picker__input__button"
            onClick={handleOpenMenu}
            type="button"
          >
            {formatAsDate(dateSelected.toISODate())}
          </button>
        )}
      </div>

      <Popper
        disablePortal
        transition
        anchorEl={anchorRef.current}
        open={!!anchorRef && isOpen}
        placement="bottom-start"
        role={undefined}
        style={{
          zIndex: 'var(--z-index-modal)',
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'left top',
            }}
          >
            <ClickAwayListener disableReactTree onClickAway={handleCloseMenu}>
              <div className="bs-marketplace-date-picker__menu">
                <div className="bs-marketplace-date-picker__menu__header">
                  <div className="bs-marketplace-date-picker__menu__header__date">
                    {dateDisplayed.toFormat('MMMM yyyy')}
                  </div>
                  <div className="bs-marketplace-date-picker__menu__header__buttons">
                    <button
                      className="bs-marketplace-date-picker__menu__header__buttons__left"
                      onClick={handleChangeDateDisplayed('subtract')}
                      type="button"
                    >
                      <ChevronLeftIcon color="inherit" />
                    </button>
                    <button
                      className="bs-marketplace-date-picker__menu__header__buttons__right"
                      onClick={handleChangeDateDisplayed('add')}
                      type="button"
                    >
                      <ChevronRightIcon color="inherit" />
                    </button>
                  </div>
                </div>
                <div className="bs-marketplace-date-picker__menu__calendar">
                  {getLocaleWeekdays('narrow').map((value, i) => (
                    <div
                      key={`header-${i}`}
                      className="bs-marketplace-date-picker__menu__calendar__day bs-marketplace-date-picker__menu__calendar__day--header"
                    >
                      {value}
                    </div>
                  ))}
                  {Array(nbDisplayedWeeks)
                    .fill(0)
                    .map((_, weekNumber) => {
                      const weekStartingDay = firstDayDisplayedInCalendar.plus({
                        week: weekNumber,
                      });

                      return (
                        <>
                          {Array(7)
                            .fill(0)
                            .map((__, dayNumber) => {
                              const currentDayDate = weekStartingDay.plus({
                                days: dayNumber,
                              });
                              return (
                                <MarketplaceDatePickerDay
                                  key={currentDayDate.toISODate()}
                                  date={currentDayDate.toISODate()}
                                  dateDisplayed={dateDisplayed.toISODate()}
                                  dateSelected={dateSelected.toISODate()}
                                  handleSelect={handleSelect}
                                  isDisabled={isDayDisabled(
                                    currentDayDate.toISODate(),
                                  )}
                                />
                              );
                            })}
                        </>
                      );
                    })}
                </div>
              </div>
            </ClickAwayListener>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default React.memo(MarketplaceDatePicker);
