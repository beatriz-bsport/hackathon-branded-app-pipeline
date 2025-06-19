exports.default = {
  pages: {
    detail: "Email templates",
  },
  breadcrumbs: {
    rootPage: "Email templates",
    customPage: "Custom templates",
  },
  details: {
    state: {
      loading: "Loading your template...",
    },
    actions: {
      saveChanges: "Save changes",
      discardChanges: "Discard",
    },
    hover: {
      exportHtml: "Export template to HTML",
      renameTemplate: "Rename email template",
      moreActions: "More actions",
    },
    bsportTemplateInfo: {
      title: "bsport templates",
      description: {
        firstStep:
          "If you want to send communications or edit the templates in this section, it is necessary to create a copy of the desired template. ",
        secondStep:
          "Then select the copy of the email when sending a communication.",
      },
      quit: "Quit",
    },
    renameTemplateModal: {
      title: "Rename email template",
      textInput: {
        label: "Template title",
        placeholder: "Template title here...",
      },
      confirmButton: "Rename",
      cancelButton: "Cancel",
      onSuccess: {
        title: "Template renamed",
        action: "Undo",
      },
      onFailure: {
        title: "An error occurred when renaming your template.",
      },
      errors: {
        notProvided: "This is required",
        tooLong: "The title is too long",
      },
    },
  },
  saveTemplateAction: {
    description: "The page has unsaved changes.",
    success: {
      title: "Email template saved",
    },
    error: {
      missingFields: "Some required fields are missing",
      problemWhileSaving: "There was a problem saving your changes.",
    },
  },
  leaveConfirmationModal: {
    description: "Are you sure you want to leave this page?",
    confirmButton: "OK",
    cancelButton: "Cancel",
  },
  templateSubject: {
    label: "Email subject",
    placeholder: "Add an email subject...",
    error: {
      notProvided: "This is required",
      tooLong: "The subject is too long",
    },
  },
  templateDesign: {
    error: {
      notProvided: "No template design provided.",
    },
  },
  templateCategory: {
    label: "Category",
    noCategory: "No category",
  },
};
