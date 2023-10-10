import { hasObjectLevelPermission } from '../permission-utils/utils';
import { ObjectLevelPermissions } from '../types';

const permissionState: Partial<ObjectLevelPermissions> = {
  member: {
    allowed_actions: {
      create: true,
      readInfo: false,
      editInfo: false,
      delete: false,
      search: false,
      accessProfile: false,
      readBalance: false,
      communication: false,
      manageNotification: false,
    },
  },
  billing: {
    allowed_actions: {
      takePayment: false,
      editBalance: false,
      readInvoices: true,
      createInvoice: false,
      readPaymentLink: false,
      cancelInvoice: false,
      addPaymentMethod: false,
      deletePaymentMethod: false,
      partialRefundAsDiscount: false,
      partialRefundAsCredit: false,
      createManualDiscount: false,
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
    },
  },
};

describe('TEST hasObjectLevelPermission', () => {
  it('Returns a boolean when checking a particular permission', () => {
    const hasMemberCreatePermission = hasObjectLevelPermission(
      permissionState,
      'member.allowed_actions.create',
    );
    const hasBillingReadInvoicesPermission = hasObjectLevelPermission(
      permissionState,
      'billing.allowed_actions.readInvoices',
    );
    expect(hasMemberCreatePermission).toBe(true);
    expect(hasBillingReadInvoicesPermission).toBe(true);
  });

  it('Returns a boolean when checking all permissions', () => {
    const hasExportManagePermission = hasObjectLevelPermission(
      permissionState,
      'export.allowed_actions',
    );
    expect(hasExportManagePermission).toBe(true);
  });
});
