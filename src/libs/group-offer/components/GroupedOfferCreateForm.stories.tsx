// @ts-nocheck

import React from 'react';
import { coachFactory } from '#libs/associated-coach/factories';
import { establishment_factory } from '#libs/establishment/factory';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import metaActivityFactory from '../factories';

import GroupedOfferForm from './GroupedOfferCreateForm.drawer';

export default {
  title: 'MetaActivity/Components/GroupedOfferForm',
  component: GroupedOfferForm,
  args: {},
} as ComponentMeta<typeof GroupedOfferForm>;

const Template: ComponentStory<typeof GroupedOfferForm> = (args) => (
  <GroupedOfferForm {...args} />
);

// Create Clean Factory : https://gitlab.com/bsport/bsport-saas/-/issues/1278
const THEME = {
  id: 85516,
  has_partnership: false,
  franchisor: 1,
  primary_color: '#000000',
  payment_method_available: '[1, 2]',
  payment_method_available_manager: '[1, 2]',
  payment_method_available_basket: '[1]',
  payment_method_available_subscription: '[1]',
  secondary_color: '#505050',
  online_payment_enabled: true,
  allow_guest: false,
  hidden_from_marketplace: true,
  show_offers_filling: false,
  contact_email: 'mid_b_elysees@midtown-studio.com',
  currency: 'eur',
  currency_display: '€',
  is_whereby_integration_allowed: false,
  payment_method_missing: false,
  is_whereby_integration_enabled: true,
  default_booking_ordering: 'member_first_name',
  general_terms_and_conditions:
    'CONDITIONS GÉNÉRALES DE VENTE\n(en vigueur au 15 juillet 2015)\n\n1.DÉSIGNATION DU VENDEUR\nLe présent Site (www.midtown-studio.com) (ci-après : le « Site ») est édité par MIDTOWN STUDIO, Société par Actions Simplifiée au capital de 25 000,00 euros (vingt-cinq mille euros), immatriculée au RCS de PARIS sous le n° 811071885, dont le siège social est situé 55 avenue Marceau, 75116 Paris (ci-après : « MIDTOWN STUDIO »).\n\nMIDTOWN STUDIO peut être contactée aux coordonnées suivantes :\nAdresse postale : 5...',
  general_terms_of_use:
    'CONDITIONS GÉNÉRALES DE VENTE\n(en vigueur au 15 juillet 2015)\n\n1.DÉSIGNATION DU VENDEUR\nLe présent Site (www.midtown-studio.com) (ci-après : le « Site ») est édité par MIDTOWN STUDIO, Société par Actions Simplifiée au capital de 25 000,00 euros (vingt-cinq mille euros), immatriculée au RCS de PARIS sous le n° 811071885, dont le siège social est situé 55 avenue Marceau, 75116 Paris (ci-après : « MIDTOWN STUDIO »).\n\nMIDTOWN STUDIO peut être contactée aux coordonnées suivantes :\nAdresse postale : 5...',
  waiver:
    "Veuillez lire attentivement les contrats et les renonciations qui suivent. Ils comprennent les déclarations de non-responsabilité et la renonciation aux recours judiciaires par lesquelles vous renoncez à poursuivre certaines parties. Cette décharge de responsabilité est aussi valable pour les personnes pour qui vous réservez une séance ou qui utiliseraient votre Compte pour s'inscrire. Par votre acceptation électronique, vous déclarez avoir lu et compris l'intégralité des textes qui vous ont été...",
  email_sender_address: 'customers@midtown-studio.com',
  websiteURL: 'https://www.midtown-studio.com/',
  scheduleURL:
    'https://www.midtown-studio.com/bootcamp-paris/midtown-champs-elysees/',
  instagramURL: 'https://www.instagram.com/bootcampmidtown/',
  facebookURL: '',
  android_app_url: 'https://play.google.com/store/apps/details?id=com.bsport',
  hideCoach: true,
  ios_app_url: 'https://apps.apple.com/fr/app/id1356621554',
  show_cancelled_offers_customer: false,
  show_cancelled_offers_manager: true,
  show_workshops_customer: false,
  max_future_booking: 0,
  cover: 'https://d2r95z4j5cc9cx.cloudfront.net/activity/14_QmGP0Da.jpg',
  mobile_cover: null,
  company: 349,
  company_name: 'MIDTOWN CHAMPS-ÉLYSÉES',
  timezone_name: 'Europe/Paris',
  hide_least_specific_payment_pack: false,
  default_attendance: false,
  consumer_regularize_debt: true,
  allow_consumer_to_use_internal_account: false,
  accept_double_booking: false,
  accept_double_booking_workshop: false,
  gtmId: '',
  facebookPixelId: '',
  stripe_pk_key: 'pk_test_lFB5CxcyTCaQcS00MiE1ebEO',
  vod: false,
  locale: 'fr_FR',
  basket_expiration_days: 1,
  show_booked_gender_offer: false,
  is_checking_balance: false,
  nb_to_check_balance: 6,
  vod_providers: '[2, 3]',
  gender_max_shift_for_booking: 3,
  is_premium: false,
  enable_multi_localization: false,
  hide_intercom: false,
  is_quickbook_integration_allowed: false,
  is_quickbook_integration_enabled: true,
  schedule_timerange_begin: '2022-04-12 06:00',
  schedule_timerange_end: '2022-04-12 23:00',
  coach_can_edit_attendance: true,
  autotag_rule_extended: false,
  performance_tracking: false,
  provincial_tax_name: null,
  provincial_tax_value: null,
  is_tax_excluded_in_marketplace: false,
  hide_unnecessary_compatible_purchase_method: false,
  hide_sessions_with_tags_when_not_eligible: true,
  hide_member_details_in_app_private_booking_for_coach: false,
};

export const fullFlow = Template.bind({});
fullFlow.args = {
  open: true,
  metaActivity: null,
  metaActivities: metaActivityFactory.MetaActivity.create(100),
  coaches: Array(5)
    .fill(0)
    .map(() => coachFactory()),
  establishments: Array(5)
    .fill(0)
    .map(() => establishment_factory(2)),
  availableRoomBlueprints: [],
  allRoomBlueprints: [],
  coachPaymentRulesByKind: [],
  tagList: [],
  theme: THEME,
  onClose: () => {},
  resetPreview: () => {},
};

export const editFlow = Template.bind({});
editFlow.args = {
  open: true,
  metaActivity: metaActivityFactory.MetaActivity.create(1),
  metaActivities: metaActivityFactory.MetaActivity.create(100),
  coaches: Array(5)
    .fill(0)
    .map(() => coachFactory()),
  establishments: establishment_factory(2),
  availableRoomBlueprints: [],
  allRoomBlueprints: [],
  coachPaymentRulesByKind: [],
  tagList: [],
  theme: THEME,
  onClose: () => {},
  resetPreview: () => {},
};
