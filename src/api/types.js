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
};

export type Booking = {
  id: number,
  status: ?boolean,
};

export type BookingOption = {
  id: number,
  cancelled: boolean,
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
