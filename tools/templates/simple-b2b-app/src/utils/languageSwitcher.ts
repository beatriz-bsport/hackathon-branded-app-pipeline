import { getLanguageSwitcher } from "@bsport/i18n";
import { i18nInstance } from "./i18n";

// TODO : replace with the name of your application, to use named export/import
// when federating the application in the final Host
export const templateLanguageSwitcher = getLanguageSwitcher(i18nInstance);
