import React from 'react';

import clsx from 'clsx';
import Block from '@material-ui/icons/Block';
import HourglassFull from '@material-ui/icons/HourglassFull';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

export type Props = {
  isError: boolean;
};

const OfferBookingWaitingListStatusIcon: React.FC<Props> = ({ isError }) => {
  return (
    <div className="bs-offer-booking-waiting-list-status__container">
      <div
        className={clsx(
          'bs-offer-booking-waiting-list-status__icon__container',
          {
            'bs-offer-booking-waiting-list-status__icon__error': isError,
            'bs-offer-booking-waiting-list-status__icon__default': !isError,
          },
        )}
      >
        {isError ? (
          <Block fontSize="large" />
        ) : (
          <HourglassFull fontSize="large" />
        )}
      </div>
    </div>
  );
};

export const OfferBookingWaitingListStatusIconForStorybook =
  marketplaceCssHoc()(OfferBookingWaitingListStatusIcon);

export default React.memo(OfferBookingWaitingListStatusIcon);
