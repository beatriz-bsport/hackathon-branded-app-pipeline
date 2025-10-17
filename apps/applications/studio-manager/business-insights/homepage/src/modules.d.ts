declare module "sm-navigation-sidebar/NavigationSidebar" {
  import { VFC } from "react";

  const NavigationSidebar: VFC;
  export default NavigationSidebar;
}

declare module "sm-navigation-sidebar/urls" {
  export const REVAMP_URLS_DEVELOPMENT: {
    insights: string;
  };
  export const REVAMP_URLS_PRODUCTION: Partial<typeof REVAMP_URLS_DEVELOPMENT>;
  export default REVAMP_URLS_DEVELOPMENT;
}
