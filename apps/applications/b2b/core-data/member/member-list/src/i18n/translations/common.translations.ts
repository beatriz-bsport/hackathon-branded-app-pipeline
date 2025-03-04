exports.default = {
  pages: {
    memberList: "Members",
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
};
