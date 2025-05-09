exports.default = {
  pages: {
    active: "Teachers",
    archived: "Archived teachers",
  },
  activeList: {
    actions: {
      addTeacher: "Add teacher",
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
      success: "Your teacher was archived",
      error: "Failed to archive your teacher",
    },
    messageRestored: {
      success: "Your teacher was restored",
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
      restore: "Unarchive teacher",
      clickToCopy: "Click to copy",
    },
    actions: {
      copyEmail: "Your email was copied to your clipboard",
      copyPhone: "Your mobile number was been copied to your clipboard",
    },
  },
};
