export interface CompanyRolePermissions {
  checkin: boolean;
  navigation: boolean;
  appbarButtons: AppbarButtons;
  navigationMenu: NavigationMenu;
  restrictedPaths?: string[];
  clockIn?: boolean;
  appbarActions?: boolean;
}

interface AppbarButtons {
  ledger: boolean;
  notificationCenter: boolean;
  communicationAlerts: boolean;
}

interface NavigationMenu {
  // Need Access Monitoring upsell
  accessMonitoring?: AccessMonitoring;
  calendar: boolean;
  dashboard: boolean;
  digitalOffer: DigitalOffer;
  inbox: boolean;
  marketing: Marketing;
  member: boolean;
  myClub: MyClub;
  payments: Payments;
  products: ProductsClass;
  reporting: boolean;
  schedule: boolean;
  search?: boolean;
  settings: Settings;
  tutorial: boolean;
}

interface AccessMonitoring {
  monitor?: boolean;
  perform: boolean;
  settings?: boolean;
}

interface DigitalOffer {
  videos: boolean;
  playlists: boolean;
}

interface Marketing {
  tags: boolean;
  cadence: boolean;
  templates: boolean;
  smartlists: boolean;
  customForms: boolean;
  notifications: boolean;
}

interface MyClub {
  programs: boolean;
  teachers: boolean;
  workshops: boolean;
  activities: boolean;
  replacement: boolean;
  appointments: boolean;
  establishments: boolean;
}

interface Payments {
  orders: boolean;
  clockIn: {
    selfClockIn: boolean;
    clockInForOther: boolean;
    canAccessHistory: boolean;
  };
  billings: boolean;
  expenses: boolean;
  teachers: boolean;
  directDebits: boolean;
  installments: boolean;
}

interface ProductsClass {
  shop: boolean;
  packs: boolean;
  contracts: boolean;
  giftcards: boolean;
  promotions: boolean;
  paymentPack: boolean;
  privatePass: boolean;
  shopReworked?: {
    products: boolean;
    settings: boolean;
  };
}

interface Settings {
  staffs: boolean;
  billing: boolean;
  company: boolean;
  webHook: boolean;
  webShop: boolean;
  widgets: boolean;
  generals: boolean;
  referral: boolean;
  quicksale: boolean;
  quickBooks: boolean;
  marketplace: boolean;
  memberForms: boolean;
  partnership: boolean;
  waitingList: boolean;
  subscription: boolean;
  liveStreaming: boolean;
  activeCampaign: boolean;
  coachUserspace: boolean;
  paymentMethods: boolean;
  personalization: boolean;
  teacherPayrollRules: boolean;
  transactionnalEmail: boolean;
  mobilePersonalization: boolean;
}
