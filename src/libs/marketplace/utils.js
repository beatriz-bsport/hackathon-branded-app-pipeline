import moment from 'moment';

export function isOfferInThePast(offer) {
  return !moment(offer.date_start).isSameOrBefore(moment());
}
