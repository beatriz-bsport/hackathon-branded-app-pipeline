import Config from '../../config';

export function getPaymentLink(companyId: number, invoiceId: string) {
  return `${Config.PUBLIC_URL}/c/${companyId}/?invoiceInPayment=${invoiceId}`;
}
