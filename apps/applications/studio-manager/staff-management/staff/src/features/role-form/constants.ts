import type { CompanyRolePermissions } from "@bsport/api-staff-management";

import type { RoleFormData } from "./types";

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

export const HIDDEN_PERMISSION_KEYS = new Set([
  "restrictedPaths",
  "navigation",
  "checkin",
  "appbarActions",
  "navigationMenu.search",
]);

// Mirrors getDefaultPermissions() in the legacy CreateRoleDialog.component.tsx.
// Keep in sync when new permission keys are added server-side.
export const DEFAULT_PERMISSIONS: CompanyRolePermissions = {
  navigationMenu: {
    dashboard: true,
    calendar: true,
    schedule: true,
    accessMonitoring: {
      perform: false,
      monitor: false,
      settings: false,
    },
    myClub: {
      activities: true,
      workshops: true,
      appointments: true,
      teachers: true,
      establishments: true,
      programs: true,
      replacement: true,
    },
    products: {
      paymentPack: true,
      privatePass: true,
      shop: true,
      shopReworked: {
        products: true,
        settings: true,
      },
      packs: true,
      giftcards: true,
      promotions: true,
      contracts: true,
    },
    payments: {
      billings: true,
      directDebits: true,
      teachers: true,
      orders: true,
      expenses: true,
      installments: true,
      clockIn: {
        selfClockIn: true,
        clockInForOther: false,
        canAccessHistory: false,
      },
    },
    marketing: {
      templates: true,
      customForms: true,
      smartlists: true,
      notifications: true,
      tags: true,
      cadence: true,
    },
    digitalOffer: {
      videos: true,
      playlists: true,
    },
    inbox: true,
    member: true,
    reporting: true,
    settings: {
      generals: true,
      marketplace: true,
      widgets: true,
      staffs: true,
      personalization: true,
      memberForms: true,
      coachUserspace: true,
      liveStreaming: true,
      transactionnalEmail: true,
      teacherPayrollRules: true,
      paymentMethods: true,
      company: true,
      billing: true,
      waitingList: true,
      webShop: true,
      webHook: true,
      partnership: true,
      quickBooks: true,
      activeCampaign: true,
      subscription: true,
      mobilePersonalization: true,
      quicksale: true,
      referral: true,
    },
    tutorial: true,
  },
  appbarButtons: {
    ledger: true,
    notificationCenter: true,
    communicationAlerts: true,
  },
  navigation: true,
  checkin: false,
  restrictedPaths: [],
};

export const ROLE_FORM_DEFAULTS: RoleFormData = {
  name: "",
  description: "",
  starterRoleId: "",
  permissions: DEFAULT_PERMISSIONS,
};
