import React from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment-timezone';
import { pure } from 'recompose';
import { Offer_FULL } from '#libs/offer/types';
import './MarketplaceDatePicker.css';

const MarketplaceDatePickerDay: React.FC<{
  day: Moment;
  dateDisplayed: Moment;
  dateSelected: string;
  onClick: () => void;
  offersThisDay: Array<Offer_FULL>;
}> = ({ day, dateSelected, dateDisplayed, onClick, offersThisDay }) => {
  const daySelected = moment(dateSelected).startOf('day');
  const numberOfDots = offersThisDay.slice(0, 3).length;

  return (
    <div
      className={classNames(
        'bs-marketplace-date-picker__menu__calendar__day__container',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          'bs-marketplace-date-picker__menu__calendar__day',
          {
            'bs-marketplace-date-picker__menu__calendar__day--today': moment()
              .startOf('day')
              .isSame(day),
            'bs-marketplace-date-picker__menu__calendar__day--selected':
              daySelected.isSame(day),
            'bs-marketplace-date-picker__menu__calendar__day--disabled':
              dateDisplayed.month() - day.month() !== 0,
          },
        )}
      >
        {day.format('D')}
      </button>
      <div className="bs-marketplace-date-picker__menu__calendar__day__dots">
        {[0, 1, 2].map((index) => (
          <div
            key={`dot-${index}`}
            className={classNames({
              'bs-marketplace-date-picker__menu__calendar__day__dots__dot--hidden':
                numberOfDots < index + 1 && index === 0,
              'bs-marketplace-date-picker__menu__calendar__day__dots__dot':
                numberOfDots >= index + 1,
              'bs-marketplace-date-picker__menu__calendar__day__dots__dot--none':
                numberOfDots < index + 1 && index !== 0,
            })}
          >
            •
          </div>
        ))}
      </div>
    </div>
  );
};

export default pure(MarketplaceDatePickerDay);
