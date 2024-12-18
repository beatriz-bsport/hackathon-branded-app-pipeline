import React from 'react';
import { MarketplaceOfferListItemForStorybook } from './MarketplaceOfferListItemCSSOnly.component';
import { levelFactory } from '#src/libs/level/factories';
import themeFactory from '#src/libs/theme/factories';
import establishmentFactoryBot from '#src/libs/establishment/factories/Establishments';
import { coachFactory } from '#src/libs/associated-coach/factories';
import { CompanyTheme } from '#src/libs/theme/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';

const fakeLevel = { 1: levelFactory() };

const fakeCompanyTheme: CompanyTheme = themeFactory.companyTheme.createOne();

const fakeEstablishment: Establishment =
  establishmentFactoryBot.Establishment.createOne();

const fakeCoach: Partial<Coach> = coachFactory();

// Create Clean Factorty : https://gitlab.com/bsport/bsport-saas/-/issues/1277
const metaActivity = {
  id: 36497,
  name: 'Atelier Shakti Dance : Special Nouvelle lune',
  cover_main: 'https://d2r95z4j5cc9cx.cloudfront.net/activity/14_QmGP0Da.jpg',
  rating: '-1.00',
  SCT: 119,
  parent_category: 9,
  // @ts-expect-error
  images: [],
  establishments: [{ id: fakeEstablishment.id }],
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
  // @ts-expect-error
  on_booking_notification: [],
  auto_discard_active: false,
  auto_discard_hours_before_start: 6,
  auto_discard_min_bookings_nb: 1,
  ordering_in_category: 516,
  // @ts-expect-error
  category: null,
};

// Create clean factory : https://gitlab.com/bsport/bsport-saas/-/issues/1276
const offer = {
  id: 364927,
  company: 89,
  activity: 125631,
  custom_level: 1,
  level: 1,
  available: true,
  coach_override: false,
  male: 5,
  female: 6,
  other: 3,
  meta_activity: 36497,
  coach: fakeCoach.id,
  partner_max_booking_count: 6,
  establishment: fakeEstablishment,
  credit_price_override: 1,
  credit_price: 1,
  date_start: '2023-06-30T14:30:00+02:00',
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
  full: false,
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
  return <MarketplaceOfferListItemForStorybook {...args} />;
};

export const ListState = Template.bind({});

ListState.args = {
  bookingStatus: 'isBooked',
  offer,
  showOfferFilling: true,
  onBookOption: () => {},
  onBook: () => {},
  establishment: offer.establishment,
  coach: fakeCoach,
  getLevel: fakeLevel,
  metaActivity: metaActivity,
  position: ['first', 'last'],
  isWorkshop: false,
  withoutBookButton: false,
  withoutCTA: false,
  isRegistered: false,
  theme: { ...fakeCompanyTheme, hide_book_button: true },
};

export default {
  title: 'Components/Marketplace/MarketPlaceOfferListItem',
  component: MarketplaceOfferListItemForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [
    // @ts-expect-error
    (Story) => (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '80%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
