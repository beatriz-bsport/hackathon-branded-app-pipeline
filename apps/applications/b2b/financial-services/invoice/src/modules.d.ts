declare module "navigation-sidebar/App" {
  import { VFC } from "react";

  const NavigationSidebar: VFC<>;
  export default NavigationSidebar;
}

declare module "navigation-sidebar/languageSwitcher" {
  import { Locale } from "#src/utils/i18n";
  export const navigationLanguageSwitcher: (languageId: Locale) => void;
}
