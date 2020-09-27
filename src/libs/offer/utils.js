import moment from 'moment-timezone';

export function isOfferInThePast(offer) {
  return !moment(offer.date_start).isSameOrBefore(moment());
}
