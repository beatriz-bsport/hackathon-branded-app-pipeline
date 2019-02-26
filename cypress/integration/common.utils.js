export const REACT_APP_URI = Cypress.env('REACT_APP_API_URI');
export const REACT_APP_TEST_URI = `${Cypress.env(
  'REACT_APP_BASE_URI',
)}/state/reset`;

export function generateNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function selectCountryPhoneCode(selector, countryName, countryCode) {
  cy.get(selector)
    .select(countryCode)
    .invoke('val')
    .should('equal', countryCode);
}
