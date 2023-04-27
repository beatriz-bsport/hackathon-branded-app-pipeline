// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY } from '@bsport/common/lib/master-data/payment-group';

const CheckoutForm = (props: {
  clientSecret: string;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
}) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
          paymentRequest.on('paymentmethod', async (ev) => {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            const { paymentIntent, error: confirmError } =
              await stripe.confirmCardPayment(
                props.clientSecret,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false },
              );

            if (confirmError) {
              // Report to the browser that the payment failed, prompting it to
              // re-show the payment interface, or show an error message and close
              // the payment interface.
              ev.complete('fail');
            } else {
              // Report to the browser that the confirmation was successful, prompting
              // it to close the browser payment method collection interface.
              ev.complete('success');
              // Check if the PaymentIntent requires any actions and if so let Stripe
              // handle the flow. If using an API version older than "2019-02-11" instead
              // instead check for: `paymentIntent.status === "requires_source_action"`.
              if (paymentIntent.status === 'requires_action') {
                // Let Stripe handle the rest of the payment flow.
                const { error } = await stripe.confirmCardPayment(
                  props.clientSecret,
                );
                if (error) {
                  // The payment failed -- ask your customer for a new payment method.
                } else if (props.createPendingBookingsIfNecessary) {
                  // The payment has succeeded.
                  props.createPendingBookingsIfNecessary({
                    payment_group_method_identifier:
                      PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
                  });
                }
              } else if (props.createPendingBookingsIfNecessary) {
                // The payment has succeeded.
                props.createPendingBookingsIfNecessary({
                  payment_group_method_identifier:
                    PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
                });
              }
            }
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }
  return <div>NON</div>;
};

export default CheckoutForm;
