// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import moment from 'moment-timezone';
import { BOOKING_DATE_ORDER } from '@bsport/common/lib/master-data/settings';
import {
  MarketPlaceCoachDisplay,
  MarketPlaceDaysFormatDisplay,
  MarketPlaceSessionTimeDisplay,
} from '@bsport/common/lib/master-data/personalization';

faker.locale = 'fr';

const defaultScheduleBegin = moment()
  .hours(6)
  .minutes(0)
  .seconds(0)
  .milliseconds(0)
  .format();

const defaultScheduleEnd = moment()
  .hours(23)
  .minutes(0)
  .seconds(0)
  .milliseconds(0)
  .format();

FactoryBot.define('companyTheme', {
  id: FactoryBot.sequence(),
  company_name: () => faker.random.word(),
  stripe_pk_key: () => faker.random.word(),
  locale: 'fr_FR',
  show_offers_filling: false,
  accept_double_booking: false,
  allow_guest: true,
  allow_guest_frequency: 'week',
  allow_guest_max_number: 1,
  hide_unnecessary_compatible_purchase_method: false,

  show_studio_on_general_app: true,
  coach_can_edit_attendance: false,
  default_attendance: false,
  show_cancelled_offers_manager: false,
  show_cancelled_offers_customer: false,
  hideCoach: false,
  show_workshops_customer: false,
  show_booked_gender_offer: false,
  is_checking_balance: false,
  hide_member_details_in_app_private_booking_for_coach: false,

  gender_max_shift_for_booking: 0,
  max_future_booking: 0,
  default_booking_ordering: BOOKING_DATE_ORDER,
  basket_expiration_days: 0,
  nb_to_check_balance: 0,

  hide_sessions_with_tags_when_not_eligible: true,
  schedule_timerange_begin: defaultScheduleBegin,
  schedule_timerange_end: defaultScheduleEnd,
  requires_email_confirmation_when_signing_up: false,
  confirm_email_url_redirection: '',
  show_establishment: false,
  show_level: false,
  show_activity_color: false,
  session_time_display: MarketPlaceSessionTimeDisplay.DEFAULT,
  coach_display: MarketPlaceCoachDisplay.DEFAULT,
  days_format_display: MarketPlaceDaysFormatDisplay.DEFAULT,
});

FactoryBot.define('ProvincialTax', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  value: () => faker.datatype.float(),
});

export default FactoryBot;
