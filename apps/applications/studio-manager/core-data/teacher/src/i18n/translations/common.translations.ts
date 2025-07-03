exports.default = {
  pages: {
    active: "Teachers",
    archived: "Archived teachers",
  },
  activeList: {
    actions: {
      addTeacher: "Add teacher",
    },
    addTeacherModal: {
      title: "Add teacher",
      input: {
        label: "Teacher email",
        placeholder: "Add teacher's email...",
        helper:
          "If an email is already in our system, the teacher's account will be linked automatically.",
        missingEmailError: "This is required",
      },
      actions: {
        cancel: "Cancel",
        create: "Create",
        open: "Open",
      },
      linkedTeacher: "Teacher successfully linked",
      errors: {
        staffExists:
          "The email indicated is already linked to a staff account.",
        staffFranchiseExists:
          "The email indicated is already linked to a staff franchise account.",
      },
    },
    archiveModal: {
      buttons: {
        archive: "Archive",
        cancel: "Cancel",
      },
      title: "Archive teacher",
      description: {
        action: "Are you sure that you want to archive <b>{{ name }}<b> ?",
        effect:
          "They will no longer be active but can be restored any time from your archive.",
      },
    },
  },
  toasts: {
    messageArchived: {
      success: "Teacher archived",
      error: "Failed to archive your teacher",
    },
    messageRestored: {
      success: "Teacher restored",
      error: "Failed to restore your teacher",
    },
    messageUndone: {
      success: "Action undone",
      error: "Failed to undo action",
    },
    actions: {
      undo: "Undo",
    },
  },
  table: {
    headers: {
      name: "Name",
      email: "Email",
      phone: "Phone",
    },
    loading: {
      activeList: "Loading teachers ...",
      archivedList: "Loading archived teachers ...",
    },
    empty: {
      activeList: {
        title: "No teachers yet",
        subtitle: "Start adding teachers to your studio",
      },
      archivedList: {
        title: "No archived teachers yet",
        subtitle: "Any teachers moved here can be restored",
      },
    },
    tooltips: {
      archive: "Archive teacher",
      restore: "Restore teacher",
      clickToCopy: "Click to copy",
    },
    actions: {
      copyEmail: "Email copied to your clipboard",
      copyPhone: "Mobile number copied to your clipboard",
    },
  },
};
