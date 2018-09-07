import React from 'react';

import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { checkA11y } from '@storybook/addon-a11y';
import {
  withKnobs,
  text,
  boolean,
  object,
  number,
  select,
} from '@storybook/addon-knobs';

import OfferCard from './OfferCard.component';

storiesOf('Calendar/OfferCard', module)
  .addDecorator(checkA11y)
  .addDecorator(withKnobs)
  .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
  .add('empty', () => {
    const bookingOptions = [];
    const pendingBookings = [];
    const validatedBookings = [];
    const offer = {
      title: 'Some activity',
      id: 46,
      date_start: '2018-08-04T23:45:10.517470+02:00',
      date_end: '2018-08-04T22:45:10.517470Z',
      price: 49,
      price_coach: 49,
      effectif: 6,
      nb_option: 0,
      nb_pending: 0,
      nb_validated: 0,
      category: 'Crossfit',
      level: 'Débutant',
      level_id: 2,
      parent_category: 8,
      etablissement: {
        id: 11,
        title: 'Delaunay Dumont SA',
        slug: null,
        city: {
          slug: 'paris',
          name: 'Paris',
        },
        cover: null,
        cover_thumbnail: null,
        location: {
          address: '13 Rue Titon, 75011 Paris, France',
          latitude: 48.85163863760986,
          longitude: 2.3863555999555532,
        },
        cover_main:
          'http://localhost:8000/media/activity/bsport_logo_vSCj4Z6.png',
      },
      name: 'Crossfit',
      coach: {
        id: 25,
        name: 'Thibault Gallet-Pierre',
        photo: '/media/user/male-76_9I2YKi3.jpg',
      },
      activity_id: 13,
      meta_activity_id: 6,
    };

    const initial = object(
      'Initial',
      offer,
      pendingBookings,
      validatedBookings,
      bookingOptions,
    );
    return (
      <OfferCard
        offer={offer}
        pendingBookings={pendingBookings}
        validatedBookings={validatedBookings}
        bookingOptions={bookingOptions}
      />
    );
  })
  .add('options-pending-and-validated-bookings', () => {
    // const bookingOptions = [];
    // const pendingBookings = [];
    // const validatedBookings = [];
    const bookingOptions = [
      {
        booking_id: null,
        cancelled: false,
        date: '2018-09-06T12:06:14.519122+02:00',
        id: 7,
        is_convertible: true,
        nb_place: 1,
        user: {
          id: 379,
          name: 'Simone Guyot',
          photo: '/media/user/male-20_55V3Um3.jpg',
        },
      },
      {
        booking_id: null,
        cancelled: false,
        date: '2018-09-06T12:06:14.519122+02:00',
        id: 6,
        is_convertible: false,
        nb_place: 1,
        user: {
          id: 12,
          name: 'Peter Guyot',
          photo: '/media/user/male-20_55V3Um3.jpg',
        },
      },
    ];
    const pendingBookings = [
      {
        user: {
          id: 34,
          name: 'Nicolas du Portal',
          photo: '/media/user/male-67_RRBPC2L.jpg',
          nb_booking: 4,
        },
        id: 39,
        date: '2018-09-03T23:45:19.073230+02:00',
        source: 'MOB',
        status: null,
        date_start: '2018-09-06 21:45:10.517633+00:00',
      },
      {
        user: {
          id: 3,
          name: 'Jean Jacques',
          photo: '/media/user/male-67_RRBPC2L.jpg',
          nb_booking: 1,
        },
        id: 38,
        date: '2018-09-03T23:45:19.073230+02:00',
        source: 'WEB',
        status: null,
        date_start: '2018-09-06 21:45:10.517633+00:00',
      },
    ];
    const validatedBookings = [
      {
        user: {
          id: 34,
          name: 'Nicolas du Portal',
          photo: '/media/user/male-67_RRBPC2L.jpg',
          nb_booking: 4,
        },
        id: 39,
        date: '2018-09-03T23:45:19.073230+02:00',
        source: 'MOB',
        status: true,
        date_start: '2018-09-06 21:45:10.517633+00:00',
      },
      {
        user: {
          id: 3,
          name: 'Jean Jacques',
          photo: '/media/user/male-67_RRBPC2L.jpg',
          nb_booking: 1,
        },
        id: 38,
        date: '2018-09-03T23:45:19.073230+02:00',
        source: 'WEB',
        status: true,
        date_start: '2018-09-06 21:45:10.517633+00:00',
      },
    ];
    const offer = {
      title: 'Some activity',
      id: 46,
      date_start: '2018-08-04T23:45:10.517470+02:00',
      date_end: '2018-08-04T22:45:10.517470Z',
      price: 49,
      price_coach: 49,
      effectif: 6,
      nb_option: 2,
      nb_pending: 2,
      nb_validated: 2,
      category: 'Crossfit',
      level: 'Débutant',
      level_id: 2,
      parent_category: 8,
      etablissement: {
        id: 11,
        title: 'Delaunay Dumont SA',
        slug: null,
        city: {
          slug: 'paris',
          name: 'Paris',
        },
        cover: null,
        cover_thumbnail: null,
        location: {
          address: '13 Rue Titon, 75011 Paris, France',
          latitude: 48.85163863760986,
          longitude: 2.3863555999555532,
        },
        cover_main:
          'http://localhost:8000/media/activity/bsport_logo_vSCj4Z6.png',
      },
      name: 'Crossfit',
      coach: {
        id: 25,
        name: 'Thibault Gallet-Pierre',
        photo: '/media/user/male-76_9I2YKi3.jpg',
      },
      activity_id: 13,
      meta_activity_id: 6,
    };

    return (
      <OfferCard
        offer={offer}
        pendingBookings={pendingBookings}
        validatedBookings={validatedBookings}
        bookingOptions={bookingOptions}
      />
    );
  });
