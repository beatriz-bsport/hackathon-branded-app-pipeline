import React, { useCallback, useMemo } from 'react';
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

import type { ConsumerBooking } from '#libs/booking/types';

import './styles.css';

type Props = {
  /** The selected consumer booking in the modal */
  booking: ConsumerBooking;
  /** The timezone retrieved from the company's theme */
  timezone: string;
  /** The session time display config retrieved from the company's theme */
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  /** Whether a bookiing cancellation is processing or not */
  isLoading: boolean;
  /** If the booking's offer is part of a group, get related bookings that will be cancelled */
  relatedBookings: ConsumerBooking[];
  /** Handler function fired when clicking on blanket or cancel button */
  onClose: () => void;
  /** Handler for offer cancellation */
  cancelBooking: (bookingId: number, isRefundingCredit: boolean) => void;
};

type RelatedBookingProps = Pick<Props, 'timezone' | 'sessionTimeDisplay'> & {
  booking: ConsumerBooking;
};

const RelatedBookingItem: React.FC<RelatedBookingProps> = React.memo(
  ({ booking, timezone, sessionTimeDisplay }) => {
    const bookingDate = useConsumerBookingDateTime({
      offerDateStart: booking.offer_date_start,
      offerDurationMinute: booking.offer_duration_minute,
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
  sessionTimeDisplay,
  timezone,
  isLoading,
  relatedBookings,
  onClose,
  cancelBooking,
}) => {
  const { t } = useTranslation(['consumerSpace', 'datetime', 'common']);

  const bookingDate = useConsumerBookingDateTime({
    offerDateStart: booking.offer_date_start,
    offerDurationMinute: booking.offer_duration_minute,
    establishmentTimezoneName: booking.establishment.tzname,
    isMetaActivityBroadcast: booking.meta_activity.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const hasRelatedBookings = !!relatedBookings && relatedBookings?.length > 0;

  const modalSubtitle = `${booking.meta_activity.name} - ${bookingDate}`;

  const isLateCancellation = useMemo(
    () =>
      getIsLateBookingCancellation(
        moment().format(),
        booking.meta_activity?.last_discard_minutes,
        booking.offer?.date_start,
      ),
    [booking.meta_activity?.last_discard_minutes, booking.offer?.date_start],
  );

  const modalMessage = isLateCancellation
    ? t('consumerSpace:reworked.myBookings.cancelModal.noRefund')
    : t('consumerSpace:reworked.myBookings.cancelModal.creditsWillBeRefunded', {
        count: booking.credit_consumed,
      });

  const handleSubmit = useCallback(() => {
    if (booking?.id) cancelBooking(booking?.id, !isLateCancellation);
  }, [booking?.id, cancelBooking, isLateCancellation]);

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
        confirmLabel={t('consumerSpace:reworked.myBookings.cancelModal.title')}
        isSubmitLoading={isLoading}
        onCancel={onClose}
        onClose={onClose}
        onConfirm={handleSubmit}
        size={hasRelatedBookings ? 'lg' : 'md'}
        subtitle={modalSubtitle}
        title={t('consumerSpace:reworked.myBookings.cancelModal.title')}
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
