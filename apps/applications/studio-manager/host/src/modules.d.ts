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

// ----- Booking -----
declare module "sm-group-activity/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-session/App" {
  const App: BaseApp["App"];
  export default App;
}
// ----- Buyables -----
declare module "sm-giftcard/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-order/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-pack/App" {
  const App: BaseApp["App"];
  export default App;
}

// ----- Core-data -----
declare module "sm-member-list/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-teacher/App" {
  const App: BaseApp["App"];
  export default App;
}

// ----- Customer Data Platform -----
declare module "sm-email-template/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-tag/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-transactional-notification/App" {
  const App: BaseApp["App"];
  export default App;
}

// ----- Business Insights -----
declare module "sm-insights/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-homepage/App" {
  const App: BaseApp["App"];
  export default App;
}
