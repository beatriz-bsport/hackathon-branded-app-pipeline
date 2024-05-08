import React from 'react';

import { action } from '@storybook/addon-actions';
import { ComponentStory, Meta } from '@storybook/react';
import { within, screen, userEvent } from '@storybook/testing-library';
import { Grid, Paper } from '@material-ui/core';
import { expect } from '@storybook/jest';
import i18n from 'i18next';

import OfferCreateFormWithFormik, {
  OfferCreateForm,
} from '#libs/offer/OfferCreateForm.component';
import { OFFER_RECURRENCE } from '#libs/offer/constants';
import {
  newStoryFromTemplate,
  querySelectedElementShouldBeHiddenInTheDocument,
  querySelectedElementShouldBeInTheDocument,
  sleep,
} from '../../utils/storybookHelper';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { tagListFactory } from '#libs/tag/factory';
import withFormik from '@bbbtech/storybook-formik';
import OfferFormValidationSchema from '#libs/offer/form/CreationValidationSchema';
import { OfferFormValues } from '#libs/offer/types';
import { establishment_factory } from '#libs/establishment/factory';
import { coachesFactory } from '#libs/associated-coach/factories';
import { levelListFactory } from '#libs/level/factories';
import { roomBlueprintListFactory } from '#libs/spot-scheduling/factories';
import { coachPaymentRulesByKindFactory } from '#libs/coach-payment-rules/factories';
import SpotSchedulingHelper from '#libs/spot-scheduling/utils';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { getIsoWeekDay } from '#libs/offer/utils';
import { DateTime } from 'luxon';

const requiredFieldError = i18n.t('offer:form.errors.required');
const positiveNumberError = i18n.t('offer:form.errors.positiveNumber');
const minZeroNumberError = i18n.t('offer:form.errors.minZero');
const minTwoNumberError = i18n.t('offer:form.errors.minTwo');
const broadcastLinkError = i18n.t('offer:form.errors.field.broadcastLink');
const startDateTooFarError = i18n.t('offer:form.errors.dateTooFar');
const endDateError = i18n.t('offer:form.errors.field.dateIntervalEnd');
const partnerMaxBookingError = i18n.t(
  'offer:form.errors.field.partnerMaxBookingCount',
);

const metaActivity = meta_activity_factory(1, true)[0];
const activeCustomLevels = levelListFactory(3);
const availableEstablishments = establishment_factory(5);
const coaches = coachesFactory(5);
const roomBlueprints = roomBlueprintListFactory(
  5,
  availableEstablishments[0].id,
);
const coachPaymentRulesByKind = coachPaymentRulesByKindFactory(5);
const tagList = tagListFactory(10);
const initialDateIntervalEndDays = 1;
const isoWeekDay = getIsoWeekDay();

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
  onBannerGoBack: action('onBannerGoBack'),
};

const initialValues: OfferFormValues = {
  effectif: null,
  waitingListMaxSize: null,
  establishment: null,
  level: 1,
  broadcastLink: '',
  credits: 1,
  dateIntervalStart: DateTime.now().startOf('day'),
  dateIntervalEnd: DateTime.now().plus({ day: initialDateIntervalEndDays }),
  durationMinute: 60,
  isRecurrence: false,
  recurrence: OFFER_RECURRENCE.WEEKLY,
  recurrenceWeekDay: {
    '1': isoWeekDay === 1,
    '2': isoWeekDay === 2,
    '3': isoWeekDay === 3,
    '4': isoWeekDay === 4,
    '5': isoWeekDay === 5,
    '6': isoWeekDay === 6,
    '7': isoWeekDay === 7,
  },
  calendarSelectedDate: DateTime.now().toISO(),
  isRecurrenceWeekDayDialogOpen: false,
  coach: null,
  additionalCoaches: [],
  coachPaymentRule: null,
  isManagerOnly: false,
  allowGuestOffer: true,
  partnerMaxBookingCount: 6,
  availableOnPartnership: true,
  selectedWhitelistTags: [],
  selectedBlacklistTags: [],
  roomBlueprint: null,
  isMetaActivityBroadcast: true,
  isOfferInGroup: false,
  roomBlueprintSlots: null,
  isZoomAppEnabled: true,
  isShowPartnership: true,
  is_hybrid: false,
};

const OfferFormMeta: Meta<typeof OfferCreateForm> = {
  title: 'library/Offer/OfferCreateForm',
  component: OfferCreateFormWithFormik,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues,
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema: OfferFormValidationSchema,
      onSubmit: () => {},
    },
  },
  argTypes: {
    onSubmit: actionsData.onSubmit,
    onCancel: actionsData.onCancel,
    onBannerGoBack: actionsData.onBannerGoBack,
  },
  args: {
    metaActivity,
    tagList,
    selectedDate: DateTime.now().toISO(),
    activeCustomLevels,
    allCustomLevels: levelListFactory(8),
    availableEstablishments,
    zoomAppDetail: null,
    timezone: 'Europe/Paris',
    coaches,
    coachPaymentRulesByKind,
    editableCoachPaymentRule: true,
    roomBlueprints,
    showPartnership: true,
    allowGuestMaster: true,
    isOfferInGroup: false,
    onSubmit: () => {},
  },
};

export default OfferFormMeta;

const OfferFormTemplate: ComponentStory<typeof OfferCreateForm> = (args) => (
  <Grid item xs={12} lg={6}>
    <Paper>
      <OfferCreateForm {...args} />
    </Paper>
  </Grid>
);

/*
 * Loading state - When passing the isLoading boolean the skeleton should be rendered
 */
export const LoadingForm = newStoryFromTemplate(OfferFormTemplate);
LoadingForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );

  querySelectedElementShouldBeInTheDocument(offerForm, '#offer-form-skeleton');
};
LoadingForm.args = {
  isLoading: true,
};

/*
 * Rendering tests - Every form section should be rendered correctly
 */
export const EmptyForm = newStoryFromTemplate(OfferFormTemplate);
EmptyForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );

  // Form banner
  querySelectedElementShouldBeInTheDocument(offerForm, '#offer-form-banner');
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-banner-back',
  );

  // Specificities section
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-specificities-section',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-effectif-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-waiting-list-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-level-selector',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-establishment-selector',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-credits-input',
  );

  // Date and time section
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-datetime-section',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-date-start-time-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-duration-hours-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-duration-minutes-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-date-start-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-recurrence-switch',
  );
  const dateTimeEndDatePicker = offerForm.querySelector(
    '#offer-form-date-end-input',
  );
  const dateTimeRecurrenceSelector = offerForm.querySelector(
    '#offer-form-recurrence-selector',
  );
  expect(dateTimeEndDatePicker).toBeNull();
  expect(dateTimeRecurrenceSelector).toBeNull();

  // Coach section
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-coach-section',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-coach-selector',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-coach-payment-rule-selector',
  );

  // Settings section
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-settings-section',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-manager-only-switch',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-allow-guest-switch',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-available-partnership-switch',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-partner-max-booking-input',
  );

  // Tags section
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-tags-section',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-partner-max-booking-input',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-whitelist-tags-selector',
  );
  querySelectedElementShouldBeHiddenInTheDocument(
    offerForm,
    '#offer-form-whitelist-tags-selector',
  );
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-blacklist-tags-selector',
  );
  querySelectedElementShouldBeHiddenInTheDocument(
    offerForm,
    '#offer-form-blacklist-tags-selector',
  );

  // Form actions
  const actionButtonsContainer = offerForm.querySelector('#offer-form-actions');
  const actionsButtons = actionButtonsContainer.querySelectorAll('button');
  expect(actionsButtons.length).toEqual(2);
};

/*
 * Specificities interactions tests
 */
export const SpecificitiesSectionInteractions =
  newStoryFromTemplate(OfferFormTemplate);
SpecificitiesSectionInteractions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  await sleep(300);

  // Level field - after clicking on "create a level" button the dialog should be visible
  const createLevelButton = offerForm.querySelector(
    '#offer-form-level-field button',
  );
  userEvent.click(createLevelButton);
  await sleep(100);
  const createLevelDialog = await screen.queryByRole('dialog');
  expect(createLevelDialog).toBeInTheDocument();
  const cancelText = i18n.t('common:cancel');
  const createLevelDialogCancelButton = await screen.getAllByText(
    cancelText,
  )[1];
  userEvent.click(createLevelDialogCancelButton);
  await sleep(100);

  // Level field - after clicking on the selector options should be visible
  const levelSelector = offerForm.querySelector(
    '#offer-form-level-selector div',
  );
  userEvent.click(levelSelector);
  await sleep(100);
  const firstLevelInSelector = await screen.findByText(
    activeCustomLevels[0].name,
  );
  expect(firstLevelInSelector).toBeVisible();
  userEvent.click(firstLevelInSelector);
  await sleep(100);

  // Establishment field - after clicking on the selector options should be visible
  const establishmentSelector = offerForm.querySelector(
    '#offer-form-establishment-selector div',
  );
  userEvent.click(establishmentSelector);
  await sleep(100);
  const firstEstablishmentInSelector = await screen.findByText(
    availableEstablishments[0].title,
  );
  expect(firstEstablishmentInSelector).toBeVisible();
  userEvent.click(firstEstablishmentInSelector);
  await sleep(100);

  // Spot scheduling field - after clicking on an establishment that has blueprints the selector should be visible
  const roomBlueprintSelector = offerForm.querySelector(
    '#offer-form-blueprint-selector div',
  );
  expect(roomBlueprintSelector).toBeVisible();
  userEvent.click(roomBlueprintSelector);
  await sleep(100);
  const spotCount = SpotSchedulingHelper.getSpotCount(
    roomBlueprints[0] as RoomBlueprint,
  );
  const firstRoomBlueprintInSelectorText = `(${spotCount}) ${roomBlueprints[0].name}`;
  const firstRoomBlueprintInSelector = await screen.findByText(
    firstRoomBlueprintInSelectorText,
  );
  expect(firstRoomBlueprintInSelector).toBeVisible();
  userEvent.click(firstRoomBlueprintInSelector);
  await sleep(100);

  // Spot scheduling field - when hovering on tooltip the helper text should be visible
  const spotSchedulingFieldTooltip = offerForm.querySelector(
    '#offer-form-spot-scheduling-field-container',
  ).lastElementChild;
  userEvent.hover(spotSchedulingFieldTooltip);
  await sleep(100);
  const spotSchedulingFieldTooltipText = i18n.t(
    'offer:form.section.specificities.tooltip.roomBlueprint',
  );
  const spotSchedulingFieldTooltipTextElement = await screen.findByText(
    spotSchedulingFieldTooltipText,
  );
  expect(spotSchedulingFieldTooltipTextElement).toBeInTheDocument();
  userEvent.unhover(spotSchedulingFieldTooltip);

  // Credits field - when hovering on tooltip the helper text should be visible
  const creditsFieldTooltip = offerForm.querySelector(
    '#offer-form-credits-field',
  ).lastElementChild;
  userEvent.hover(creditsFieldTooltip);
  await sleep(100);
  const creditsFieldTooltipText = i18n.t(
    'offer:form.section.specificities.tooltip.credits',
  );
  const creditsFieldTooltipTextElement = await screen.findByText(
    creditsFieldTooltipText,
  );
  expect(creditsFieldTooltipTextElement).toBeInTheDocument();
  userEvent.unhover(creditsFieldTooltip);
  await sleep(100);

  // Broadcast link field - when hovering on tooltip the helper text should be visible
  const broadcastLinkFieldTooltip = offerForm.querySelector(
    '#offer-form-broadcast-link-field',
  ).childNodes[2];
  userEvent.hover(broadcastLinkFieldTooltip as Element);
  await sleep(100);
  const broadcastLinkFieldTooltipText = i18n.t(
    'offer:form.section.specificities.tooltip.broadcastLink',
  );
  const broadcastLinkFieldTooltipTextElement = await screen.findByText(
    broadcastLinkFieldTooltipText,
  );
  expect(broadcastLinkFieldTooltipTextElement).toBeInTheDocument();
  userEvent.unhover(broadcastLinkFieldTooltip as Element);
  await sleep(100);
};

/*
 * Date time section interaction tests
 */
export const DateTimeSectionInteractions =
  newStoryFromTemplate(OfferFormTemplate);
DateTimeSectionInteractions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  await sleep(300);

  // Start date time field - ensure a time picker appears when clicking on the calendar icon
  const dateStartTimePickerButton = offerForm.querySelector(
    '#offer-form-date-start-time-field button',
  );
  userEvent.click(dateStartTimePickerButton);
  await sleep(100);
  const dateStartTimePickerDialog = await screen.findByRole('menu');
  expect(dateStartTimePickerDialog).toBeInTheDocument();
  const dateStartTimePickerDialogCancelButton = await screen.findByText(
    'Cancel', // dialog actions not localized
  );
  userEvent.click(dateStartTimePickerDialogCancelButton);
  await sleep(100);

  // Start date field - ensure a date picker appears when clicking on the calendar icon
  const dateStartPickerButton = offerForm.querySelector(
    '#offer-form-date-start-field button',
  );
  userEvent.click(dateStartPickerButton);
  await sleep(100);
  const dateStartPickerDialogText = await screen.findByText(
    DateTime.now().toFormat('MMMM yyyy'),
  );
  expect(dateStartPickerDialogText).toBeInTheDocument();
  const dateStartPickerDialogCancelButton = await screen.findByText('Cancel');
  userEvent.click(dateStartPickerDialogCancelButton);
  await sleep(100);

  // Recurrence field - ensure recurrence fields are visible once toggle checked
  const recurrenceSwitch = offerForm.querySelector(
    '#offer-form-recurrence-switch',
  );
  userEvent.click(recurrenceSwitch);
  await sleep(100);
  const dateEndPicker = offerForm.querySelector('#offer-form-date-end-input');
  const recurrenceSelectorContainer = offerForm.querySelector(
    '#offer-form-recurrence-selector',
  );
  expect(dateEndPicker).toBeInTheDocument();
  expect(recurrenceSelectorContainer).toBeInTheDocument();

  // End date field - ensure a date picker appears when clicking on the calendar icon
  const dateEndPickerButton = offerForm.querySelector(
    '#offer-form-date-end-field button',
  );
  userEvent.click(dateEndPickerButton);
  await sleep(100);
  const dateEndPickerDialogText = await screen.findByText(
    DateTime.now().toFormat('MMMM yyyy'),
  );
  expect(dateEndPickerDialogText).toBeInTheDocument();
  const dateEndPickerDialogCancelButton = await screen.findByText('Cancel');
  userEvent.click(dateEndPickerDialogCancelButton);
  await sleep(100);

  // Recurrence field - after clicking on the selector options should be visible
  const recurrenceSelector = offerForm.querySelector(
    '#offer-form-recurrence-selector div',
  );
  userEvent.click(recurrenceSelector);
  await sleep(100);
  const recurrenceDailyOptionText = i18n.t(
    'offer:form.section.dateTime.field.recurrence.option.daily',
  );
  const recurrenceWeeklyOptionText = i18n.t(
    'offer:form.section.dateTime.field.recurrence.option.weekly',
  );
  const recurrenceMonthlyOptionText = i18n.t(
    'offer:form.section.dateTime.field.recurrence.option.monthly',
  );
  const recurrenceDailyOption = await screen.findByText(
    recurrenceDailyOptionText,
  );
  const recurrenceWeeklyOption = await screen.findAllByText(
    recurrenceWeeklyOptionText,
  );
  const recurrenceMonthlyOption = await screen.findByText(
    recurrenceMonthlyOptionText,
  );
  expect(recurrenceDailyOption).toBeVisible();
  expect(recurrenceWeeklyOption[1]).toBeVisible();
  expect(recurrenceMonthlyOption).toBeVisible();

  // Recurrence field - after choosing "Weekly" option in recurrency selector days should be visible
  userEvent.click(recurrenceWeeklyOption[1]);
  await sleep(100);
  const recurrenceWeekDaysContainer = offerForm.querySelector(
    '#offer-form-recurrence-week-days',
  );
  expect(recurrenceWeekDaysContainer).toBeInTheDocument();

  // Recurrence field - after clicking the preview button the calendar dialog should be visible
  userEvent.click(recurrenceWeekDaysContainer.firstElementChild);
  const recurrencePreviewText = i18n.t(
    'offer:form.section.dateTime.field.recurrence.preview',
  );
  const recurrencePreviewButton = await screen.findByText(
    recurrencePreviewText,
  );
  userEvent.click(recurrencePreviewButton);
  await sleep(100);
  const recurrencePreviewDialogTitleText = i18n.t(
    'offer:form.dialog.recurrencePreview',
  );
  const recurrenceDialogTitle = await screen.findByText(
    recurrencePreviewDialogTitleText,
  );
  expect(recurrenceDialogTitle).toBeInTheDocument();
  const closeText = i18n.t('common:close');
  const recurrenceDialogCancelButton = await screen.findByText(closeText);
  userEvent.click(recurrenceDialogCancelButton);
};

/*
 * Coach section interaction tests
 */
export const CoachSectionInteractions = newStoryFromTemplate(OfferFormTemplate);
CoachSectionInteractions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  await sleep(300);

  // Coach field - after clicking on the selector options should be visible
  const coachSelector = offerForm.querySelector(
    '#offer-form-coach-selector div',
  );
  userEvent.click(coachSelector);
  await sleep(100);
  const firstCoachInSelector = await screen.findByText(coaches[0].name);
  expect(firstCoachInSelector).toBeVisible();

  // Coach payment rule field - after a coach selection we should be able to choose the payment rule
  userEvent.click(firstCoachInSelector);
  await sleep(100);
  const coachPaymentRuleSelector = offerForm.querySelector(
    '#offer-form-coach-payment-rule-selector div',
  );
  userEvent.click(coachPaymentRuleSelector);
  await sleep(100);
  const firstPaymentRuleName =
    coachPaymentRulesByKind[
      parseInt(Object.keys(coachPaymentRulesByKind)[0])
    ][0].name;
  const firstPaymentRuleInSelector = await screen.findByText(
    firstPaymentRuleName,
  );
  expect(firstPaymentRuleInSelector).toBeVisible();
  userEvent.click(firstPaymentRuleInSelector);
};

/*
 * Settings section interaction tests
 */
export const SettingsSectionInteractions =
  newStoryFromTemplate(OfferFormTemplate);
SettingsSectionInteractions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  await sleep(300);

  // Manager only field - the switch should work properly
  const managerOnlySwitch = offerForm.querySelector(
    '#offer-form-manager-only-switch',
  );
  userEvent.click(managerOnlySwitch);
  await sleep(100);
  expect(managerOnlySwitch).toHaveProperty('checked', false);

  // Allow guest field - the switch should work properly
  const allowGuestSwitch = offerForm.querySelector(
    '#offer-form-allow-guest-switch input',
  );
  userEvent.click(allowGuestSwitch);
  await sleep(100);
  expect(allowGuestSwitch).toHaveProperty('checked', false);

  // Partnership field - the switch should work properly
  const partnershipSwitch = offerForm.querySelector(
    '#offer-form-available-partnership-switch input',
  );
  userEvent.click(partnershipSwitch);
  await sleep(100);
  expect(partnershipSwitch).toHaveProperty('checked', false);
};

/*
 * Tags section interaction tests
 */
export const TagsSectionInteractions = newStoryFromTemplate(OfferFormTemplate);
TagsSectionInteractions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  await sleep(300);

  // Tags section - section should visible on title collapse click
  const tagsCollapseButton = offerForm.querySelector(
    '#offer-form-tags-section button',
  );
  userEvent.click(tagsCollapseButton);
  await sleep(100);
  const whitelistTagsSelector = offerForm.querySelector(
    '#offer-form-whitelist-tags-selector div',
  );
  const blackListTagsSelector = offerForm.querySelector(
    '#offer-form-blacklist-tags-selector div',
  );
  expect(whitelistTagsSelector).toBeVisible();
  expect(blackListTagsSelector).toBeVisible();

  // Whitelist tags field - after clicking on the selector options should be visible
  userEvent.click(whitelistTagsSelector);
  await sleep(100);
  const firstTagInTagList = await screen.findByText(tagList[0].name);
  expect(firstTagInTagList).toBeInTheDocument();

  // Blacklist tags field - after choosing a whitelisted tag it should not visible in the selector
  userEvent.click(firstTagInTagList);
  await sleep(100);
  userEvent.click(blackListTagsSelector);
  await sleep(100);
  expect(firstTagInTagList).not.toBeInTheDocument();
  userEvent.click(blackListTagsSelector);
};

/*
 * Specificities errors tests
 */
export const SpecificitiesSectionErrors =
  newStoryFromTemplate(OfferFormTemplate);
SpecificitiesSectionErrors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  const submitFormButton = offerForm.querySelector('button[type="submit"]');
  await sleep(300);

  // Effectif field - user should not be able to submit if the input is empty
  userEvent.click(submitFormButton);
  await sleep(100);
  const effectifFieldError = offerForm.querySelector(
    '#offer-form-effectif-input-helper-text',
  );
  expect(effectifFieldError).toBeInTheDocument();
  expect(effectifFieldError).toHaveTextContent(requiredFieldError);

  // Effectif field - user should not be able to submit if the input is negative
  const effectifInput = offerForm.querySelector('#offer-form-effectif-input');
  userEvent.type(effectifInput, '-5');
  userEvent.click(submitFormButton);
  await sleep(100);
  expect(effectifFieldError).toBeInTheDocument();
  expect(effectifFieldError).toHaveTextContent(minTwoNumberError);

  // Waiting list field - user should not be able to submit if the input is empty
  userEvent.click(submitFormButton);
  await sleep(100);
  const waitingListFieldError = offerForm.querySelector(
    '#offer-form-waiting-list-input-helper-text',
  );
  expect(waitingListFieldError).toBeInTheDocument();
  expect(waitingListFieldError).toHaveTextContent(requiredFieldError);

  // Waiting list field - user should not be able to submit if the input is negative
  const waitingListInput = offerForm.querySelector(
    '#offer-form-waiting-list-input',
  );
  userEvent.type(waitingListInput, '-3');
  userEvent.click(submitFormButton);
  await sleep(100);
  expect(waitingListFieldError).toBeInTheDocument();
  expect(waitingListFieldError).toHaveTextContent(minZeroNumberError);

  // Establishment field - user should not be able to submit if the input is empty
  userEvent.click(submitFormButton);
  await sleep(100);
  const establishmentFieldError = offerForm.querySelector(
    '#offer-form-establishment-field span.MuiTypography-colorError',
  );
  expect(establishmentFieldError).toBeInTheDocument();
  expect(establishmentFieldError).toHaveTextContent(requiredFieldError);

  // Credits field - user should not be able to submit if the input is empty
  const creditsInput = offerForm.querySelector('#offer-form-credits-input');
  userEvent.clear(creditsInput);
  userEvent.click(submitFormButton);
  await sleep(100);
  const creditsFieldError = offerForm.querySelector(
    '#offer-form-credits-input-helper-text',
  );
  expect(creditsFieldError).toBeInTheDocument();
  expect(creditsFieldError).toHaveTextContent(requiredFieldError);

  // Credits field - user should not be able to submit if the input is negative
  userEvent.clear(creditsInput);
  userEvent.type(creditsInput, '-5');
  userEvent.click(submitFormButton);
  await sleep(100);
  expect(creditsFieldError).toBeInTheDocument();
  expect(creditsFieldError).toHaveTextContent(minZeroNumberError);
};

/*
 * Date time errors tests
 */
export const DateTimeSectionErrors = newStoryFromTemplate(OfferFormTemplate);
DateTimeSectionErrors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  const submitFormButton = offerForm.querySelector('button[type="submit"]');
  await sleep(300);

  // Date start field - user should not be able to submit if date selected is more than 3 years ahead of current date
  const numberOfYearsAhead = 4;
  const dateFourYearsAhead = DateTime.now()
    .plus({ year: numberOfYearsAhead })
    .toFormat('D');
  const dateStartInput = offerForm.querySelector(
    '#offer-form-date-start-input',
  );
  userEvent.clear(dateStartInput);
  userEvent.type(dateStartInput, dateFourYearsAhead);
  userEvent.tab();
  userEvent.click(submitFormButton);
  await sleep(100);
  const dateStartTooFarError = await screen.findByText(startDateTooFarError);
  expect(dateStartTooFarError).toBeInTheDocument();

  // Date end field - user should not be able to submit if toggle is checked but no value selected
  const recurrenceSwitch = offerForm.querySelector(
    '#offer-form-recurrence-switch',
  );
  userEvent.click(recurrenceSwitch);
  await sleep(100);
  userEvent.click(submitFormButton);
  await sleep(100);
  const dateEndFieldError = offerForm.querySelector(
    '#offer-form-date-end-field span.MuiTypography-colorError',
  );
  expect(dateEndFieldError).toBeInTheDocument();
  expect(dateEndFieldError).toHaveTextContent(endDateError);
};

/*
 * Coach errors tests
 */
export const CoachSectionErrors = newStoryFromTemplate(OfferFormTemplate);
CoachSectionErrors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  const submitFormButton = offerForm.querySelector('button[type="submit"]');
  await sleep(300);

  // Coach field - user should not be able to submit if no value is selected
  userEvent.click(submitFormButton);
  await sleep(100);
  const coachFieldError = offerForm.querySelector(
    '#offer-form-coach-field span.MuiTypography-colorError',
  );
  expect(coachFieldError).toBeInTheDocument();
  expect(coachFieldError).toHaveTextContent(requiredFieldError);
};

/*
 * Settings errors tests
 */
export const SettingsSectionErrors = newStoryFromTemplate(OfferFormTemplate);
SettingsSectionErrors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-form',
    {},
    {
      timeout: 3500,
    },
  );
  const submitFormButton = offerForm.querySelector('button[type="submit"]');
  await sleep(300);

  // Partner max booking field - user should not be able to submit if amount is more than available slots
  const effectifInput = offerForm.querySelector('#offer-form-effectif-input');
  userEvent.type(effectifInput, '10');
  const partnershipMaxBookingInput = offerForm.querySelector(
    '#offer-form-partner-max-booking-input',
  );
  userEvent.clear(partnershipMaxBookingInput);
  userEvent.type(partnershipMaxBookingInput, '15');
  userEvent.click(submitFormButton);
  await sleep(100);
  const partnerMaxBookingErrorElement = await screen.findByText(
    partnerMaxBookingError,
  );
  expect(partnerMaxBookingErrorElement).toBeInTheDocument();
};
