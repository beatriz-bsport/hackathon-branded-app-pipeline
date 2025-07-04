exports.default = {
  common: {
    back: "Back",
  },
  menus: {
    popover: {
      settings: "Settings",
      attendance: "Attendance",
      ledger: "Ledger",
      tutorials: "Tutorials",
      help: "Help center",
      feedback: "Feedback board",
      logout: "Logout",
    },
    inbox: "Inbox",
    notifications: "Notifications",
    calendar: "Calendar",
    schedule: "Schedule",
    accessControl: "Access Control",
    classes: {
      title: "Classes",
      activities: "Activities",
      workshops: "Workshops",
      appointments: "Appointments",
    },
    memberships: {
      title: "Memberships",
      passes: "Passes",
      subscriptions: "Subscriptions",
    },
    products: {
      title: "Products",
      webshop: "Webshop",
      packs: "Packs",
      giftcards: "Gift cards",
      videosAndEbooks: "Videos & ebooks",
      orders: "Orders",
    },
    marketing: {
      title: "Marketing",
      memberNotifications: "Member notifications",
      emailTemplates: "Email templates",
      smartlists: "Smartlists",
      audience: "Audience",
      promotions: "Promotions",
      customForms: "Custom forms",
    },
    dashboard: "Dashboard",
    reporting: "Reporting",
    finance: {
      title: "Finance",
      invoices: "Invoices",
      payouts: "Payouts",
      directDebits: "Direct debits",
      expenses: "Expenses",
      payroll: "Payroll",
    },
    membersHub: {
      title: "Members Hub",
      members: "Members",
      forms: "Forms",
      tags: "Tags",
    },
    myStudio: {
      title: "My studio",
      teachers: "Teachers",
      establishments: "Establishments",
    },
    settings: {
      title: "Settings",
      general: "General",
      marketplace: "Marketplace",
      widgets: "Widgets",
      permissions: "Permissions",
      personalization: "Personalization",
      teacherView: "Teacher view",
      memberForms: "Member forms",
      livestreaming: "Livestreaming",
      transactionalNotifications: "Transactional notifications",
      payroll: "Payroll",
      paymentMethods: "Payment methods",
      paymentFacilities: "Payment facilities",
      billing: "Billing",
      company: "Company",
      waitlist: "Waitlist",
      webhook: "Webhook",
      partnership: "Partnership",
      activeCampaign: "ActiveCampaign",
      referral: "Referral",
      bsportSubscription: "bsport subscription",
      temporaryPassword: "Temporary password",
      changeLanguage: "Change language",
    },
  },
  revampCard: {
    betaFeedbackLink: "Beta feedback",
    goBackToOldUi: "Go back to old UI",
  },
  languages: {
    french: "French",
    englishUK: "English (UK)",
    englishUS: "English (US)",
    spanish: "Spanish",
    dutch: "Dutch",
    german: "German",
    italian: "Italian",
    portuguese: "Portuguese",
    czech: "Czech",
  },
  notifications: {
    title: "Notification center",
    tabs: {
      billing: "Billing",
      orders: "Orders",
      tasks: "Tasks",
      unpaidAppointments: "Unpaid appointments",
      tutorials: "Tutorials",
      companyOnboarding: "Legal information",
      privateBookingIncomplete: "Appointments to complete",
    },
    billing: {
      loading: "Loading billing notifications...",
      empty: {
        title: "No billing notifications",
        description: "All your billing notifications will appear here",
      },
      paid: "Paid:",
      due: "Due:",
      itemTitle: "Unpaid invoice",
      itemDescription: "Invoice has not been finalized yet",
    },
    orders: {
      loading: "Loading orders...",
      empty: {
        title: "No orders",
        description: "All your orders will appear here",
      },
      itemTitle: "Pending order",
      paidByFormat: "Paid by <strong>{{name}}</strong> on the store",
    },
    tasks: {
      loading: "Loading tasks...",
      empty: {
        title: "No tasks",
        description: "All your tasks will appear here",
      },
    },
    unpaidAppointments: {
      title: "Unpaid appointments",
      itemTitle: "Unpaid appointment",
      loading: "Loading unpaid appointments...",
      credits: "Unpaid credits",
      empty: {
        title: "No unpaid appointments",
        description: "You don't have any unpaid appointments",
      },
    },
    tutorials: {
      loading: "Loading tutorials...",
      empty: {
        title: "No tutorials",
        description: "All your tutorial notifications will appear here",
      },
      newSection: {
        title: "New section",
        description:
          "The {{sectionName}} tutorial has been added, get trained right now.",
      },
      newLesson: {
        title: "New lesson",
        description: "Lesson {{lessonName}} added to {{sectionName}} section",
      },
    },
    companyOnboarding: {
      loading: "Loading company onboarding notifications...",
      empty: {
        title: "No company onboarding notifications",
        description:
          "All your company onboarding notifications will appear here",
      },
      creation: {
        title: "Online payments are currently disabled",
        content:
          "Please check your legal and banking information to be able to process online payments.",
      },
      payout: {
        title: "Incomplete banking details",
        content:
          "Payouts cannot be processed due to the fact that the account verification has not been completed or has been done so incorrectly.",
      },
      verification: {
        title: "Business management",
        content:
          "Several documents are pending validation to verify your account. The deadline is: {{date}}.",
        contentGeneric:
          "Several documents are pending validation to verify your account.",
      },
      paypal: {
        title: "PayPal payments are disabled",
        primaryEmailConfirmation:
          "The email for your PayPal account requires confirmation. Please check your PayPal account to resolve this issue.",
        requiresMoreInformation:
          "Your PayPal account requires additional information or validation from PayPal. Please check your PayPal account to resolve this issue.",
        issueCheckAccount:
          "There is an issue with your PayPal account. Please check your PayPal account to resolve this issue.",
        issueRepeatOnboarding:
          "There is an issue with your PayPal account. Please repeat the connection process using the same account to resolve this issue.",
      },
      generic: {
        title: "Company onboarding required",
        content: "Please complete your company onboarding process.",
      },
    },
    privateBookingIncomplete: {
      loading: "Loading appointments to complete...",
      empty: {
        title: "No appointments to complete",
        description: "All your appointments have assigned coaches",
      },
      member: "Member: {{userName}}",
      date: "Date: {{date}}",
    },
  },
};
