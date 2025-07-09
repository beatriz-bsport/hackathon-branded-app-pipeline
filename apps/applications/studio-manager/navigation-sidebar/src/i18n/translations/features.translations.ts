exports.default = {
  searchMembers: {
    title: "Search members",
    addMember: "Add member",
    loading: "Loading results...",
    emptySearch: "Type above to start your search or add a new member",
    tagsTooltip: "Tags:",
    segments: {
      active: "Active",
      archived: "Archived",
    },
    copyToClipboard: {
      action: "Click to copy",
      toasts: {
        phoneNumberCopied: "Member mobile number was copied to your clipboard",
        emailCopied: "Member email was copied to your clipboard",
      },
    },
  },
  temporaryPassword: {
    title: "Temporary password",
    description:
      "You may generate and request a temporary password which will be valid for up to 1 week to share it with our Support Team for assistance. Your main and usual password won't be affected.",
    buttons: {
      close: "Close",
      generate: "Generate",
    },
    generatedPassword: {
      copyToClipboard: "Copy the password to the clipboard",
      copiedToClipboard: "Password copied",
      validity:
        "This password is valid until {{- expirationDate }}. Your main password has not changed.",
    },
  },
  attendance: {
    title: "Time clock",
    clockInForStaff: "Clock-in for another staff member",
    buttons: {
      close: "Close",
      clockIn: "Clock-in",
      clockOut: "Clock-out",
    },
    initial: {
      welcome: "Hello {{ name }}!",
      clockInCTA: "Please click 'Clock-in' to get started;",
    },
    clockedIn: {
      successfulClockIn: "You've successfully clocked-in.",
      failedClockIn: "You are already clocked-in.",
      clockOutCTA: "You can click 'Clock-out' to wrap-up.",
    },
    clockedOut: {
      successfulClockOut: "Your schedules have been saved:",
      failedClockOut: "Failed to clock-out",
      nextIterationCTA:
        "You can start a new punch the next time you open this window.",
    },
    schedule: {
      arrivalTime: "Arrival Time",
      departureTime: "Departure Time",
      hoursWorked: "Hours Worked",
    },
  },
};
