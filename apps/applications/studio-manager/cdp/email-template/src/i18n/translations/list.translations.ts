exports.default = {
  pages: {
    active: "Email templates",
    archived: "Archived email templates",
  },
  tabs: {
    customTemplates: "Custom templates",
    masterTemplates: "Master templates",
    bsportTemplates: "bsport templates",
  },
  filters: {
    filterButton: {
      label: "Filter",
    },
    displayButton: {
      label: "Display",
    },
    status: "Status",
  },
  templateList: {
    loading: "Loading email templates...",
    emptyPage: {
      title: "No email templates yet",
      description: "Create email templates to easily contact your members",
    },
    emptyCategory: {
      description:
        "You haven’t created any email templates in this category yet",
    },
    noCategory: "No Category ({{emailTemplateCount}})",
  },
  activeList: {
    actions: {
      addCategory: "Add category",
      addTemplate: "Create template",
      delete: "Delete",
      duplicate: "Duplicate",
      pinToTop: "Pin to top",
      preview: "Preview",
      rename: "Rename",
    },
    hover: {
      pin: "Pin this template to appear on the top of the list",
      unpin: "Unpin this template",
      preview: "Preview template",
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
    createTemplateModal: {
      title: "Create new email template",
      description: "Name your template to get started!",
      confirmButton: "Create",
      cancelButton: "Cancel",
      textInput: {
        label: "Template title",
        placeholder: "Template title here...",
      },
      onSuccess: {
        title: "Your email template was created",
        action: "Open",
      },
    },
    duplicateTemplateModal: {
      title: "Duplicate email template",
      description: {
        firstStep: "Duplicate",
        secondStep: "You can edit the email template afterwards.",
      },
      confirmButton: "Duplicate",
      cancelButton: "Cancel",
      onSuccess: {
        title: "Your email template was duplicated",
        action: "Open",
      },
    },
    deleteTemplateModal: {
      title: "Delete email template",
      description: {
        firstStep: "Do you want to delete",
        secondStep:
          "Deleting this template will also remove it for any transactional email(s) that it has been linked to. Are you sure that you want to delete this email template?",
      },
      confirmButton: "Delete",
      cancelButton: "Cancel",
      onSuccess: {
        title: "Your email template was deleted",
        action: "Undo",
      },
    },
    createCategoryModal: {
      title: "Create a new category",
      textInput: {
        label: "Category name",
        placeholder: "Category name here...",
      },
      confirmButton: "Create",
      cancelButton: "Cancel",
      onSuccess: {
        title: "{{categoryName}} successfully created",
      },
    },
    renameCategoryModal: {
      title: "Rename category",
      textInput: {
        label: "Category name",
        placeholder: "Category name here...",
      },
      confirmButton: "Rename",
      cancelButton: "Cancel",
      onSuccess: {
        title: "Your category has been renamed : {{newCategoryName}}",
        action: "Undo",
      },
    },
    deleteCategoryModal: {
      title: "Delete category",
      description: {
        firstStep: "Do you want to delete",
        secondStep:
          "All items under this category will be moved to the no category section",
      },
      confirmButton: "Delete",
      cancelButton: "Cancel",
      onSuccess: {
        title: "{{categoryName}} has been deleted",
        action: "Undo",
      },
    },
    emailPreviewModal: {
      confirmButton: "Edit",
      cancelButton: "Close",
    },
  },
};
