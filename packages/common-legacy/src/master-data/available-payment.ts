import memoize from 'memoize-one';
import { DateTime } from 'luxon';
import {
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE,
  OFFER_WAITING_LIST_STATUS_FULL,
} from './error-codes/buyable-item-can-not-be-bought';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from './bookable-status';
import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
} from './waiting-list-status';
import {
  ConsumerPaymentPack,
  MaxoutBooking,
  OfferConstraint,
  OfferStatus,
  Offer_FULL,
  PaymentCombo,
  PaymentPack,
  SelectedPack,
  PaymentPackWithMaxoutData,
  ContractWithPaymentPack,
  MaxoutData,
  OfferREST,
} from './available-payment.type';
import { getMaxoutInfoForPaymentPack } from './payment-pack-maxout-data';

export const getPaymentPackTimeLimitation = (
  paymentPack: PaymentPack,
  baseDate: string,
) => {
  const { validity_daterange, duration_days, duration_months, duration_years } =
    paymentPack;

  if (!paymentPack) {
    return { start: null, end: null };
  }
  if (validity_daterange) {
    const dateRange: {
      lower: string;
      upper: string;
    } = JSON.parse(validity_daterange);
    return {
      start: DateTime.fromISO(dateRange.lower),
      end: DateTime.fromISO(dateRange.upper),
    };
  }

  const sanitizedBaseDate = baseDate
    ? DateTime.fromISO(baseDate)
    : DateTime.now();

  return {
    start: sanitizedBaseDate,
    end: sanitizedBaseDate
      .plus({
        day: duration_days || 0,
        month: duration_months || 0,
        year: duration_years || 0,
      })
      .minus({ day: 1 }),
  };
};

/*
 * Utility function to be able to know, from the
 * offer in the list :
 * - the validity intervale of date in which we should find a pass working
 * - the nb of credits needed to make these bookings
 * - if allow_guest_offer is required
 */
export const getOfferContraints = (
  baseOffer: Offer_FULL,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedOffers: Array<{ offer: Offer_FULL; extra_data: any }>,
  offerStatusById: { [id: number]: OfferStatus },
  additionalGuestCount: number = 0,
  isBookingForInviteeOnly: boolean = false,
) => {
  let credit = 0;
  const offerStatus = offerStatusById[baseOffer.id];
  if (
    offerStatus &&
    offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE
  ) {
    credit = baseOffer.credit_price * (1 + additionalGuestCount);
  }

  let minDate = DateTime.fromISO(baseOffer.date_start);
  let maxDate = minDate;

  const selectedBookable = selectedOffers.filter((o) => {
    const _offerStatus = offerStatusById[o.offer.id];
    return _offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
  });

  selectedBookable.forEach((offerData) => {
    credit += offerData.offer.credit_price * (additionalGuestCount + 1);
    const dateStart = DateTime.fromISO(offerData.offer.date_start);
    if (dateStart < minDate) {
      minDate = dateStart;
    }
    if (dateStart > maxDate) {
      maxDate = dateStart;
    }
  });

  const mustAllowBookingForGuest =
    additionalGuestCount > 0 || isBookingForInviteeOnly;

  return {
    credit,
    minDate: minDate.toISODate(),
    maxDate: maxDate.toISODate(),
    mustAllowBookingForGuest,
  };
};

/*
 * Utility function which returns if :
 * - is bookable (create a booking)
 * - is registerable on waiting list (create a BookingOption)
 * - nb of bookable stuff (for pass limitation and stuff)
 */
export const getCanIBook = (
  offerStatusById: { [id: number]: OfferStatus },
  baseOffer: Offer_FULL,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedOffers: Array<{ offer: Offer_FULL; extra_data: any }>,
  selectedPack: SelectedPack,
  acceptDoubleBooking: boolean,
  acceptDoubleBookingWorkshop: boolean,
) => {
  let areBookable = false;
  let areWaitingList = false;
  if (!baseOffer || !offerStatusById) {
    return { areBookable, areWaitingList };
  }

  [baseOffer, ...selectedOffers.map((offerData) => offerData.offer)].forEach(
    (o) => {
      const { id } = o;
      if (offerStatusById[id]) {
        const { isBookable, isWaitingList, blockedByTags } = getOfferFeature(
          o,
          offerStatusById,
          acceptDoubleBooking,
          acceptDoubleBookingWorkshop,
        );
        areBookable = areBookable || (isBookable && !blockedByTags);
        areWaitingList = areWaitingList || isWaitingList;
      }
    },
  );

  areBookable =
    areBookable &&
    (!!selectedPack?.consumerPaymentPack ||
      !!selectedPack?.paymentPack ||
      !!selectedPack?.paymentPackCombo);

  return { areBookable, areWaitingList };
};

/*
 * From an offer and status, tells you what you can you do with it
 */
export const getOfferFeature = (
  offer: Offer_FULL,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offerStatusById: any,
  acceptDoubleBooking: boolean,
  acceptDoubleBookingWorkshop: boolean,
) => {
  const offerStatus = offerStatusById[offer.id];
  if (!offerStatus) {
    return {
      isBookable: false,
      isWaitingList: false,
      loading: true,
      isRegistered: false,
      isRegisteredWaitingList: false,
      noInteraction: true,
      blocked_by_tags: true,
    };
  }

  const isRegistered = offerStatus.is_registered;
  const isRegisteredWaitingList =
    offerStatus.waiting_list_status ===
    OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED;
  const isBookable =
    offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE &&
    (!isRegistered ||
      (acceptDoubleBooking && !offer.meta_activity?.is_workshop) ||
      (acceptDoubleBookingWorkshop && offer.meta_activity?.is_workshop)) &&
    !offerStatus.blocked_by_tags;

  const isWaitingList =
    offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
    offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN &&
    !isRegistered &&
    ((acceptDoubleBooking && !offer.meta_activity?.is_workshop) ||
      (acceptDoubleBookingWorkshop && offer.meta_activity?.is_workshop) ||
      !isRegisteredWaitingList);

  const isBookingLimitReached =
    offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE;

  return {
    isBookable,
    isWaitingList,
    loading: false,
    isRegistered,
    isRegisteredWaitingList,
    noInteraction:
      (!isWaitingList && !isBookable) ||
      offerStatus.is_registered ||
      offerStatus.blocked_by_tags,
    blockedByTags: offerStatus.blocked_by_tags,
    isBookingLimitReached,
  };
};

export const getMainOfferNotBookableReason = (
  offer: Offer_FULL,
  offerStatus: OfferStatus,
  {
    isBookable,
    isWaitingList,
    isRegistered,
    isRegisteredWaitingList,
    blockedByTags,
  }: {
    isBookable: boolean;
    isWaitingList: boolean;
    isRegistered: boolean;
    isRegisteredWaitingList: boolean;
    blockedByTags: boolean;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (x: string, data?: any) => string,
) => {
  let message = t('booking:bookingModule.offer.locked');
  let icon = 'block';

  if (blockedByTags) {
    return {
      message: t('booking:bookingModule.offer.blockedByTags'),
      icon,
    };
  }
  if (!isBookable && isRegistered) {
    return {
      message: t('booking:bookingModule.offer.isAlreadyRegistered'),
      icon,
    };
  }

  if (!isWaitingList) {
    if (offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON) {
      const date = DateTime.fromISO(offer.date_start)
        .setZone(offer.timezone_name)
        .minus({ minute: offer.meta_activity.first_booking_minutes_until })
        .toFormat('DDD');
      message = t('booking:bookingModule.offer.isTooSoon', { date });
      icon = 'wait';
    } else if (
      offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE
    ) {
      message = t('booking:bookingModule.offer.isTooLate');
      icon = 'block';
    } else if (
      offerStatus?.waiting_list_status ===
      OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS
    ) {
      message = t(
        'booking:bookingModule.option.waitingListLockedByPendingBookings',
      );
      icon = 'wait';
    } else if (
      offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
    ) {
      message = t('booking:bookingModule.offer.isWaitingListFull');
    } else if (isRegisteredWaitingList) {
      message = t('booking:bookingModule.option.isAlreadyOnWaitingList');
      icon = 'wait';
    } else if (
      offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE
    ) {
      message = t('booking:bookingModule.option.isBookingLimitReached');
      icon = 'block';
    }
  } else if (
    offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE
  ) {
    message = t('booking:bookingModule.option.isBookingLimitReached');
    icon = 'block';
  } else if (
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN
  ) {
    message = t('booking:bookingModule.option.waitingListOpen');
    icon = 'wait';
  }
  return { message, icon };
};

export const getMainOfferNotBookableReasonWithTitle = (
  offer: Offer_FULL,
  offerStatus: OfferStatus,
  {
    isBookable,
    isWaitingList,
    isRegistered,
    isRegisteredWaitingList,
    blockedByTags,
  }: {
    isBookable: boolean;
    isWaitingList: boolean;
    isRegistered: boolean;
    isRegisteredWaitingList: boolean;
    blockedByTags: boolean;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (x: string, data?: any) => string,
) => {
  let title = t('booking:newBookingModule.blockedReasons.default.title');
  let message = t('booking:newBookingModule.blockedReasons.default.message');
  let icon = 'block';
  let color = 'error';
  let isWaitingListOpenMainReason = false;

  if (blockedByTags) {
    return {
      title: t('booking:newBookingModule.blockedReasons.blockedByTags.title'),
      message: t(
        'booking:newBookingModule.blockedReasons.blockedByTags.message',
      ),
      icon: 'label-off',
      color: 'error',
    };
  }
  if (!isBookable && isRegistered) {
    return {
      title: t(
        'booking:newBookingModule.blockedReasons.isAlreadyRegistered.title',
      ),
      message: t(
        'booking:newBookingModule.blockedReasons.isAlreadyRegistered.message',
      ),
      icon: 'done-all',
      color: 'success',
    };
  }

  if (!isWaitingList) {
    if (offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON) {
      const bookingWindowStartDatetime = offer.booking_window_start_datetime
        ? DateTime.fromISO(offer.booking_window_start_datetime).setZone(
            offer.timezone_name,
          )
        : DateTime.fromISO(offer.date_start)
            .setZone(offer.timezone_name)
            .minus({ minute: offer.meta_activity.first_booking_minutes_until });

      const formattedDatetime = bookingWindowStartDatetime.toLocaleString(
        DateTime.DATETIME_MED,
      );

      title = t('booking:newBookingModule.blockedReasons.isTooSoon.title');
      message = t('booking:newBookingModule.blockedReasons.isTooSoon.message', {
        date: formattedDatetime,
      });
      icon = 'update';
      color = 'warning';
    } else if (
      offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE
    ) {
      title = t('booking:newBookingModule.blockedReasons.isTooLate.title');
      message = t('booking:newBookingModule.blockedReasons.isTooLate.message');
      icon = 'timer-off';
      color = 'error';
    } else if (
      offerStatus?.waiting_list_status ===
      OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS
    ) {
      title = t(
        'booking:newBookingModule.blockedReasons.waitingListLockedByPendingBookings.title',
      );
      message = t(
        'booking:newBookingModule.blockedReasons.waitingListLockedByPendingBookings.message',
      );
      icon = 'block';
      color = 'error';
    } else if (
      offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
    ) {
      title = t(
        'booking:newBookingModule.blockedReasons.isWaitingListFull.title',
      );
      message = t(
        'booking:newBookingModule.blockedReasons.isWaitingListFull.message',
      );
      icon = 'block';
      color = 'error';
    } else if (isRegisteredWaitingList) {
      title = t(
        'booking:newBookingModule.blockedReasons.isAlreadyOnWaitingList.title',
      );
      message = t(
        'booking:newBookingModule.blockedReasons.isAlreadyOnWaitingList.message',
      );
      icon = 'hourglass';
      color = 'success';
    } else if (
      offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE
    ) {
      title = t(
        'booking:newBookingModule.blockedReasons.isBookingLimitReached.title',
      );
      message = t(
        'booking:newBookingModule.blockedReasons.isBookingLimitReached.message',
      );
      icon = 'block';
    }
  } else if (
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN
  ) {
    title = t('booking:newBookingModule.blockedReasons.waitingListOpen.title');
    message = t(
      'booking:newBookingModule.blockedReasons.waitingListOpen.message',
    );
    icon = 'hourglass';
    color = 'success';
    isWaitingListOpenMainReason = true;
  }
  return {
    title,
    message,
    icon,
    color,
    isWaitingListOpenMainReason,
  };
};

/*
 * Filter out CPP that don't have enough credits / validity period long enough
 * annotates MaxoutData to the result (taking into account
 * bookings already made with this cpp)
 */
export const getAvailableConsumerPack = memoize(
  (
    offersConstraint: OfferConstraint,
    consumerPaymentPackList: ConsumerPaymentPack<PaymentPack>[],
    consumerPaymentPackMaxoutBooking: { [key: string]: MaxoutBooking },
    selectedOffers: Offer_FULL[] | OfferREST[],
    offer: Offer_FULL | OfferREST,
    tz_name: string,
  ) => {
    const tzName = tz_name || 'Europe/Paris';
    const { credit, minDate, maxDate, mustAllowBookingForGuest } =
      offersConstraint;

    const minLuxonDate = DateTime.fromISO(minDate).setZone(tzName);
    const maxLuxonDate = DateTime.fromISO(maxDate).setZone(tzName);

    return consumerPaymentPackList
      .filter((cpp) => !!cpp.payment_pack)
      .filter((cpp) => {
        return (
          (cpp.payment_pack.unlimited || cpp.available_credits >= credit) &&
          DateTime.fromISO(cpp.starting_date).setZone(tzName) <= minLuxonDate &&
          DateTime.fromISO(cpp.ending_date).setZone(tzName) >= maxLuxonDate &&
          (cpp.payment_pack.allow_guest_pass || !mustAllowBookingForGuest)
        );
      })
      .map((cpp) => {
        const maxout = consumerPaymentPackMaxoutBooking[cpp.id];

        const maxoutData = getMaxoutInfoForPaymentPack(
          cpp.payment_pack,
          [offer, ...selectedOffers].map((offer: Offer_FULL) =>
            DateTime.fromISO(offer.date_start).setZone(tzName),
          ),
          maxout,
        );

        return { ...cpp, ...maxoutData };
      });
  },
);

/*
 * Filter out PP that don't have enough credits / validity period long enough
 * annotates MaxoutData to the result
 */
export const getAvailablePaymentPacks = memoize(
  (
    offersConstraint: OfferConstraint,
    paymentPackList: PaymentPack[],
    selectedOffer: Offer_FULL[] | OfferREST[],
    offer: Offer_FULL | OfferREST,
    tz_name: string,
  ) => {
    const { credit, minDate, maxDate, mustAllowBookingForGuest } =
      offersConstraint;
    const tzName = tz_name || 'Europe/Paris';

    return paymentPackList
      .filter((pp) => {
        const { start, end } = getPaymentPackTimeLimitation(pp, minDate);
        return (
          (pp.unlimited || pp.credits >= credit) &&
          start.setZone(tzName) <= DateTime.fromISO(minDate).setZone(tzName) &&
          end.setZone(tzName) >= DateTime.fromISO(maxDate).setZone(tzName) &&
          (pp.allow_guest_pass || !mustAllowBookingForGuest)
        );
      })
      .map((pp) => {
        const maxoutData = getMaxoutInfoForPaymentPack(
          pp,
          [offer, ...selectedOffer].map((offer: Offer_FULL) =>
            DateTime.fromISO(offer.date_start).setZone(tzName),
          ),
        );

        return { ...pp, ...maxoutData };
      });
  },
);

/*
 * Computes MaxoutData for a list fo PaymentPack
 */
const getMaxoutFromAvailablePaymentPacks = (
  availablePaymentPacks: Array<PaymentPackWithMaxoutData>,
): MaxoutData => {
  const sortedMaxedOutPacks = [...availablePaymentPacks]
    .filter((pp) => pp.exceedsBookingMaxout)
    .sort((a, b) => (b.maxoutInfo?.nb ?? 0) - (a.maxoutInfo?.nb ?? 0));
  const firstMaxedOutPack = sortedMaxedOutPacks[0];

  return {
    exceedsBookingMaxout: !!firstMaxedOutPack,
    maxoutInfo: firstMaxedOutPack ? firstMaxedOutPack.maxoutInfo : null,
  };
};

/*
 * Filter out PaymentCombo that don't have at least 1 PP with
 * enough credits / validity period long enough.
 * annotates MaxoutData to the result
 */
export const getAvailableComboPacks = memoize(
  (
    offersConstraint: OfferConstraint,
    paymentComboList: PaymentCombo[],
    selectedOffers: Offer_FULL[] | OfferREST[],
    offer: Offer_FULL | OfferREST,
    tz_name: string,
  ) => {
    const tzName = tz_name || 'Europe/Paris';
    return paymentComboList
      .map((pc) => {
        const paymentPacks = pc.payment_packs
          .filter((comboItem) => !!comboItem.data)
          .map((comboItem) => comboItem.data);

        const availablePaymentPacks: Array<PaymentPackWithMaxoutData> =
          getAvailablePaymentPacks(
            offersConstraint,
            paymentPacks,
            selectedOffers,
            offer,
            tzName,
          );

        if (availablePaymentPacks.length === 0) return null;

        // Determine which maxout info to display on the whole payment combo
        const { exceedsBookingMaxout, maxoutInfo } =
          getMaxoutFromAvailablePaymentPacks(availablePaymentPacks);

        return { ...pc, exceedsBookingMaxout, maxoutInfo };
      })
      .filter((pc) => pc !== null);
  },
);

/*
 * Filter out Contracts that don't have a PP with
 * enough credits / validity period long enough.
 * annotates MaxoutData to the result
 */
export const getAvailableContracts = memoize(
  (
    offersConstraint: OfferConstraint,
    contractList: Array<ContractWithPaymentPack>,
    selectedOffers: Offer_FULL[] | OfferREST[],
    offer: Offer_FULL | OfferREST,
    tz_name: string,
  ) => {
    const tzName = tz_name || 'Europe/Paris';
    return contractList
      .map((contract) => {
        const availablePaymentPacks: Array<PaymentPackWithMaxoutData> =
          getAvailablePaymentPacks(
            offersConstraint,
            contract.allPaymentPacks || [],
            selectedOffers,
            offer,
            tzName,
          );

        if (availablePaymentPacks.length === 0) return null;

        const { exceedsBookingMaxout, maxoutInfo } =
          getMaxoutFromAvailablePaymentPacks(availablePaymentPacks);

        return { ...contract, exceedsBookingMaxout, maxoutInfo };
      })
      .filter((contract) => contract !== null);
  },
);
