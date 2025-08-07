exports.default = {
  page: {
    title: "Tags",
    filters: {
      label: "Filter by main tag",
      operators: {
        is: "is",
        isNot: "is not",
      },
    },
    actions: {
      createTagGroup: {
        label: "Add main tag",
      },
      createTag: {
        label: "Add sub tag",
      },
    },
    loadingState: {
      message: "Loading tags...",
    },
    emptyFilteredPageState: {
      title: "No results found",
      description:
        "No main tags match your filters. Try clearing them to see more results.",
      secondaryButtonLabel: "Clear filters",
    },
    emptyPageState: {
      title: "No tags yet",
      description: "Create tags to manage your members",
    },
    emptyMainTagState: {
      description: "You haven’t created any sub tags in this main tag yet",
    },
  },
  tagGroupList: {
    actions: {
      addSubTag: "Add a sub tag",
      rename: "Rename",
      delete: "Delete",
    },
    items: {
      tooltip: {
        delete: "Delete",
      },
    },
  },
  tagGroupModal: {
    title: {
      create: "Create a main tag",
      update: "Edit main tag",
    },
    helper:
      'Example: add a Main Tag named "VIP", add the Sub Tags "Yes" and "No", and you\'ll have an overview of all your current VIPs.',
    formField: {
      tagGroupName: {
        label: "Main tag name",
        placeholder: "Add a main tag name...",
        errors: {
          required: "Enter a main tag name",
          alreadyInUse:
            "This name is already in use. Please choose a different main tag name.",
          tooLong:
            "The main tag name is too long, it should be less than {{ max }} characters",
          tooShort:
            "The main tag name is too short, it should be at least {{ min}} characters",
        },
      },
    },
    actions: {
      create: "Create",
      update: "Save",
      cancel: "Cancel",
      goTo: "Go to Main Tag",
    },
    result: {
      createSuccess: {
        title: "Main Tag created",
      },
      updateSuccess: {
        title: "Main Tag updated",
      },
      updateFailure: {
        title: "There was an error while updating your main tag",
      },
      createFailure: {
        title: "There was an error while creating your main tag",
      },
    },
  },
  tagModal: {
    title: {
      create: "Create a sub tag",
      update: "Edit sub tag",
    },
    formField: {
      mainTagAssociated: {
        label: "Select a main tag",
        placeholder: "No main tag selected",
        errors: {
          required: "Select a main tag",
        },
      },
      tagName: {
        label: "Sub tag name",
        placeholder: "Add a sub tag name...",
        errors: {
          required: "Enter a sub tag name",
          alreadyInUse:
            "This name is already in use. Please choose a different sub tag name.",
          tooLong:
            "The sub tag name is too long, it should be less than {{ max }} characters",
          tooShort:
            "The sub tag name is too short, it should be at least {{ min}} characters",
        },
      },
      tagColor: {
        label: "Colour",
        placeholder: "#FFFFFF",
      },
    },
    actions: {
      create: "Create",
      update: "Update",
      cancel: "Cancel",
      goTo: "Go to Sub Tag",
    },
    result: {
      createSuccess: {
        title: "Sub Tag created",
      },
      createFailure: {
        title: "Your sub tag could not be saved",
      },
      updateSuccess: {
        title: "Sub Tag updated",
      },
      updateFailure: {
        title: "Your sub tag revisions could not be saved",
      },
    },
  },
  deleteMainTagModal: {
    title: "Permanently delete main tag?",
    description:
      "Deleting this main tag will permanently remove it from {{ number }} members that it's assigned to.",
    alerts: {
      tagInUse: {
        description:
          "Just a heads up: deleting this main tag will also remove any associated sub-tags and tag rules within any conditional workflows that it's used in.",
        confirmCheckbox: {
          label: "Please tick to confirm: ",
          description:
            "I understand that that deleting this main tag is a permanent action that will affect any associated workflows.",
          confirmButtonTooltip:
            "Please check the impact of this change before you continue",
        },
      },
    },
    actions: {
      confirm: "Delete",
      cancel: "Cancel",
    },
    result: {
      success: {
        title: "Your main tag was deleted",
      },
      failure: {
        title: "Failed to delete main tag",
      },
    },
  },
  deleteSubTagModal: {
    title: "Permanently delete sub-tag?",
    description:
      "Deleting this sub-tag will permanently remove it from {{number}} members that it's assigned to. ",
    alerts: {
      tagInUse: {
        description:
          "Just a heads up: deleting this sub-tag will also affect any conditional workflows that it's used in. ",
        confirmCheckbox: {
          label: "Please tick to confirm:",
          description:
            "I understand that that deleting this sub-tag is a permanent action that will affect any associate workflows. ",
          confirmButtonTooltip:
            "Please check the impact of this change before you continue",
        },
      },
    },
    actions: {
      confirm: "Delete",
      cancel: "Cancel",
    },
    result: {
      success: {
        title: "Your sub tag was deleted",
      },
      failure: {
        title: "There was an error while deleting your sub tag",
      },
    },
  },
  tagsDetails: {
    members: "Members",
    actions: {
      tagAll: "Tag all",
      untagAll: "Untag all",
      edit: "Edit",
    },
    tooltip: {
      close: "Close",
      tagMember: "Tag member",
      untagMember: "Untag member",
      editTag: "Change name or color",
      previousSubTag: "View previous sub tag",
      nextSubTag: "View next sub tag",
    },
    segmentedControl: {
      tagged: "Tagged",
      untagged: "Untagged",
    },
    memberList: {
      actions: {
        tag: {
          success: {
            title: "Member tagged successfully",
          },
          failure: {
            title: "Failed to tag member",
          },
        },
        untag: {
          success: {
            title: "Member untagged successfully",
          },
          failure: {
            title: "Failed to untag member",
          },
        },
      },
      loadingState: {
        tagged: "Loading tagged members...",
        untagged: "Loading untagged members...",
      },
      emptyState: {
        title: {
          tagged: "No members tagged yet",
          untagged: "No members untagged yet",
        },
        description: {
          untagged:
            "You can tag members by clicking on the plus icon next to their name on the untagged list.",
          tagged:
            "You can untag members by clicking on the minus icon next to their name on the tagged list.",
        },
      },
    },
  },
  updateMemberTagBatchModal: {
    title: {
      tag: "Tag all?",
      untag: "Untag all?",
    },
    description: {
      tag: "Add the {{tagName}} tag from {{number}} members?",
      untag: "Remove the {{tagName}} tag from {{number}} members?",
    },
    actions: {
      tag: "Tag all",
      untag: "Untag all",
      cancel: "Cancel",
      undo: "Undo",
    },
    loading: {
      tag: "Tagging {{number}} members...",
      untag: "Untagging {{number}} members...",
    },
    results: {
      tag: {
        success: {
          title: "All members were tagged",
        },
        failure: {
          title: "Failed to tag members",
        },
      },
      untag: {
        success: {
          title: "All members were untagged",
        },
        failure: {
          title: "Failed to untag members",
        },
      },
    },
  },
};
