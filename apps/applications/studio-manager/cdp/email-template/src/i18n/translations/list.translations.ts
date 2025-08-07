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
      title: "You haven't made any custom templates yet!",
      description:
        "Create your first custom template to send personalized emails to your members.",
    },
    emptyCategory: {
      description:
        "Create a custom template for this category to send personalized emails to members.",
    },
    noCategory: "No Category ({{emailTemplateCount}})",
  },
  activeList: {
    actions: {
      addCategory: "Add category",
      addTemplate: "Create template",
      delete: "Delete",
      duplicate: "Duplicate",
      preview: "Preview",
      rename: "Rename",
      undo: {
        success: "Action undone",
        error: "An error occurred while undoing the action",
      },
    },
    hover: {
      preview: "Preview template",
      duplicate: "Duplicate template",
      delete: "Delete template",
      moreActions: "More actions",
    },
    bsportTemplateInfo: {
      title: "bsport templates",
      description:
        "Duplicate the template that you want to use, then edit and send the copied version to members directly from this page.",
      quit: "Quit",
    },
    createTemplateModal: {
      title: "Create new email template",
      description: "Name your template to get started!",
      confirmButton: "Create",
      cancelButton: "Go back",
      textInput: {
        label: "Template title",
        placeholder: "Template title here...",
      },
      onSuccess: {
        title: "Template created",
        action: "Open",
      },
      onFailure: {
        title: "An error occurred when creating your email template.",
      },
      errors: {
        name: "Cannot create a template: template name not valid",
      },
    },
    previewEmailTemplateModal: {
      confirmButton: "Edit",
      cancelButton: "Close",
    },
    duplicateTemplateModal: {
      title: "Duplicate template?",
      description: "You can edit <b>{{emailTemplateTitle}}</b> after",
      duplicateEmailTitle: "{{emailTemplateTitle}} - Copy",
      confirmButton: "Duplicate",
      cancelButton: "Go back",
      onSuccess: {
        title: "Template duplicated",
        action: "Open",
      },
      onFailure: {
        title: "An error occurred when duplicating your email template.",
      },
    },
    deleteTemplateModal: {
      title: "Delete email template?",
      description:
        "Deleting <b>{{emailTemplateTitle}}</b> will also remove it from any transactional emails that it's linked to.",
      confirmButton: "Delete",
      cancelButton: "Go back",
      onSuccess: {
        title: "Email template deleted",
        action: "Undo",
      },
      onFailure: {
        title: "An error occurred when deleting your email template.",
      },
    },
    createCategoryModal: {
      title: "Create a new category",
      textInput: {
        label: "Category name",
        placeholder: "Category name here...",
      },
      confirmButton: "Create",
      cancelButton: "Go back",
      onSuccess: {
        title: "Category created",
      },
      onFailure: {
        title: "An error occurred when creating your category.",
      },
      errors: {
        name: "Cannot create a category: category name not valid",
      },
    },
    renameCategoryModal: {
      title: "Rename category",
      textInput: {
        label: "Category name",
        placeholder: "Category name here...",
      },
      confirmButton: "Rename",
      cancelButton: "Go back",
      onSuccess: {
        title: "Category renamed",
        action: "Undo",
      },
      onFailure: {
        title: "An error occurred when renaming your category.",
      },
    },
    deleteCategoryModal: {
      title: "Delete category?",
      description:
        "All items listed under <b>{{categoryName}}</b> will be moved to the 'No Category' section.",
      confirmButton: "Delete",
      cancelButton: "Go back",
      onSuccess: {
        title: "Category deleted",
        action: "Undo",
      },
      onFailure: {
        title: "An error occured when deleting your category.",
      },
    },
    restoreEmailTemplateAction: {
      onFailure: {
        title: "An error occured when restoring your email template.",
      },
    },
    renameTemplateModal: {
      title: "Rename email template",
      textInput: {
        label: "Template title",
        placeholder: "Template title here...",
      },
      confirmButton: "Rename",
      cancelButton: "Go back",
      onSuccess: {
        title: "Template renamed",
        action: "Undo",
      },
      onFailure: {
        title: "An error occurred when renaming your template.",
      },
    },
  },
};
