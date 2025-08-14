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
      giftcard: "Gift Cards",
      offer: "Sessions",
      replacement_request: "Substitution",
      "waiting-list": "Waitlists",
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
      tooltip: {
        pushNotificationHelper: {
          title: "Push notifications",
          message:
            "You can start enabling a push notification after you’ve set it up.",
        },
        franchiseOwned:
          "The Master Account directly manages this transactional notification.",
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
