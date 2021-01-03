import moment from 'moment-timezone';
import { Offer } from './types';

export function isOfferInThePast(offer: Offer) {
  return !moment(offer.date_start).isSameOrBefore(moment());
}

export function isOfferBookableYet(offer: Offer) {
  if (offer.meta_activity) {
    return moment(offer.date_start)
      .add(-offer.meta_activity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment());
  }
  return null;
}

export function urlToMarketplace(companyName: string, companyId: string) {
  return `/m/${companyName.replace(' ', '-')}/${companyId}`;
}
