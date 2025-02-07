exports.default = {
  list: {
    enabled: {
      item: {
        notifications: {
          title: "Notifications",
          popoverLabel: "Has notifications set up",
        },
        livestream: {
          title: "Livestream",
          popoverLabel: "Live streaming available",
        },
      },
      duplicate: {
        title: "Duplicate activity",
        modalContent:
          "Duplicate <strong>{{groupActivityName}}</strong>?<br/> You can edit the gift card details afterwards.",
        cancel: "Cancel",
        confirm: "Duplicate",
      },
      archive: {
        title: "Archive activity",
        modalContent:
          "Do you want to archive <strong>{{groupActivityName}}</strong> activity? The sessions and past bookings won't be modified.<br/> You can unarchive the activity at any time.",
        cantArchive:
          "There are upcoming sessions planned for this activity. Check if they have been cancelled.",
        cancel: "Cancel",
        confirm: "Archive",
      },
      emptyState: {
        title: "No group activities yet",
        body: "Create group activities and let your members attend sessions",
      },
    },
    archived: {
      unarchive: "Unarchive activity",
      emptyState: { title: "No archived group activities yet" },
    },
    header: {
      groupActivities: "Group activities",
      archivedGroupActivities: "Archived group activities",
      add: "Add group activity",
      filter: "Filter",
      display: {
        title: "Display",
        ordering: "Ordering",
        alphabetical: "Alphabetical",
        reset: "Reset",
        save: "Save",
      },
      archivedActivities: "Archived activities",
    },
    toasts: {
      duplication: "{{groupActivityName}} has been duplicated",
      archive: "{{groupActivityName}} has been archived",
      unarchive: "{{groupActivityName}} has been unarchived",
      open: "Open",
      undo: "Undo",
    },
  },
};
