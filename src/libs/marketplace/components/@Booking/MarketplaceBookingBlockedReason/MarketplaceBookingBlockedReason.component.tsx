import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SvgIconComponent } from '@material-ui/icons';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import StatusMessageWithIcon from '#components/css-only/StatusMessageWithIcon';

import './MarketplaceBookingBlockedReason.css';

export type Props = {
  bookingBlockedReason: {
    title: string;
    message: string;
    TheIcon: SvgIconComponent;
    color: string;
    isWaitingListOpenMainReason: boolean;
  };
  isLoading: boolean;
  goBackToCalendar: () => void;
};

const MarketplaceBookingBlockedReason: React.FC<Props> = (props) => {
  const TheIcon = props.bookingBlockedReason.TheIcon;
  const { t } = useTranslation('booking');

  return (
    <div className="bs-marketplace-booking-blocked-reason">
      <StatusMessageWithIcon
        actions={{
          cancel: {
            label: t('booking:newBookingModule.backToCalendar'),
            onClick: props.goBackToCalendar,
          },
        }}
        icon={
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
              className={classNames({
                'bs-marketplace-booking-blocked-reason__icon--success':
                  props.bookingBlockedReason.color === 'success',
                'bs-marketplace-booking-blocked-reason__icon--warning':
                  props.bookingBlockedReason.color === 'warning',
                'bs-marketplace-booking-blocked-reason__icon--error':
                  props.bookingBlockedReason.color === 'error',
              })}
              fontSize="large"
            />
          </div>
        }
        isLoading={props.isLoading}
        message={props.bookingBlockedReason.message}
        title={props.bookingBlockedReason.title}
      />
    </div>
  );
};

export const MarketplaceBookingBlockedReasonForStorybook = marketplaceCssHoc()(
  MarketplaceBookingBlockedReason,
);

export default React.memo(MarketplaceBookingBlockedReason);
