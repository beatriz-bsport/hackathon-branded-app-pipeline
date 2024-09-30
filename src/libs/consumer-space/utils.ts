import Config from '../../config';
import { NEW_MEMBER_PROFILE_COMPANY_ID_LIST } from '#src/libs/consumer-space/constants';

export function getIsNewMemberProfileDisplayed(companyId: number) {
  const isProduction = ['production'].includes(
    Config.REACT_APP_SENTRY_ENVIRONMENT,
  );
  return isProduction
    ? NEW_MEMBER_PROFILE_COMPANY_ID_LIST.includes(companyId)
    : true;
}

export function getPaymentLink(companyId: number, invoiceId: string) {
  return getIsNewMemberProfileDisplayed(companyId)
    ? `${Config.PUBLIC_URL}/c/${companyId}/invoice/?selectedInvoiceUuid=${invoiceId}`
    : `${Config.PUBLIC_URL}/c/${companyId}/?invoiceInPayment=${invoiceId}`;
}

export function getAddPaymentLink(companyId: number) {
  const profileUrl = encodeURIComponent(
    `/c/${companyId}/profile?isAddPaymentMethodDialogOpen=true`,
  );
  return `${Config.PUBLIC_URL}/login?membership=${companyId}&next=${profileUrl}`;
}
