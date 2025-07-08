exports.default = {
  pages: {
    active: "Forms",
    archived: "Archived Forms",
    loading: "Loading...",
  },
  activeList: {
    actions: {
      addForm: "Add Form",
    },
    addFormModal: {
      title: "Create new Form",
      description: "Name your new form to get started!",
      input: {
        label: "Form name",
        placeholder: "Add a form name...",
      },
      actions: {
        cancel: "Cancel",
        create: "Create",
      },
      errors: {
        nameTooLong:
          "The name is not valid, the maximum length is {{ maximalLength }} characters.",
        nameTooShort:
          "The name is not valid, the minimal length is {{ minimalLength }} character.",
        nameRequired: "The name is not valid, you cannot enter an empty name.",
      },
    },
    archiveModal: {
      actions: {
        archive: "Archive",
        cancel: "Cancel",
      },
      title: "Archive Form",
      description: {
        verification: "Do you want to archive <b>{{ name }}</b> ?",
        effect:
          "Archiving this form will move it to your archive. Members won't be able to access it anymore.",
      },
    },
    duplicateModal: {
      actions: {
        duplicate: "Duplicate",
        cancel: "Cancel",
      },
      title: "Duplicate Form",
      description: {
        verification: "Duplicate <b>{{ name }}</b> ?",
        effect: "You can edit the form afterwards.",
      },
    },
  },
  toasts: {
    messageCreated: {
      success: "Form created",
      error: "Failed to create your form",
    },
    messageArchived: {
      success: "Form archived",
      error: "Failed to archive your form",
    },
    messageRestored: {
      success: "Form restored",
      error: "Failed to restore your form",
    },
    messageDuplicated: {
      success: "Form duplicated",
      error: "Failed to duplicate your form",
    },
    messageUndone: {
      success: "Action undone",
      error: "Failed to undo action",
    },
    actions: {
      undo: "Undo",
      open: "Open",
    },
  },
  table: {
    headers: {
      name: "Name",
      questions: "Questions",
    },
    loading: {
      activeList: "Loading forms...",
      archivedList: "Loading archived forms...",
    },
    empty: {
      activeList: {
        title: "No forms yet",
        subtitle: "Create forms to easily get feedback from your members",
      },
      archivedList: {
        title: "No archived forms yet",
        subtitle: "Any forms moved here can be restored",
      },
      search: {
        title: "No forms found",
        subtitle: "Try with different keywords",
      },
    },
    tooltips: {
      archive: "Archive Form",
      restore: "Restore Form",
      duplicate: "Duplicate Form",
      search: "Search for a form",
      switchToArchived: "Archived forms",
    },
  },
};
