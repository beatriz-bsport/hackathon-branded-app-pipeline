// @flow

export type OfferPerformance = {
  id: number,
  nb_bookings: number,
  price_coach: number,
};

export type Performance = Array<OfferPerformance>;

export type Invoice = {
  uuid: string,
  date: string,
  price: number,
  member: number,
  content_type: string,
  object_id: number,
};

export type Profile = {
  name: string,
  first_name: string,
  last_name: string,
  photo: string,
  email: string,
  phonenumber: { phone_number: string },
};

export type Review = {
  comment: string,
  rating: number,
  user: {
    name: string,
    id: number,
    photo: string,
  },
};
export type Coach = {
  name: string,
  id: number,
  photo: string,
};

export type Stat = {
  id: number,
};

export type SCS = {
  id: number,
  name: string,
};
export type SCT = {
  id: number,
  name: string,
  SCS: SCS,
};
export type ActivitySimplified = {
  id: number,
  parent_category: number,
  meta_activity_id: number,
  name: string,
  level: number,
  etablissement: Establishment,
  next_slot: string,
  coach: Profile,
};

export type Activity = {
  id: number,
  name: string,
  meta_activity_id: number,
};

export type Offer = {
  available: boolean,
  title: string,
  id: number,
  activity_id: number,
  category: string,
  coach_override: ?{
    id: number,
    name: string,
    photo: string,
  },
  coach: {
    id: number,
    name: string,
    photo: string,
  },
  cover_main: string,
  date_end: string,
  date_start: string,
  effectif: number,
  establishment_override: ?{
    city: {
      name: string,
      slug: string,
    },
    cover: string,
    cover_thumnail: string,
    id: number,
    location: {
      address: string,
      latitude: number,
      longitude: number,
    },
    slug: string,
    title: string,
  },
  etablissement: {
    city: {
      name: string,
      slug: string,
    },
    cover: string,
    cover_thumnail: string,
    id: number,
    location: {
      address: string,
      latitude: number,
      longitude: number,
    },
    slug: string,
    title: string,
  },
  level: string,
  level_id: number,
  meta_activity_id: number,
  name: string,
  nb_option: number,
  nb_validated: number,
  parent_category: number,
  price: number,
  price_coach: number,
  credit_price: number,
  activity: ActivitySimplified,
};

export type MetaActivity = {
  id: number,
  name: string,
  description: string,
  offers: Array<Offer>,
  coaches: Array<Coach>,
  etablissements: Array<Establishment>,
  cover_main: ?string,
  levels: Array<{ id: number, name: string }>,
  parent_category: SCS,
};

export type User = {
  id: number,
  name: string,
  photo: string,
};
export type Booking = {
  user: User,
  id: number,
  status: ?boolean,
  date: string,
  date_start: string,
  attendance: boolean,
  nb_booking: number,
  source: string,
  offer: Offer,
};

export type BookingOption = {
  id: number,
  cancelled: boolean,
  date_start: string,
  is_convertible: boolean,
  offer: Offer,
};

export type Consumer = {
  id: number,
  last_name: string,
  first_name: string,
  email: string,
  phonenumber: { phone_number: string },
  birthday: string,
  gender: string,
  is_coach: boolean,
  is_consumer: boolean,
  photo: ?string,
  is_complete: boolean,
  sports: Array<Object>,
  frequency: ?Object,
  situation: ?Object,
};

export type Member = {
  name: string,
  phone_number: string,
  email: string,
  date_joined: string,
  nb_bookings: number,
  nb_pass_active: number,
  next_booking: ?string,
  previous_booking: ?string,
  id: number,
};

export type MemberDetailed = {
  consumer: Consumer,
  next_bookings: Array<Booking>,
  previous_bookings: Array<Booking>,
  consumer_payment_packs: Array<ConsumerPaymentPackManagerView>,
  date_joined: string,
  id: number,
};

export type PaymentPack = {
  id: number,
  unlimited: boolean,
  name: string,
  credits: number,
  company: { name: string },
  max_bookings_per_week: number,
  validity_daterange: ?{ upper: string, lower: string },
  duration_days: ?number,
};

export type ConsumerPaymentPackConsumerView = {
  available_credits: number,
  id: number,
  payment_pack: PaymentPack,
  name: string,
  used_credits: number,
  bookings_this_week: number,
  ending_date: string,
};

export type ConsumerPaymentPackManagerView = {
  id: number,
  bookings_this_week: number,
  ending_date: string,
};

export type Category = {
  id: number,
};

export type PaymentPackManagerView = {
  consumer_payment_packs: Array<ConsumerPaymentPackManagerView>,
  unlimited: boolean,
  base_price: number,
  name: string,
  credits: number,
  categories: Array<Category>,
  activities: Array<Object>,
  max_bookings_per_week: number,
  validity_daterange: ?{ upper: string, lower: string },
  duration_days: ?number,
};

export type Location = {
  name: string,
  address: string,
  latitude: number,
  longitude: number,
};
export type Establishment = {
  id: number,
  cover: string,
  title: string,
  specific_info: string,
  activities: Array<ActivitySimplified>,
  location: Location,
};

export type CoachDetailed = {
  name: string,
  id: number,
  photo: string,
  activities: Array<ActivitySimplified>,
};
