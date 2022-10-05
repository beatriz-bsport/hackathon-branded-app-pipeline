import React from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { Offer_FULL } from '#libs/offer/types';
import './MarketplaceDatePicker.css';

const MarketplaceDatePickerDay: React.FC<{
  date: string;
  dateDisplayed: string;
  dateSelected: string;
  handleSelect: (dateString: string) => void;
  offersThisDay: Array<Offer_FULL>;
}> = ({ date, dateSelected, dateDisplayed, handleSelect, offersThisDay }) => {
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
        onClick={() => handleSelect(date)}
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
          },
        )}
      >
        {moment(date).format('D')}
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

export default React.memo(MarketplaceDatePickerDay);
