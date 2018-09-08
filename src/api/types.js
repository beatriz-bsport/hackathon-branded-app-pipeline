// @flow

export type ActivitySimplified = {
  id: number,
};

export type Activity = {
  id: number,
};

export type Offer = {
  id: number,
  activity_id: number,
  category: string,
  coach: {
    id: number,
    name: string,
    photo: string,
  },
  cover_main: string,
  date_end: string,
  date_start: string,
  effectif: number,
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
  nb_pending: number,
  nb_validated: number,
  parent_category: number,
  price: number,
  price_coach: number,
  credit_price: number,
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
};

export type BookingOption = {
  id: number,
  cancelled: boolean,
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
};

export type ConsumerPaymentPackConsumerView = {
  available_credits: number,
  id: number,
  payment_pack: PaymentPack,
};

export type ConsumerPaymentPackManagerView = {
  id: number,
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
