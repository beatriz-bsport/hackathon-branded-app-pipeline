exports.default = {
  page: {
    title: "Transactional Notifications",
  },
  notificationRuleEvents: {
    list: {
      notificationNumber_one: "1 notification",
      notificationNumber_other: "{{ count }} notifications",
      loading: {
        message: "Loading notification rule events...",
      },
      emptyState: {
        title: "No notification rule events found",
        description:
          "There are no notification rule events available at the moment. Please check back later or contact support.",
      },
    },
    categories: {
      member: "Member registration",
      booking: "Bookings",
      private_booking: "Appointments",
      recurrent_private_booking: "Recurring appointments",
      payment_pack: "Penalties",
      giftcard: "Gift cards",
      offer: "Sessions",
      replacement_request: "Substitutions",
      waiting_list: "Waitlists",
      subscription: "Subscriptions",
      invoice: "Billing",
      referral: "Referral",
    },
  },
  notificationRuleEventDetails: {
    table: {
      headers: {
        name: "Notification",
        email: "Email",
        pushNotification: "Push Notification",
      },
      helper: {
        title: "Push notifications",
        description:
          "You can start enabling a push notification after you’ve set it up.",
      },
      actions: {
        preview: "Preview",
      },
    },
  },
};
