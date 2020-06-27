import moment from 'moment';

export function isOfferInThePast(offer) {
  return !moment(offer.date_start).isSameOrBefore(moment());
}

export function isOfferBookableYet(offer) {
  if (offer.meta_activity) {
    return moment(offer.date_start)
      .add(-offer.meta_activity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment());
  }
  return null;
}

export function urlToMarketplace(companyName, companyId) {
  return `/m/${companyName.replace(' ', '-')}/${companyId}`;
}
