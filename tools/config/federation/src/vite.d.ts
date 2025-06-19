/*
 * This file declares all variables defined by apps.
 * Import it in your `vite-env.d.ts` with a reference:
 *
 * /// <reference types="@bsport/config-federation/vite" />
 *
 * declare const __NAVIGATION_SIDEBAR__: FederationVariables;
 *
 * Notice that we use the package folder name as the variable name
 * with all caps, words delimited by underscores and prefixed and suffixed by double underscores
 */

declare type FederationVariables = {
  /**
   * The namespace prefix for i18n
   * matches the package name without the package scope
   */
  __I18N_NAMESPACE_PREFIX__: string;

  /**
   * The Sentry scope tag for error tracking
   * matches the package name without the package scope
   */
  __SENTRY_SCOPE_TAG__: string;

  /**
   * The base URL for the application, when in development
   * it uses a full URL with the port
   * when in production it uses a relative URL
   * it is the one used to locate locales files
   */
  __APPLICATION_BASE_URL__: string;

  /**
   * The basename to use with react router provider
   * <BrowserRouter basename={__BASENAME__}>
   *   {children}
   * </BrowserRouter>
   */
  __BASENAME__: string;
};
