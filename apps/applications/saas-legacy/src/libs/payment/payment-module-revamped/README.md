# Payment module

As of August 2024,  the state of the front-end components flow for payment is incredibly complicated and far more intricate than necessary. For more information, please read [this notion](https://www.notion.so/Payment-Components-FE-3b462a797af940d89f0efe37d083446a?pvs=21).

We want to be able to use Payment module without any knowledge on payments in general.

Plus, we need to use Payment module within the widget, allowing authenticated API calls via the bridge.

This README aims at explaining the way we are now starting to use Payments in frontend generally. 

## 1st use case: I want to implement online payment on an Invoice as a member

This is as simple as this:

```jsx
        <OnlinePaymentInvoice
	        // necessary
          companyId={companyId}
          invoiceUuid={invoiceUuid}
          memberId={memberId}
          onConfirmPaymentSuccess={onPaymentSuccess}
          stripePaymentElementConfig={stripePaymentElementConfig}

	        // optional, exposing onPaymentConfirm (if you need to handle the confirm button somewhere else)
          ref={ref}
          // optional, if you want to handle the confirm button by yourself
          forceHideConfirmPaymentButton
          // optional, callbacks triggered after applying balance to Invoice
          applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
        />

```

In the meantime, you’ll probably be interested in tracking the current status of the payment from your parent component.

To this extent, you have to proceed as this:

```jsx
    const {
	    // if payment has been requested (user clicked on *Confirm*)
      isPaymentProcessing,
      setupPaymentError,
      // if the backend has processed the payment (invoice/basket may still be processing)
      hasPaymentSucceeded,
      // after payment has been processed, the related invoice/basket has not necessarily
      // been correctly updated yet. Frontend waits 2 seconds before asking the status of 
      // the invoice to backend. 
      isBackendProcessingAfterPayment,
      // if there is any loading on the payment page side (member balance being applied,
      // payment method being detached, payment methods being fetched...)
      isPaymentInterfaceLoading,
    } = useInvoicePaymentStatusTracker({
      invoiceUuid,
      memberId,
    });
```

We also expose two methods that you can access from parent components, by forwarding a ref:

```tsx
    React.useImperativeHandle(
      ref,
      () => {
        return {
	        // If you want to handle the payment confirm button
          onPaymentConfirm: (event: React.MouseEvent<HTMLElement>) =>
            !!event && paymentStripeRef?.current?.onPaymentConfirm(event),
          // If you want to restore the part of the state corresponding
          // to the invoice payment setup
          onResetInvoicePaymentSetup: handleResetInvoiceClientSecret,
        };
      },
      [paymentStripeRef, handleResetInvoiceClientSecret],
    );

```

# Next steps:

## 2nd use case: I want to implement online payment on an Invoice as a manager

Not much to do here.

OnlinePaymentInvoice props that will be necessary here are commented. If you’re about to implement this use-case, you’ll have to handle them.

Adapt the hooks in invoice-payment, and paymentModule state accordingly.

## Other use cases: I want to implement online payment on a Basket

This will require more effort. What is needed here, in bulk

- create a new folder basket-payment, similarly as invoice-payment with equivalent hooks
- create OnlinePaymentBasket component, similarly as OnlinePaymentInvoice, but you’ll have to be careful about:
    - Add PayPal payment engine
    - Retrieve all the props from OnlinePayment (the original) that are required exclusively for Basket (not for Invoice)
    - In lower level components such as PaymentStripeCardRevamped, you’ll have to remove the API calls made from the components, and instead put everything in redux, using new actions (for instance verifyBasketAPI)

## Remove props unnecessary from PaymentStripe, PaymentStripeCard…

## Handle loading in lower components

Currently the way we handle the loading from OnlineInvoice to its children is a hugeee mess. In particular we’re mixing states, payments processing, payments setting up, applyBalanceLoading, detachingPaymentMethod etc… 

There are a plenty of unnecessary OR conditions, making the whole very difficult to maintain and to understand
