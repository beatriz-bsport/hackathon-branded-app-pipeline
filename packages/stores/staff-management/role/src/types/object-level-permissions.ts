export interface ObjectLevelPermissions {
  billing: Billing;
  export: Export;
  management: Management;
  member: Member;
  planning: Planning;
  product: Product;
  report: Report;
  reservation: Reservation;
  session: Session;
}

interface BaseAllowedActions {
  edit: boolean;
  create: boolean;
  delete: boolean;
  read?: boolean;
}

interface Billing {
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
}

interface Export {
  allowed_actions: {
    report: boolean;
    invoice: boolean;
    payroll: boolean;
    planning: boolean;
    smartlist: boolean;
    attendance: boolean;
    subscription: boolean;
    memberDocument: boolean;
    smartlist_general_report: boolean;
  };
}

interface Management {
  coach: {
    allowed_actions: Omit<BaseAllowedActions, "read"> & {
      readPayroll: boolean;
      substitution: boolean;
    };
  };
  activity: {
    allowed_actions: BaseAllowedActions;
  };
  workshop: {
    allowed_actions: BaseAllowedActions;
  };
  privateService: {
    allowed_actions: BaseAllowedActions;
  };
}

interface Member {
  allowed_actions: {
    create: boolean;
    delete: boolean;
    search: boolean;
    editInfo: boolean;
    readInfo: boolean;
    readBalance: boolean;
    accessProfile: boolean;
    communication: boolean;
    manageNotification: boolean;
  };
}

interface Planning {
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
}

interface Product {
  contract: {
    allowed_actions: Omit<BaseAllowedActions, "read"> & {
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
  paymentPack: {
    allowed_actions: PassAllowedActions;
  };
  privatePass: {
    allowed_actions: PassAllowedActions;
  };
  shopReworked?: {
    allowed_actions: Omit<BaseAllowedActions, "read"> & {
      editSettings: boolean;
      editInventory: boolean;
    };
  };
}

interface PassAllowedActions {
  edit: boolean;
  block?: boolean;
  create: boolean;
  delete: boolean;
  manageCredit: boolean;
  compatibility: boolean;
  manageExtension: boolean;
}

interface Report {
  Club: {
    [category: string]: {
      allowed_actions: BaseAllowedActions;
    };
  };
  Bookings: {
    [category: string]: {
      allowed_actions: BaseAllowedActions;
    };
  };
  Payments: {
    [category: string]: {
      allowed_actions: BaseAllowedActions;
    };
  };
  Products: {
    [category: string]: {
      allowed_actions: BaseAllowedActions;
    };
  };
}

interface Reservation {
  activity: {
    allowed_actions: ReservationActivityAllowedActions;
  };
  workshop: {
    allowed_actions: ReservationActivityAllowedActions;
  };
  privateBooking: {
    allowed_actions: {
      edit: boolean;
      cancel: boolean;
      create: boolean;
      editPerformance: boolean;
      refund?: boolean;
    };
  };
}

interface ReservationActivityAllowedActions {
  create: boolean;
  delete: boolean;
  refund?: boolean;
  editSpot: boolean;
  rollcall: boolean;
  attendance: boolean;
  addToWaitlist: boolean;
  editPerformance: boolean;
  removeFromWaitlist: boolean;
}

interface Session {
  activity: {
    allowed_actions: SessionAllowedActions;
  };
  workshop: {
    allowed_actions: SessionAllowedActions;
  };
  privateSlot: {
    allowed_actions: SessionAllowedActions;
  };
}

interface SessionAllowedActions {
  edit: boolean;
  create: boolean;
  delete: boolean;
  editNotes: boolean;
  viewNotes: boolean;
}
