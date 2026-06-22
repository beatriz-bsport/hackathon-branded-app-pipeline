import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import type { SavedPaymentMethod } from "@bsport/api-financial-services";

export const findCurrentSavedPaymentMethod = (
  billingPlan: BillingPlan,
  savedPaymentMethods: SavedPaymentMethod[],
): SavedPaymentMethod | undefined => {
  // Primary match: Stripe payment method id stored on the billing plan.
  const stripePaymentMethodId = billingPlan.stripe_payment_method_id.trim();

  if (stripePaymentMethodId) {
    const matchedByStripeId = savedPaymentMethods.find(
      (paymentMethod) => paymentMethod.id === stripePaymentMethodId,
    );

    if (matchedByStripeId) return matchedByStripeId;
  }

  // Fallback: numeric backend identifiers. payment_method_identifier is the
  // canonical FK while payment_method is an older alias — both are tried so
  // billing plans created via either path are matched correctly.
  const backendIdentifiers = [
    billingPlan.payment_method_identifier,
    billingPlan.payment_method,
  ].filter((identifier) => identifier > 0);

  return savedPaymentMethods.find(
    (paymentMethod) =>
      paymentMethod.payment_backend_identifier !== undefined &&
      backendIdentifiers.includes(paymentMethod.payment_backend_identifier),
  );
};
