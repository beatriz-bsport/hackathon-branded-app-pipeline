exports.default = {
  pages: {
    list: "Gift cards",
    archivedList: "Archived gift cards",
  },
  listPage: {
    header: {
      buttons: {
        addGiftcard: "Add gift card",
        openBankImage: "Gift card image bank",
      },
    },
    empty: {
      title: "No gift cards yet",
      subtitle:
        "Create gift cards and let your members gift it to their loved ones",
    },
    archiveModal: {
      title: "Archive gift card",
      description: {
        action: "Do you want to archive '{{ name }}' ?",
        effect:
          "Members that previously purchased it will still be able to use it. " +
          "You can unarchive this gift card at any time.",
      },
      buttons: {
        cancel: "Cancel",
        archive: "Archive",
      },
      toasts: {
        messageArchived: "'{{ name }}' has been archived",
        actionUndo: "Undo",
      },
    },
    duplicateModal: {
      title: "Duplicate gift card",
      description: {
        action: "Do you want to duplicate '{{ name }}' ?",
        effect: "You can edit the gift card details afterwards.",
      },
      buttons: {
        cancel: "Cancel",
        duplicate: "Duplicate",
      },
      toasts: {
        messageDuplicated: "'{{ name }}' has been duplicated",
        actionOpen: "Open",
      },
    },
  },
  archivedListPage: {
    empty: {
      title: "No archived gift cards",
    },
    toasts: {
      messageUnarchived: "'{{ name }}' has been unarchived",
      actionUndo: "Undo",
    },
  },
  giftcardTable: {
    headers: {
      name: "Name",
      validity: "Validity",
      price: "Price",
    },
    values: {
      unavailable: "Unavailable",
      shared: "Shared",
      unlimited: "Unlimited",
      expireInXDays: "{{ expiration }} days",
    },
    tooltips: {
      archive: "Archive gift card",
      duplicate: "Duplicate gift card",
      restore: "Unarchive gift card",
      shared: "Item created by master account",
      unavailable: "Cannot be purchased on marketplace",
    },
    loading: "Loading giftcards",
  },
};
