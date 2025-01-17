// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import memoize from 'memoize-one';

import metaActivityFactory from '#src/libs/group-offer/factories';
import { levelFactory } from '#src/libs/level/factory';
import { coachFactory } from '#src/libs/associated-coach/factories';
import { establishment_factory } from '#src/libs/establishment/factory';
import { offerGroupFactory } from '#src/libs/group-offer/factory';

FactoryBot.define('Offer', {
  company: 1,
  id: 1,
  title: faker.lorem.word(2),
  name: faker.lorem.word(2),
  available: true,
  is_full: false,
  date_start: DateTime.now().plus({ day: 1 }).toISODate(),
  waiting_list_disabled: false,
  full: false,
  is_waiting_list_full: false,
  activity_id: 1,
  waiting_list_max_size: 5,
  category: '',
  cover_main: faker.image.urlLoremFlickr({ category: 'food' }),
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
  establishment: 1,
  meta_activity: 1,
  group: null,
  additional_coaches: [],
  tot_slots: faker.number.int(100),
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

    _memoizeOverride?: number,
  ) => {
    const {
      withLevel,
      withCoach,
      withCoachOverride,
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
      offer.date_start = DateTime.now().minus({ week: 1 }).toISODate();
    }

    if (offerStatus === 'cancel') {
      offer.is_full = true;
      offer.available = false;
    }

    if (offerStatus === 'future') {
      offer.date_start = DateTime.now().plus({ year: 1 }).toISODate();
    }

    return offer;
  },
);
