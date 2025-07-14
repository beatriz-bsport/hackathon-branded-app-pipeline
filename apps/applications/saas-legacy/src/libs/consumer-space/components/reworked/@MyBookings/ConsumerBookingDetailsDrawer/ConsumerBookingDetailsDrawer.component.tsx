import React from 'react';

import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code.js';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization.js';

import { useTranslation } from 'react-i18next';
import {
  formatAsDate,
  getIsLateBookingCancellation,
} from '#src/utils/datetime';
import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';

import BottomDrawer from '#Fabrique/BottomDrawer';
import ConsumerBookingDetailsCard from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard';

import type {
  ConsumerBooking,
  ConsumerBookingOption,
  ConsumerPrivateBooking,
} from '#src/libs/booking/types';
import { getLevelTranslation } from '#src/libs/level/utils';

type Props = {
  isOpen: boolean;
  timezone: string;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  selectedBooking: ConsumerBooking;
  selectedPrivateBooking: ConsumerPrivateBooking;
  selectedBookingOption: ConsumerBookingOption;
  handleClose: () => void;
};

const ConsumerBookingDetailsDrawer: React.FC<Props> = ({
  isOpen,
  timezone,
  sessionTimeDisplay,
  selectedBooking,
  selectedPrivateBooking,
  selectedBookingOption,
  handleClose,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common', 'translation']);

  const selectedBookingDate = useConsumerBookingDateTime({
    dateStart:
      selectedBooking?.offer?.date_start ||
      selectedPrivateBooking?.date_start ||
      selectedBookingOption?.offer?.date_start,
    durationMinute:
      selectedBooking?.offer?.duration_minute ??
      selectedPrivateBooking?.private_slot?.duration_minutes ??
      selectedBookingOption?.offer?.duration_minute,
    establishmentTimezoneName:
      selectedBooking?.establishment?.tzname ||
      selectedPrivateBooking?.establishment?.tzname ||
      selectedBookingOption?.establishment?.tzname,
    isMetaActivityBroadcast: selectedBooking?.meta_activity?.is_broadcast,
    sessionTimeDisplay,
    timezoneName: timezone,
  });

  const levelName = getLevelTranslation(
    selectedBooking?.level?.id ||
      selectedPrivateBooking?.private_slot?.id ||
      selectedBookingOption?.level?.id,
    selectedBooking?.level?.name ||
      selectedPrivateBooking?.private_slot?.name ||
      selectedBookingOption?.level?.name,
    t,
  );

  const isLateCancellation = getIsLateBookingCancellation(
    selectedBooking?.date_canceled || selectedPrivateBooking?.date_canceled,
    selectedBooking?.meta_activity?.last_discard_minutes ??
      selectedPrivateBooking?.private_service?.last_discard_minutes,
    selectedBooking?.offer?.date_start || selectedPrivateBooking?.date_start,
  );

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-booking-details-drawer__root"
      modalDialogProps={{
        title: t('consumerSpace:reworked.myBookings.detailsCard.drawerTitle'),
        onClose: handleClose,
        onCancel: handleClose,
        cancelLabel: t('common:back'),
      }}
    >
      <ConsumerBookingDetailsCard
        cancellationDate={formatAsDate(
          selectedBooking?.date_canceled ||
            selectedPrivateBooking?.date_canceled,
        )}
        className="bs-consumer-booking-details-drawer__details-card"
        coachDescription={
          selectedBooking?.coach?.description ||
          selectedPrivateBooking?.coach?.description ||
          selectedBookingOption?.coach?.description
        }
        coachFacebookURL={
          selectedBooking?.coach?.facebook_url ||
          selectedPrivateBooking?.coach?.facebook_url ||
          selectedBookingOption?.coach?.facebook_url
        }
        coachInstagramURL={
          selectedBooking?.coach?.instagram_url ||
          selectedPrivateBooking?.coach?.instagram_url ||
          selectedBookingOption?.coach?.instagram_url
        }
        coachName={
          selectedBooking?.coach?.name ||
          selectedPrivateBooking?.coach?.name ||
          selectedBookingOption?.coach?.name
        }
        coachOverrideDescription={selectedBooking?.coach_override?.description}
        coachOverrideName={selectedBooking?.coach_override?.name}
        coachOverridePicture={selectedBooking?.coach_override?.photo}
        coachPicture={
          selectedBooking?.coach?.photo ||
          selectedPrivateBooking?.coach?.photo ||
          selectedBookingOption?.coach?.photo
        }
        consumerPaymentPackAvailableCredits={
          selectedBooking?.consumer_payment_pack?.available_credits ??
          selectedPrivateBooking?.private_consumer_pass?.private_pass?.credits -
            selectedPrivateBooking?.private_consumer_pass?.used_credits
        }
        consumerPaymentPackPenaltyDisabledFrom={
          selectedBooking?.consumer_payment_pack?.penalty_disabled_from
        }
        consumerPaymentPackPenaltyDisabledUntil={
          selectedBooking?.consumer_payment_pack?.penalty_disabled_until
        }
        consumerPaymentPackUsedCredits={
          selectedBooking?.consumer_payment_pack?.used_credits ??
          selectedPrivateBooking?.private_consumer_pass?.used_credits
        }
        creditsToRefund={
          selectedBooking?.offer?.credit_price ??
          selectedPrivateBooking?.private_slot?.credit
        }
        date={selectedBookingDate}
        description={
          selectedBooking?.meta_activity?.description ||
          selectedPrivateBooking?.private_service?.description ||
          selectedBookingOption?.meta_activity?.description
        }
        establishmentAddress={
          (selectedBooking || selectedPrivateBooking || selectedBookingOption)
            ?.establishment?.location?.address
        }
        establishmentTitle={
          (selectedBooking || selectedPrivateBooking || selectedBookingOption)
            ?.establishment?.title
        }
        isCancelled={
          !!(selectedBooking || selectedPrivateBooking)?.date_canceled ||
          !!selectedBookingOption?.cancelled
        }
        isCancelledFromManager={
          (selectedBooking || selectedPrivateBooking)?.booking_status_code ===
          BOOKING_STATUS_CANCELLED_BY_MANAGER.id
        }
        isCancelledFromOffer={
          (selectedBooking || selectedPrivateBooking)?.booking_status_code ===
          BOOKING_STATUS_CANCELLED_BY_OFFER.id
        }
        isConsumerPaymentPackDisabled={
          selectedBooking?.consumer_payment_pack?.disabled ||
          selectedPrivateBooking?.private_consumer_pass?.disabled
        }
        isLateCancellation={isLateCancellation}
        levelName={levelName}
        metaActivityLastDiscardMinutes={
          selectedBooking?.meta_activity?.last_discard_minutes ??
          selectedPrivateBooking?.private_service?.last_discard_minutes ??
          selectedBookingOption?.meta_activity?.last_discard_minutes
        }
        metaActivityName={
          selectedBooking?.offer?.name_override ||
          selectedBooking?.meta_activity?.name ||
          selectedPrivateBooking?.private_service?.name ||
          selectedBookingOption?.meta_activity?.name
        }
        metaActivityPicture={
          selectedBooking?.meta_activity?.cover_main ||
          selectedPrivateBooking?.private_service?.cover_main ||
          selectedBookingOption?.meta_activity?.cover_main
        }
        paymentPackName={
          selectedBooking?.consumer_payment_pack?.payment_pack?.name ||
          (!selectedPrivateBooking?.is_unpaid &&
            selectedPrivateBooking?.private_consumer_pass?.private_pass?.name)
        }
        paymentPackTotalCredits={
          selectedBooking?.consumer_payment_pack?.payment_pack?.credits ??
          selectedPrivateBooking?.private_consumer_pass?.private_pass?.credits
        }
        sessionTimeDisplay={sessionTimeDisplay}
        showPlaceholder={
          !(selectedBooking || selectedPrivateBooking || selectedBookingOption)
        }
        timezoneName={timezone}
        workshopLinkedOffers={undefined}
      />
    </BottomDrawer>
  );
};

export default React.memo(ConsumerBookingDetailsDrawer);
