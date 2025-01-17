import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import i18n from 'i18next';

import {
  querySelectedElementShouldBeInTheDocument,
  querySelectedElementShouldHaveAttribute,
  querySelectedElementShouldContainsSpecifiedText,
  findByTestIdInCanvas,
} from '../../../../../../utils/storybookHelper';

// Rendering tests
// The purpose of these tests is to check that all the elements of the form are rendered correctly

// 🧪 Every section of the form should be rendered
export const emptyFormRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  // 🧪 General section should appear in the document
  querySelectedElementShouldBeInTheDocument(
    component,
    '#private-pass-form-general-section',
  );

  // 🧪 Payment method section should appear in the document
  querySelectedElementShouldBeInTheDocument(
    component,
    '#private-pass-form-payment-section',
  );

  // 🧪 Validity section should appear in the document
  querySelectedElementShouldBeInTheDocument(
    component,
    '#private-pass-form-validity-section',
  );

  // 🧪 Compatibility section should appear in the document
  querySelectedElementShouldBeInTheDocument(
    component,
    '#private-pass-form-compatibility-section',
  );

  // 🧪 Action buttons section should appear in the document
  querySelectedElementShouldBeInTheDocument(
    component,
    '#private-pass-form-actions-buttons',
  );

  // 🧪 Action buttons section should contains two buttons
  const actionButtonsContainer = component.querySelector(
    '#private-pass-form-actions-buttons',
  );
  const actionsButtons = actionButtonsContainer.querySelectorAll('button');
  expect(actionsButtons.length).toEqual(2);
};

// 🧪 General section - All the fields should be rendered. The hidden fields should be hidden
export const generalSectionRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const generalSection = component.querySelector(
    '#private-pass-form-general-section',
  );

  // All the fields should be rendered. The hidden fields should be hidden

  // 🧪 Shoud render title and icon
  const titleContainer = generalSection.querySelectorAll('div')[0];
  expect(titleContainer.querySelector('svg')).not.toBeNull();
  expect(titleContainer.querySelector('h6')).not.toBeNull();

  // 🧪 Name field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#private-pass-name-field',
  );

  // 🧪 Category selector shoud be rendered
  querySelectedElementShouldBeInTheDocument(generalSection, '#value-container');

  // 🧪 Credits field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#private-pass-credit-field',
  );

  // 🧪 Price field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#private-pass-price-field',
  );

  // 🧪 Tax field shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#private-pass-tax-field',
  );

  // 🧪 Universal Switch container shoud be rendered
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#private-pass-universal-switch-field-container',
  );

  // 🧪 Universal Switch field shoud be rendered
  const universalSwitchContainer = generalSection.querySelector(
    '#private-pass-universal-switch-field-container',
  );
  querySelectedElementShouldBeInTheDocument(universalSwitchContainer, 'input');

  // 🧪 Universal Switch field shoud be named is_universal_pass
  querySelectedElementShouldHaveAttribute(
    universalSwitchContainer.querySelector('input'),
    'name',
    'is_universal_pass',
  );

  // 🧪 Switch fields container shoud be rendered
  const switchFieldsContainer = generalSection.querySelector(
    '#private-pass-switch-fields-container',
  );
  expect(switchFieldsContainer).toBeInTheDocument();

  // 🧪 Switch fields container shoud contains 4 inputs
  const switchFields = switchFieldsContainer.querySelectorAll('input');
  expect(switchFields.length).toEqual(4);

  // 🧪 First switch should have name manager_only
  querySelectedElementShouldHaveAttribute(
    switchFields[0],
    'name',
    'manager_only',
  );

  // 🧪 First switch should have name new_member_only
  querySelectedElementShouldHaveAttribute(
    switchFields[1],
    'name',
    'new_member_only',
  );

  // 🧪 First switch should have name full_vod_access
  querySelectedElementShouldHaveAttribute(
    switchFields[2],
    'name',
    'full_vod_access',
  );

  // 🧪 First switch should have name unusable_by_staff
  querySelectedElementShouldHaveAttribute(
    switchFields[3],
    'name',
    'unusable_by_staff',
  );
};

// 🧪 Payment section - All the fields should be rendered. The hidden fields should be hidden
export const paymentSectionRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );
  const paymentSection = component.querySelector(
    '#private-pass-form-payment-section',
  );

  // 🧪 Title and icon should be rendered
  const titleContainer = paymentSection.querySelectorAll('div')[0];
  expect(titleContainer.querySelector('svg')).not.toBeNull();
  expect(titleContainer.querySelector('h6')).not.toBeNull();

  // 🧪 Payment method info message should be rendered
  const paymentMethodInfoMessage = i18n.t(
    'privateService:privatePass.form.available_payment_method_identifiers.helperText',
  );
  expect(
    await within(component).findByText(paymentMethodInfoMessage),
  ).toBeInTheDocument();

  // 🧪 There should be two input (checkboxes) inside this section
  const paymentMethodCheckboxes = await within(
    paymentSection as HTMLElement,
  ).findAllByRole('checkbox');
  expect(paymentMethodCheckboxes.length).toEqual(2);

  // 🧪 The text of the first checkbox should be Online payments
  const paymentMethodOptions = paymentSection.querySelectorAll('label');
  querySelectedElementShouldContainsSpecifiedText(
    paymentMethodOptions[0],
    i18n.t('paymentMethod.CB'),
  );

  // 🧪 The text of the second checkbox should be Internal account (credits)
  querySelectedElementShouldContainsSpecifiedText(
    paymentMethodOptions[1],
    i18n.t('paymentMethod.CREDIT_ACCOUNT'),
  );
};

// 🧪 Validity section - All the fields should be rendered. The hidden fields should be hidden
export const validitySectionRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );
  const validitySection = component.querySelector(
    '#private-pass-form-validity-section',
  );

  // 🧪 Validity days field should be rendered
  querySelectedElementShouldBeInTheDocument(
    validitySection,
    '#private-pass-duration-days',
  );

  // 🧪 Validity months field should be rendered
  querySelectedElementShouldBeInTheDocument(
    validitySection,
    '#private-pass-duration-months',
  );

  // 🧪 Validity years field should be rendered
  querySelectedElementShouldBeInTheDocument(
    validitySection,
    '#private-pass-duration-years',
  );

  // 🧪 Validity options radio group should be rendered
  const validityRadioGroups = await within(
    validitySection as HTMLElement,
  ).findByRole('radiogroup');

  // 🧪 Validity options radio group should have 2 radio buttons
  const validityRadioButtons =
    within(validityRadioGroups).getAllByRole('radio');
  expect(validityRadioButtons.length).toEqual(2);

  // 🧪 First radio button should be "Valid from the billing date"
  const validityRadioOptions = validityRadioGroups.querySelectorAll('label');

  // There is another label not related to validity options, that's why we start at [1]
  querySelectedElementShouldContainsSpecifiedText(
    validityRadioOptions[1],
    i18n.t('privateService:privatePass.form.start_date_method.on_purchase'),
  );

  // 🧪 First radio button should be "Valid from the 1st booking"
  querySelectedElementShouldContainsSpecifiedText(
    validityRadioOptions[2],
    i18n.t('privateService:privatePass.form.start_date_method.on_booking'),
  );
};

export const compatibilitySectionRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );
  const compatibilitySection = component.querySelector(
    '#private-pass-form-compatibility-section',
  );

  // 🧪 Private service selector should be rendered
  querySelectedElementShouldBeInTheDocument(
    compatibilitySection,
    '#private-service-selector',
  );

  // 🧪 When no private service is selected, a warning message should be displayed
  querySelectedElementShouldContainsSpecifiedText(
    compatibilitySection as HTMLElement,
    i18n.t('privateService:privatePass.compatibleServices.isEmpty'),
  );
};
