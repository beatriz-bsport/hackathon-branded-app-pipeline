import React from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';

import './MarketplaceDatePicker.css';

const MarketplaceDatePickerDay: React.FC<{
  date: string;
  dateDisplayed: string;
  dateSelected: string;
  handleSelect: (dateString: string) => () => void;
  isDisabled?: boolean;
}> = ({ date, dateSelected, dateDisplayed, handleSelect, isDisabled }) => {
  const daySelected = moment(dateSelected).startOf('day');

  return (
    <div
      className={classNames(
        'bs-marketplace-date-picker__menu__calendar__day__container',
      )}
    >
      <button
        className={classNames(
          'bs-marketplace-date-picker__menu__calendar__day',
          {
            'bs-marketplace-date-picker__menu__calendar__day--today': moment()
              .startOf('day')
              .isSame(moment(date)),
            'bs-marketplace-date-picker__menu__calendar__day--selected':
              daySelected.isSame(moment(date)),
            'bs-marketplace-date-picker__menu__calendar__day--disabled':
              moment(dateDisplayed).month() - moment(date).month() !== 0,
            'bs-marketplace-date-picker__menu__calendar__day--disabled-past':
              isDisabled,
          },
        )}
        disabled={isDisabled}
        onClick={handleSelect(date)}
        type="button"
      >
        {moment(date).format('D')}
      </button>
    </div>
  );
};

export default React.memo(MarketplaceDatePickerDay);
