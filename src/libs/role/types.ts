import { ErrorAndLoading } from '../types';

// FOR CREATING A STAFF USER
export type UserRoleData = {
  email: string;
  password: string;
  role: number;
};

export type Permission = {
  offer: {
    delete: boolean; // X
    edit: boolean; // X
    create: boolean; // X
  };
  member: {
    search: boolean; // X
    retrieve: boolean; // X
    create: boolean;
  };
  checkin: boolean; // X
  navigation: boolean; // X
  appbarButtons: {
    ledger: boolean;
    notificationCenter: boolean;
  };
  restrictedPaths: string[]; // X
  navigationMenu: {
    dashboard: boolean;
    calendar: boolean;
    schedule: boolean;
    myClub: {
      activities: boolean;
      workshops: boolean;
      appointments: boolean;
      teachers: boolean;
      establishments: boolean;
      programs: boolean;
    };
    products: {
      paymentPack: boolean;
      privatePass: boolean;
      shop: boolean;
      packs: boolean;
      giftcards: boolean;
      promotions: boolean;
      contracts: boolean;
    };
    payments: {
      billings: boolean;
      directDebits: boolean;
      teachers: boolean;
      orders: boolean;
      expenses: boolean;
      installments: boolean;
      clockIn: {
        selfClockIn: boolean;
        clockInForOther: boolean;
        canAccessHistory: boolean;
      };
    };
    marketing: {
      templates: boolean;
      customForms: boolean;
      smartlists: boolean;
      notifications: boolean;
      tags: boolean;
      strategies: boolean;
    };
    digitalOffer: {
      videos: boolean;
      playlists: boolean;
    };
    member: boolean;
    reporting: boolean;
    settings: {
      generals: boolean;
      marketplace: boolean;
      widgets: boolean;
      staffs: boolean;
      personalization: boolean;
      memberForms: boolean;
      liveStreaming: boolean;
      transactionnalEmail: boolean;
      teacherPayrollRules: boolean;
      paymentMethods: boolean;
      company: boolean;
      billing: boolean;
      waitingList: boolean;
      webShop: boolean;
      webHook: boolean;
      partnership: boolean;
      quickBooks: boolean;
      activeCampaign: boolean;
      subscription: boolean;
    };
  };
};

export type Role = {
  id: number;
  name: string;
  description: string;
  editable: boolean;
  company: number;
  permissions: Permission;
};

export type UserRole<R = number> = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_restricted: boolean;
  role: R;
};

export type RoleState = ErrorAndLoading & {
  users: UserRole[];
  users_paginated: ErrorAndLoading & {
    next_page: number;
    previous_page: number;
    count: number;
    allIds: Array<number>;
    byId: { [key: string]: UserRole };
  };
  role: ErrorAndLoading & {
    byId: { [key: string]: Role };
    allIds: number[];
    createOrUpdate: ErrorAndLoading;
  };
  createOrUpdate: ErrorAndLoading;
};
