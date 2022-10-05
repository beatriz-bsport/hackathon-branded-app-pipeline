import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import moment from 'moment-timezone';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import omit from 'lodash/omit';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './MarketplaceDatePicker.css';
import MarketplaceCommonFilter from '../../types';

import MarketplaceDatePickerDay from './MarketplaceDatePickerDay.component';

export type Props = {
  dateSelected: string;
  rangeSize: number;
  onSelect: (date: string) => void;
  events: Array<Event>;
  companyId: number;
  fetchAllOffers: (props: {
    company: number;
    min_date: string;
    max_date: string;
    filters?: Array<MarketplaceCommonFilter>;
  }) => void;
  offerFilters: Array<MarketplaceCommonFilter>;
};

const MarketplaceDatePicker: React.FC<Props> = ({
  dateSelected,
  rangeSize = 7,
  onSelect,
  events,
  companyId,
  fetchAllOffers,
  offerFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateDisplayed, setDateDisplayed] = useState(moment(dateSelected));
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenMenu = useCallback(() => {
    setDateDisplayed(moment(dateSelected));
    setIsOpen(true);
    fetchAllOffers({
      company: companyId,
      min_date: moment(dateDisplayed)
        .startOf('month')
        .startOf('week')
        .format('YYYY-MM-DD'),
      max_date: moment(dateDisplayed)
        .endOf('month')
        .endOf('week')
        .format('YYYY-MM-DD'),
      ...omit(offerFilters || {}),
    });
  }, [companyId, dateDisplayed, dateSelected, fetchAllOffers, offerFilters]);

  // Close menu on scroll outside of the menu
  useEffect(() => {
    const onScroll = throttle((ev: Event) => {
      if (
        isOpen &&
        !ev.target?.className?.includes('bs-marketplace-date-picker__menu')
      ) {
        handleCloseMenu();
      }
    }, 500);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [handleCloseMenu, isOpen]);

  const handleFastSelect = useCallback(
    (type: 'add' | 'subtract') => (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.stopPropagation();
      ev.preventDefault();
      onSelect(
        moment(dateSelected)
          .add(type === 'subtract' ? -rangeSize : rangeSize, 'day')
          .format('YYYY-MM-DD'),
      );
    },
    [dateSelected, onSelect, rangeSize],
  );

  const handleChangeDateDisplayed = useCallback(
    (type: 'add' | 'subtract') => (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.stopPropagation();
      ev.preventDefault();
      setDateDisplayed(
        dateDisplayed.clone().add(type === 'subtract' ? -1 : 1, 'month'),
      );
      fetchAllOffers({
        company: companyId,
        min_date: dateDisplayed
          .clone()
          .add(type === 'subtract' ? -1 : 1, 'month')
          .startOf('month')
          .startOf('week')
          .format('YYYY-MM-DD'),
        max_date: dateDisplayed
          .clone()
          .add(type === 'subtract' ? -1 : 1, 'month')
          .endOf('month')
          .endOf('week')
          .format('YYYY-MM-DD'),
        ...omit(offerFilters || {}),
      });
    },
    [companyId, dateDisplayed, fetchAllOffers, offerFilters],
  );

  const handleSelect = useCallback(
    (date: string) => () => {
      onSelect(moment(date).format('YYYY-MM-DD'));
      handleCloseMenu();
    },
    [handleCloseMenu, onSelect],
  );

  const getDateDisplay = useCallback(() => {
    const start = moment(dateSelected).startOf('week');
    const end = moment(dateSelected)
      .startOf('week')
      .add(rangeSize - 1, 'day');

    if (start.year() !== end.year() || start.year() !== moment().year()) {
      return `${start.format('ddd DD/MM YYYY')} - ${end.format(
        'ddd DD/MM YYYY',
      )}`;
    }

    return `${start.format('ddd DD/MM')} - ${end.format('ddd DD/MM')}`;
  }, [dateSelected, rangeSize]);

  const startOfMonth = useMemo(
    () => moment(dateDisplayed).startOf('month'),
    [dateDisplayed],
  );

  const startingDay = useMemo(() => {
    const dayOfWeek = startOfMonth.weekday();
    return startOfMonth.clone().subtract(dayOfWeek, 'day');
  }, [startOfMonth]);

  const nbDisplayedWeeks = useMemo(() => {
    const endOfMonth = moment(dateDisplayed).endOf('month');
    const dayOfWeek = startOfMonth.weekday();
    const endingDate = endOfMonth.clone().add(6 - dayOfWeek, 'day');

    return Math.ceil(endingDate.diff(startingDay, 'week'));
  }, [dateDisplayed, startOfMonth, startingDay]);

  return (
    <>
      <div
        ref={anchorRef}
        className={classNames('bs-marketplace-date-picker', {
          'bs-marketplace-date-picker--open': isOpen,
        })}
      >
        <button
          onClick={handleFastSelect('subtract')}
          className={classNames('bs-marketplace-date-picker__left-button', {
            'bs-marketplace-date-picker___left-button--open': isOpen,
          })}
          type="button"
        >
          <ChevronLeftIcon color="inherit" />
        </button>
        <button
          className={classNames('bs-marketplace-date-picker__placeholder', {
            'bs-marketplace-date-picker__placeholder--open': isOpen,
          })}
          type="button"
          onClick={handleOpenMenu}
        >
          {getDateDisplay()}
        </button>

        <button
          onClick={handleFastSelect('add')}
          className={classNames('bs-marketplace-date-picker__right-button', {
            'bs-marketplace-date-picker__right-button--open': isOpen,
          })}
          type="button"
        >
          <ChevronRightIcon color="inherit" />
        </button>
      </div>

      <Popper
        open={!!anchorRef && isOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
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
            <ClickAwayListener onClickAway={handleCloseMenu} disableReactTree>
              <div className="bs-marketplace-date-picker__menu">
                <div className="bs-marketplace-date-picker__menu__header">
                  <div className="bs-marketplace-date-picker__menu__header__date">
                    {dateDisplayed.format('MMMM YYYY')}
                  </div>
                  <div className="bs-marketplace-date-picker__menu__header__buttons">
                    <button
                      onClick={handleChangeDateDisplayed('subtract')}
                      className="bs-marketplace-date-picker__menu__header__buttons__left"
                      type="button"
                    >
                      <ChevronLeftIcon color="inherit" />
                    </button>
                    <button
                      onClick={handleChangeDateDisplayed('add')}
                      className="bs-marketplace-date-picker__menu__header__buttons__right"
                      type="button"
                    >
                      <ChevronRightIcon color="inherit" />
                    </button>
                  </div>
                </div>
                <div className="bs-marketplace-date-picker__menu__calendar">
                  {Array(7)
                    .fill(0)
                    .map((value, i) => (
                      <div
                        className="bs-marketplace-date-picker__menu__calendar__day bs-marketplace-date-picker__menu__calendar__day--header"
                        key={`header-${i}`}
                      >
                        {moment()
                          .weekday(value + i)
                          .format('ddd')
                          .slice(0, 1)}
                      </div>
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
                                  date={dayString}
                                  dateSelected={dateSelected}
                                  dateDisplayed={dateDisplayed.format(
                                    'YYYY-MM-DD',
                                  )}
                                  key={dayString}
                                  handleSelect={handleSelect}
                                  offersThisDay={events.filter(
                                    (event: Event) => {
                                      return moment(event.date_start).isSame(
                                        day,
                                        'day',
                                      );
                                    },
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
