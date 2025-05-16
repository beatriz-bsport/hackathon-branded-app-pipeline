const getTranslations = async () => {
  const {
    ORDER_STATE_CANCELLED,
    ORDER_STATE_ONSITEDELIVERY,
    ORDER_STATE_PAID,
    ORDER_STATE_SENT,
  } = await import("@bsport/common/lib/master-data/order-states");

  return {
    status: {
      label: "Status",
      values: {
        [ORDER_STATE_PAID.id]: "To be processed",
        [ORDER_STATE_CANCELLED.id]: "Cancelled",
        [ORDER_STATE_ONSITEDELIVERY.id]: "Click & collect",
        [ORDER_STATE_SENT.id]: "Sent",
      },
    },
  };
};

exports.default = getTranslations();
