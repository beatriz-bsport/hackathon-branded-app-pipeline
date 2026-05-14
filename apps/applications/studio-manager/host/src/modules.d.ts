interface BaseApp {
  App: React.VFC;
  NavigationSidebar: React.VFC;
}

// ----- Common -----
declare module "sm-navigation-sidebar/NavigationSidebar" {
  const NavigationSidebar: BaseApp["NavigationSidebar"];
  export default NavigationSidebar;
}

declare module "sm-navigation-sidebar/urls" {
  export const REVAMP_URLS_DEVELOPMENT: {
    calendar: string;
    services: string;
    insights: string;
    customForm: string;
    emailTemplate: string;
    giftcard: string;
    homepage: string;
    invoice: string;
    member: string;
    onDemand: string;
    order: string;
    pack: string;
    payout: string;
    playlist: string;
    smartfill: string;
    smartlist: string;
    segment: string;
    teacher: string;
    settings_teacherView: string;
    video: string;
    settings_referral: string;
    settings_aggregators: string;
    settings_staff: string;
    settings_transactionalNotification: string;
    tag: string;
    marketingNotification: string;
  };
  export const REVAMP_URLS_PRODUCTION: Partial<typeof REVAMP_URLS_DEVELOPMENT>;
  export default REVAMP_URLS_DEVELOPMENT;
}
