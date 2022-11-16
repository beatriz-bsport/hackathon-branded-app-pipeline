import React from 'react';
import OfferSpotSelector from '../../../../pages/checkout/booker-modules/OfferBooker/OfferSpotSelector';

import SpotSelectorDialogComponent from './SpotSelectorDialog.component';

const CustomTemplate = (args: Props) => (
  <SpotSelectorDialogComponent {...args} />
);

const CustomTemplateOffer = (args: Props) => <OfferSpotSelector {...args} />;

export const Template = CustomTemplate.bind({});
export const TemplateOffer = CustomTemplateOffer.bind({});

const offer = {
  company: 2,
  activity: 265,
  level: 1,
  custom_level: 1,
  available: true,
  coach_override: null,
  coach: {
    firstname: 'Alpha',
    lastname: 'Brundy',
    name: 'Alpha Brundy',
    gender: 'F',
    rating: '-1.00',
    id: 4,
    birthday: '1993-01-22',
    photo: null,
    description:
      'dsjkhfksdfjhsdkf\r\njkl\r\n\r\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ',
    phone: '+33292827373',
    color: '',
    email: 'alpha@gmail.com',
    associated_coach_id: 6,
    associatedcoach_set: [6],
    disabled: false,
    default_payment_rule_id: 8,
    coach_payment_rule_id: 6,
    workshop_coach_payment_rule_id: null,
    private_coach_payment_rule_id: 17,
    coach_payment_rule_group_id: null,
    private_slots_coach_payment_rules: [],
    facebook_url: 'fffeeffe00000',
    instagram_url: 'moon0000',
    has_access_to_coach_space: false,
  },
  partner_max_booking_count: 6,
  establishment: {
    id: 29,
    title: 'Cycling',
    cover: null,
    location: {
      address: "11 Rue de l'Arbre Sec , 75001 Paris, France",
      address_line_1: "11 Rue de l'Arbre Sec",
      address_line_2: '',
      zipcode: '75001',
      city: 'Paris',
      state: '',
      country: 'France',
      country_code: '',
      geometry: 'SRID=4326;POINT (45.7666584 4.835410599999999)',
      latitude: 45.7666584,
      longitude: 4.835410599999999,
    },
    specific_info: 'rfzer\n\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ',
    easy_access: {
      id: 3389,
      lines: ['GL'],
      name: 'Laroche-Migennes',
    },
    associatedestablishment_set: [29],
    tzname: 'Europe/Paris',
    practical_info: '',
    capacity: 30,
    on_booking_notification: [],
    disabled: false,
    has_next_slots: true,
    establishment_billing_group_id: 4,
  },
  meta_activity: {
    id: 1,
    name: 'Yoga',
    cover_main: 'https://assets.dev.bsport.io/theme/logo_bsoprt_txt.jpg',
    rating: '-1.00',
    SCT: 46,
    parent_category: 9,
    images: [],
    establishments: [
      {
        id: 1,
      },
      {
        id: 1,
      },
      {
        id: 52,
      },
      {
        id: 19,
      },
      {
        id: 3,
      },
      {
        id: 53,
      },
      {
        id: 29,
      },
      {
        id: 29,
      },
      {
        id: 29,
      },
      {
        id: 1,
      },
      {
        id: 29,
      },
      {
        id: 53,
      },
    ],
    next_slot: '2022-06-29T00:00:00+02:00',
    company: 2,
    activities: [1, 27, 302, 37, 46, 291, 268, 265, 266, 317, 301, 288],
    description: 'Yoga\n\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ',
    last_booking_minutes: 0,
    last_discard_minutes: 0,
    first_booking_minutes_until: 259200,
    is_workshop: false,
    is_broadcast: false,
    customer_enabled: true,
    color: '',
    on_booking_notification: [],
    auto_discard_active: false,
    auto_discard_hours_before_start: 6,
    auto_discard_min_bookings_nb: 1,
    ordering_in_category: 1,
    category: null,
    alt_cover_main: 'cover main',
  },
  credit_price_override: 1,
  credit_price: 1,
  date_start: '2022-06-29T00:00:00+02:00',
  duration_minute: 30,
  effectif: 10,
  establishment_override: null,
  id: 17975,
  recurrence_id: '1d30b0ff-cba8-4a1d-afbd-deca10531ebc',
  waiting_list_max_size: 10,
  waiting_list_disabled: false,
  bookings: [],
  booking_options: [],
  meta_activity_color: '',
  tot_slots: 0,
  validated_booking_count: 0,
  full: false,
  is_waiting_list_full: false,
  timezone_name: 'Europe/Paris',
  room_blueprint: 4,
  coach_payment_rule_id: null,
  available_on_partnership: true,
  manager_only: false,
  whitelist_tags: [],
  blacklist_tags: [],
  group: null,
  allow_guest_offer: true,
};

const RoomBlueprint2 = {
  id: 195,
  company: 670,
  name: 'Sans titre',
  canvas: {
    elements: [
      {
        id: 'spot-1656404933666',
        data: {
          x: 528,
          y: 991,
          index: 1,
          selected: false,
          asset_identifier: 'spot_free',
          rotation: 0,
        },
        type: 'spot',
      },
      {
        type: 'rect',
        id: 'rect-1656427522002',
        data: {
          x: 148,
          y: 103,
          width: 1850,
          height: 1925,
          stroke: 'black',
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427525525',
        data: {
          x: 323,
          y: 363,
          index: 2,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427526065',
        data: {
          x: 1433,
          y: 388,
          index: 3,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427526468',
        data: {
          x: 1088,
          y: 633,
          index: 4,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427527088',
        data: {
          x: 1778,
          y: 913,
          index: 5,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427527763',
        data: {
          x: 628,
          y: 1593,
          index: 6,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427528303',
        data: {
          x: 413,
          y: 1418,
          index: 7,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427528675',
        data: {
          x: 1333,
          y: 1483,
          index: 8,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'spot',
        id: 'spot-1656427528955',
        data: {
          x: 1578,
          y: 1738,
          index: 9,
          asset_identifier: 'spot_free',
          selected: false,
        },
      },
      {
        type: 'teacher',
        id: 'teacher-1656427532702',
        data: {
          x: 983,
          y: 288,
          rotation: 0,
          stroke: 'black',
        },
      },
    ],
  },
  establishment: 2286,
  disabled: false,
};

const RoomBlueprint = {
  id: 197,
  company: 670,
  name: 'Sans titre',
  canvas: {
    elements: [
      {
        id: 'spot-1656410101531',
        data: {
          x: 578,
          y: 1904,
          index: 1,
          rotation: 0,
          selected: false,
          asset_identifier: 'spot_free',
        },
        type: 'spot',
      },
      {
        id: 'spot-1656410106515',
        data: {
          x: 1635,
          y: 196,
          index: 2,
          rotation: 0,
          selected: false,
          asset_identifier: 'spot_free',
        },
        type: 'spot',
      },
      {
        id: 'spot-1656410106830',
        data: {
          x: 887,
          y: 1531,
          index: 3,
          rotation: 0,
          selected: false,
          asset_identifier: 'spot_free',
        },
        type: 'spot',
      },
      {
        id: 'spot-1656410760326',
        data: {
          x: 465,
          y: 1026,
          index: 4,
          rotation: 0,
          selected: false,
          asset_identifier: 'spot_free',
        },
        type: 'spot',
      },
    ],
  },
  establishment: 2286,
  disabled: false,
};

const spotType = {
  id: 14,
  name: 'gfdgdf',
  shape: 'square',
  prefix: 's',
  company: 670,
  blueprint: 191,
  fill_color: '#bd10e0',
  free_image: null,
  taken_image: null,
  stroke_color: '#c5f811',
  establishment: '2286',
  selected_image: null,
};

Template.args = {
  roomBlueprint: RoomBlueprint2,
  assets: {},
  takenSpot: [],
  onSelectSpot: () => {},
  onSelectTakenSpot: () => {},
  open: true,
  offer: offer,
  // fullScreen: true,
};
TemplateOffer.args = {
  roomBlueprintsById: [RoomBlueprint2],
  assets: {},
  takenSpot: [],
  updateSpotForOffer: () => {},
  refreshOfferStatus: () => {},
  assetByIdBlueprintByIdentifier: {},
  offer: offer,
  onCancel: () => {},
  offerStatusById: {},
  spotTypes:[],
  // fullScreen: true,
};

// export default {
//   title: 'SpotSelectorDialogComponent',
//   component: SpotSelectorDialogComponent,
//   parameters: {
//     docs: {
//       page: null,
//     },
//   },
// };

export default {
  title: 'OfferSpotSelector',
  component: OfferSpotSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};
