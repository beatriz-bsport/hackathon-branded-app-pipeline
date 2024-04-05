import Config from '../../../config';

/**
 * List of company IDs where a specific register booking title should be displayed
 * in login and signup pages.
 *
 * In production environment, the specified register booking title will be displayed
 * for the listed company IDs; otherwise, it will be an empty array.
 * NB : This is implemented as a "hot-feature" and further development must be done
 * to avoid keeping this ugly implementation
 */
export const COMPANY_IDS_TO_DISPLAY_REGISTER_BOOKING_TITLE =
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
    ? [
        // BODY STREET
        2306,
        // LINESPORT CLUB
        498,
      ]
    : [];
