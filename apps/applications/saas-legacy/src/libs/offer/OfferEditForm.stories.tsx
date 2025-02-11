import React from 'react';

import { action } from '@storybook/addon-actions';
import { ComponentStory, Meta } from '@storybook/react';
import { DateTime } from 'luxon';
import { within } from '@storybook/testing-library';
import { Grid, Paper } from '@material-ui/core';
import { expect } from '@storybook/jest';

import OfferEditFormWithFormik, {
  OfferEditForm,
} from '#src/libs/offer/OfferEditForm.component';
import { PropagateCoachOverrideToSimilarOffers } from '#src/libs/offer/constants';
import {
  newStoryFromTemplate,
  querySelectedElementShouldBeHiddenInTheDocument,
  querySelectedElementShouldBeInTheDocument,
} from '../../utils/storybookHelper';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';
import { tagListFactory } from '#src/libs/tag/factory';
import withFormik from '@bbbtech/storybook-formik';
import OfferEditFormValidationSchema from '#src/libs/offer/form/EditValidationSchema';
import { OfferFormValues } from '#src/libs/offer/types';
import { establishment_factory } from '#src/libs/establishment/factory';
import { coachesFactory } from '#src/libs/associated-coach/factories';
import { levelListFactory } from '#src/libs/level/factories';
import { roomBlueprintListFactory } from '#src/libs/spot-scheduling/factories';
import { coachPaymentRulesByKindFactory } from '#src/libs/coach-payment-rules/factories';
import { offerFactory, offersFactory } from './factory';

// const requiredFieldError = i18n.t('offer:form.errors.required');
// const positiveNumberError = i18n.t('offer:form.errors.positiveNumber');
// const minZeroNumberError = i18n.t('offer:form.errors.minZero');
// const minTwoNumberError = i18n.t('offer:form.errors.minTwo');
// const broadcastLinkError = i18n.t('offer:form.errors.field.broadcastLink');
// const startDateTooFarError = i18n.t('offer:form.errors.dateTooFar');
// const endDateError = i18n.t('offer:form.errors.field.dateIntervalEnd');
// const partnerMaxBookingError = i18n.t(
//   'offer:form.errors.field.partnerMaxBookingCount',
// );

const similarOffers = offersFactory(15);
const metaActivity = meta_activity_factory(1, true)[0];
const metaActivities = meta_activity_factory(10);
const activeCustomLevels = levelListFactory(3);
const establishments = establishment_factory(5);
const coaches = coachesFactory(5);
const roomBlueprints = roomBlueprintListFactory(5, establishments[0].id);
const coachPaymentRulesByKind = coachPaymentRulesByKindFactory(5);
const tagList = tagListFactory(10);
const offer = offerFactory({ level: activeCustomLevels[0], credits: 1 });

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
  onBannerGoBack: action('onBannerGoBack'),
};

const initialValues: OfferFormValues = {
  effectif: offer.effectif,
  waitingListMaxSize: offer.waiting_list_max_size,
  level: offer.level_id,
  establishment: establishments[0].id,
  broadcastLink: 'https://zoom.us/123456789',
  credits: offer.credit_price,
  dateIntervalStart: DateTime.fromISO(offer.date_start),
  durationMinute: offer.duration_minute,
  coach: coaches[0].id,
  coachPaymentRule: null,
  isManagerOnly: false,
  allowGuestOffer: offer.allow_guest_offer,
  availableOnPartnership: true,
  selectedWhitelistTags: offer.whitelist_tags.map((tag) => tag.id),
  selectedBlacklistTags: offer.blacklist_tags.map((tag) => tag.id),
  roomBlueprint: offer.room_blueprint ?? null,
  roomBlueprintSlots: null,
  isMetaActivityBroadcast: true,
  isZoomAppEnabled: true,
  isOfferInGroup: false,
  selectedMetaActivity: metaActivity.id,
  isNotifyConsumers: false,
  isModifyRecursively: false,
  coachOverride: null,
  selectedSimilarOffers: [],
  coachOverridePropagateMode:
    PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY,
  isCoachOverridePropagate: true,
  isShowPartnership: false,
  is_hybrid: false,
};

const OfferEditFormMeta: Meta<typeof OfferEditForm> = {
  title: 'library/Offer/OfferEditForm',
  component: OfferEditFormWithFormik,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues,
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: false,
      validationSchema: OfferEditFormValidationSchema,
      onSubmit: () => {},
    },
  },
  argTypes: {
    onSubmit: actionsData.onSubmit,
    onCancel: actionsData.onCancel,
  },
  args: {
    offer: { offer, meta_activity: metaActivity },
    metaActivities: metaActivities,
    coaches: coaches,
    availableEstablishments: establishments,
    allEstablishments: establishments,
    roomBlueprints,
    allRoomBlueprints: null,
    isWherebyIntegrationEnabled: true,
    processing: false,
    similarOffers,
    similarOfferLoading: false,
    coachPaymentRulesByKind,
    showPartnership: true,
    tagList,
    activeCustomLevels,
    allCustomLevels: levelListFactory(8),
    allowGuestMaster: true,
    zoomAppDetail: null,
    editableCoachPaymentRule: true,
    updateLevel: () => {},
    createLevel: () => {},
    deleteLevel: () => {},
    onSubmit: () => {},
    onCancel: () => {},
    fetchSimilarOffers: () => {},
    fetchLevelList: () => {},
  },
};

export default OfferEditFormMeta;

const OfferEditFormTemplate: ComponentStory<typeof OfferEditForm> = (args) => (
  <Grid item xs={12} lg={6}>
    <Paper>
      <OfferEditForm {...args} />
    </Paper>
  </Grid>
);

/*
 * Loading state - When passing the isLoading boolean the skeleton should be rendered
 */
export const LoadingForm = newStoryFromTemplate(OfferEditFormTemplate);
LoadingForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-edit-form',
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
export const BaseForm = newStoryFromTemplate(OfferEditFormTemplate);
BaseForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const offerForm = await canvas.findByTestId(
    'offer-edit-form',
    {},
    {
      timeout: 3500,
    },
  );

  // Form banner
  querySelectedElementShouldBeInTheDocument(offerForm, '#offer-form-banner');

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

  // Tags section
  querySelectedElementShouldBeInTheDocument(
    offerForm,
    '#offer-form-tags-section',
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
  const actionButtonsContainer = offerForm.querySelector(
    '#offer-edit-form-actions',
  );
  const actionsButtons = actionButtonsContainer.querySelectorAll('button');
  expect(actionsButtons.length).toEqual(2);
};
