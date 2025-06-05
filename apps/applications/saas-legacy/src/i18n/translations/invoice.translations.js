const getTranslations = async () => {
  const PLANNED_INVOICE_STATUS = await import(
    '@bsport/common/lib/master-data/planned-invoice-status.js'
  );

  const {
    INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE,
    INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER,
    INVOICE_NO_REFUND_ON_SAME_PAYMENT_METHOD_IF_NO_ONLINE_PAYMENT,
    INVOICE_NO_REFUND_ON_SEPA_PAYMENT_OLDER_THAN_SIX_MONTHS,
  } = await import('@bsport/common/lib/master-data/error-codes/payment.js');
  const {
    BUYABLE_ITEM_PASS,
    BUYABLE_ITEM_SHOP_ITEM,
    BUYABLE_ITEM_PRIVATE_PASS,
    BUYABLE_ITEM_COMBO_ITEM,
    BUYABLE_ITEM_GIFTCARD,
    BUYABLE_ITEM_CREDIT,
  } = await import('@bsport/common/lib/master-data/buyable-items.js');
  const { InvoiceItemVoucherTraceKind } = await import(
    '@bsport/common/lib/master-data/invoice-item.js'
  );
  const { INVOICE_TYPE_MIGRATION, INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER } =
    await import('@bsport/common/lib/master-data/invoice-type.js');
  const {
    SOURCE_APP,
    SOURCE_WEB,
    SOURCE_SAAS,
    SOURCE_OTHER,
    SOURCE_MIGRATION,
  } = await import('@bsport/common/lib/master-data/source-device.js');
  const {
    PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
    PAYMENT_GROUP_METHOD_IDENTIFIER_CHECK,
    PAYMENT_GROUP_METHOD_IDENTIFIER_HOLIDAY_CHECK,
    PAYMENT_GROUP_METHOD_IDENTIFIER_AMEX,
    PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE,
    PAYMENT_GROUP_METHOD_IDENTIFIER_TRANSFER,
    PAYMENT_GROUP_METHOD_IDENTIFIER_OTHER,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL,
    PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
    PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
    PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
    PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
    PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET,
    PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
    PAYMENT_ENGINE_STRIPE,
    PAYMENT_ENGINE_BSPORT,
    PAYMENT_ENGINE_PAYPAL,
    REVERSE_ON_PAYMENT_METHOD,
    REVERSE_ON_DEBT,
    REVERSE_ON_NEW_PAYMENT_METHOD,
  } = await import('@bsport/common/lib/master-data/payment-group.js');

  return {
    returnPayment: {
      modal: {
        title: 'Client refund',
        content:
          'The payment will be refunded on the bank account, a credit will be added on the invoice to reflect the refunded payment.',
        cancel: 'Cancel',
        confirm: 'Refund',
      },
    },
    configuration: {
      stripe_footer: 'Invoice footer',
      invoicePDFTitle: 'Invoice company name',
      invoicePDFEmail: 'Invoice email address',
      explainStripeFooter:
        'This text will appear at the bottom of the invoices edited in PDF, please add any legal relevant information.',
      explainInvoicePDFTitle:
        "This name will appear as your studio's name on all generated invoices",
      submit_stripe_footer: 'Update',
      forms: {
        invoicePDFTitlePlaceholder:
          'Default company name from Stripe onboarding',
        stripe_footer_placeholder: 'No additional legal information',
        show_company_email_in_invoice:
          'Display the company email address on all invoices',
      },
      refundsAndDiscount: {
        title: 'Refunds and Discounts',
        info: 'These options allow you to force a justification from staff member when manually adding a discount or cancelling / refunding an invoice.',
        checkbox: {
          customDiscountJustification:
            'Require justification for manual discounts',
          refundAndCancelJustification:
            'Require justification for invoice refunds and cancellations',
        },
      },
      nf525Button: 'Download',
      nf525Explain:
        'BSPORT Solutions follows the NF525 compliance procedures. Download our official certificate.',
      nf525: 'NF525 Certification',
      subscription: {
        forms: {
          revert_bookings_on_fail_subscription_payment: {
            label:
              'Cancel associated bookings for subscriptions when payments fail',
            warning:
              "Attention! Previously cancelled bookings resulting from a failed payment won't be recreated if a later payment was successful.",
            helperText:
              'The system will automatically refund the credits and cancel associated bookings for blocked passes for subscriptions whose payments have failed or have been disputed.',
          },
          disable_pass_on_fail_subscription_payment: {
            label: 'Deactivate subscriptions when payments fail',
            helperText:
              'The system will automatically block passes from subscriptions whose payments have failed or have been disputed until the outstanding amount has been paid.',
          },
          nbRetriesSubscriptionPayments: {
            helperText: 'Between 0 and 5 attempts',
            label: 'Number of attempts after a failed payment',
          },
          activateSmartRetries: {
            label: 'Enable Smart Retries for failed payments',
            helperText:
              'The system will automatically retry failed payments at the best time.',
          },
          advance_sepa_billing: {
            helperText:
              'Most customers receive the SEPA payment orders 3 days later.',
            label:
              'Send the SEPA payment order 3 days in advance to compensate any delays in the Banking Networks, which may delay your cash flow.',
          },
        },
        title: 'Subscription',
      },
      invoiceGeneral: 'Invoice PDF',
      stripeTerminal: {
        title: 'Payment terminals',
        connectDialog: {
          title: {
            edit: 'Modifications',
            connect: 'Connect',
            success: 'Successfully connected',
            error: 'Connection failed',
          },
          success: 'Your Stripe Terminal has succesfully connected',
          mustCreateStripeLocation:
            'For your first registration, please fill in the information of the studio where the terminal will be used.',
          loading1:
            'We are trying to establish a connection with your terminal.',
          loading2: 'Please wait',
          form: {
            readerLabel: 'Name of the terminal',
            registrationCode: 'Terminal code',
            registrationCodeHelperText:
              'Enter the code displayed on your Stripe POS terminal',
            connect: 'Connect',
            continue: 'Continue',
            retry: 'Retry',
            update: 'Modify',
          },
          error1: 'Your Stripe Terminal has not been connected.',
          error2: 'Retry',
        },
        paymentDialog: {
          minAmountInfo:
            'The minimum purchase amount for using the terminal is {{amountString}}.',
          paymentSuccess: {
            content: {
              payment: 'The payment has been processed.',
              wait: 'The payment is being processed.',
            },
            title: {
              payment: 'Payment accepted',
              setupAndPlan: 'Payment saved',
              setupOnly: 'Payment method saved',
            },
          },
          paymentFailed: {
            title: {
              setupIntent: 'Operation failed',
              paymentIntent: 'Payment failed',
            },
            content: {
              paymentIntent: 'The payment was not processed.',
              setupIntent: 'The payment method has not been saved.',
            },
            explain: { label: 'Reason for failure :' },
            interac: {
              content:
                'Interac cards cannot be used for recurring payments or saved. Please use an alternative payment method.',
              title: 'Incompatible payment method',
            },
          },
          processing: {
            title: 'Transaction in progress',
            content: 'Please follow the instructions on the Stripe terminal',
            help: {
              title: 'Are you encountering an issue ?',
              content:
                'If the terminal displays an error you can click on cancel and try to pay again. You may want to check your internet connection on both your laptop and terminal.',
            },
            inactivity: {
              title: 'Are you still here?',
              content:
                "We've detected that you have been inactive. Do you still want to pursue this operation? Without any response from you in the next 30 seconds, it will be automatically canceled.",
              action: "Yes! I'm here",
            },
            cancelError: {
              generic: {
                title: 'An error occurred',
                content: 'The operation cannot be cancelled',
              },
              readerBusy: {
                title: 'Payment is being processed',
                content: 'Please wait for the payment to be completed.',
              },
            },
          },
          processingSavePaymentMethod: {
            title: 'Operation in progress',
            content: 'Please follow the instructions on the Stripe terminal',
            help: {
              title: 'Are you encountering an issue ?',
              content:
                'If the terminal displays an error, you can click on cancel and try to save the payment method again. You may want to check your internet connection on both your laptop and terminal.',
            },
            cancelError: {
              readerBusy: {
                title: 'The payment method is being saved',
                content: 'Please wait for the operation to be completed.',
              },
            },
          },
          radio: 'Payment Terminal',
          amountToPay: 'Amount due',
          connectAndPay: 'Send to terminal',
          connectionSuccess: {
            payment:
              'The connection with the terminal has been made. The amount to be paid should now be displayed.',
            intent:
              'The connection with the terminal has been made. The customer should be able to present their card.',
            processing: 'Your application is being processed',
            cancel: {
              title: 'Cancellation',
              cancelExplain1: 'Are you sure you want to cancel the operation?',
              cancelExplain2:
                "You will be redirected to payment terminal's choice.",
              error: 'An error occurred during cancellation.',
            },
          },
          disconnect: {
            title: 'Disconnect',
            content: 'The connection has been lost. Please try again',
          },
        },
        helperText:
          'Use terminals to directly complete transactions from the Back Office and to save time on cutting out all the manual work for physical payments. Please contact your Account Manager for more information.',
        addCard: 'Add Stripe terminal',
        deleteDialog: {
          title: 'Delete',
          content1:
            'Are you sure that you want to remove this payment terminal ({{label}})?',
          content2:
            'This terminal will no langer appear for physical payments.',
          content3: 'Reconnect',
        },
        addReader: 'Connect a terminal',
      },
      tse: {
        title: 'Kassensicherungsverordnung (Germany)',
        description:
          'It’s a regulation aimed at ensuring the security and integrity of electronic cash register systems. We use Fiskaly as a technical security device (TSE) to prevent manipulation and ensure that transaction data is stored securely and tamper-proof.',
        version: 'Version of the TSE: v2',
        manufacturer: 'Manufacturer: fiskaly GmbH',
        manufacturerLinkLabel: 'Certificate of the TSE manufacturer',
        documentationLabel: 'Procedural documentation',
      },
    },
    actions: {
      equilibrate: 'Regularize (deposit)',
      download: 'Download invoice (PDF)',
      downloadXml: 'Download invoice (XML)',
      downloadXmlBulk: 'Generate invoices (XML)',
      downloadXmlBulkTooltip:
        'Invoices will be generated from the last month. If any invoice has already been generated, it must be downloaded individually.',
      downloadXmlBulkState: {
        title: 'Zip file',
        ready: 'Your invoices are ready to be downloaded.',
        generate: 'Generate',
        processing:
          "We're processing your Zip file. You'll be notified when it has been finished.",
      },
      addInvoiceItem: 'Add to invoice',
      save: 'Save',
      backToInvoiceItemEditor: 'Purchase',
      goToPaymentEditor: 'Payment',
      goToSubscription: 'Show subscription',
      revert: 'Cancel',
      invoiceReverted: 'Invoice cancelled',
      finalize: 'Finalize (PDF)',
      consumeBalance: 'Pay via balance',
      explainPdfDraft: 'The invoice is still a draft, pdf is not available.',
      addFooter: "Edit this invoice's footnote",
      addCoupon: 'Add promo code',
      downloadReceipt: 'Payment receipt',
    },
    invoice: {
      editor: { title: 'Invoicing', save: 'Issue invoice', sumup: 'Overview' },
      title: 'Invoice {{ uuid }}',
      header: {
        source: {
          [SOURCE_APP]: 'App',
          [SOURCE_WEB]: 'Web',
          [SOURCE_SAAS]: 'Backoffice',
          [SOURCE_OTHER]: 'Other',
          [SOURCE_MIGRATION]: 'Migration',
          label: 'Channel : {{ source }}',
        },
        clientAuthor: 'Customer',
        author: 'Created by : {{ name }}',
        date: 'Date: {{ date }}',
        reverseInvoice: 'Refunded via ',
        reverseInvoicePending: 'Refund pending via ',
        sourceInvoice: 'Cancel invoice',
        noEstablishment: 'No establishment has been associated to this invoice',
        noBillingGroup: 'No billing group has been associated to this invoice',
      },
      paymentFailed: 'Payment failed. Please try again.',
      paymentFailedWithMethod:
        'Payment failed with {{ paymentMethod }}. Please try again.',
      titleRevert: 'Credit {{ uuid }}',
      titleRevertPending: '[Pending] Credit {{ uuid }}',
      titleReceipt: 'Payment receipt {{ uuid }}',
      titleReverted: 'Invoice (reverted) {{uuid}}',
    },
    creditAccountBalance: { current: 'Current balance' },
    uneditableMessage: {
      invoiceFinalizedThusNotEditable:
        'Invoice was finalized and is not editable anymore',
      invoiceFromSubscriptionThusNotEditable:
        'This invoice is part of a subscription and is therefore not editable, please modify the subscription directly',
      invoiceRevertedThusNotEditable:
        'Invoice was cancelled and is not editable anymore',
    },
    section: {
      paymentList: {
        total: 'Total payment',
        isEmpty: 'No payment method is registered',
        title: 'Payment methods',
      },
      invoiceItemList: {
        total: 'Total',
        isEmpty: 'Please start by adding products to this invoice.',
        title: 'Purchases',
        titleReverse: 'Purchase breakdown',
        billing_establishment: 'Billing establishment*',
        billingGroup: 'Billing group *',
        cannotCreateDiscount:
          'You do not have the required permission to add a discount.',
      },
    },
    invoiceItem: {
      voucher: 'Discount: {{ voucher }}',
      voucherReason: {
        [InvoiceItemVoucherTraceKind.PAYMENT_COMBO]: 'Pack discount',
        [InvoiceItemVoucherTraceKind.COUPON_CODE]:
          'Promo code: {{coupon_name}}',
        [InvoiceItemVoucherTraceKind.COUPON_REFERRED]:
          'Referral discount: Referred member',
        [InvoiceItemVoucherTraceKind.COUPON_REFERRING]:
          'Referral discount: Referring member',
        [InvoiceItemVoucherTraceKind.MANUAL]:
          'Manual discount: {{manual_reason}}',
        manualWithNoReason: 'Manual discount',
      },
      quantity: 'Quantity',
      credit: { label: 'Credit' },
      buyableItemIdentifier: {
        [BUYABLE_ITEM_PASS]: 'Passes',
        [BUYABLE_ITEM_SHOP_ITEM]: 'Webshop',
        [BUYABLE_ITEM_PRIVATE_PASS]: 'Appointment passes',
        [BUYABLE_ITEM_COMBO_ITEM]: 'Packs',
        [BUYABLE_ITEM_GIFTCARD]: 'Gift cards',
        [BUYABLE_ITEM_CREDIT]: 'Credit',
      },
      discount: 'Discount',
      finalPricePreview: 'Preview total',
      discountReason: 'Reason for discount',
    },
    invoiceInfoDialog: {
      actions: { close: 'Close', show: 'See invoice' },
      explain:
        "One or more payments are not passed correctly, the member's deposit reflects the failure of the payment",
    },
    revert: {
      content: {
        explain: {
          [REVERSE_ON_PAYMENT_METHOD]:
            "Card payments / SEPA / etc... will be paid directly to the customer's account. Use this method to make a direct refund following an error.",
          [REVERSE_ON_DEBT]:
            'A credit note will be generated and will increase the customer balance accordingly. Use this method to generate a credit note.',
          [REVERSE_ON_NEW_PAYMENT_METHOD]:
            'Choose the reimbursement method yourself. Use this method for a check / manual transfer / cash refund.',
        },
        label: {
          [REVERSE_ON_PAYMENT_METHOD]: 'Direct refund',
          [REVERSE_ON_DEBT]: 'Refund on internal account',
          [REVERSE_ON_NEW_PAYMENT_METHOD]: 'Manual refund',
        },
        explainEmptyPayment: 'Are you sure you want to cancel this invoice?',
        revertReason: 'Reason for cancellation',
      },
      dialog: {
        actions: { confirm: 'Confirm', cancel: 'Close' },
        title: 'Invoice cancellation',
      },
      warning: {
        [INVOICE_NO_REFUND_ON_SAME_PAYMENT_METHOD_IF_NO_ONLINE_PAYMENT]:
          'Direct refunds are only available if at least one of the payments uses an online method.',
        [INVOICE_NO_REFUND_ON_SEPA_PAYMENT_OLDER_THAN_SIX_MONTHS]:
          'Direct refunds are not possible for SEPA payments older than 180 days.',
        [INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE]:
          'At least one payment has been made with an Interac card on this invoice. Direct refunds are not supported for Interac cards.',
        [INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER]:
          'Note: an adjustment to the account balance cannot be refunded with the account balance',
        debtAndNewPaymentMethodNotAllowed:
          'At least one payment is pending. Only a direct refund is available.',
      },
      SEPARefundDialog: {
        title: 'SEPA refund processing',
        alert:
          'A refund on a SEPA payment may take up to 5 business days to process. Please make sure your customer is informed that their refund is in progress. Be aware that even after a SEPA payment has been refunded, the customer can still dispute the transaction.',
        actions: { confirm: 'Issue refund', cancel: 'Cancel action' },
      },
      blockedDialog: {
        helper:
          'Your Stripe balance is insufficient to process the refund. Please try again after a few days so that payments can be collected.',
        alert:
          'Be careful, with this refund you will exceed the authorized overdraft limit of {{refundBlockingLimit }} {{currencyDisplay}}.',
        title: 'Insufficient Stripe balance',
      },
      autoDebitDialog: {
        helper:
          "Your studio is currently in the process of closing your Bsport account.\n\nBy clicking on confirm, the invoice will be refunded. Your Stripe balance will be debited by {{refundAmount}} {{ currencyDisplay }}. However, to reset your Stripe balance to 0 {{ currencyDisplay }} you will be automatically debited for the difference directly from your bank account indicated in Settings > Company.\n\nIf you don't want to exceed your overdraft limit, you can wait for your Stripe balance to rise again.",
        title: 'Insufficient Stripe balance',
      },
    },
    table: {
      nested: {
        payment: {
          header: {
            paymentReceived: 'Status',
            date: 'Date',
            price: 'Amount',
            paymentMethod: 'Payment method',
          },
          isEmpty: 'No payment',
          title: 'Payment',
        },
        invoiceItem: {
          header: {
            product: 'Name',
            voucher: 'Discount',
            priceExcTax: 'Total (excl. VAT / Sales Tax)',
            price: 'Total (incl. VAT / Sales Tax)',
          },
          isEmpty: 'Please start by adding products to this invoice.',
          title: 'Purchases',
        },
        export: {
          title: 'Electronic invoice (XML)',
          header: {
            status: 'Status',
            errorMessage: 'Error message',
          },
          status: {
            success: 'Generated successfully',
            fail: 'Generation failed',
            failWithMessage: 'Generation failed: {{- errorMessage }}',
            notGenerated: 'Not generated',
          },
        },
      },
      header: {
        pdf: 'PDF',
        missing: 'Amount due',
        amount: 'Total cost',
        date: 'Billing date',
        id: 'Identifier',
        member: 'Member',
        invoiceType: 'Type',
        quickbooks: 'QuickBooks',
      },
      actions: { goToInvoice: 'See invoice' },
    },
    balance: {
      updaterDialog: {
        actions: { cancel: 'Cancel', submit: 'Next' },
        debt: 'Deduct',
        explainTopup:
          "The member's account balance will be increased by: {{ currencyDisplay }}{{ amount }}.",
        explainDecaissement:
          "The member's balance will be decreased by: {{ currencyDisplay }}{{ amount }}.",
        balanceValueLabel: 'Amount',
        title: 'Balance adjustment',
        typeLabel: 'Adjustment type',
        topup: 'Add',
        withoutPaymentNote: {
          warning:
            "Attention: only use this option when absolutely necessary. This action won't be registered in your account.",
          label: "Don't generate an invoice",
        },
      },
    },
    paymentPanel: {
      fields: {
        country: { placeholder: 'France', label: "Accountholder's country" },
        email: { label: "Accountholder's email", placeholder: 'john@doe.com' },
        accountHolderName: { placeholder: 'John Doe', label: 'Accountholder' },
      },
      paymentList: {
        isEmpty: 'There is no registered payment to display.',
        titleReverse: 'Refund',
        title: 'Payments',
      },
      actions: {
        saveForLaterAsSEPA: 'The mandate will be registered as "SEPA"',
        saveForLater: 'Save this payment method',
        paymentSecurityInformation:
          'You can securely store your preferred payment details for future purchases, your information will be encrypted and stored securely',
        showInvoice: 'See invoice',
        confirmPayment: 'Confirm payment',
        payAll: 'Settle customer debt',
        cancel: 'Cancel',
        revert: 'Cancel',
        pay: 'Pay invoice',
        bill: 'Take payment',
        basketWasInconsistent:
          'Your basket has changed. You have not been charged, please attempt the payment again.',
        basketInconsistent:
          'Your cart has been modified, please refresh your page before validating your payment.\n You have not been charged.',
        billByInstalment: 'Instalments',
        paymentLink: 'Payment link',
        generatePaymentLink: 'Generate a payment link',
      },
      sumup: {
        amountRemaining: 'Outstanding amount',
        amountDue: 'Total due',
        title: 'Overview',
        amountPaid: 'Paid',
        amountBeingProcessed: 'Amount in process',
      },
      date: { label: 'Payment date' },
      paymentNote: {
        helperText: '(Optional) Payment reference',
        label: 'Note',
      },
      amount: { label: 'Amount to charge' },
      amountRemaining: 'Outstanding amount: {{ amount }}',
      billingMoreThanNeeded:
        'If you charge more than the amount of the invoice, the difference in cost will be added to the client account balance',
      errorSecretExplain2:
        'If the issue is not resolved please contact us at dev+payment-intent@bsport.io',
      errorSecretExplain1: 'This payment method is not available at the moment',
      plannedPaymentEvent: {
        title: 'Planned payment',
        title_plural: 'Planned payments',
      },
      revertReason: 'Reason: {{ revertReason }}',
    },
    paymentMethod: {
      label: {
        [PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT]: 'Bacs Direct Debit',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: 'Card',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL]:
          'Card (manual - card machine)',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_CHECK]: 'Check',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_HOLIDAY_CHECK]: 'Vacation check',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_CASH]: 'Cash',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_AMEX]: 'AMEX',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT]: 'Client credit balance (debit)',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE]: 'Dispute',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_TRANSFER]: 'Transfer',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_OTHER]: 'Other',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: 'SEPA',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: 'Bancontact',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: 'iDEAL',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: 'Sofort',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: 'EPS',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: 'Giropay',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET]: 'PayPal',
      },
      select: { label: 'Payment method' },
      isInternalExplain:
        'The account balance will be automatically charged if no payment method has been added.',
      add: 'Add',
      edit: 'Edit',
      title: 'Payment method',
      none: 'There are no saved payment methods to display.',
      detach: {
        pm_deleted: 'Deleted payment method',
        pm_associated_to_protected_bp:
          'Impossible: You have a subscription associated with this payment method',
        last_payment_method: 'You must have at least one payment method',
        pm_associated_to_pi:
          'Impossible: You have a subscription associated with this payment method',
        pm_associated_to_registered_ppe:
          'Impossible: You have a subscription associated with this payment method',
      },
      inconsistent:
        "This payment method has been invalidated. It's possible that the member has requested to deactivate this payment method or that this profile has been merged with another profile. Either way, this payment method is no longer usable.",
      isInternalExplainFuturePayments:
        'The due date will be deducted automatically from the account balance. If this is not sufficient, a negative account will be created.',
      addPaymentMethod: 'Add a payment method',
      copyLink: 'Copy the link to add a payment method',
      manual: 'Manual',
      other: 'Other',
    },
    paymentEngine: {
      label: {
        [PAYMENT_ENGINE_STRIPE]: 'Stripe',
        [PAYMENT_ENGINE_BSPORT]: 'Manual payment',
        [PAYMENT_ENGINE_PAYPAL]: 'Paypal',
      },
    },
    invoiceType: {
      reversed: 'Invoice (reverted)',
      return: 'Refunded invoice',
      credit_payment: 'Receipt (balance adjustment)',
      migration: 'Migration',
      regular: 'Invoice',
    },
    invoiceInfo: {
      [INVOICE_TYPE_MIGRATION]:
        'This invoice is the result of a migration. We are unable to provide a PDF or cancel it for legal reasons.',
      [INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER]:
        "This payment receipt represents your member's balance adjustment.",
    },
    plannedPaymentEvent: {
      actions: {
        edit: 'Edit',
        registerNow: 'Take payment now',
        enable: 'Activate',
        disable: 'Deactivate',
        changeMethod: 'Change the payment method',
        solveInvalidPaymentAttempt: 'Regularise',
      },
      nextRetryDate: 'The payment will be retried on {{ d }}',
      lockedToday:
        'The payment is scheduled today, you can no longer change it',
      registerNowInitialData: 'Payment originally due on {{-date}}',
      dialog: {
        invalidMandate: {
          confirm: 'Next',
          cancel: 'Cancel',
          explainSituation:
            'The mandate associated with this payment method has expired. This can be due to a number of reasons: too many failed payments, a unilateral decision by the bank, etc. The payment method can no longer be used and you will have to register a new one.',
          title: 'Expired or invalid direct debit mandate!',
        },
      },
      unrecoverableError: 'Error during payment.',
    },
    mandate: {
      email: 'Email address',
      name: "Account holder's full name",
      address_line_1: 'Address line 1',
      address_line_2: 'Address line 2',
      address_postal_code: 'Postal code',
      phone: 'Phone number',
      city: 'City',
      state: 'State',
      country: 'Country',
      contentBacsDebit:
        'By providing your bank details and confirming your payment, you authorise bsport and Stripe, our payment system, to send debit instructions to your bank in accordance with the payment schedule. You may request a refund from your bank in accordance with the terms of your contract with your bank. You can request your bank to cancel the Direct Debit mandate at any time.',
      contentIban:
        'By providing your IBAN and confirming your payment, you authorise bsport and Stripe, our payment system, to send debit instructions to your bank in accordance with the payment schedule. You may request a refund from your bank in accordance with the terms of your contract with your bank. A refund must be requested within 8 weeks of the first debit.',
    },
    paymentGroup: {
      requiresAction: 'The bank did not authenticate payment (3DSecure)',
      validateRequiresAction: 'Confirm payment method',
    },
    invoicePaymentPackTagWarningDialog: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      content:
        "Attention: you're about to bill a pass to a member that doesn't possess the necessary tags. Are you sure that you want to continue with this billing anyway? ",
      title: 'Information',
    },
    quickbooks: {
      send: {
        errors: {
          931000: 'Error authenticating to QuickBooks',
          931001: 'Error authenticating to QuickBooks',
          931002: 'Authentication keys have expired',
          931003: 'Authentication keys have expired',
          931004: "You've not set up your QuickBooks application",
          931100: 'Error while updating authentication keys',
          931101: "QuickBooks can't send us your data",
          932000: 'Your account is no longer authenticated on BSPORT',
          932001: 'Your account is no longer authenticated on BSPORT',
          932100: 'Error while accessing your QuickBooks information',
          933000:
            "The member associated to this invoice doesn't have the required information to be registered with QuickBooks",
          933100: 'Error while associating the member to the invoice',
          933101: 'Error while associating the member to the invoice',
          933102: 'Error when creating the invoice on QuickBooks',
          933103:
            'Your QuickBooks platform supports multiple currencies, please specify which tax to use.',
          934000: 'This invoice lacks information to be created on QuickBooks',
          934001: 'Error while creating invoice without associated items',
          934002: 'Error while sending a canceled an invoice to QuickBooks',
          934003: 'Error while sending an incomplete invoice to QuickBooks',
          934004: 'Error while sending an unpaid invoice to QuickBooks',
          934005: "Your invoice can't be sent to QuickBooks",
          934006: 'This invoice has already been saved to QuickBooks',
          title: 'Error while sending your invoice',
        },
      },
      invoice: {
        sendToQuickbooks: 'Transfer invoice to QuickBooks',
        onQuickbooks: 'Transferred',
      },
    },
    applyGiftcard: {
      actions: {
        confirm: 'Confirm',
        cancel: 'Close',
        apply: 'Payment by gift card',
      },
      form: {
        errors: { errorAmount: 'Invalid amount.' },
        usedGiftcard: 'Used gift card',
        amountToPay: 'Amount paid by gift card',
        title: 'Payment by gift card',
        availableGiftcards: 'Available gift card(s)',
        addGiftcardError:
          'This gift card code is incorrect. Please check and try again.',
        addGiftcard: 'Add gift card',
        giftcardCode: 'Gift card code',
        expiresOn: 'Expires on: {{- date }}',
      },
      giftcard: 'Gift card',
    },
    invoiceFuturePaymentsDialog: {
      applyForAllFuturePayments: 'Apply to future installments of this invoice',
    },
    status: {
      [PLANNED_INVOICE_STATUS.SUCCEEDED.id]: 'Successful',
      [PLANNED_INVOICE_STATUS.FAILED.id]: 'Failed',
      [PLANNED_INVOICE_STATUS.PENDING.id]: 'Pending',
      [PLANNED_INVOICE_STATUS.PROCESSING.id]: 'In progress',
      [PLANNED_INVOICE_STATUS.CANCELED.id]: 'Cancelled',
    },
    anonymousMember: 'Anonymous member',
    sentToFiskaly: 'Sent to Fiskaly',
  };
};

exports.default = getTranslations();
