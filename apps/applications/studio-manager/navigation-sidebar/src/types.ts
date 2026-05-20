export type Urls = {
  // Group 1
  inbox: string;
  // Group 2
  homepage: string;
  calendar: string;
  schedule: string;
  accessMonitoring: string; // Root path for the Access Monitoring Application
  accessMonitoring_monitor: string;
  accessMonitoring_perform: string;
  accessMonitoring_settings: string;
  // Group 3
  // --- Services ---
  activity: string;
  appointment: string;
  services: string;
  workshop: string;
  // Group 4
  // --- Memberships ---
  pass: string;
  appointmentPass: string;
  subscription: string;
  // --- Products ---
  webshop: string; // Root path for the Webshop Application
  webshop_products: string;
  webshop_settings: string;
  webshopOld: string;
  pack: string;
  giftcard: string;
  onDemand: string; // Root path for the VOD Application
  video: string;
  playlist: string; // Tab on video app
  order: string;
  // Group 5
  // --- Marketing ---
  marketingNotification: string;
  smartfill: string;
  emailTemplate: string;
  segment: string;
  smartlist: string;
  audience: string;
  promotion: string;
  // Group 6
  dashboard: string;
  reporting: string;
  insights: string;
  // Group 7
  // --- Finance ---
  invoice: string;
  payout: string;
  directDebit: string;
  expense: string;
  payroll: string;
  // Group 8
  // --- Members Hub ---
  member: string;
  performanceTracking: string;
  customForm: string;
  tag: string;
  // --- My Studio ---
  teacher: string;
  substitution: string;
  establishment: string;
  // Menu
  search: string;
  attendance: string;
  tutorial: string;
  feedback: string;
  // Settings
  settings_general: string;
  settings_marketplace: string;
  settings_widgets: string;
  settings_permissions: string; // Root path for the Staff Management Application
  settings_permission: string;
  settings_personalization: string;
  settings_staff: string;
  settings_teacherView: string;
  settings_memberForm: string; // Dupplicate ?
  settings_livestreaming: string;
  settings_transactionalNotification: string;
  settings_payroll: string;
  settings_paymentMethod: string;
  settings_paymentFacility: string;
  settings_billing: string;
  settings_company: string;
  settings_companyOnboarding: string;
  settings_waitlist: string;
  settings_webhook: string;
  settings_partnership: string;
  settings_activeCampaign: string;
  settings_referral: string;
  settings_bsportSubscription: string;
  settings_quickbook: string;
  settings_quicksale: string;
  settings_webshop: string;
  settings_mobilePersonalization: string;
  settings_aggregators: string;
};

export type LegacyUrls = Omit<
  Urls,
  "homepage" | "onDemand" | "settings_permissions"
>;
