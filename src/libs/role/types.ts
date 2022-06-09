import { ErrorAndLoading } from '../types';

// FOR CREATING A STAFF USER
export type UserRoleData = {
  email: string;
  password: string;
  role: number;
};

export type Permission = {
  offer: {
    delete: boolean;
    edit: boolean;
    create: boolean;
  };
  member: {
    search: boolean;
    retrieve: boolean;
    create: boolean;
  };
  checkin: boolean;
  navigation: boolean;
  appbarButtons: {
    ledger: boolean;
    notificationCenter: boolean;
  };
  restrictedPaths: string[];
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
      mobilePersonalization: boolean;
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

export type ProtectedUrls =
  | '/activity'
  | '/activity/add'
  | '/add-offers'
  | '/calendar'
  | '/clock-in/history'
  | '/clock-in/real-time'
  | '/coach'
  | '/coach/edit'
  | '/coach/performance'
  | '/combo'
  | '/coupon'
  | '/custom-form'
  | '/custom-form/details'
  | '/dashboard'
  | '/email-template'
  | '/email-template/create'
  | '/empty'
  | '/establishment'
  | '/establishment/add'
  | '/establishment/details'
  | '/establishment/edit'
  | '/establishment/location'
  | '/establishment/room'
  | '/expense'
  | '/giftcard'
  | '/instalment-payment'
  | '/invoice'
  | '/invoice/bill-member'
  | '/marketing'
  | '/marketing/notifications'
  | '/marketing/rule'
  | '/marketing/strategies'
  | '/marketing/tags'
  | '/member'
  | '/member/add'
  | '/member/edit'
  | '/offer'
  | '/order'
  | '/payment-pack'
  | '/performance-tracking'
  | '/private-service'
  | '/private-service/calendar'
  | '/private-service/pass'
  | '/private-service/service'
  | '/reporting'
  | '/schedule'
  | '/search'
  | '/search/results'
  | '/settings/active-campaign'
  | '/settings/broadcast'
  | '/settings/company_onboarding'
  | '/settings/company'
  | '/settings/forms'
  | '/settings/general'
  | '/settings/invoice'
  | '/settings/marketplace-settings'
  | '/settings/mobile-personalization'
  | '/settings/notification-rule'
  | '/settings/partnership'
  | '/settings/payment-methods'
  | '/settings/payment-rules'
  | '/settings/personalization'
  | '/settings/platform-billing'
  | '/settings/quickbooks'
  | '/settings/role'
  | '/settings/shop'
  | '/settings/waiting-list'
  | '/settings/webhook'
  | '/settings/widget'
  | '/shop'
  | '/smart-list'
  | '/spot-scheduling'
  | '/subscription'
  | '/subscription/contract'
  | '/vod/playlist'
  | '/vod/video'
  | '/workshop-activity'
  | '/workshop-activity/add'
  | '/workshop-activity/tabs'
  | '/workshop-activity/tabs/groups'
  | '/workshop-activity/tabs/list';
