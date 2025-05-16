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
  const urls: {
    activity: string;
    emailTemplate: string;
    giftcard: string;
    invoice: string;
    member: string;
    smartlist: string;
    teacher: string;
  };
  export default urls;
}

// ----- Booking -----
declare module "sm-group-activity/App" {
  const App: BaseApp["App"];
  export default App;
}

// ----- Buyables -----
declare module "sm-giftcard/App" {
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

// ----- Financial Services -----
declare module "sm-invoice/App" {
  const App: BaseApp["App"];
  export default App;
}

// ----- Customer Data Platform -----
declare module "sm-email-template/App" {
  const App: BaseApp["App"];
  export default App;
}
declare module "sm-smartlists/App" {
  const App: BaseApp["App"];
  export default App;
}
