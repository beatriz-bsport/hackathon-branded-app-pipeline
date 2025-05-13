exports.default = {
  pages: {
    memberList: "Members",
    archivedMemberList: "Archived members",
  },
  actions: {
    addMember: "Add member",
  },
  memberTable: {
    loading: "Loading members ...",
    emptySearch: {
      subtitle:
        "No members match your filters. Try clearing them to see more results.",
    },
    emptyList: {
      activeMode: {
        title: "No members yet",
        subtitle: "Start adding members in your studio",
      },
      archivedMode: {
        title: "No archived members",
      },
    },
    headers: {
      name: "Name",
      email: "Email",
      balance: "Balance",
      joinDate: "Join Date",
    },
    tooltips: {
      archive: "Archive member",
      restore: "Unarchive member",
    },
  },
  listPage: {
    archiveModal: {
      title: "Archive member",
      description: {
        action:
          "Are you sure that you want to archive <strong>{{ name }}</strong> ?",
        effect:
          "They will no longer be active but can be restored any time from your archive.",
      },
      alertIrregularity: {
        adviseRegularization:
          "Based on the following criteria, we advise that you regularize your member's internal account balance before the member is archived:",
        items: {
          negativeBalance: "Negative internal account balance",
          unpaidInvoices: "Unpaid invoice(s)",
          currentSubscription: "Current subscription",
          autorenewalSubscriptions: "Subscriptions with automatic renewals",
          futureBookings: "Future bookings",
          recurringBookings: "Recurring bookings",
          scheduledAppointments: "Scheduled appointments",
        },
      },
      buttons: {
        cancel: "Cancel",
        archive: "Archive",
      },
    },
  },
  toasts: {
    actions: {
      undo: "Undo",
    },
    messageUndone: {
      success: "Action undone",
      error: "Failed to undone the action",
    },
    messageArchived: {
      success: "Member has been archived",
      error: "Failed to archive member",
    },
    messageRestored: {
      success: "Member has been restored",
      error: "Failed to restore member",
    },
  },
  filters: {
    label: "Filter",
    operators: {
      is: "is",
      isNot: "is not",
    },
  },
};
