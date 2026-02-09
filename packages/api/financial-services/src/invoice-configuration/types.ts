export type InvoiceConfigurationResponse = {
  stripe_footer: string;
  invoice_business_name: string;
  nb_retries_subscription_payments: number;
  disable_pass_on_fail_subscription_payment: boolean;
  show_company_email_in_invoice: boolean;
  revert_bookings_on_fail_subscription_payment: boolean;
  advance_sepa_billing: boolean;
  is_custom_discount_reason_required: boolean;
  is_invoice_revert_reason_required: boolean;
};
