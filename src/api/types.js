export type Offer = {
  id: Number,
  activity_id: Number,
  category: string,
  coach: {
    id: Number,
    name: string,
    photo: string,
  },
  cover_main: string,
  date_end: string,
  date_start: string,
  effectif: Number,
  etablissement: {
    city: {
      name: string,
      slug: string,
    },
    cover: string,
    cover_thumnail: string,
    id: Number,
    location: {
      address: string,
      latitude: Number,
      longitude: Number,
    },
    slug: string,
    title: string,
  },
  level: string,
  level_id: Number,
  meta_activity_id: Number,
  name: string,
  nb_option: Number,
  nb_pending: Number,
  nb_validated: Number,
  parent_category: Number,
  price: Number,
  price_coach: Number,
};

export type Booking = {
  id: Number,
  status: ?boolean,
};

export type BookingOption = {
  id: Number,
  cancelled: boolean,
};
