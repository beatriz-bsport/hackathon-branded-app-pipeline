exports.default = {
  title: "Smartlists",
  addSmartlist: "Create Smartlist",
  loading: "Loading Smartlists...",
  emptyState: {
    title: "No Smartlists yet",
    subtitle:
      "Create your first Smartlist to segment members with tags, send targeted messages and track engagement.",
  },
  emptySearch: {
    title: "No results found",
    subtitle:
      "No Smartlists match your search.\nTry clearing it to see more results",
    clearFilters: "Clear search",
  },
  duplicateModal: {
    title: "Duplicate Smartlist?",
    description: "You can edit <b>{{name}}</b> after",
    buttons: {
      duplicate: "Duplicate",
      cancel: "Go back",
    },
  },
  deleteModal: {
    title: "Delete Smartlist?",
    description: "Do you want to delete <b>{{name}}</b>?",
    warning:
      "If you delete <b>{{name}}</b>, any scheduled messages or automatic tagging will be cancelled but previously tagged members won't be affected.",
    audienceWarning: "Smartlists used in Audience workflows can't be deleted. ",
    cannotBeDeleted:
      "This Smartlist is currently being used in Audience workflows and can't be deleted on this page.",
    audienceCallToAction:
      "To delete this Smartlist, go to the Audience page and remove it from the associated workflows.",
    buttons: {
      delete: "Delete",
      cancel: "Go back",
    },
  },
  toasts: {
    success: {
      duplicated: "Smartlist duplicated",
      open: "Open",
      saved: "Smartlist updated",
      created: "Smartlist created",
      deleted: "Smartlist deleted",
      undo: "Undo",
      actionUndone: "Action undone",
    },
    error: {
      duplicateFailed:
        "Something went wrong while duplicating the Smartlist. Please try again.",
      updateFailed:
        "Something went wrong while updating the Smartlist. Please try again.",
      createFailed:
        "Something went wrong while creating the Smartlist. Please try again.",
      deleteFailed:
        "Something went wrong while deleting the Smartlist. Please try again.",
      deleteError: {
        101000: "Smartlist deletion failed. Please try again.",
        101001:
          "This Smartlist cannot be deleted because it's being used in active communication groups.",
        101002:
          "This Smartlist cannot be deleted because it's being used in active cadences.",
      },
    },
  },
  inlineActions: {
    duplicate: "Duplicate Smartlist",
    edit: "Change name or description",
    delete: "Delete Smartlist",
  },
  createForm: {
    title: "Create Smartlist",
    subtitle:
      "Segment your members by specific criteria with Smartlists. Add a name and description for this Smartlist so you can find it later.",
    actions: {
      create: "Save",
      cancel: "Go back",
    },
  },
  editForm: {
    fields: {
      name: {
        label: "Name",
        placeholder: "e.g. Members who paid via Stripe",
        required: "Give your Smartlist a name so you can find it later",
        maxLength:
          "Smartlist name is too long, please keep it under 200 characters",
      },
      description: {
        label: "Description",
        placeholder: "e.g. Members who have paid using Stripe payment",
      },
    },
    actions: {
      save: "Save",
      cancel: "Go back",
      create: "Create",
    },
    title: {
      edit: "Edit Smartlist",
      add: "Create Smartlist",
    },
  },
};
