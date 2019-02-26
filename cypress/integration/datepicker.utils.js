export function pickUpDate() {
  cy.get('body')
    .find('[role = dialog]')
    .find('button > span')
    .contains('OK')
    .click();
}
