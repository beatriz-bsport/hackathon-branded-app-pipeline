import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classNames from 'classnames';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import { getIsLateBookingCancellation } from '#utils/datetime';
import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import BottomDrawer from '#Fabrique/BottomDrawer';
import Typography from '#Fabrique/Typography';
import Alert from '#Fabrique/Alert';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

import type {
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
} from '#libs/booking/types';

import './styles.css';

type Props = {
  isOpen: boolean;
  /** The selected consumer booking in the modal */
  booking?: ConsumerBooking;
  /** The selected consumer booking in the modal */
  privateBooking?: ConsumerPrivateBooking;
  /** The selected consumer booking in the modal */
  bookingOption?: ConsumerBookingOption;
  /** The timezone retrieved from the company's theme */
  timezone: string;
  /** The session time display config retrieved from the company's theme */
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  /** Whether a booking cancellation is processing or not */
  isLoading: boolean;
  /** If the booking's offer is part of a group, get related bookings that will be cancelled */
  relatedBookings: ConsumerBooking[];
  handleClose: () => void;
  /** Handler for booking cancellation */
  cancelBooking: (params: {
    isRefundingCredit: boolean;
    bookingId?: number;
    privateBookingId?: number;
    bookingOptionId?: number;
  }) => void;
};

type RelatedBookingProps = Pick<Props, 'timezone' | 'sessionTimeDisplay'> & {
  booking: ConsumerBooking;
};

const RelatedBookingItem: React.FC<RelatedBookingProps> = React.memo(
  ({ booking, timezone, sessionTimeDisplay }) => {
    const bookingDate = useConsumerBookingDateTime({
      dateStart: booking.offer_date_start,
      durationMinute: booking.offer_duration_minute,
      establishmentTimezoneName: booking.establishment.tzname,
      isMetaActivityBroadcast: booking.meta_activity.is_broadcast,
      sessionTimeDisplay,
      timezoneName: timezone,
    });

    return (
      <ListItem
        captionText={booking.meta_activity.name}
        className="bs-consumer-booking-cancel-drawer__list__item"
        label={bookingDate}
      />
    );
  },
);

const ConsumerBookingCancelDrawer: React.FC<Props> = ({
  isOpen,
  booking,
  privateBooking,
  bookingOption,
  timezone,
  sessionTimeDisplay,
  relatedBookings,
  handleClose,
  cancelBooking,
  isLoading,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common']);

  const bookingDate = useConsumerBookingDateTime({
    dateStart:
      booking?.offer_date_start ||
      privateBooking?.date_start ||
      bookingOption?.offer?.date_start,
    durationMinute:
      booking?.offer_duration_minute ??
      privateBooking?.private_slot?.duration_minutes ??
      bookingOption?.offer?.duration_minute,
    establishmentTimezoneName: (booking || privateBooking || bookingOption)
      ?.establishment?.tzname,
    isMetaActivityBroadcast: (booking || bookingOption)?.meta_activity
      ?.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const hasRelatedBookings = !!relatedBookings && relatedBookings?.length > 0;

  const isLateCancellation = getIsLateBookingCancellation(
    moment().format(),
    booking?.meta_activity?.last_discard_minutes ??
      privateBooking?.private_service?.last_discard_minutes,
    booking?.offer?.date_start || privateBooking?.date_start,
  );

  const drawerTitle = (() => {
    if (bookingOption) {
      return t(
        'consumerSpace:reworked.myBookings.cancelModal.confirm.consumerBookingOption',
      );
    }
    if (privateBooking) {
      return t(
        'consumerSpace:reworked.myBookings.cancelModal.confirm.consumerPrivateBooking',
      );
    }
    return t(
      'consumerSpace:reworked.myBookings.cancelModal.confirm.consumerBooking',
    );
  })();

  const drawerSubtitle = `${
    (booking || bookingOption)?.meta_activity?.name ||
    privateBooking?.private_service?.name
  } - ${bookingDate}`;

  const drawerMessage = (() => {
    if (isLateCancellation) {
      return t('consumerSpace:reworked.myBookings.cancelModal.noRefund');
    }
    if (bookingOption) {
      return t('consumerSpace:reworked.myBookings.cancelModal.waitlist');
    }
    return t(
      'consumerSpace:reworked.myBookings.cancelModal.creditsWillBeRefunded',
      {
        count: booking?.credit_consumed ?? privateBooking?.private_slot?.credit,
      },
    );
  })();

  const handleSubmit = useCallback(() => {
    cancelBooking({
      isRefundingCredit: !isLateCancellation,
      bookingId: booking?.id,
      privateBookingId: privateBooking?.id,
      bookingOptionId: bookingOption?.id,
    });
  }, [
    cancelBooking,
    booking?.id,
    privateBooking?.id,
    bookingOption?.id,
    isLateCancellation,
  ]);

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-booking-details-drawer__root"
      modalDialogProps={{
        title: drawerTitle,
        subtitle: drawerSubtitle,
        onClose: handleClose,
        onCancel: handleClose,
        confirmLabel: drawerTitle,
        onConfirm: handleSubmit,
        cancelLabel: t('common:back'),
        isSubmitLoading: isLoading,
      }}
    >
      <div
        className={classNames(
          'bs-consumer-booking-cancel-drawer__related-bookings',
          {
            'bs-consumer-booking-cancel-drawer__related-bookings--hidden':
              !hasRelatedBookings,
          },
        )}
      >
        <Typography
          className="bs-consumer-booking-cancel-drawer__text"
          variant="body-md"
        >
          {t('consumerSpace:reworked.myBookings.cancelModal.group.message')}
        </Typography>

        <Alert
          hideLeftIcon
          className="bs-consumer-booking-cancel-drawer__alert"
          color="warning"
          title={t(
            'consumerSpace:reworked.myBookings.cancelModal.group.alert.title',
          )}
          variant="weak"
        >
          {t(
            'consumerSpace:reworked.myBookings.cancelModal.group.alert.message',
          )}
        </Alert>

        <Typography
          className="bs-consumer-booking-cancel-drawer__text"
          variant="title-sm"
        >
          {t('consumerSpace:reworked.myBookings.cancelModal.group.listTitle')}
        </Typography>

        <List className="bs-consumer-booking-cancel-drawer__list">
          {(relatedBookings || []).map((relatedBooking) => (
            <RelatedBookingItem
              key={relatedBooking.id}
              booking={relatedBooking}
              sessionTimeDisplay={sessionTimeDisplay}
              timezone={timezone}
            />
          ))}
        </List>
      </div>

      <div
        className={classNames(
          'bs-consumer-booking-cancel-modal__dialog__message',
          {
            'bs-consumer-booking-cancel-modal__dialog__message--hidden':
              !!relatedBookings,
          },
        )}
      >
        <Typography
          className="bs-consumer-booking-cancel-modal__dialog__text"
          variant="body-md"
        >
          {drawerMessage}
        </Typography>
      </div>
    </BottomDrawer>
  );
};

export default React.memo(ConsumerBookingCancelDrawer);
