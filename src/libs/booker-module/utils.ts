import moment from 'moment-timezone';
import memoize from 'memoize-one';

import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
} from '@bsport/common/lib/master-data/bookable-status';

import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  MaxoutBooking,
  ConsumerPaymentPack,
} from '../consumer-payment-pack/types';
import { getPaymentPackTimeLimitation } from '../payment-packs/utils';

import { Offer_FULL, OfferStatus } from '../offer/types';

import { PaymentPack } from '../payment-packs/types';
import { PaymentCombo } from '../payment-combo/types';

const DATE_FORMAT = 'YYYY-MM-DD';

export type SelectedPack = {
  consumerPaymentPack?: ConsumerPaymentPack<PaymentPack> | null;
  paymentPackCombo?: PaymentCombo | null;
  paymentPack?: PaymentPack | null;
};

export type OfferConstraint = {
  credit: number;
  minDate?: string;
  maxDate?: string;
};

/*
 * Utility function to be able to know, from the
 * offer in the list :
 * - the validity intervale of date in which we should find a pass working
 * - the nb of credits needed to make these bookings
 */
export const getOfferContraints = (
  baseOffer: Offer_FULL,
  selectedOffers: Array<{ offer: Offer_FULL; extra_data: any }>,
  offerStatusById: { [id: number]: OfferStatus },
) => {
  let credit = 0;
  const offerStatus = offerStatusById[baseOffer.id];
  if (
    offerStatus &&
    offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE
  ) {
    credit = baseOffer.credit_price;
  }

  let minDate = moment(baseOffer.date_start);
  let maxDate = minDate;

  const selectedBookable = selectedOffers.filter((o) => {
    const _offerStatus = offerStatusById[o.offer.id];
    return _offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
  });

  selectedBookable.forEach((offerData) => {
    credit += offerData.offer.credit_price;
    const dateStart = moment(offerData.offer.date_start);
    if (dateStart.isBefore(minDate)) {
      minDate = dateStart;
    }
    if (dateStart.isAfter(maxDate)) {
      maxDate = dateStart;
    }
  });

  return {
    credit,
    minDate: minDate.format(DATE_FORMAT),
    maxDate: maxDate.format(DATE_FORMAT),
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
  selectedOffers: Array<{ offer: Offer_FULL; extra_data: any }>,
  selectedPack: SelectedPack,
  acceptDoubleBooking: boolean,
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
        const { isBookable, isWaitingList } = getOfferFeature(
          o,
          offerStatusById,
          acceptDoubleBooking,
        );
        areBookable = areBookable || isBookable;
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
  offerStatusById: any,
  acceptDoubleBooking: boolean,
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
    };
  }
  const isRegistered = offerStatus.is_registered;
  const isRegisteredWaitingList =
    offerStatus.waiting_list_status ===
    OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED;
  const isBookable =
    (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE ||
      offerStatus.waiting_list_status ===
        OFFER_WAITING_LIST_STATUS_CONVERTIBLE) &&
    (!isRegistered || acceptDoubleBooking);

  const isWaitingList =
    offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
    offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN &&
    !isRegistered &&
    (acceptDoubleBooking || !isRegisteredWaitingList);

  return {
    isBookable,
    isWaitingList,
    loading: false,
    isRegistered,
    isRegisteredWaitingList,
    noInteraction: (!isWaitingList && !isBookable) || offerStatus.is_registered,
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
  }: {
    isBookable: boolean;
    isWaitingList: boolean;
    isRegistered: boolean;
    isRegisteredWaitingList: boolean;
  },
  t: (x: string, data?: any) => string,
) => {
  let message = t('booking:bookingModule.offer.locked');
  let icon = 'block';

  if (!isBookable && isRegistered) {
    return {
      message: t('booking:bookingModule.offer.isAlreadyRegistered'),
      icon,
    };
  }

  if (!isWaitingList) {
    if (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON) {
      const date = moment(offer.date_start)
        .tz(offer.timezone_name)
        .subtract(offer.meta_activity.first_booking_minutes_until)
        .format('LL');
      message = t('booking:bookingModule.offer.isTooSoon', { date });
      icon = 'wait';
    } else if (
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE
    ) {
      message = t('booking:bookingModule.offer.isTooLate');
      icon = 'block';
    } else if (!isRegisteredWaitingList) {
      message = t('booking:bookingModule.offer.isWaitingListFull');
    } else if (isRegisteredWaitingList) {
      message = t('booking:bookingModule.option.isAlreadyOnWaitingList');
      icon = 'wait';
    }
  } else if (
    offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN
  ) {
    message = t('booking:bookingModule.option.waitingListOpen');
    icon = 'wait';
  }
  return { message, icon };
};

export const getAvailableConsumerPack = memoize(
  (
    offersConstraint: OfferConstraint,
    consumerPaymentPackList: ConsumerPaymentPack<PaymentPack>[],
    consumerPaymentPackMaxoutBooking: { [key: string]: MaxoutBooking },
    selectedOffer: Offer_FULL[],
    offer: Offer_FULL,
    tz_name: string,
  ) => {
    const { credit, minDate, maxDate } = offersConstraint;
    return consumerPaymentPackList.filter((cpp) => {
      const maxout = consumerPaymentPackMaxoutBooking[cpp.id];

      let matchMaxout = true;

      if (maxout) {
        Object.values(maxout).forEach((period) => {
          period.forEach((maxout_data) => {
            let matchingOffers = 0;

            const maxoutStart = moment(maxout_data.start_date);
            const maxoutEnd = moment(maxout_data.end_date);

            [offer, ...selectedOffer].forEach((o: Offer_FULL) => {
              const offerStart = moment(o.date_start);

              if (
                offerStart.isSameOrAfter(maxoutStart) &&
                offerStart.isSameOrBefore(maxoutEnd)
              ) {
                matchingOffers += 1;
              }
            });

            if (matchingOffers > maxout_data.booking_available) {
              matchMaxout = false;
            }
          });
        });
      }

      return (
        matchMaxout &&
        (cpp.payment_pack.unlimited || cpp.available_credits >= credit) &&
        moment(cpp.starting_date)
          .tz(tz_name)
          .isSameOrBefore(moment(minDate).tz(tz_name)) &&
        moment(cpp.ending_date)
          .tz(tz_name)
          .isSameOrAfter(moment(maxDate).tz(tz_name))
      );
    });
  },
);

export const getAvailablePaymentPacks = memoize(
  (
    offersConstraint: OfferConstraint,
    paymentPackList: PaymentPack[],
    selectedOffer: Offer_FULL[],
    offer: Offer_FULL,
    tz_name: string,
  ) => {
    const { credit, minDate, maxDate } = offersConstraint;

    return paymentPackList.filter((pp) => {
      const byDay = {};
      const byWeek = {};
      const byMonth = {};

      [offer, ...selectedOffer].forEach((o) => {
        const date = moment(o.date_start);
        const dayOfYear = date.dayOfYear();
        const weekNumber = date.week();
        const month = date.month();

        if (!byDay[dayOfYear]) {
          byDay[dayOfYear] = 1;
        } else {
          byDay[dayOfYear] += 1;
        }

        if (!byWeek[weekNumber]) {
          byWeek[weekNumber] = 1;
        } else {
          byWeek[weekNumber] += 1;
        }

        if (!byMonth[month]) {
          byMonth[month] = 1;
        } else {
          byMonth[month] += 1;
        }
      });

      let matchMaxBookingNumber = true;

      Object.values(byDay).forEach((bookingNumber) => {
        if (
          pp.max_bookings_per_day !== null &&
          bookingNumber > pp.max_bookings_per_day
        ) {
          matchMaxBookingNumber = false;
        }
      });

      Object.values(byWeek).forEach((bookingNumber) => {
        if (
          pp.max_bookings_per_week !== null &&
          bookingNumber > pp.max_bookings_per_week
        ) {
          matchMaxBookingNumber = false;
        }
      });

      Object.values(byMonth).forEach((bookingNumber) => {
        if (
          pp.max_bookings_per_month !== null &&
          bookingNumber > pp.max_bookings_per_month
        ) {
          matchMaxBookingNumber = false;
        }
      });

      const { start, end } = getPaymentPackTimeLimitation(pp, minDate);
      return (
        matchMaxBookingNumber &&
        (pp.unlimited || pp.credits >= credit) &&
        start.tz(tz_name).isSameOrBefore(moment(minDate).tz(tz_name)) &&
        end.tz(tz_name).isSameOrAfter(moment(maxDate).tz(tz_name))
      );
    });
  },
);
export const getAvailableComboPacks = memoize(
  (
    offersConstraint: OfferConstraint,
    paymentComboList: PaymentCombo[],
    selectedOffers: Offer_FULL[],
    offer: Offer_FULL,
    tz_name: string,
  ) => {
    const { credit, minDate, maxDate } = offersConstraint;
    return paymentComboList.filter((pc) => {
      const paymentPacks = pc.payment_packs
        .filter((comboItem) => !!comboItem.data)
        .map((comboItem) => comboItem.data);

      const availablePaymentPacks = getAvailablePaymentPacks(
        offersConstraint,
        paymentPacks,
        selectedOffers,
        offer,
        tz_name,
      );

      return pc.payment_packs
        .filter((comboItem) => {
          return !!availablePaymentPacks.find((pp) => pp.id === comboItem.id);
        })
        .find((comboItem) => {
          const { start, end } = getPaymentPackTimeLimitation(
            comboItem.data,
            minDate,
          );

          return (
            (comboItem.data.unlimited || comboItem.data.credits >= credit) &&
            start.tz(tz_name).isSameOrBefore(moment(minDate).tz(tz_name)) &&
            end.tz(tz_name).isSameOrAfter(moment(maxDate).tz(tz_name))
          );
        });
    });
  },
);
