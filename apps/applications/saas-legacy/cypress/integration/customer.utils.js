export function fillSignUpForm() {
  // Fill in form
  cy.get('[name=first_name]').type('John');
  cy.get('[name=last_name]').type('Doe');
  cy.get('[name=email]').type('john.doe@example.com');
  cy.get('[name=phonenumber]').type('0612345678');
  cy.get('[name=password]').type('mypassword');
  cy.get('[name=passwordConfirm]').type('mypassword');
  cy.get('[name=acceptPrivacyPolicy] [type=checkbox]').click();
  cy.get('#btn-signup-next').click();
}
