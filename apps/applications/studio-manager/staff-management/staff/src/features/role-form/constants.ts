import type {
  CompanyRolePermissions,
  ObjectLevelPermissions,
} from "@bsport/api-staff-management";

import { mergeWithDefaults } from "./permission-tree-utils";
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

const REPORT_CATEGORIES = {
  Payments: [
    "basket",
    "cashbook",
    "credit",
    "expense",
    "invoices",
    "unpaid_invoices",
    "payments",
    "payment_sumup",
    "on_spot_payments",
    "dispute",
    "payment_installments",
    "video_purchase",
  ],
  Club: [
    "billing_plan",
    "members_purchase",
    "members",
    "activities",
    "activityByEst",
    "activityByCoach",
    "workshop",
    "offers",
    "subscription",
    "privateService",
    "referral_grant",
    "access_monitoring",
  ],
  Bookings: [
    "dayBookings",
    "first_booking",
    "bookings",
    "first_attendance",
    "first_privatebooking",
    "private_bookings",
    "unpaid_private_bookings",
  ],
  Products: [
    "private_cpasses_expired",
    "expired_pass",
    "memberships",
    "private_cpasses",
    "universal_passes",
    "discount",
    "giftcard",
    "consumer_giftcard",
    "shop",
    "video",
  ],
} as const;

const createDefaultReportPermissions = (): ObjectLevelPermissions["report"] =>
  Object.fromEntries(
    Object.entries(REPORT_CATEGORIES).map(([globalCategory, categories]) => [
      globalCategory,
      Object.fromEntries(
        categories.map((category) => [
          category,
          {
            allowed_actions: {
              create: true,
              read: true,
              edit: true,
              delete: true,
            },
          },
        ]),
      ),
    ]),
  ) as unknown as ObjectLevelPermissions["report"];

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

// Mirrors DEFAULT_OBJECT_LEVEL_PERMISSIONS in the legacy CreateRoleDialog.
// Keep in sync when server-side object-level permission keys change.
export const DEFAULT_OBJECT_LEVEL_PERMISSIONS = {
  session: {
    activity: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        viewNotes: true,
        editNotes: true,
      },
    },
    workshop: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        viewNotes: true,
        editNotes: true,
      },
    },
    privateSlot: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        viewNotes: true,
        editNotes: true,
      },
    },
  },
  member: {
    allowed_actions: {
      create: true,
      readInfo: true,
      editInfo: true,
      delete: true,
      search: true,
      accessProfile: true,
      readBalance: true,
      communication: true,
      manageNotification: true,
    },
  },
  billing: {
    allowed_actions: {
      takePayment: true,
      editBalance: true,
      editBalanceWithoutInvoice: true,
      readInvoices: true,
      createInvoice: true,
      readPaymentLink: true,
      cancelInvoice: true,
      addPaymentMethod: true,
      deletePaymentMethod: true,
      partialRefundAsDiscount: true,
      partialRefundAsCredit: true,
      createManualDiscount: true,
    },
  },
  reservation: {
    activity: {
      allowed_actions: {
        rollcall: true,
        addToWaitlist: true,
        create: true,
        edit: true,
        delete: true,
        removeFromWaitlist: true,
        attendance: true,
        editSpot: true,
        editPerformance: true,
        refund: true,
      },
    },
    workshop: {
      allowed_actions: {
        rollcall: true,
        addToWaitlist: true,
        create: true,
        edit: true,
        delete: true,
        removeFromWaitlist: true,
        attendance: true,
        editSpot: true,
        editPerformance: true,
        refund: true,
      },
    },
    privateBooking: {
      allowed_actions: {
        create: true,
        edit: true,
        cancel: true,
        editPerformance: true,
      },
    },
  },
  export: {
    allowed_actions: {
      planning: true,
      invoice: true,
      subscription: true,
      payroll: true,
      attendance: true,
      smartlist: true,
      memberDocument: true,
      report: true,
      smartlist_general_report: true,
    },
  },
  planning: {
    calendar: {
      allowed_actions: {
        bulkCancellation: true,
        readCancellations: true,
        readWeeklyOverview: true,
      },
    },
    schedule: {
      allowed_actions: {
        createAvailability: true,
        deleteAvailability: true,
        readAvailabilityDetail: true,
      },
    },
  },
  report: createDefaultReportPermissions(),
  product: {
    paymentPack: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        manageExtension: true,
        manageCredit: true,
        compatibility: true,
        block: true,
      },
    },
    privatePass: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        manageExtension: true,
        manageCredit: true,
        compatibility: true,
      },
    },
    contract: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        pause: true,
        createBillingPlan: true,
        createCustomBillingPlan: true,
        pauseBillingPlan: true,
        endBillingPlan: true,
        editPassBillingPlan: true,
        editInvoiceDateBillingPlan: true,
        editInvoicePriceBillingPlan: true,
        endAfterInvoiceBillingPlan: true,
      },
    },
    shopReworked: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        editInventory: true,
        editSettings: true,
      },
    },
  },
  management: {
    activity: { allowed_actions: { create: true, edit: true, delete: true } },
    workshop: { allowed_actions: { create: true, edit: true, delete: true } },
    privateService: {
      allowed_actions: { create: true, edit: true, delete: true },
    },
    coach: {
      allowed_actions: {
        create: true,
        edit: true,
        delete: true,
        readPayroll: true,
        substitution: true,
      },
    },
  },
} as unknown as ObjectLevelPermissions;

const OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP: Record<string, string> = {
  "billing.allowed_actions.editBalance":
    "billing.allowed_actions.editBalanceWithoutInvoice",
};

const OBJECT_LEVEL_PERMISSIONS_RECIPROQUE_MAP = Object.fromEntries(
  Object.entries(OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP).map(([key, value]) => [
    value,
    key,
  ]),
);

export const OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP = {
  direct: OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP,
  reciproque: OBJECT_LEVEL_PERMISSIONS_RECIPROQUE_MAP,
};

export const SET_NESTED_FORM_VALUE_OPTIONS = {
  shouldDirty: true,
  shouldValidate: true,
} as const;

export const ROLE_FORM_DEFAULTS: RoleFormData = {
  name: "",
  description: "",
  starterRoleId: "",
  permissions: DEFAULT_PERMISSIONS,
  objectLevelPermissions: DEFAULT_OBJECT_LEVEL_PERMISSIONS,
  hasBookingOverrideControl: false,
};

/**
 * Merges `permissions` with DEFAULT_OBJECT_LEVEL_PERMISSIONS so that any keys
 * absent from the server response are initialised to `true` (the default for
 * new permissions).  If `permissions` is undefined the full defaults are
 * returned.
 */
export const getObjectLevelPermissionsWithDefaults = (
  permissions?: ObjectLevelPermissions,
): ObjectLevelPermissions =>
  mergeWithDefaults(
    JSON.parse(JSON.stringify(DEFAULT_OBJECT_LEVEL_PERMISSIONS)) as unknown,
    permissions,
  ) as ObjectLevelPermissions;
