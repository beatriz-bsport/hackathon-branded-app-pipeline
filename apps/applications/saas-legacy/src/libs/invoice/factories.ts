import { faker } from '@faker-js/faker';

import { ConsumerInvoice, Invoice, InvoiceType } from '#src/libs/invoice/types';
import { PaymentEngine, PaymentItem } from '#src/libs/invoice/payment/types';
import { PaymentMethodsChoices } from '#src/libs/invoice/payment/constants';
import { ExportInvoiceErrorCode, ExportInvoiceStatus } from './constants';
import type { InvoiceItem } from '#src/libs/invoice/invoice-item/types';

/**
 * Generates an invoice with Faker. You can use the options parameter to alter properties of the returned object.
 * @param {Partial<Invoice>} options An object containing partial data for the invoice.
 * @returns {Invoice} The generated invoice object.
 * @example
 * const fakeInvoice = invoiceFactory({
 *   memberName: 'John Doe',
 *   date: '2024-04-17',
 *   amount_due_cts: 5000,
 *   amount_paid_cts: 2000,
 *   is_v2: true
 * });
 */
export function invoiceFactory(options?: Partial<Invoice>): Invoice {
  const fake_amount_due_cts = faker.number.int(10000);
  const fake_amount_paid_cts = faker.number.int(fake_amount_due_cts);
  return {
    amount_due_cts: options?.amount_due_cts ?? fake_amount_due_cts,
    amount_paid_cts: options?.amount_paid_cts ?? fake_amount_paid_cts,
    author: options?.author ?? faker.number.int(),
    billing_plan: options?.billing_plan ?? null,
    custom_footer: options?.custom_footer ?? '',
    date: options?.date ?? faker.date.future().toISOString(),
    establishment_billing_group: options?.establishment_billing_group ?? null,
    establishment: options?.establishment ?? null,
    fully_payed: options?.fully_payed ?? '',
    invoice_items: options?.invoice_items ?? [],
    invoice_legal_identifier: options?.invoice_legal_identifier ?? null,
    invoice_type: options?.invoice_type ?? InvoiceType.REGULAR,
    is_draft: options?.is_draft ?? false,
    is_finalized: options?.is_finalized ?? false,
    is_member_pos: options?.is_member_pos ?? false,
    is_signed_on_fiskaly: options?.is_signed_on_fiskaly ?? false,
    is_quick_invoice: options?.is_quick_invoice ?? null,
    is_v2: options?.is_v2 ?? false,
    member: options?.member ?? faker.number.int(10000),
    memberName: options?.memberName ?? faker.person.firstName(),
    payments: options?.payments ?? [],
    plannedinvoice: options?.plannedinvoice ?? faker.number.int(),
    price_due: options?.price_due ?? '',
    price_payed: options?.price_payed ?? '',
    quickbooks_status: options?.quickbooks_status ?? faker.number.int(),
    reverse_invoices: options?.reverse_invoices ?? [],
    reverted: options?.reverted ?? false,
    source_invoice: options?.source_invoice ?? null,
    source: options?.source ?? faker.number.int(),
    stripe_invoice_pdf: options?.stripe_invoice_pdf ?? null,
    exported_invoice_file_path: options?.exported_invoice_file_path ?? null,
    exported_invoice_status: faker.helpers.enumValue(ExportInvoiceStatus),
    exported_invoice_error_message:
      options?.exported_invoice_error_message ?? null,
    exported_invoice_error_code: faker.helpers.enumValue(
      ExportInvoiceErrorCode,
    ),
    uuid: options?.uuid ?? faker.string.uuid(),
    voucher: options?.voucher ?? '',
    revert_reason: options?.revert_reason ?? '',
    fiskaly_sign_es_signature_status:
      options?.fiskaly_sign_es_signature_status ?? null,
  };
}

/**
 * Generates a consumer invoice with Faker. You can use the options parameter to alter properties of the returned object.
 * @param {Partial<ConsumerInvoice>} options An object containing partial data for the consumer invoice.
 * @returns {ConsumerInvoice} The generated consumer invoice object.
 * @example
 * const fakeConsumerInvoice = consumerInvoiceFactory({
 *   date: '2024-04-17',
 *   amount_due_cts: 5000,
 *   amount_paid_cts: 2000,
 *   amount_paid_cts: 3000,
 *   is_finalized: true,
 * });
 */
export function consumerInvoiceFactory(
  options?: Partial<ConsumerInvoice>,
): ConsumerInvoice {
  const defaultAmountDueCts = faker.number.int(10000);
  const defaultAmountPaidCts = faker.number.int(defaultAmountDueCts);
  const defaultAmountLeftToPayCts = defaultAmountDueCts - defaultAmountPaidCts;
  return {
    amount_due_cts: options?.amount_due_cts ?? defaultAmountDueCts,
    amount_left_to_pay_cts:
      options?.amount_left_to_pay_cts ?? defaultAmountLeftToPayCts,
    amount_paid_cts: options?.amount_paid_cts ?? defaultAmountPaidCts,
    amount_refunded_cts: options?.amount_refunded_cts ?? 0,
    date: options?.date ?? faker.date.future().toISOString(),
    disputed_payments: options?.disputed_payments ?? [],
    establishment_billing_group_name:
      options?.establishment_billing_group_name ?? null,
    invoice_items: options?.invoice_items ?? [],
    invoice_legal_identifier: options?.invoice_legal_identifier ?? null,
    invoice_type: options?.invoice_type ?? InvoiceType.REGULAR,
    is_draft: options?.is_draft ?? false,
    is_finalized: options?.is_finalized ?? false,
    is_quick_invoice: options?.is_quick_invoice ?? null,
    main_invoice_item_name:
      options?.main_invoice_item_name ?? faker.commerce.productName(),
    member: options?.member ?? faker.number.int(10000),
    payments: options?.payments ?? [],
    plannedpaymentevent_set: options?.plannedpaymentevent_set ?? [],
    reverse_invoices: options?.reverse_invoices ?? [],
    reverted: options?.reverted ?? false,
    stripe_invoice_pdf: options?.stripe_invoice_pdf ?? null,
    exported_invoice_file_path: options?.exported_invoice_file_path ?? null,
    exported_invoice_status: faker.helpers.enumValue(ExportInvoiceStatus),
    exported_invoice_error_message:
      options?.exported_invoice_error_message ?? null,
    exported_invoice_error_code: faker.helpers.enumValue(
      ExportInvoiceErrorCode,
    ),
    uuid: options?.uuid ?? faker.string.uuid(),
    voucher: options?.voucher ?? '',
  };
}

/**
 * Generates an invoice item with Faker. You can use the options parameter to alter properties of the returned object.
 * @param {Partial<InvoiceItem>} options An object containing partial data for the invoice item.
 * @returns {InvoiceItem} The generated invoice item object.
 * @example
 * const fakeInvoiceItem = invoiceItemFactory({
 *   name: 'Product A',
 *   price: '50.00',
 *   total_price: '50.00',
 * });
 */
export function invoiceItemFactory(
  options?: Partial<InvoiceItem>,
): InvoiceItem {
  const currentPrice = options?.price ?? faker.commerce.price({ max: 100 });
  const currentVoucher = options?.voucher ?? '0.00';
  const currentTotalPrice =
    options?.total_price ??
    (parseFloat(currentPrice) - parseFloat(currentVoucher)).toString();

  return {
    content_type: options?.content_type ?? faker.number.int(10),
    id: options?.id ?? faker.number.int(100),
    invoice: options?.invoice ?? faker.string.uuid(),
    name: options?.name ?? faker.commerce.productName(),
    object_id: options?.object_id ?? faker.number.int(200),
    price: currentPrice,
    reverted: options?.reverted ?? false,
    subtitle: options?.subtitle ?? faker.commerce.productDescription(),
    total_price_notax: options?.total_price_notax ?? currentTotalPrice,
    total_price: currentTotalPrice,
    voucher: currentVoucher,
  };
}

/**
 * Generates a batch of invoice items with Faker.
 * @param {number} length The number of invoice items to generate.
 * @param {Partial<InvoiceItem>} instance An optional object containing partial data for each invoice item in the batch.
 * @returns {InvoiceItem[]} An array containing the generated invoice item objects.
 * @example
 * const fakeInvoiceItems = invoiceItemBatchFactory(5, {
 *   name: 'Product A',
 *   price: '50.00',
 *   total_price: '50.00',
 * });
 */
export const invoiceItemBatchFactory = (
  length: number,
  instance?: Partial<InvoiceItem>,
): InvoiceItem[] =>
  faker.helpers.multiple<InvoiceItem>(
    () => invoiceItemFactory(instance || {}),
    { count: length },
  );

/**
 * Generates a payment item with Faker. You can use the options parameter to alter properties of the returned object.
 * @param {Partial<PaymentItem>} options An object containing partial data for the payment item.
 * @returns {PaymentItem} The generated payment item object.
 * @example
 * const fakePaymentItem = paymentItemFactory({
 *   date: '2024-04-17',
 *   price: '50.00',
 *   payment_received: true,
 * });
 */
export function paymentItemFactory(
  options?: Partial<PaymentItem>,
): PaymentItem {
  return {
    date: options?.date ?? faker.date.past().toString(),
    id: options?.id ?? faker.number.int(100),
    invoice: options?.invoice ?? faker.string.uuid(),
    is_method_editable: options?.is_method_editable ?? false,
    is_processing: options?.is_processing ?? false,
    is_returnable: options?.is_returnable ?? false,
    is_v2: options?.is_v2 ?? true,
    payment_engine: options?.payment_engine ?? PaymentEngine.BSPORT,
    payment_method:
      options?.payment_method ??
      faker.helpers.arrayElement(PaymentMethodsChoices),
    payment_note: options?.payment_note ?? faker.commerce.productDescription(),
    payment_received: options?.payment_received ?? false,
    price: options?.price ?? faker.commerce.price({ max: 100 }),
    returned_amount: options?.returned_amount ?? '',
    reverted: options?.reverted ?? false,
    stripe_charge_id: options?.stripe_charge_id ?? faker.string.uuid(),
    transaction_fee: options?.transaction_fee ?? '',
    uuid: options?.uuid ?? faker.string.uuid(),
  };
}

/**
 * Generates a batch of payment items with Faker.
 * @param {number} length The number of payment items to generate.
 * @param {Partial<PaymentItem>} instance An optional object containing partial data for each payment item in the batch.
 * @returns {PaymentItem[]} An array containing the generated payment item objects.
 * @example
 * const fakePaymentItems = paymentItemBatchFactory(5, {
 *   date: '2024-04-17',
 *   price: '50.00',
 *   payment_received: true,
 * });
 */
export const paymentItemBatchFactory = (
  length: number,
  instance?: Partial<PaymentItem>,
): PaymentItem[] =>
  faker.helpers.multiple<PaymentItem>(
    () => paymentItemFactory(instance || {}),
    { count: length },
  );
