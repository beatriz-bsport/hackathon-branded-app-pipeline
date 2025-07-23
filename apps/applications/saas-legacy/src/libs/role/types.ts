import {
  PRIVATE_BOOKING_CREATED_BY_STAFF,
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_RESTORED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
} from '#src/libs/private-service/components/constants';
import {
  BOOKING_CREATED_BY_STAFF,
  BOOKING_CANCELLED_BY_STAFF,
} from '#src/libs/booking/components/constants';
import { ErrorAndLoading } from '../types';

// FOR CREATING A STAFF USER
export type UserRoleData = {
  id?: number;
  email: string;
  password: string;
  role: number;
  first_name: string;
  last_name: string;
  coaches_in_role_ids: number[];
  establishments_in_role_ids: number[];
  staff_establishment_billing_group?: number | null;
};

export type FranchiseUserRoleData = {
  id?: number;
  email: string;
  password: string;
  franchise_role: number;
  first_name: string;
  last_name: string;
  franchisees_in_role_ids: number[];
};

export type RolePermission = {
  checkin: boolean;
  navigation: boolean;
  appbarButtons: {
    ledger: boolean;
    notificationCenter: boolean;
    communicationAlerts: boolean;
  };
  restrictedPaths: string[];
  navigationMenu: {
    dashboard: boolean;
    calendar: boolean;
    schedule: boolean;
    // This permission is hidden for a company without the access monitoring upsell
    accessMonitoring?: {
      perform: boolean;
      monitor: boolean;
      settings: boolean;
    };
    myClub: {
      activities: boolean;
      workshops: boolean;
      appointments: boolean;
      teachers: boolean;
      establishments: boolean;
      programs: boolean;
      replacement: boolean;
    };
    products: {
      paymentPack: boolean;
      privatePass: boolean;
      shop: boolean;
      shopReworked: {
        products: boolean;
        settings: boolean;
      };
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
      cadence: boolean;
    };
    digitalOffer: {
      videos: boolean;
      playlists: boolean;
    };
    inbox: boolean;
    member: boolean;
    reporting: boolean;
    settings: {
      generals: boolean;
      marketplace: boolean;
      widgets: boolean;
      staffs: boolean;
      personalization: boolean;
      memberForms: boolean;
      coachUserspace: boolean;
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
      quicksale: boolean;
      referral: boolean;
    };
    tutorial: boolean;
  };
};

export type ObjectLevelPermissions = {
  session: {
    activity: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        viewNotes: boolean;
        editNotes: boolean;
      };
    };
    workshop: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        viewNotes: boolean;
        editNotes: boolean;
      };
    };
    privateSlot: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        viewNotes: boolean;
        editNotes: boolean;
      };
    };
  };
  member: {
    allowed_actions: {
      create: boolean;
      readInfo: boolean;
      editInfo: boolean;
      delete: boolean;
      search: boolean;
      accessProfile: boolean;
      readBalance: boolean;
      communication: boolean;
      manageNotification: boolean;
    };
  };
  billing: {
    allowed_actions: {
      takePayment: boolean;
      editBalance: boolean;
      editBalanceWithoutInvoice: boolean;
      readInvoices: boolean;
      createInvoice: boolean;
      readPaymentLink: boolean;
      cancelInvoice: boolean;
      addPaymentMethod: boolean;
      deletePaymentMethod: boolean;
      partialRefundAsDiscount: boolean;
      partialRefundAsCredit: boolean;
      createManualDiscount: boolean;
    };
  };
  reservation: {
    activity: {
      allowed_actions: {
        rollcall: boolean;
        addToWaitlist: boolean;
        create: boolean;
        delete: boolean;
        removeFromWaitlist: boolean;
        attendance: boolean;
        editSpot: boolean;
        editPerformance: boolean;
        refund: boolean;
      };
    };
    workshop: {
      allowed_actions: {
        rollcall: boolean;
        addToWaitlist: boolean;
        create: boolean;
        delete: boolean;
        removeFromWaitlist: boolean;
        attendance: boolean;
        editSpot: boolean;
        editPerformance: boolean;
        refund: boolean;
      };
    };
    privateBooking: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        cancel: boolean;
        editPerformance: boolean;
      };
    };
  };
  export: {
    allowed_actions: {
      planning: boolean;
      invoice: boolean;
      subscription: boolean;
      payroll: boolean;
      attendance: boolean;
      smartlist: boolean;
      memberDocument: boolean;
      report: boolean;
      smartlist_general_report: boolean;
    };
  };
  planning: {
    calendar: {
      allowed_actions: {
        bulkCancellation: boolean;
        readCancellations: boolean;
        readWeeklyOverview: boolean;
      };
    };
    schedule: {
      allowed_actions: {
        createAvailability: boolean;
        deleteAvailability: boolean;
        readAvailabilityDetail: boolean;
      };
    };
  };
  report: {
    [global_category: string]: {
      [category: string]: {
        allowed_actions: {
          create: boolean;
          read: boolean;
          edit: boolean;
          delete: boolean;
        };
      };
    };
  };
  product: {
    paymentPack: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        manageExtension: boolean;
        manageCredit: boolean;
        compatibility: boolean;
        block: boolean;
      };
    };
    privatePass: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        manageExtension: boolean;
        manageCredit: boolean;
        compatibility: boolean;
      };
    };
    contract: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        pause: boolean;
        createBillingPlan: boolean;
        createCustomBillingPlan: boolean;
        pauseBillingPlan: boolean;
        endBillingPlan: boolean;
        editPassBillingPlan: boolean;
        editInvoiceDateBillingPlan: boolean;
        editInvoicePriceBillingPlan: boolean;
        endAfterInvoiceBillingPlan: boolean;
      };
    };
    shopReworked: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        editInventory: boolean;
        editSettings: boolean;
      };
    };
  };
  management: {
    activity: {
      allowed_actions: { create: boolean; edit: boolean; delete: boolean };
    };
    workshop: {
      allowed_actions: { create: boolean; edit: boolean; delete: boolean };
    };
    privateService: {
      allowed_actions: { create: boolean; edit: boolean; delete: boolean };
    };
    coach: {
      allowed_actions: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        readPayroll: boolean;
        substitution: boolean;
      };
    };
  };
};

export type FranchiseRolePermission = {
  franchiseMenu: {
    franchises: boolean;
    members: boolean;
    products: {
      paymentPackTemplates: boolean;
      privatePassTemplates: boolean;
      universalPassTemplates?: boolean;
      shopTemplates: boolean;
      giftcardTemplates: boolean;
      couponTemplates: boolean;
      contractTemplates: boolean;
    };
    emailTemplates: boolean;
    notificationRules: boolean;
    reporting: boolean;
    widgets: boolean;
    staff: boolean;
    settings: boolean;
    tag: boolean;
  };
};

export type Role = {
  id: number;
  name: string;
  description: string;
  editable: boolean;
  company: number;
  permissions: RolePermission;
  object_level_permissions: ObjectLevelPermissions;
  has_booking_override_control: boolean;
  is_franchisor?: boolean;
};

export type FranchiseRole = {
  identifier: number | null;
  id: number;
  name: string;
  description: string;
  editable: boolean;
  franchise: number;
  company_role: Role;
  permissions: FranchiseRolePermission;
  allowed_franchisees: Array<number>;
};

export type SelectFieldItem = {
  value: number;
  label: string;
};

export type FranchiseRoleMasterAccountData = {
  id?: number;
  name: string;
  description: string;
  editable: boolean;
  permissions: FranchiseRolePermission;
};

export type FranchiseRoleFranchiseeData = {
  name: string;
  description: string;
  editable: boolean;
  has_booking_override_control: boolean;
  permissions: RolePermission;
  object_level_permissions: ObjectLevelPermissions;
};

export type UserRole<R = number, FR = number> = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_restricted: boolean;
  role: R;
  franchise_role: FR;
  franchise_role_identifier: number | null;
  coaches_selected_in_role?: number[];
  establishments_selected_in_role?: number[];
  allowed_franchisees?: number[];
  commission: number;
  franchise_user: number | null;
  staff_establishment_billing_group?: number | null;
};

export type RoleState = ErrorAndLoading & {
  allIds: number[];
  byId: { [key: number]: UserRole };
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
  franchiseRole: ErrorAndLoading & {
    byId: { [key: string]: FranchiseRole };
    allIds: number[];
    createOrUpdate: ErrorAndLoading;
  };
  createOrUpdate: ErrorAndLoading;
};

export type ProtectedUrls =
  | '/access-monitoring/monitor'
  | '/access-monitoring/perform'
  | '/access-monitoring/settings'
  | '/activity'
  | '/activity/add'
  | '/add-offers'
  | '/audience'
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
  | '/inbox/thread'
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
  | '/replacement'
  | '/replacement/discipline-group'
  | '/replacement/management'
  | '/reporting'
  | '/schedule'
  | '/search'
  | '/search/results'
  | '/settings/active-campaign'
  | '/settings/broadcast'
  | '/settings/coach-userspace'
  | '/settings/company_onboarding'
  | '/settings/company'
  | '/settings/forms'
  | '/settings/general'
  | '/settings/invoice'
  | '/settings/marketplace-settings'
  | '/settings/mobile-personalisation/customize'
  | '/settings/mobile-personalisation/links'
  | '/settings/mobile-personalisation/popups'
  | '/settings/notification-rule'
  | '/settings/partnership'
  | '/settings/payment-methods'
  | '/settings/payment-rules'
  | '/settings/personalization'
  | '/settings/platform-billing'
  | '/settings/quickbooks'
  | '/settings/quicksale'
  | '/settings/referral'
  | '/settings/role'
  | '/settings/shop'
  | '/settings/waiting-list'
  | '/settings/webhook'
  | '/settings/widget/create'
  | '/settings/widget/customize-css'
  | '/settings/widget/customize'
  | '/shop'
  | '/shop/products'
  | '/shop/settings'
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

export type FranchiseProtectedUrls =
  | '/f/franchises'
  | '/f/members'
  | '/f/coupon-template'
  | '/f/marketing/campaigns'
  | '/f/marketing/tags'
  | '/f/email-template'
  | '/f/settings/notification-rule'
  | '/f/payment-pack-template'
  | '/f/private-pass-template'
  | '/f/universal-pass-template'
  | '/f/giftcard-template'
  | '/f/reporting'
  | '/f/settings/staff'
  | '/f/settings/role'
  | '/f/settings/widget'
  | '/f/settings/theme';

export type AllActionIdentifier =
  | typeof PRIVATE_BOOKING_CREATED_BY_STAFF
  | typeof PRIVATE_BOOKING_CANCELLED_BY_STAFF
  | typeof PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF
  | typeof PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF
  | typeof PRIVATE_BOOKING_RESTORED_BY_STAFF
  | typeof RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF
  | typeof BOOKING_CREATED_BY_STAFF
  | typeof BOOKING_CANCELLED_BY_STAFF;

export type BookingModificationActionIdentifier =
  | typeof BOOKING_CREATED_BY_STAFF
  | typeof BOOKING_CANCELLED_BY_STAFF;

export type PrivateBookingModificationActionIdentifier =
  | typeof PRIVATE_BOOKING_CANCELLED_BY_STAFF
  | typeof PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF
  | typeof PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF
  | typeof PRIVATE_BOOKING_RESTORED_BY_STAFF
  | typeof RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF;

export type StaffModificationHistory<
  ActionIdentifierChoices = AllActionIdentifier,
> = {
  staff?: UserRoleData;
  staff_id: number;
  action_identifier: ActionIdentifierChoices;
  timestamp: number;
  old_date_start: number;
  new_date_start: number;
  old_coach: number;
  new_coach: number;
};

export type RedirectionParameters = {
  newWindow?: boolean;
  deniedAccessDialog?: {
    display: boolean;
  };
};
