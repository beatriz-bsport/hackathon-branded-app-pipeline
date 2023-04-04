import { userEvent, within, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import i18n from 'i18next';

import {
  querySelectedFieldShouldReceiveTheInputValue,
  sleep,
  findByTestIdInCanvas,
} from '../../../../../../utils/storybookHelper';

import PrivatePassForm from '../PrivatePassForm.component';

import { inputValues } from './constants';

const categoryShouldAppearInDOM = async (
  element: HTMLElement | Element,
  privatePassCategoryName: string,
) => {
  const categorySelector = element.querySelector('#value-container');
  userEvent.click(categorySelector);
  await sleep(100);
  const firstCategory = await screen.findByText(privatePassCategoryName);
  userEvent.click(firstCategory);
  await sleep(100);
  expect(await screen.findByText(privatePassCategoryName)).toBeInTheDocument();
};

// Interactions tests
// The purpose of these tests is to interact with the component and to check that the values inputted are the ones received by the form.

export const generalSectionInteractionsTests = async ({
  canvasElement,
  args,
}: {
  args: React.ComponentProps<typeof PrivatePassForm>;
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const generalSection = component.querySelector(
    '#private-pass-form-general-section',
  );

  const switchFields = generalSection.querySelectorAll(
    '#private-pass-switch-fields-container input',
  );

  // 🧪 Name - The value received should be the same as the one inputted
  // Need to wait / sleep here otherwise textfield-pass-title will not be available and we'll not be able to interact (type) with it
  await sleep(10);
  await querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-name-field',
    inputValues.general.name,
  );

  // 🧪 Category - By default, category name should not appear in the DOM
  let privatePassCategoryName = args.privatePassCategories[1].name;
  expect(canvas.queryByText(privatePassCategoryName)).toBeNull();

  // 🧪 Category - Once selected, the category should appear in the DOM
  await categoryShouldAppearInDOM(
    generalSection,
    args.privatePassCategories[1].name,
  );
  // 🧪 Category - The recently selected category should replace the one previously selected
  await categoryShouldAppearInDOM(
    generalSection,
    args.privatePassCategories[2].name,
  );

  // 🧪 Credit - The value received should be the same as the one inputted
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-credit-field',
    inputValues.general.credits,
  );

  // 🧪 Price - The value received should be the same as the one inputted
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-price-field',
    inputValues.general.price,
  );

  // 🧪 VAT - The value received should be the same as the one inputted
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-tax-field',
    inputValues.general.vat,
  );

  // 🧪 Universal Switch Field - By default, shouldn't be checked
  const universalSwitchField = generalSection.querySelector(
    '#private-pass-universal-switch-field-container input',
  );
  expect(universalSwitchField).not.toBeChecked();

  // 🧪 Universal Switch Field - After click, it should be checked
  userEvent.click(universalSwitchField);
  expect(universalSwitchField).toBeChecked();

  // 🧪 manager_only - By default, shouldn't be checked
  expect(switchFields[0]).not.toBeChecked();

  // 🧪 manager_only - After click, it should be checked
  userEvent.click(switchFields[0]);
  expect(switchFields[0]).toBeChecked();

  // 🧪 manager_only - After click, new_member_only should be disabled
  expect(switchFields[1]).toBeDisabled();
  userEvent.click(switchFields[0]);

  // 🧪 new_member_only - By default, shouldn't be checked
  expect(switchFields[1]).not.toBeChecked();

  // 🧪 new_member_only - After click, it should be checked
  userEvent.click(switchFields[1]);
  expect(switchFields[1]).toBeChecked();

  // 🧪 full_vod_access - By default, should be checked
  expect(switchFields[2]).toBeChecked();

  // 🧪 full_vod_access - After click, it shouldn't be checked
  userEvent.click(switchFields[2]);
  expect(switchFields[2]).not.toBeChecked();

  // 🧪 unusable_by_staff - By default, shouldn't be checked
  expect(switchFields[3]).not.toBeChecked();

  // 🧪 unusable_by_staff - After click, it should be checked
  userEvent.click(switchFields[3]);
  expect(switchFields[3]).toBeChecked();
};

export const paymentSectionInteractionsTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const paymentSection = component.querySelector(
    '#private-pass-form-payment-section',
  );
  const paymentMethodCheckboxes = await within(
    paymentSection as HTMLElement,
  ).findAllByRole('checkbox');

  // 🧪 By default, the first checkbox should be checked
  expect(paymentMethodCheckboxes[0]).toBeChecked();

  // 🧪 By default, the second checkbox should not be checked
  expect(paymentMethodCheckboxes[1]).not.toBeChecked();

  // 🧪 After clicking, the first checkbox should not be checked
  userEvent.click(paymentMethodCheckboxes[0]);
  expect(paymentMethodCheckboxes[0]).not.toBeChecked();

  // 🧪 After clicking, the second checkbox should be checked
  userEvent.click(paymentMethodCheckboxes[1]);
  expect(paymentMethodCheckboxes[1]).toBeChecked();
};

export const validitySectionInteractionsTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const validitySection = component.querySelector(
    '#private-pass-form-validity-section',
  );
  const validityRadioGroups = await within(
    validitySection as HTMLElement,
  ).findByRole('radiogroup');
  const validityRadioButtons =
    within(validityRadioGroups).getAllByRole('radio');

  // 🧪 Validity - Days - The value received should be the same as the one inputted
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#private-pass-duration-days',
    inputValues.validity.days,
  );

  // 🧪 Validity - Months - The value received should be the same as the one inputted
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#private-pass-duration-months',
    inputValues.validity.months,
  );

  // 🧪 Validity - years - The value received should be the same as the one inputted
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#private-pass-duration-years',
    inputValues.validity.years,
  );

  // 🧪 Expiration date - The value received should be the same as the one inputted
  userEvent.click(validityRadioButtons[1]);
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#private-pass-expiration-field',
    inputValues.validity.expiration,
  );
};

export const compatibilitySectionInteractionsTests = async ({
  canvasElement,
  args,
}: {
  args: React.ComponentProps<typeof PrivatePassForm>;
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const compatibilitySection = component.querySelector(
    '#private-pass-form-compatibility-section',
  );

  const placeholderText = i18n.t(
    'privateService:privatePass.form.selector.privateService',
  );

  const compatibilityList = compatibilitySection.querySelector('ul');

  // 🧪 List - By default, none compatible private service is shown in the list
  expect(
    within(compatibilityList).queryByText(args.privateServices[0].name),
  ).toBeNull();

  // 🧪 List - When user selects a category, it should be rendered in the list below the selector
  // We need to wait / sleep here otherwise the selector will not be availabe to interact with it
  await sleep(10);

  const compatibleAppointmentsSelector = await within(
    compatibilitySection as HTMLElement,
  ).findByText(placeholderText);

  userEvent.click(compatibleAppointmentsSelector);

  const privateServiceName = await screen.findByText(
    args.privateServices[0].name,
  );

  userEvent.click(privateServiceName);

  expect(
    within(compatibilityList).queryByText(args.privateServices[0].name),
  ).not.toBeNull();

  // 🧪 List - When user delete a selected category, it should be removed from the list below the selector
  const deleteListItemButton = compatibilityList.querySelectorAll(
    '#shortMenuContainer button',
  )[1];

  userEvent.click(deleteListItemButton);

  sleep(100);

  expect(
    within(compatibilityList).queryByText(args.privateServices[0].name),
  ).toBeNull();
};

export const universalCompatibilityInteractionsTests = async ({
  canvasElement,
  args,
}: {
  args: React.ComponentProps<typeof PrivatePassForm>;
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  await sleep(300);

  const placeholderText = i18n.t('paymentPack:addPaymentPack.letBlank');

  // Click on the universal switch field to render the section
  const universalSwitchField = component.querySelector(
    '#private-pass-universal-switch-field-container input',
  );
  userEvent.click(universalSwitchField);
  await sleep(300);
  const universalCompatibilitySection = component.querySelector(
    '#universal-pass-compatibility',
  );

  // 🧪 Selectors - The name of the selected category should appear in the control
  const selectedCategoryShouldAppearInControl = async (
    selector: HTMLElement,
    text: string,
  ) => {
    userEvent.click(selector);

    await sleep(300);

    userEvent.click(await canvas.findByText(text));
    expect(await canvas.findByText(text)).toBeInTheDocument();

    // Click on the confirm button
    userEvent.click(
      universalCompatibilitySection.querySelectorAll('button')[1],
    );
    expect(await canvas.findByText(text)).toBeInTheDocument();
  };

  const clickOnTagShouldRemoveItFromControl = async (tagName: string) => {
    const tag = await within(
      universalCompatibilitySection as HTMLElement,
    ).findByRole('button');

    userEvent.click(tag.querySelector('svg'));
    expect(canvas.queryByText(tagName)).toBeNull();
  };

  // 🧪 Categories selector - The name of the selected category should appear in the control
  // We need to call the same findAllByText function for each selector
  let selectors = await within(component).findAllByText(placeholderText);

  await selectedCategoryShouldAppearInControl(
    selectors[0],
    args.categoryList[0].name,
  );

  // 🧪 Categories selector - Clicking on the tag should remove it from the control
  await clickOnTagShouldRemoveItFromControl(args.categoryList[0].name);

  // 🧪 Establishments selector - The name of the selected category should appear in the control
  // We need to call the same findAllByText function for each selector
  selectors = await within(component).findAllByText(placeholderText);

  await selectedCategoryShouldAppearInControl(
    selectors[1],
    args.establishmentList[0].title,
  );

  // 🧪 Establishments selector - Clicking on the tag should remove it from the control
  await clickOnTagShouldRemoveItFromControl(args.establishmentList[0].title);

  // 🧪 Activities selector - The name of the selected category should appear in the control
  selectors = await within(component).findAllByText(placeholderText);

  await selectedCategoryShouldAppearInControl(
    selectors[2],
    args.metaActivityList[0].name,
  );

  // 🧪 Activities selector - Clicking on the tag should remove it from the control
  await clickOnTagShouldRemoveItFromControl(args.metaActivityList[0].name);
};
