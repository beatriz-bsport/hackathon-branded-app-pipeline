import { fakerFR as faker } from '@faker-js/faker';
// @ts-ignore
import FactoryBot from 'ya-factorybot';
import moment from 'moment-timezone';
import memoize from 'memoize-one';

import metaActivityFactory from '#libs/group-offer/factories';
import { levelFactory } from '#libs/level/factory';
import { coachFactory } from '#libs/associated-coach/factories';
import { establishment_factory } from '#libs/establishment/factory';
import { offerGroupFactory } from '#libs/group-offer/factory';

FactoryBot.define('Offer', {
  company: 1,
  id: 1,
  title: faker.lorem.word(2),
  name: faker.lorem.word(2),
  available: true,
  is_full: false,
  date_start: moment().add(1, 'day').format('YYYY-MM-DD'),
  waiting_list_disabled: false,
  full: false,
  is_waiting_list_full: false,
  activity_id: 1,
  waiting_list_max_size: 5,
  category: '',
  cover_main: faker.image.food(),
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
  otherGender: 2,
  partner_max_booking_count: 6,
  credit_price_override: 1,
  custom_level: 1,
  activity: 1,
  coach: 1,
  coach_override: null,
  establishment_override: null,
  establishment: 1,
  meta_activity: 1,
  group: null,
  additional_coaches: [],
});

export const offerFactory = memoize(
  (
    props: {
      withLevel?: boolean;
      withCoach?: boolean;
      withCoachOverride?: boolean;
      withEstablishmentOverride?: boolean;
      withEstablishment?: boolean;
      withMetaActivity?: boolean;
      withGroup?: boolean;
      offerStatus?: 'waitingList' | 'cancel' | 'past' | 'bookable' | 'future';
    },
    // Here a index to byPassMemoization in some cases
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _memoizeOverride?: number,
  ) => {
    const {
      withLevel,
      withCoach,
      withCoachOverride,
      withEstablishmentOverride,
      withEstablishment,
      withMetaActivity,
      withGroup,
      offerStatus,
    } = props;

    const offer = FactoryBot.Offer.create(1);

    if (withLevel) {
      offer.custom_level = levelFactory(6);
    }

    if (withCoach) {
      offer.coach = coachFactory(1);
    }
    if (withCoachOverride) {
      offer.coach_override = coachFactory(1);
    }
    if (withEstablishmentOverride) {
      offer.establishment_override = establishment_factory(1)[0];
    }
    if (withEstablishment) {
      offer.establishment = establishment_factory(1)[0];
    }
    if (withMetaActivity) {
      offer.meta_activity = metaActivityFactory.MetaActivity.create(1);
    }
    if (withGroup) {
      offer.group = offerGroupFactory();
    }

    if (offerStatus === 'waitingList') {
      offer.is_full = true;
      offer.full = true;
    }

    if (offerStatus === 'past') {
      offer.date_start = moment().subtract(1, 'week').format('YYYY-MM-DD');
    }

    if (offerStatus === 'cancel') {
      offer.is_full = true;
      offer.available = false;
    }

    if (offerStatus === 'future') {
      offer.date_start = moment().add(1, 'year').format('YYYY-MM-DD');
    }

    return offer;
  },
);
