import moment from 'moment-timezone';
import { BOOKING_SOURCE_SAAS } from '@bsport/common/lib/master-data/booking_source';
import { Offer } from '#libs/offer/types';
import { isOfferInThePast } from '#libs/marketplace/utils/offer';

const offer: Offer = {
  company: 1,
  id: 1,
  title: 'Title',
  name: 'Name',
  available: true,
  date_start: moment().add(1, 'day').format('YYYY-MM-DD'),
  date_end: moment().add(1, 'day').format('YYYY-MM-DD'),
  full: false,
  activity_id: 1,
  waiting_list_max_size: 5,
  category: '',
  cover_main: 'picture',
  effectif: 20,
  nb_option: 1,
  nb_bookings: 1,
  parent_category: 1,
  price: 1,
  price_coach: 1,
  credit_price: 1,
  timezone_name: 'Europe/Paris',
  room_blueprint: null,
  whitelist_tags: [],
  blacklist_tags: [],
  duration_minute: 60,
  allow_guest_offer: true,
  male: 4,
  female: 4,
  activity: 1,
  coach: 1,
  coach_override: null,
  establishment_override: null,
  establishment: 1,
  meta_activity: 1,
  group: null,
  additional_coaches: [],
  level: 1,
  level_id: 1,
  meta_activity_id: 10,
  roll_call_needs_validation: false,
  linked_hybrid_offer_id: 1,
  is_broadcast: false,
  source: BOOKING_SOURCE_SAAS.id,
  custom_level: 1,
  validated_booking_count: 10,
};

const offerPassed: Offer = {
  ...offer,
  date_start: moment().subtract(1, 'week').format('YYYY-MM-DD'),
};

const offerInTheFuture: Offer = {
  ...offer,
  date_start: moment().add(1, 'year').format('YYYY-MM-DD'),
};

// NOTE FROM MOMENT DOC: moment().isBefore() has undefined behavior and should not be used!
// If the code runs fast the initial created moment would be the same as the one created in isBefore to perform the check,
// so the result would be false. But if the code runs slower it's possible that the moment created in isBefore is measurably
// after the one created in moment(), so the call would return true.
// Therefore we can't test an offer with a date_start equals to moment()

describe('TEST isOfferInThePast', () => {
  it('Should return true if offer.date_start is passed', () => {
    expect(isOfferInThePast(offerPassed)).toBeTruthy();
  });
  it('Should return false if offer.date_start is in the future', () => {
    expect(isOfferInThePast(offerInTheFuture)).toBeFalsy();
  });
});
