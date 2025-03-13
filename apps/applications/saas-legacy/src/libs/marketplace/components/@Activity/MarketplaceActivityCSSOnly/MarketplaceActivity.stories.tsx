import React from 'react';
import { useMuiThemeToCssVars } from '../../../../../hooks/useMuiThemeToCssVars';
import MarketplaceActivityV2 from './MarketplaceActivityCSSOnly.component';
// @ts-expect-error
import bsportTheme from '../../../../../../.storybook/bsport-theme';
import { useTheme } from '@material-ui/core';
import { any } from 'prop-types';

// TODO Create Clean Factory : https://gitlab.com/bsport/bsport-saas/-/issues/1277
const metaActivity = {
  id: 36497,
  name: 'Atelier Shakti Dance : Special Nouvelle lune',
  cover_main: 'https://d2r95z4j5cc9cx.cloudfront.net/activity/14_QmGP0Da.jpg',
  rating: '-1.00',
  SCT: 119,
  parent_category: 9,
  images: any,
  establishments: [{ id: 154 }],
  next_slot: '2022-04-30T14:30:00+02:00',
  company: 89,
  activities: [125631],
  description:
    "Atelier Shakti Dance : Special Nouvelle lune\r\n\r\n Le 30 avril aura lieu la nouvelle lune sous le signe du Taureau. \r\n\r\nLa nouvelle lune est un moment de commencement, propice aux nouveaux départs, aux nouveaux projets. Pour célébrer ce cycle et envoyer nos intentions,  Stessy vous propose un atelier rituel & shakti dance. \r\n\r\n\r\nLa shakti dance® est la pratique consciente de la danse combinée avec la sagesse ancestrale du yoga. Elle a été créée et développée par Sara Avtar, danseuse depuis son enfance et professeur de Kundalini Yoga depuis plus de 20 ans.\r\n\r\nÉtirements de yoga, méditation en mouvement, mantras, danse… Cette discipline réveille l’énergie Shakti (énergie vitale) qui vibre en chacun de nous, facilite le lâcher prise et encourage le mouvement libre et intuitif du corps. (Il n'est pas nécessaire de savoir danser )",
  last_booking_minutes: 0,
  last_discard_minutes: 2880,
  first_booking_minutes_until: 259200,
  is_workshop: true,
  is_broadcast: false,
  customer_enabled: true,
  color: '#ff2100',
  on_booking_notification: any,
  auto_discard_active: false,
  auto_discard_hours_before_start: 6,
  auto_discard_min_bookings_nb: 1,
  ordering_in_category: 516,
  // @ts-expect-error
  category: null,
};

// TODO Create Clean Factory : https://gitlab.com/bsport/bsport-saas/-/issues/1276
const offer = {
  id: 364927,
  company: 89,
  activity: 125631,
  level: 1,
  available: true,
  coach_override: {
    firstname: 'Stessy',
    lastname: 'Leduc',
    name: 'Stessy Leduc',
    gender: 'F',
    rating: '-1.00',
    id: 21828,
    birthday: '1988-08-17',
    photo: 'https://d2r95z4j5cc9cx.cloudfront.net/user/46_MnjAD5z.jpg',
    description:
      "Ancienne journaliste, c’est lors d’un long voyage initiatique autour du monde il y a 5 ans, que j’ai découvert le yoga et la spiritualité. Je me suis alors formée à différentes pratiques pour devenir professeure de Kundalini Yoga, de Shakti dance (le yoga de la danse) et animatrice d'ateliers méditation et philosophie dans les écoles, avec l’association SEVE, fondée par l’écrivain et philosophe Frederic Lenoir.\r\n\r\nDepuis, je donne des cours dans différents studios à Nantes, à Paris et j’organise des retraites pour les femmes dans plusieurs régions de France. Passionnée par la puissance du féminin sacré, je propose aussi des cercles de femmes et des rituels autour de cette thématique. ",
    phone: '+33768326992',
    color: '',
    email: 'stessyleduc@gmail.com',
    associated_coach_id: 30955,
    associatedcoach_set: [30955, 22871],
    disabled: false,
    // @ts-expect-error
    default_payment_rule_id: null,
    // @ts-expect-error
    coach_payment_rule_id: null,
    // @ts-expect-error
    workshop_coach_payment_rule_id: null,
    // @ts-expect-error
    private_coach_payment_rule_id: null,
    // @ts-expect-error
    coach_payment_rule_group_id: null,
    // @ts-expect-error
    private_slots_coach_payment_rules: [],
    facebook_url: '',
    instagram_url: '',
    has_access_to_coach_space: false,
  },
  male: 5,
  female: 6,
  other: 3,
  meta_activity: metaActivity,
  coach: {
    firstname: 'Stessy',
    lastname: 'Leduc',
    name: 'Stessy Leduc',
    gender: 'F',
    rating: '-1.00',
    id: 21828,
    birthday: '1988-08-17',
    photo: 'https://d2r95z4j5cc9cx.cloudfront.net/user/46_MnjAD5z.jpg',
    description:
      "Ancienne journaliste, c’est lors d’un long voyage initiatique autour du monde il y a 5 ans, que j’ai découvert le yoga et la spiritualité. Je me suis alors formée à différentes pratiques pour devenir professeure de Kundalini Yoga, de Shakti dance (le yoga de la danse) et animatrice d'ateliers méditation et philosophie dans les écoles, avec l’association SEVE, fondée par l’écrivain et philosophe Frederic Lenoir.\r\n\r\nDepuis, je donne des cours dans différents studios à Nantes, à Paris et j’organise des retraites pour les femmes dans plusieurs régions de France. Passionnée par la puissance du féminin sacré, je propose aussi des cercles de femmes et des rituels autour de cette thématique. ",
    phone: '+33768326992',
    color: '',
    email: 'stessyleduc@gmail.com',
    associated_coach_id: 30955,
    associatedcoach_set: [30955, 22871],
    disabled: false,
    // @ts-expect-error
    default_payment_rule_id: null,
    // @ts-expect-error
    coach_payment_rule_id: null,
    // @ts-expect-error
    workshop_coach_payment_rule_id: null,
    // @ts-expect-error
    private_coach_payment_rule_id: null,
    // @ts-expect-error
    coach_payment_rule_group_id: null,
    // @ts-expect-error
    private_slots_coach_payment_rules: [],
    facebook_url: '',
    instagram_url: '',
    has_access_to_coach_space: false,
  },
  partner_max_booking_count: 6,
  establishment: {
    id: 154,
    title: 'LA GRANDE SALLE DU CENTRE ELEMENT',
    cover:
      'https://d2r95z4j5cc9cx.cloudfront.net/etablissement/Horizontale_crocodile_Suspensions_gong.jpg',
    location: {
      address: '7 Rue des Guillemites, 75004 Paris, France',
      address_line_1: '7 Rue des Guillemites',
      address_line_2: '',
      zipcode: '75004',
      city: 'Paris',
      state: '',
      country: 'France',
      country_code: 'FR',
      geometry: 'SRID=4326;POINT (48.8584229 2.3574909)',
      latitude: 48.8584229,
      longitude: 2.3574909,
    },
    specific_info:
      'Le Centre Elément a pour vocation de proposer une approche holistique du bien-être, en travaillant sur le corps physique, émotionnel et énergétique. Amplifiez votre expérience en ajoutant à votre pratique régulière : Un air purifié et énergisant, une eau vivifiée, des technologies innovantes.',
    associatedestablishment_set: [52],
    tzname: 'Europe/Paris',
    practical_info: 'porte en verre sur rue',
    capacity: 30,
    // @ts-expect-error
    on_booking_notification: [],
    disabled: false,
    has_next_slots: true,
    // @ts-expect-error
    establishment_billing_group_id: null,
  },
  credit_price_override: 1,
  credit_price: 1,
  date_start: '2022-04-30T14:30:00+02:00',
  duration_minute: 150,
  effectif: 30,
  recurrence_id: '4879da5d-fdec-47d1-a507-985a072d63a5',
  waiting_list_max_size: 5,
  waiting_list_disabled: false,
  // @ts-expect-error
  bookings: [],
  // @ts-expect-error
  booking_options: [],
  meta_activity_color: '',
  tot_slots: 0,
  validated_booking_count: 0,
  full: true,
  is_waiting_list_full: false,
  timezone_name: 'Europe/Paris',
  // @ts-expect-error
  room_blueprint: null,
  coach_payment_rule_id: 78,
  available_on_partnership: true,
  manager_only: false,
};

// @ts-expect-error
const Template = (args: Props) => {
  const styles = useMuiThemeToCssVars();
  const theme = useTheme();
  return (
    <div style={{ ...styles, margin: 48 }}>
      <MarketplaceActivityV2 {...args} theme={theme} />
    </div>
  );
};

export const ListState = Template.bind({});

ListState.args = {
  offer: offer,
  customLevel: {
    id: 12,
    name: 'Hardcore',
    color: '#ff00aa',
  },
  theme: bsportTheme,
};

export default {
  title: 'Components/Marketplace/MarketplaceActivityV2',
  component: MarketplaceActivityV2,
  parameters: {
    docs: {
      page: null,
    },
  },
};
