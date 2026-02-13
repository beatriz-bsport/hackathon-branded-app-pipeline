import {
  ADMIN_ROLE,
  CHECKIN_APP_ROLE,
  OWNER_ROLE,
  REPORT_ROLE,
  RESTRICTED_STAFF_ROLE,
  STAFF_ROLE,
  // @ts-expect-error
} from '#src/libs/role/role-types.js';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_CUSTOM_APP,
  UPSELL_PERFORMANCE_TRACKING_IDENTIFIER,
} from '#src/libs/platform-billing/upsell-identifiers';
import { COMPANY_REPORT_CATEGORIES_BY_GLOBAL_CATEGORY } from '#src/libs/reporting/common/constants';
import {
  FranchiseProtectedUrls,
  ProtectedUrls,
  ObjectLevelPermissions,
} from './types';

// @ts-expect-error
export const URLS_PERMISSIONS: Record<ProtectedUrls, string[]> = {
  // give calendar and schedule priority for redirection
  '/calendar': ['navigationMenu.calendar'],
  '/schedule': ['navigationMenu.schedule'],
  '/access-monitoring/monitor': ['navigationMenu.accessMonitoring.monitor'],
  '/access-monitoring/perform': ['navigationMenu.accessMonitoring.perform'],
  '/access-monitoring/settings': ['navigationMenu.accessMonitoring.settings'],
  '/activity': ['navigationMenu.myClub.activities'],
  '/activity/add': ['navigationMenu.myClub.activities'],
  '/add-offers': ['navigationMenu.schedule', 'navigationMenu.calendar'],
  '/audience': ['navigationMenu.marketing.cadence'],
  '/clock-in/history': ['navigationMenu.payments.clockIn.canAccessHistory'],
  '/clock-in/real-time': ['navigationMenu.payments.clockIn.clockInForOther'],
  '/coach': ['navigationMenu.myClub.teachers'],
  '/coach/edit': ['navigationMenu.myClub.teachers'],
  '/coach/performance': ['navigationMenu.payments.teachers'],
  '/combo': ['navigationMenu.products.packs'],
  '/coupon': ['navigationMenu.products.promotions'],
  '/custom-form': ['navigationMenu.marketing.customForms'],
  '/custom-form/details': ['navigationMenu.marketing.customForms'],
  '/dashboard': ['navigationMenu.dashboard'],
  '/email-template': ['navigationMenu.marketing.templates'],
  '/email-template/create': ['navigationMenu.marketing.templates'],
  '/establishment': ['navigationMenu.myClub.establishments'],
  '/establishment/add': ['navigationMenu.myClub.establishments'],
  '/establishment/details': ['navigationMenu.myClub.establishments'],
  '/establishment/edit': ['navigationMenu.myClub.establishments'],
  '/establishment/location': ['navigationMenu.myClub.establishments'],
  '/establishment/room': ['navigationMenu.myClub.establishments'],
  '/expense': ['navigationMenu.payments.expenses'],
  '/giftcard': ['navigationMenu.products.giftcards'],
  '/inbox/thread': ['navigationMenu.inbox'],
  '/instalment-payment': ['navigationMenu.payments.installments'],
  '/invoice': ['navigationMenu.payments.billings'],
  '/invoice/bill-member': ['navigationMenu.payments.billings'],
  '/insights': ['navigationMenu.reporting'],
  '/marketing': ['navigationMenu.marketing'],
  '/marketing/notifications': ['navigationMenu.marketing.notifications'],
  '/marketing/rule': ['navigationMenu.marketing.notifications'],
  '/marketing/strategies': ['navigationMenu.marketing.strategies'],
  '/marketing/tags': ['navigationMenu.marketing.tags'],
  '/member': ['navigationMenu.member'],
  // TODO: make URLS_PERMISSIONS compatible with the new object level permissions
  // '/member/add': ['member.allowed_actions.create'],
  // '/member/edit': ['member.allowed_actions.editInfo'],
  '/offer': ['navigationMenu.schedule', 'navigationMenu.calendar'],
  '/order': ['navigationMenu.payments.orders'],
  '/payment-pack': ['navigationMenu.products.paymentPack'],
  '/performance-tracking': ['navigationMenu.myClub.programs'],
  '/private-service': ['navigationMenu.products.privatePass'],
  '/private-service/calendar': ['navigationMenu.schedule'],
  '/private-service/pass': ['navigationMenu.products.privatePass'],
  '/private-service/service': ['navigationMenu.myClub.appointments'],
  '/replacement': ['navigationMenu.myClub.replacement'],
  '/replacement/discipline-group': ['navigationMenu.myClub.replacement'],
  '/replacement/management': ['navigationMenu.myClub.replacement'],
  '/reporting': ['navigationMenu.reporting'],
  '/reporting/categories': ['navigationMenu.reporting'],
  // '/search': ['member.allowed_actions.accessProfile'],
  // '/search/results': ['member.allowed_actions.search'],
  '/settings/active-campaign': ['navigationMenu.settings.activeCampaign'],
  '/settings/broadcast': ['navigationMenu.settings.liveStreaming'],
  '/settings/coach-userspace': ['navigationMenu.settings.coachUserspace'],
  '/settings/company_onboarding': ['navigationMenu.settings.subscription'],
  '/settings/company': ['navigationMenu.settings.company'],
  '/settings/forms': ['navigationMenu.settings.memberForms'],
  '/settings/general': ['navigationMenu.settings.generals'],
  '/settings/invoice': ['navigationMenu.settings.billing'],
  '/settings/marketplace-settings': ['navigationMenu.settings.marketplace'],
  '/settings/mobile-personalisation/customize': [
    'navigationMenu.settings.mobilePersonalization',
  ],
  '/settings/mobile-personalisation/links': [
    'navigationMenu.settings.mobilePersonalization',
  ],
  '/settings/mobile-personalisation/popups': [
    'navigationMenu.settings.mobilePersonalization',
  ],
  '/settings/notification-rule': [
    'navigationMenu.settings.transactionnalEmail',
  ],
  '/settings/partnership': ['navigationMenu.settings.partnership'],
  '/settings/payment-methods': ['navigationMenu.settings.paymentMethods'],
  '/settings/payment-rules': ['navigationMenu.settings.teacherPayrollRules'],
  '/settings/personalization': ['navigationMenu.settings.personalization'],
  '/settings/platform-billing': ['navigationMenu.settings.subscription'],
  '/settings/quickbooks': ['navigationMenu.settings.quickBooks'],
  '/settings/quicksale': ['navigationMenu.settings.quicksale'],
  '/settings/referral': ['navigationMenu.settings.referral'],
  '/settings/role': ['navigationMenu.settings.staffs'],
  '/settings/shop': ['navigationMenu.settings.webShop'],
  '/settings/waiting-list': ['navigationMenu.settings.waitingList'],
  '/settings/webhook': ['navigationMenu.settings.webHook'],
  '/settings/widget/create': ['navigationMenu.settings.widgets'],
  '/settings/widget/customize-css': ['navigationMenu.settings.widgets'],
  '/settings/widget/customize': ['navigationMenu.settings.widgets'],
  '/shop': ['navigationMenu.products.shop'],
  '/shop/products': ['navigationMenu.products.shopReworked.products'],
  '/shop/settings': ['navigationMenu.products.shopReworked.settings'],
  '/smart-list': ['navigationMenu.marketing.smartlists'],
  '/spot-scheduling': ['navigationMenu.myClub.establishments'],
  '/subscription': ['navigationMenu.payments.directDebits'],
  '/subscription/contract': ['navigationMenu.products.contracts'],
  '/vod/playlist': ['navigationMenu.digitalOffer.playlists'],
  '/vod/video': ['navigationMenu.digitalOffer.videos'],
  '/workshop-activity': ['navigationMenu.myClub.workshops'],
  '/workshop-activity/add': ['navigationMenu.myClub.workshops'],
  '/workshop-activity/tabs': ['navigationMenu.myClub.workshops'],
  '/workshop-activity/tabs/groups': ['navigationMenu.myClub.workshops'],
  '/workshop-activity/tabs/list': ['navigationMenu.myClub.workshops'],

  '/empty': [],
};

export const URLS_UPSELL: Record<string, number> = {
  '/performance-tracking': UPSELL_PERFORMANCE_TRACKING_IDENTIFIER,
  '/clock-in': UPSELL_IDENTIFIER_CLOCK_IN,
  '/marketing/strategies': 99999999999, // beta
  '/settings/mobile-personalisation/links': UPSELL_IDENTIFIER_CUSTOM_APP,
  '/settings/mobile-personalisation/popups': UPSELL_IDENTIFIER_CUSTOM_APP,
  '/settings/mobile-personalisation/customize': UPSELL_IDENTIFIER_CUSTOM_APP,
  '/access-monitoring/perform': UPSELL_IDENTIFIER_ACCESS_MONITORING,
  '/access-monitoring/monitor': UPSELL_IDENTIFIER_ACCESS_MONITORING,
  '/access-monitoring/settings': UPSELL_IDENTIFIER_ACCESS_MONITORING,
  // todo check vod
};

export const EXCEPTION_STAFF_ROLE_OVERBOOKING_NOT_ALLOWED = 4500;
export const EXCEPTION_STAFF_ROLE_OVERRIDE_COACH_NOT_ALLOWED = 4501;
export const EXCEPTION_STAFF_ROLE_OVERRIDE_ESTABLISHMENT_NOT_ALLOWED = 4502;
export const EXCEPTION_STAFF_ROLE_CAN_NOT_CHANGE_DATE_BECAUSE_NO_COACH_OVERRIDE = 4503;
export const EXCEPTION_STAFF_ROLE_CAN_NOT_CHANGE_DATE_BECAUSE_NO_ESTABLISHMENT_OVERRIDE = 4504;
export const EXCEPTION_STAFF_ROLE_OVERBOOKING_IN_WAITING_LIST_NOT_ALLOWED = 4505;

export const FRANCHISE_URLS_PERMISSIONS: Record<
  FranchiseProtectedUrls,
  string[]
> = {
  '/f/franchises': ['franchiseMenu.franchises'],
  '/f/members': ['franchiseMenu.members'],
  '/f/coupon-template': ['franchiseMenu.products.couponTemplates'],
  '/f/marketing/campaigns': ['franchiseMenu.marketing.campaigns'],
  '/f/marketing/tags': ['franchiseMenu.marketing.tags'],
  '/f/email-template': ['franchiseMenu.marketing.emailTemplates'],
  '/f/settings/notification-rule': ['franchiseMenu.notificationRules'],
  '/f/payment-pack-template': ['franchiseMenu.products.paymentPacksTemplates'],
  '/f/private-pass-template': ['franchiseMenu.products.privatePassTemplates'],
  '/f/universal-pass-template': [
    'franchiseMenu.products.universalPassTemplates',
  ],
  '/f/giftcard-template': ['franchiseMenu.products.giftcardTemplates'],
  '/f/reporting': ['franchiseMenu.reporting'],
  '/f/settings/staff': ['franchiseMenu.staff'],
  '/f/settings/role': ['franchiseMenu.staff'],
  '/f/settings/widget': ['franchiseMenu.widgets'],
  '/f/settings/theme': ['franchiseMenu.settings'],
};

export const DEFAULT_ROLES: number[] = [
  OWNER_ROLE,
  STAFF_ROLE,
  RESTRICTED_STAFF_ROLE,
  CHECKIN_APP_ROLE,
  ADMIN_ROLE,
  REPORT_ROLE,
];

export const UUID_REGEX = `[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`;

export const DEFAULT_OBJECT_LEVEL_PERMISSIONS: ObjectLevelPermissions = {
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
  report: Object.entries(COMPANY_REPORT_CATEGORIES_BY_GLOBAL_CATEGORY).reduce(
    (acc, [globalCategory, categoryList]) => ({
      ...acc,
      [globalCategory]: categoryList.reduce(
        (_acc, category) => ({
          ..._acc,
          [category]: {
            allowed_actions: {
              create: true,
              read: true,
              edit: true,
              delete: true,
            },
          },
        }),
        {},
      ),
    }),
    {},
  ),
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
};

const OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP: { [key: string]: string } = {
  'billing.allowed_actions.editBalance':
    'billing.allowed_actions.editBalanceWithoutInvoice',
};

const OBJECT_LEVEL_PERMISSIONS_RECIPROQUE_MAP = Object.keys(
  OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP,
).reduce<{ [key: string]: string }>(
  (acc, key) => ({
    ...acc,
    [OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP[key]]: key,
  }),
  {},
);

/**
 * @description Map of the object level permissions dependencies.
 * keys and values are all paths to the object level permissions.
 * - `direct` means that the value of the key permission influences the value of the other permission.
 * - `reciproque` means that the value of the other permission influences the value of the key permission.
 * @example  { direct: { 'billing.allowed_actions.editBalance': 'billing.allowed_actions.editBalanceWithoutInvoice' } }
 * means that the value of `billing.allowed_actions.editBalance` influences the value of `billing.allowed_actions.editBalanceWithoutInvoice`.
 * Therefore, if `billing.allowed_actions.editBalance` is `false`, `billing.allowed_actions.editBalanceWithoutInvoice` should be `false` too.
 */

export const OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP = {
  direct: OBJECT_LEVEL_PERMISSIONS_DIRECT_MAP,
  reciproque: OBJECT_LEVEL_PERMISSIONS_RECIPROQUE_MAP,
};

// For the old and the new webshop, we want to properly hide from the UI the old and new permissions according to the one that is displayed
export const NEW_WEBSHOP_OBJECT_LEVEL_PERMISSIONS = ['product.shopReworked'];

export const NEW_WEBSHOP_ROLE_LEVEL_PERMISSIONS = [
  'navigationMenu.products.shopReworked',
];

export const OLD_WEBSHOP_ROLE_LEVEL_PERMISSIONS = [
  'navigationMenu.products.shop',
  'navigationMenu.settings.webShop',
];
