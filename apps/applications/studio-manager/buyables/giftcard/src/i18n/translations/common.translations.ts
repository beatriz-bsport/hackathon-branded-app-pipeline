exports.default = {
  pages: {
    list: "Gift Cards",
    archivedList: "Archived Gift Cards",
  },
  listPage: {
    header: {
      buttons: {
        addGiftcard: "Add Gift Card",
        openBankImage: "Gift Card image bank",
      },
    },
    empty: {
      title: "No Gift Cards yet",
      subtitle:
        "Create Gift Cards and let your members gift it to their loved ones",
    },
    archiveModal: {
      title: "Archive Gift Card ?",
      description: {
        lineOne:
          "If you archive '{{ name }}', current or previous purchases won't be affected.",
        lineTwo: "You can restore this Gift Card at any time.",
      },
      buttons: {
        cancel: "Cancel",
        archive: "Archive",
      },
    },
    duplicateModal: {
      title: "Duplicate Gift Card ?",
      description: {
        action: "You'll be able to edit '{{ name }}' afterwards.",
      },
      buttons: {
        cancel: "Cancel",
        duplicate: "Duplicate",
      },
    },
  },
  archivedListPage: {
    empty: {
      title: "No archived Gift Cards",
    },
  },
  toasts: {
    successMessages: {
      restoreGiftcard: "Gift Card restored",
      archiveGiftcard: "Gift Card archived",
      duplicateGiftcard: "Gift Card duplicated",
      deleteGiftcardImage: "Gift Card image deleted",
      undoAction: "Action undone",
    },
    errorMessages: {
      restoreGiftcard: "Failed to restore Gift Card",
      archiveGiftcard: "Failed to archive Gift Card",
      duplicateGiftcard: "Failed to duplicate Gift Card",
      undoAction: "Failed to undo action",
      deleteGiftcardImage: "Failed to delete Gift Card image",
    },
    actions: {
      undo: "Undo",
      open: "Open",
      close: "Close",
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
      archive: "Archive Gift Card",
      duplicate: "Duplicate Gift Card",
      restore: "Restore Gift Card",
      shared: "Item created by master account",
      unavailable: "Cannot be purchased on marketplace",
    },
    loading: "Loading Gift Cards",
  },
  imageUploadModal: {
    title: "Gift Card image bank",
    description:
      "Add custom images to allow your members to make their " +
      "Gift Cards more personal. During the creation of the Gift Card, members will " +
      "be able to choose a background image.",
    selectImage: "Select an image to preview Gift Card design",
    emptyList: "No custom images yet",
  },
};
