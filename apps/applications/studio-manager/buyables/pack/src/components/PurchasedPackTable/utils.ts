import { LEGACY_URLS } from "#src/urls";
import { useObjectLevelPermission } from "#src/utils/role-permissions";

export const navigateToInvoiceDetails = (invoiceId: string) => {
  window.location.assign(LEGACY_URLS.INVOICE_DETAILS(invoiceId));
};

export const navigateToMemberDetails = (memberId: number) => {
  window.location.assign(LEGACY_URLS.MEMBER_DETAILS(memberId));
};

export const useActionPermissions = () => {
  const hasInvoiceAccess = useObjectLevelPermission(
    "billing.allowed_actions.readInvoices",
  );

  const hasMemberAccess = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );

  return {
    hasInvoiceAccess,
    hasMemberAccess,
  };
};

export const NAVIGATE_TO_MEMBER_ID = "button-navigate-to-member";
export const NAVIGATE_TO_INVOICE_ID = "button-navigate-to-invoice";

export const getNavigateToMemberButtonId = (itemId: string) => {
  return [itemId, "button-navigate-to-member"].join("-");
};

export const getNavigateToInvoiceButtonId = (itemId: string) => {
  return [itemId, "button-navigate-to-invoice"].join("-");
};
