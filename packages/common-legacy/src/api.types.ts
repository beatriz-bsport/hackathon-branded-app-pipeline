export type EstablishmentLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

export type Establishment = object;

export type User = object;

export type Coach = {
  name: string;
  age: number;
  photo?: string;
  rating: string;
};

export type ActivitySummary = {
  id: number;
  name: string;
  level: string;
  category: string;
  parent_category: number;
  rating: string;
  participants: Array<User>;
  etablissement?: Establishment;
  coach: Coach;
  next_slot: Date;
  cover_main: string;
};

export type City = {
  name: string;
  slug: string;
};

export type EstablishmentDetail = {
  id: number;
  title: string;
  slug: string;
  cover: string;
  specific_info: string;
  city: City;
  location: EstablishmentLocation;
  categories: Array<{ SCT__SCS: number }>;
  activities: Array<ActivitySummary>;
};

export type EstablishmentSummary = {
  id: number;
  title: string;
  cover: string;
  city: City;
  slug: string;
  location: EstablishmentLocation;
};

export type Session = {
  id: number;
  date_start: string;
  duration_minute: number;
  activity: {
    id: number;
    name: string;
    level: number;
  };
};

export type SessionSummary = {
  id: number;
  date_start: string;
  date_end: string;
  price: number;
  additional_info: string;
};
