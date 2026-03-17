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
    activity: string;
    calendar: string;
    insights: string;
    customForm: string;
    emailTemplate: string;
    giftcard: string;
    homepage: string;
    invoice: string;
    member: string;
    order: string;
    pack: string;
    payout: string;
    smartlist: string;
    teacher: string;
    settings_referral: string;
    settings_transactionalNotification: string;
    tag: string;
    marketingNotification: string;
  };
  export const REVAMP_URLS_PRODUCTION: Partial<typeof REVAMP_URLS_DEVELOPMENT>;
  export default REVAMP_URLS_DEVELOPMENT;
}
