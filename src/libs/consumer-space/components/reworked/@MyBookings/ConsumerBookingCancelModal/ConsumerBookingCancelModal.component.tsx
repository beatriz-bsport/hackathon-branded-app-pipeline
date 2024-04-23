import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import useConsumerBookingDateTime from '#libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import { getIsLateBookingCancellation } from '#utils/datetime';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import Typography from '#Fabrique/Typography';
import Alert from '#Fabrique/Alert';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

import type {
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
  ConsumerSpaceCancelBookingParams,
} from '#libs/booking/types';

import './styles.css';
import { getCreditsDividedValue } from '#libs/theme/utils';

type Props = {
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
  /** Handler function fired when clicking on blanket or cancel button */
  onClose: () => void;
  /** Handler for booking cancellation */
  cancelBooking: (params: ConsumerSpaceCancelBookingParams) => void;
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
        className="bs-consumer-booking-cancel-modal__dialog__list__item"
        label={bookingDate}
      />
    );
  },
);

const ConsumerBookingCancelModal: React.FC<Props> = ({
  booking,
  privateBooking,
  bookingOption,
  sessionTimeDisplay,
  timezone,
  isLoading,
  relatedBookings,
  onClose,
  cancelBooking,
}) => {
  const { t } = useTranslation('consumerSpace');

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

  const modalSubtitle = `${
    (booking || bookingOption)?.offer?.name_override ||
    (booking || bookingOption)?.meta_activity?.name ||
    privateBooking?.private_service?.name
  } - ${bookingDate}`;

  const isLateCancellation = getIsLateBookingCancellation(
    moment().format(),
    booking?.meta_activity?.last_discard_minutes ??
      privateBooking?.private_service?.last_discard_minutes,
    booking?.offer?.date_start || privateBooking?.date_start,
  );

  const modalTitle = (() => {
    if (bookingOption) {
      return t(
        'consumerSpace:reworked.myBookings.cancelModal.title.consumerBookingOption',
      );
    }
    if (privateBooking) {
      return t(
        'consumerSpace:reworked.myBookings.cancelModal.title.consumerPrivateBooking',
      );
    }
    return t(
      'consumerSpace:reworked.myBookings.cancelModal.title.consumerBooking',
    );
  })();

  const modalMessage = (() => {
    if (isLateCancellation) {
      return t('consumerSpace:reworked.myBookings.cancelModal.noRefund');
    }
    if (bookingOption) {
      return t('consumerSpace:reworked.myBookings.cancelModal.waitlist');
    }
    return t(
      'consumerSpace:reworked.myBookings.cancelModal.creditsWillBeRefunded',
      {
        count: booking?.credit_consumed
          ? getCreditsDividedValue(booking?.credit_consumed)
          : getCreditsDividedValue(privateBooking?.private_slot?.credit),
      },
    );
  })();

  const modalConfirmLabel = (() => {
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
    <Blanket
      isOpen
      className="bs-consumer-booking-cancel-modal__blanket"
      onClick={onClose}
    >
      <ModalDialog
        cancelLabel={t('common:back')}
        className="bs-consumer-booking-cancel-modal__dialog"
        color="warning"
        confirmLabel={modalConfirmLabel}
        isSubmitLoading={isLoading}
        onCancel={onClose}
        onClose={onClose}
        onConfirm={handleSubmit}
        size={hasRelatedBookings ? 'lg' : 'md'}
        subtitle={modalSubtitle}
        title={modalTitle}
      >
        {hasRelatedBookings ? (
          <>
            <Typography
              className="bs-consumer-booking-cancel-modal__dialog__text"
              variant="body-md"
            >
              {t('consumerSpace:reworked.myBookings.cancelModal.group.message')}
            </Typography>

            <Alert
              hideLeftIcon
              className="bs-consumer-booking-cancel-modal__dialog__alert"
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
              className="bs-consumer-booking-cancel-modal__dialog__text"
              variant="title-sm"
            >
              {t(
                'consumerSpace:reworked.myBookings.cancelModal.group.listTitle',
              )}
            </Typography>

            <List className="bs-consumer-booking-cancel-modal__dialog__list">
              {(relatedBookings || []).map((relatedBooking) => (
                <RelatedBookingItem
                  key={relatedBooking.id}
                  booking={relatedBooking}
                  sessionTimeDisplay={sessionTimeDisplay}
                  timezone={timezone}
                />
              ))}
            </List>
          </>
        ) : (
          <Typography
            className="bs-consumer-booking-cancel-modal__dialog__text"
            variant="body-md"
          >
            {modalMessage}
          </Typography>
        )}
      </ModalDialog>
    </Blanket>
  );
};
export default React.memo(ConsumerBookingCancelModal);
