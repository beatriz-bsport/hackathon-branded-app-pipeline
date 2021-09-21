import {
  PrivateServiceWithSlots,
  PrivateSlot,
  PrivateServiceGroup,
  PrivatePass,
} from './types';

function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

function random_choice(arr: Array<any>): any {
  return arr[random_int(arr.length)];
}

const slots_names: Array<string> = [
  'Tuesday morning',
  'Thursday evening',
  'Wednesday noon',
  'Friday afternoon',
  'Monday morning',
];

function slots_factory(num_el: number, ps_id?: number): Array<PrivateSlot> {
  const slots_ids: Array<number> = [...Array(num_el || 1).keys()];

  return slots_ids.map((id) => {
    return {
      id: (ps_id || 0) * 1000 + id + 1,
      name: `${random_choice(slots_names)} #${id + 1}-${ps_id || 0}`,
      private_service: ps_id,
      available: random_choice([true, false]),
      credit: 1,
      duration_minutes: 60,
      people_capacity_used: 1,
      booking_interval_minutes: 20,
    };
  });
}

const private_services_names: Array<string> = [
  'Pilates private class',
  'Yoga private class',
  'Yoga and massage',
  'Relaxation',
  'Water aerobics private class',
];

const colors: Array<string> = ['', 'blue', 'red', 'green', 'pink', 'black'];

const covers_main: Array<string> = [
  'https://assets.staging.bsport.io/activity/boxethai.jpg',
  'https://assets.staging.bsport.io/activity/ladyboxing.jpg',
  'https://assets.staging.bsport.io/activity/boxefitness.jpg',
  'https://assets.staging.bsport.io/activity/multiboxealterne.jpeg',
  'https://assets.staging.bsport.io/activity/kickboxing.jpg',
  'https://assets.staging.bsport.io/activity/Image_Boxe_Anglise.jpg',
  'https://assets.staging.bsport.io/activity/Boxe_Francaise.jpg',
];

export function private_services_factory(
  num_el: number,
): Array<PrivateServiceWithSlots> {
  const private_services_ids: Array<number> = [...Array(num_el).keys()];

  return private_services_ids.map((id) => {
    return {
      id: id + 1,
      name: `${random_choice(private_services_names)} #${id + 1}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed nisi at sapien fringilla lobortis. Quisque rhoncus accumsan vulputate. Praesent ultricies neque lacus. Duis non iaculis ex. Nullam in ante id turpis lobortis ullamcorper vel eu sapien. Nullam varius urna at dapibus aliquam. Donec elit ex, scelerisque non pretium non, iaculis et justo.',
      establishments: [],
      coach_capacity_used: 1,
      available: random_choice([true, false]),
      use_full_establishment_capacity: random_choice([true, false]),
      coaches: [],
      color: random_choice([colors]),
      company: 1,
      slots: slots_factory(random_int(5), id + 1),
      establishment_attribution: 0,
      is_home_service: random_choice([true, false]),
      coach_attribution: 3,
      manager_only: random_choice([true, false]),
      has_own_availability_slots: random_choice([true, false]),
      last_discard_minutes: 50,
      last_booking_minutes: 10,
      cover_main: random_choice(covers_main),
      private_service_group: 5,
      slots_duration_minute: [60, 90, 120],
      availability_padding_start_minutes: 10,
      availability_padding_end_minutes: 10,
    };
  });
}

const groups_names: Array<string> = [
  'Assessment',
  'Individual support',
  '1:1 training',
  '2:1 training',
  'Coaching',
];

export function private_service_groups_factory(
  num_el: number,
): Array<PrivateServiceGroup> {
  const groups_ids: Array<number> = [...Array(num_el || 1).keys()];

  return groups_ids.map((id) => {
    return {
      id: id + 1,
      name: `${random_choice(groups_names)} #${id + 1}`,
      private_services: [],
    };
  });
}

const passes_names: Array<string> = [
  'Online private class',
  '10 private classes pass',
  '20 private classes pass',
  'Private classes pass (5)',
];

export function private_services_passes_factory(
  num_el: number,
): Array<PrivatePass> {
  const passes_ids: Array<number> = [...Array(num_el).keys()];

  return passes_ids.map((id) => {
    return {
      id: id + 1,
      name: random_choice(passes_names),
      credits: 5,
      price: 200.0,
      tax: 20.0,
      private_services: [],
      manager_only: random_choice([true, false]),
      available: random_choice([true, false]),
      duration_days: 0,
      duration_months: 0,
      duration_years: 1,
      available_payment_method_identifiers: [],
      full_vod_access: random_choice([true, false]),
      editable: random_choice([true, false]),
      expiration_days_before_first_use: 30,
      start_date_method: 5,
      new_member_only: random_choice([true, false]),
      company: 1,
    };
  });
}
