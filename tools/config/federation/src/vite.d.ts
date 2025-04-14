/*
 * This file declares all variables defined by apps.
 * Import it in your `vite-env.d.ts` with a reference:
 *
 * /// <reference types="@bsport/config-federation/vite" />
 */

/**
 * The namespace prefix for i18n
 * matches the package name without the package scope
 */
declare const __I18N_NAMESPACE_PREFIX__: string;

/**
 * The base URL for the application, when in development
 * it uses a full URL with the port
 * when in production it uses a relative URL
 * it is the one used to locate locales files
 */
declare const __APPLICATION_BASE_URL__: string;

/**
 * The basename to use with react router provider
 * <BrowserRouter basename={__BASENAME__}>
 *   {children}
 * </BrowserRouter>
 */
declare const __BASENAME__: string;
