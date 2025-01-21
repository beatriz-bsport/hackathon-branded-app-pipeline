import React from 'react';
import clsx from 'clsx';
import { DateTime } from 'luxon';

import './MarketplaceDatePicker.css';

const MarketplaceDatePickerDay: React.FC<{
  date: string;
  dateDisplayed: string;
  dateSelected: string;
  handleSelect: (dateString: string) => () => void;
  isDisabled?: boolean;
}> = ({ date, dateSelected, dateDisplayed, handleSelect, isDisabled }) => {
  const daySelected = DateTime.fromISO(dateSelected).startOf('day');

  return (
    <div
      className={clsx(
        'bs-marketplace-date-picker__menu__calendar__day__container',
      )}
    >
      <button
        className={clsx('bs-marketplace-date-picker__menu__calendar__day', {
          'bs-marketplace-date-picker__menu__calendar__day--today':
            DateTime.now().startOf('day').toSeconds() ===
            DateTime.fromISO(date).startOf('day').toSeconds(),
          'bs-marketplace-date-picker__menu__calendar__day--selected':
            daySelected.toSeconds() === DateTime.fromISO(date).toSeconds(),
          'bs-marketplace-date-picker__menu__calendar__day--disabled':
            DateTime.fromISO(dateDisplayed).month -
              DateTime.fromISO(date).month !==
            0,
          'bs-marketplace-date-picker__menu__calendar__day--disabled-past':
            isDisabled,
        })}
        disabled={isDisabled}
        onClick={handleSelect(date)}
        type="button"
      >
        {DateTime.fromISO(date).toFormat('d')}
      </button>
    </div>
  );
};

export default React.memo(MarketplaceDatePickerDay);
