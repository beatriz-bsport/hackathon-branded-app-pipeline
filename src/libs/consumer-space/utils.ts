// @ts-nocheck
import Config from '../../config';

export function getPaymentLink(companyId: number, invoiceId: string) {
  return `${Config.PUBLIC_URL}/c/${companyId}/?invoiceInPayment=${invoiceId}`;
}

export function getAddPaymentLink(companyId: number) {
  const profileUrl = encodeURIComponent(
    `/c/${companyId}/profile?isAddPaymentMethodDialogOpen=true`,
  );
  return `${Config.PUBLIC_URL}/login?membership=${companyId}&next=${profileUrl}`;
}
