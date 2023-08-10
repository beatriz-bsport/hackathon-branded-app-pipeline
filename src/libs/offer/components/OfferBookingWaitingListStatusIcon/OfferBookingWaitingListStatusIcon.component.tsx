import React from 'react';

import classNames from 'classnames';
import Block from '@material-ui/icons/Block';
import HourglassFull from '@material-ui/icons/HourglassFull';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  isError: boolean;
};

const OfferBookingWaitingListStatusIcon: React.FC<Props> = ({ isError }) => {
  return (
    <div className="bs-offer-booking-waiting-list-status__container">
      <div
        className={classNames(
          'bs-offer-booking-waiting-list-status__icon__container',
          {
            'bs-offer-booking-waiting-list-status__icon__error': isError,
            'bs-offer-booking-waiting-list-status__icon__default': !isError,
          },
        )}
      >
        {isError ? (
          <Block style={{ fontSize: 40 }} />
        ) : (
          <HourglassFull style={{ fontSize: 40 }} />
        )}
      </div>
    </div>
  );
};

export const OfferBookingWaitingListStatusIconForStorybook =
  marketplaceCssHoc()(OfferBookingWaitingListStatusIcon);

export default React.memo(OfferBookingWaitingListStatusIcon);
