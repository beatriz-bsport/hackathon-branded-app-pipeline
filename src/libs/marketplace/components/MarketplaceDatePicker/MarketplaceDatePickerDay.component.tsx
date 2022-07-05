import React from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment-timezone';
import { pure } from 'recompose';
import { Offer_FULL } from '#libs/offer/types';

const MarketplaceDatePickerDay: React.FC<{
  day: Moment;
  dateDisplayed: Moment;
  dateSelected: string;
  onClick: () => void;
  offersThisDay: Array<Offer_FULL>;
}> = ({ day, dateSelected, dateDisplayed, onClick, offersThisDay }) => {
  const daySelected = moment(dateSelected).startOf('day');

  return (
    <button
      className={classNames('bs-marketplace-date-picker__menu__calendar__day', {
        'bs-marketplace-date-picker__menu__calendar__day--selected':
          daySelected.isSame(day),
        'bs-marketplace-date-picker__menu__calendar__day--disabled':
          dateDisplayed.month() - day.month() !== 0,
      })}
      onClick={onClick}
      type="button"
    >
      {day.format('D')}
      <div className="bs-marketplace-date-picker__menu__calendar__day__dots">
        {offersThisDay.slice(0, 3).map(() => (
          <div> • </div>
        ))}
      </div>
    </button>
  );
};

export default pure(MarketplaceDatePickerDay);
