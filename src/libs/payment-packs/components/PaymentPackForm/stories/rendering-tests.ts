// @ts-nocheck
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { querySelectedElementShouldBeInTheDocument } from '../../../../../utils/storybookHelper';

// The purpose of these tests is to check that all the elements of the form are rendered correctly

export const emptyFormRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // All the sections of the form should be rendered
  const canvas = within(canvasElement);
  const paymentPackForm = await canvas.findByTestId(
    'paymentpack-form',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );

  // 🧪 General section - Shoud be rendered in the document
  querySelectedElementShouldBeInTheDocument(
    paymentPackForm,
    '#paymentpack-form-general-section',
  );

  // 🧪 Validity section - Shoud be rendered in the document
  querySelectedElementShouldBeInTheDocument(
    paymentPackForm,
    '#paymentpack-form-validity-section',
  );

  // 🧪 Restriction section - Shoud be rendered in the document
  querySelectedElementShouldBeInTheDocument(
    paymentPackForm,
    '#paymentpack-form-restrictions-section',
  );

  // 🧪 Advanced section - Shoud be rendered in the document
  querySelectedElementShouldBeInTheDocument(
    paymentPackForm,
    '#paymentpack-form-advanced-options-section',
  );

  // 🧪 Action buttons section - Shoud be rendered in the document
  querySelectedElementShouldBeInTheDocument(
    paymentPackForm,
    '#paymentpack-form-actions',
  );

  // 🧪 Action buttons section - There should be two buttons -> Cancel and Submit
  const actionButtonsContainer = paymentPackForm.querySelector(
    '#paymentpack-form-actions',
  );

  const actionsButtons = actionButtonsContainer.querySelectorAll('button');
  expect(actionsButtons.length).toEqual(2);
};

export const generalSectionRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // All the fields should be rendered. The hidden fields should be hidden
  const canvas = within(canvasElement);
  const paymentPackForm = await canvas.findByTestId(
    'paymentpack-form',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const generalSection = paymentPackForm.querySelector(
    '#paymentpack-form-general-section',
  );

  // 🧪 Shoud render title and icon
  const titleContainer = generalSection.querySelector('div');

  expect(titleContainer.querySelector('svg')).not.toBeNull();
  expect(titleContainer.querySelector('h6')).not.toBeNull();

  // 🧪 Name field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-title-input',
  );

  // 🧪 Category selector shoud be rendered
  querySelectedElementShouldBeInTheDocument(generalSection, '#value-container');

  // 🧪 Price field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-price-input',
  );

  // 🧪 VAT field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-vat-input',
  );

  // 🧪 Is Universal container shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#is-universal-pass-grid',
  );

  // 🧪 Is Universal Switch Field shoud be rendered
  const isUniversalContainer = generalSection.querySelector(
    '#is-universal-pass-grid',
  );
  querySelectedElementShouldBeInTheDocument(isUniversalContainer, 'input');

  // 🧪 Credits field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-credit-input',
  );

  // 🧪 Should render radios
  const generalRadioGroup = await within(
    generalSection as HTMLElement,
  ).findByRole('radiogroup');
  expect(generalRadioGroup).toBeInTheDocument();

  const generalRadioButtons = within(generalRadioGroup).getAllByRole('radio');
  expect(generalRadioButtons.length).toEqual(2);

  // 🧪 Penalty checkbox should be disabled
  const penaltyCheckBox = generalSection
    .querySelector('#checkbox')
    .querySelector('span');

  expect(penaltyCheckBox).toBeInTheDocument();
  expect(penaltyCheckBox.getAttribute('aria-disabled')).toBeTruthy();

  // 🧪 Marginal contribution field should be hidden
  const marginalContributionField = generalSection.querySelector(
    '#paymentpack-form-margin-input',
  );
  expect(marginalContributionField).toBeNull();

  // 🧪 Penalty section should be hidden
  const penaltySection = generalSection.querySelector('.MuiCollapse-root');

  expect(penaltySection).toBeInTheDocument();
  expect(penaltySection).not.toBeVisible();
};

export const validitySectionRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // All the fields should be rendered. The hidden fields should be hidden
  const canvas = within(canvasElement);
  const paymentPackForm = await canvas.findByTestId(
    'paymentpack-form',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const validitySection = paymentPackForm.querySelector(
    '#paymentpack-form-validity-section',
  );
  const validityRadioGroups = await within(
    validitySection as HTMLElement,
  ).findAllByRole('radiogroup');

  // 🧪 Validity options radio group should be rendered
  const validityOptionsRadioGroup = validityRadioGroups[0];
  expect(validityOptionsRadioGroup).toBeInTheDocument();

  // 🧪 Validity options radio group should have 2 radio buttons
  const validityRadioButtons = within(validityOptionsRadioGroup).getAllByRole(
    'radio',
  );
  expect(validityRadioButtons.length).toEqual(2);

  // 🧪 Validity days field should be rendered
  querySelectedElementShouldBeInTheDocument(
    validitySection,
    '#paymentpack-form-day-validity-input',
  );

  // 🧪 Validity months field should be rendered
  querySelectedElementShouldBeInTheDocument(
    validitySection,
    '#paymentpack-form-month-validity-input',
  );

  // 🧪 Validity years field should be rendered
  querySelectedElementShouldBeInTheDocument(
    validitySection,
    '#paymentpack-form-year-validity-input',
  );

  // 🧪 Should render start date radio group
  const startDateRadioGroup = validityRadioGroups[1];
  expect(startDateRadioGroup).toBeInTheDocument();

  // 🧪 Radio group - should have 3 radio buttons
  const startDateRadioButtons =
    within(startDateRadioGroup).getAllByRole('radio');
  expect(startDateRadioButtons.length).toEqual(3);

  // 🧪 Radio group - the first radio button should be related to billing
  const billingRadioButton = startDateRadioButtons[0];
  expect(billingRadioButton).toHaveAttribute('value', 'billing');

  // 🧪 Radio group - the second radio button should be related to booking
  const bookingRadioButton = startDateRadioButtons[1];
  expect(bookingRadioButton).toHaveAttribute('value', 'booking');

  // 🧪 Radio group - the third radio button should be related to attendance
  const attendanceRadioButton = startDateRadioButtons[2];
  expect(attendanceRadioButton).toHaveAttribute('value', 'attendance');

  // 🧪 Expiration field should be hidden
  const expirationDateField = validitySection.querySelector(
    '#paymentpack-form-month-expiration-input',
  );
  expect(expirationDateField).toBeNull();
};

export const restrictionsSectionRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // All the fields should be rendered. The hidden fields should be hidden
  const canvas = within(canvasElement);
  const paymentPackForm = await canvas.findByTestId(
    'paymentpack-form',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const restrictionSection = paymentPackForm.querySelector(
    '#paymentpack-form-restrictions-section',
  );

  // 🧪 Max bookings per day field should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#max-bookings-per-day',
  );

  // 🧪 Max bookings per week field should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#max-bookings-per-week',
  );

  // 🧪 Max bookings per month field should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#max-bookings-per-month',
  );

  // 🧪 Max purchase per member field should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#max-purchase-per-member',
  );

  // 🧪 Switch fields should be rendered
  const restrictionsSwitchfieldsGrid = restrictionSection.querySelector(
    '#restrictions-switchfields-grid',
  );
  expect(restrictionsSwitchfieldsGrid).toBeInTheDocument();
  const restrictionsSwitchfields =
    restrictionsSwitchfieldsGrid.querySelectorAll('input');

  // 🧪 If allowGuestMaster is false, there are 4 switchfields
  expect(restrictionsSwitchfields.length).toEqual(4);

  // 🧪 First switch should have name new_member_only
  const newMemberSwitchField = restrictionsSwitchfields[0];
  expect(newMemberSwitchField).toHaveAttribute('name', 'new_member_only');

  // 🧪 Second switch should have name manager_only
  const managerOnlySwitchField = restrictionsSwitchfields[1];
  expect(managerOnlySwitchField).toHaveAttribute('name', 'manager_only');

  // 🧪 Third switch should have name onsite_payment_available
  const onsitePaymentSwitchField = restrictionsSwitchfields[2];
  expect(onsitePaymentSwitchField).toHaveAttribute(
    'name',
    'onsite_payment_available',
  );

  // 🧪 Fourth switch should have name unusable_by_staff
  const unusableByStaffSwitchField = restrictionsSwitchfields[3];
  expect(unusableByStaffSwitchField).toHaveAttribute(
    'name',
    'unusable_by_staff',
  );

  // 🧪 Categories selector should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#categories-selector',
  );

  // 🧪 Establishments selector should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#establishments-selector',
  );

  // 🧪 Activities selector should be rendered
  querySelectedElementShouldBeInTheDocument(
    restrictionSection,
    '#activities-selector',
  );

  // 🧪 Video On Demand section should be hidden
  const collapsedSections =
    restrictionSection.querySelectorAll('.MuiCollapse-root');
  const vodEnableSection = collapsedSections[0];

  expect(vodEnableSection).toBeInTheDocument();
  expect(vodEnableSection).toHaveStyle('height: 0px');

  const vodRestrictionSection = collapsedSections[1];

  expect(vodRestrictionSection).toBeInTheDocument();
  expect(vodRestrictionSection).toHaveStyle('height: 0px');
};

export const advancedOptionsSectionRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // All the fields should be rendered. The hidden fields should be hidden
  const canvas = within(canvasElement);
  const paymentPackForm = await canvas.findByTestId(
    'paymentpack-form',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const advancedOptionsSection = paymentPackForm.querySelector(
    '#paymentpack-form-advanced-options-section',
  );

  // 🧪 The section should be hidden
  const advancedOptionsCollapsedSection =
    advancedOptionsSection.querySelector('.MuiCollapse-root');

  expect(advancedOptionsCollapsedSection).toBeInTheDocument();
  expect(advancedOptionsCollapsedSection).toHaveStyle('height: 0px');
};
