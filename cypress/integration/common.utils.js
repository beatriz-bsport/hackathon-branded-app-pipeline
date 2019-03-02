export const BASE_URI = Cypress.env('BASE_URI');
export const REACT_APP_URI = `${BASE_URI}/api-v0/`;
export const REACT_APP_TEST_URI = `${BASE_URI}/state/reset`;

export function generateNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function selectCountryPhoneCode(selector, countryName, countryCode) {
  cy.get(selector)
    .select(countryCode)
    .invoke('val')
    .should('equal', countryCode);
}
