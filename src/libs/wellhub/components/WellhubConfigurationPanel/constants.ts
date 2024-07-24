import type { WellhubGym } from '#src/libs/wellhub/types';

/**
 * Array of mock WellhubGym data for testing purposes.
 * Used for development and will be removed once integration is complete.
 */
export const WELLHUB_GYMS: WellhubGym[] = [
  {
    uuid: '4c89e81a-0a04-48b4-a93d-c50a88650c06',
    are_webhooks_configured: true,
    gym_name: 'Fit Zone',
    gym_id: 101,
    company: 10,
    establishments: [
      {
        associatedestablishment_set: [2, 3],
        capacity: 50,
        cover: 'http://testserver:8000/media/etablissement/Barca_unsplash.jpg',
        disabled: false,
        easy_access: {
          id: 1,
          lines: ['Line 1', 'Line 3'],
          name: 'Easy Access Line A',
        },
        establishment_billing_group_id: 1001,
        has_next_slots: true,
        id: 852,
        location: {
          address: '123 Fitness Street',
          latitude: '48.858844',
          longitude: '2.294351',
        },
        practical_info: 'Open 24/7',
        related_company: 10,
        specific_info: 'Yoga and Pilates available',
        title: 'Main Gym',
        tzname: 'Europe/Paris',
      },
      {
        associatedestablishment_set: [2, 3],
        capacity: 30,
        cover: '',
        disabled: false,
        easy_access: {
          id: 1,
          lines: ['Line 1', 'Line 3'],
          name: 'Easy Access Line A',
        },
        establishment_billing_group_id: 1001,
        has_next_slots: true,
        id: 39,
        location: {
          address: '123bis Fitness Street',
          latitude: '48.858844',
          longitude: '2.294351',
        },
        practical_info: 'Open 24/7',
        related_company: 10,
        specific_info: 'Reformer Pilates available',
        title: 'Special Gym',
        tzname: 'Europe/Paris',
      },
    ],
    products: [
      { id: 1, name: 'Personal Training Session', price: 50 },
      { id: 2, name: 'Yoga Class', price: 20 },
    ],
  },
  {
    uuid: '9c0cb517-ac2b-4db7-b431-bd47fc73169c',
    are_webhooks_configured: true,
    gym_name: 'Power House Gym',
    gym_id: 102,
    company: 20,
    establishments: [
      {
        associatedestablishment_set: [4],
        capacity: 70,
        cover:
          'http://testserver:8000/media/etablissement/miguel-angel-hernandez-Nwc-Z3_aEvw-unsplash.jpg',
        disabled: true,
        easy_access: {
          id: 2,
          lines: ['Line 2', 'Line 5'],
          name: 'Easy Access Line B',
        },
        establishment_billing_group_id: null,
        has_next_slots: false,
        id: 157,
        location: {
          address: '456 Muscle Avenue',
          latitude: '40.712776',
          longitude: '-74.005974',
        },
        practical_info: 'Closed on Sundays',
        related_company: 20,
        specific_info: 'Specialized in weightlifting',
        title: 'Powerhouse Studio',
        tzname: 'America/New_York',
      },
    ],
    products: [
      { id: 3, name: 'Weightlifting Session', price: 60 },
      { id: 4, name: 'Gym Membership', price: 100 },
    ],
  },
  {
    uuid: '414756c2-241c-4407-8c74-72ce8429b02c',
    are_webhooks_configured: true,
    gym_name: 'Wellness Center',
    gym_id: 103,
    company: 30,
    establishments: [
      {
        associatedestablishment_set: [5, 6],
        capacity: 40,
        cover: '',
        disabled: false,
        easy_access: {
          id: 3,
          lines: ['Line 4', 'Line 6'],
          name: 'Easy Access Line C',
        },
        establishment_billing_group_id: 1003,
        has_next_slots: true,
        id: 210,
        location: {
          address: '789 Health Road',
          latitude: '34.052235',
          longitude: '-118.243683',
        },
        practical_info: 'Family-friendly environment',
        related_company: 30,
        specific_info: 'Includes swimming pool and sauna',
        title: 'Wellness Hub',
        tzname: 'America/Los_Angeles',
      },
    ],
    products: [
      { id: 5, name: 'Swimming Pool Access', price: 30 },
      { id: 6, name: 'Sauna Session', price: 25 },
    ],
  },
];
