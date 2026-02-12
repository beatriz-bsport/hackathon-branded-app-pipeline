import {
  DEFAULT_ACTION_COLOR,
  DEFAULT_ALIGNMENT,
  DEFAULT_CUSTOM_LAUNCHER_SELECTOR,
  DEFAULT_LANGUAGE_OVERRIDE,
  INTERCOM_APP_ID,
  RELEASE_SHA,
} from "./constants";

type IntercomBootParams = {
  email?: string;
  companyId?: number;
  companyName?: string;
  name?: string;
  role?: string;
  environment?: string;
  appIdOverride?: string;
  localeOverride?: string;
  companyLocale?: string;
  customLauncherSelector?: string;
  actionColor?: string;
  /** Position of the launcher on screen: "left" or "right". Default is "right". */
  alignment?: "left" | "right";
};

declare global {
  interface Window {
    Intercom?: IntercomInstance;
  }
}

/*
 * Intercom Instance type definition
 * @see https://www.npmjs.com/package/@intercom/messenger-js-sdk/v/0.0.18?activeTab=code
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type IntercomInstance = Function;

const LOGGER_PREFIX = "[Intercom Widget Init]: ";

function getLogger(showInfoLogs: boolean) {
  return {
    info: (log: string) =>
      showInfoLogs ? console.log(LOGGER_PREFIX, log) : null,
    error: (log: string) => console.error(LOGGER_PREFIX, log),
  };
}

/**
 * Utils that allow to check if all the required parameters from Intercom Widget are properly setup.
 * @returns A boolean that indicates if all the parameters are valid.
 */
export const checkIntercomWidgetConfigIsValid = ({
  email,
  companyId,
  companyName,
  environment,
  name,
  role,
}: Partial<IntercomBootParams>) => {
  const logger = getLogger(true);

  if (!email) {
    logger.error("Cannot initialize Intercom widget without an email");
    return false;
  }

  if (!companyId) {
    logger.error("Cannot initialize Intercom widget without a company Id");
    return false;
  }

  if (!companyName) {
    logger.error("Cannot initialize Intercom widget without a company name");
    return false;
  }

  if (!role) {
    logger.error("Cannot initialize Intercom widget without a user role");
    return false;
  }

  if (!environment) {
    logger.error("Cannot initialize Intercom widget without a environment");
    return false;
  }

  if (!name) {
    logger.error("Cannot initialize Intercom widget without a name");
    return false;
  }
  return true;
};

/**
 * Function used to inject Intercom Widget script inside the document <head> tag on the web page using this utils package
 * @param showDebugLog: Boolean that toggle the info logger
 * @returns A Boolean indicating if the initialization was successfull or not.
 */
export const initIntercomScript = ({
  showDebugLog,
}: {
  showDebugLog: boolean;
}) => {
  const logger = getLogger(showDebugLog);

  if (!document) {
    logger.error("Cannot find a valid document reference");
    return false;
  }

  if (!window) {
    logger.error("Cannot find a valid window reference");
    return false;
  }

  if (window.Intercom) {
    logger.info("Intercom already initialized.");
  }

  if (!window.Intercom) {
    logger.info("Initializing Intercom on the document.");

    const script: HTMLScriptElement = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`;
    script.async = true;

    document.head.appendChild(script);
  }

  // Checking if the Intercom reference can now be used within the document
  if (!window.Intercom) {
    logger.error("Cannot find a valid Intercom reference");
    return false;
  }

  return true;
};

/**
 * Function that is used to initialize the Intercom Widget on bsport web deliverables.
 * You should provide this function several parameters that will help initilize the widget used by studio to communicate to our CSMs.
 * @param name: Name of the user connected to the backoffice, eg: "Bob Bobby"
 * @param email: Email of the user connected to the backoffice, also used as the userId on Intercom, eg: "owner@yogastudio.com"
 * @param companyId: Id of the company related to the user connected to the backoffice, eg: 23
 * @param companyName: Name of the company related to the user connected to the backoffice, eg; "Yoga Studio"
 * @param role: Role name of the user connected to the backoffice , eg: "Owner"
 * @param environment: Current environment where the app is running, eg: "production", "dev"
 * @param localeOverride: Locale code of the language you want to be used by Intercom, eg: "en_EN"
 * @param companyLocale: Company locale set in the CompanyTheme data model code of the language you want to be used by Intercom, eg: "en_EN"
 * @param actionColor: Hexa decimal code of the color related to the user, eg: "#EN3412"
 * @param appIdOverride: Parameter to set if you want to override bsport base intercom app Id, usually you do not want to override it.
 * @param alignment: Position of the launcher on screen: "left" or "right". Default is "right".
 * @returns A boolean that indicates if every operation were succesfull or not.
 */
export const initIntercomWidget = ({
  name,
  email,
  companyId,
  companyName,
  role,
  environment,
  localeOverride,
  companyLocale,
  customLauncherSelector,
  actionColor,
  appIdOverride,
  alignment,
}: IntercomBootParams) => {
  const showDebugLog =
    environment !== "production" && environment !== "staging";
  const logger = getLogger(showDebugLog);
  logger.info("Intercom widget initialization started.");

  if (
    !checkIntercomWidgetConfigIsValid({
      email,
      companyName,
      role,
      environment,
      companyId,
      name,
    })
  ) {
    logger.error(
      "Issue detected is Intercom widget initialization parameters.",
    );
    return false;
  }

  if (!initIntercomScript({ showDebugLog })) {
    logger.error(
      "Issue detected during Intercom script initialization in document heads.",
    );
    return false;
  }

  logger.info("Providing client details to Intercom widget.");

  // dirty : as we mix environment on Intercom, between production and staging, we
  // want to avoid users and company collisions
  // company will have a negative id and users will have +staging@ in their email on Staging
  let formattedCompanyId = companyId;
  let formattedName = name ?? "";
  let formattedCompanyEmail = email ?? "";
  if (environment === "staging") {
    if (companyId) {
      formattedCompanyId = companyId * -1;
    }
    if (formattedName) {
      formattedName = `[STAGING] ${name}`;
    }
    if (email?.includes("@")) {
      formattedCompanyEmail = email.replace("@", "+staging@");
    }
  }

  // Here we want to first look if we are overriding by default the locale, if not then we want to take the locale of the browser
  // If its not available then we are taking the company locale provided in the companyTheme and if its still unavailable then
  // we default to english to not have any crash.
  const currentLocale =
    localeOverride ??
    navigator?.language ??
    companyLocale ??
    DEFAULT_LANGUAGE_OVERRIDE;

  window?.Intercom?.("boot", {
    app_id: appIdOverride ?? INTERCOM_APP_ID,
    user_id: email,
    company: { company_id: formattedCompanyId, company_name: companyName },
    email: formattedCompanyEmail,
    role: role,
    environment: environment,
    name: formattedName,
    language_override: currentLocale,
    custom_launcher_selector:
      customLauncherSelector ?? DEFAULT_CUSTOM_LAUNCHER_SELECTOR,
    action_color: actionColor ?? DEFAULT_ACTION_COLOR,
    alignment: alignment ?? DEFAULT_ALIGNMENT,
    release: RELEASE_SHA,
  });

  logger.info("Intercom widget has been successfully initialized.");
  return true;
};
