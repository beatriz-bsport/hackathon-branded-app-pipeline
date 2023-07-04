import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SvgIconComponent } from '@material-ui/icons';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import './MarketplaceBookingBlockedReason.css';

type Props = {
  bookingBlockedReason: {
    title: string;
    message: string;
    TheIcon: SvgIconComponent;
    color: string;
    isWaitingListOpenMainReason: boolean;
  };
  goBackToCalendar: () => void;
};

const MarketplaceBookingBlockedReason: React.FC<Props> = (props) => {
  const TheIcon = props.bookingBlockedReason.TheIcon;
  const { t } = useTranslation('booking');
  return (
    <div className="bs-marketplace-booking-blocked-reason">
      <div
        className={classNames(
          'bs-marketplace-booking-blocked-reason__icon-container',
          {
            'bs-marketplace-booking-blocked-reason__icon-container--success':
              props.bookingBlockedReason.color === 'success',
            'bs-marketplace-booking-blocked-reason__icon-container--warning':
              props.bookingBlockedReason.color === 'warning',
            'bs-marketplace-booking-blocked-reason__icon-container--error':
              props.bookingBlockedReason.color === 'error',
          },
        )}
      >
        <TheIcon
          fontSize="large"
          className={classNames({
            'bs-marketplace-booking-blocked-reason__icon--success':
              props.bookingBlockedReason.color === 'success',
            'bs-marketplace-booking-blocked-reason__icon--warning':
              props.bookingBlockedReason.color === 'warning',
            'bs-marketplace-booking-blocked-reason__icon--error':
              props.bookingBlockedReason.color === 'error',
          })}
        />
      </div>
      <div className="bs-marketplace-booking-blocked-reason__title">
        {props.bookingBlockedReason.title}
      </div>
      <div className="bs-marketplace-booking-blocked-reason__message">
        {props.bookingBlockedReason.message}
      </div>
      <button
        type="button"
        onClick={props.goBackToCalendar}
        className="bs-marketplace-booking-blocked-reason__back-button"
      >
        {t('newBookingModule.backToCalendar')}
      </button>
    </div>
  );
};

export default compose<Props, Props>(
  React.memo,
  marketplaceCssHoc(),
)(MarketplaceBookingBlockedReason);
