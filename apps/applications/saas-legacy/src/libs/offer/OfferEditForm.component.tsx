import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { withFormik, useFormikContext, FormikProps, Form } from 'formik';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  OFFER_EDIT_FORM_STEPS,
  PropagateCoachOverrideToSimilarOffers,
} from '#src/libs/offer/constants';
import { useOfferFormStyles } from '#src/libs/offer/hooks';

import EditOfferStepper from '#src/libs/offer/form/EditOfferStepper.component';
import FormSection from '#src/components/forms/FormSection';
import OfferEditFormValidationSchema from '#src/libs/offer/form/EditValidationSchema';
import OfferFormBanner from '#src/libs/offer/form/OfferFormBanner.component';
import OfferFormCoach from '#src/libs/offer/form/sections/OfferFormCoach.component';
import OfferFormDateTime from '#src/libs/offer/form/sections/OfferFormDateTime.component';
import OfferFormEditCoachOverride from '#src/libs/offer/form/sections/OfferFormEditCoachOverride.component';
import OfferFormEditSettings from '#src/libs/offer/form/sections/OfferFormEditSettings.component';
import OfferFormEditSimilarOffers from '#src/libs/offer/form/sections/OfferFormEditSimilarOffers.component';
import OfferFormSettings from '#src/libs/offer/form/sections/OfferFormSettings.component';
import OfferFormSkeleton from '#src/libs/offer/components/OfferFormSkeleton.component';
import OfferFormSpecificities from '#src/libs/offer/form/sections/OfferFormSpecificities.component';
import OfferFormTags from '#src/libs/offer/form/sections/OfferFormTags.component';
import OfferFormUpdateUSCWarning from '#src/libs/offer/form/OfferFormUpdateUSCWarning.component';

import SpotSchedulingHelper from '#src/libs/spot-scheduling/utils';

import type { Coach } from '#src/libs/associated-coach/types';
import type { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Level, LevelFilterSet } from '#src/libs/level/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Offer } from '#src/api/types';
import {
  Offer as SimilarOffer,
  OfferFormValues,
  OfferFilterData,
  OfferEdit,
  PartnerSpotCappingStrategy,
} from '#src/libs/offer/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import type { OptionCallback, OptionPaginatedCallback } from '#src/state/types';
import type { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { ZoomApp } from '#src/libs/zoom-app/types';

type ComponentProps = {
  metaActivity: MetaActivity<number>;
  isOfferInGroup?: boolean;
  activeCustomLevels?: Level[];
  allCustomLevels?: Level[];
  availableEstablishments: Establishment[];
  zoomAppDetail: ZoomApp;
  timezone: string;
  showPartnership: boolean;
  allowGuestMaster?: boolean;
  coaches: Coach[];
  editableCoachPaymentRule: boolean;
  coachPaymentRulesByKind: { [kind: number]: CoachPaymentRule[] };
  isWherebyIntegrationEnabled: boolean;
  roomBlueprints: RoomBlueprint[];
  tagList: Tag<TagGroup>[];
  processing: boolean;
  isLoading?: boolean;
  hideBanner?: boolean;
  onCancelText?: string;
  onSubmitText?: string;
  offer: Omit<Offer, 'whitelist_tags' | 'blacklist_tags'> & {
    group?: OffersGroup;
    coach: Coach;
    timezone_name: string;
    establishment: Establishment;
    meta_activity: MetaActivity;
    whitelist_tags: Tag[];
    blacklist_tags: Tag[];
    credits?: number;
    available_on_partnership: boolean;
  };
  metaActivities: MetaActivity[];
  similarOffersLoading: boolean;
  similarOffers: SimilarOffer[];
  createLevel?: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel?: (id: number, options?: OptionCallback) => void;
  fetchLevelList?: (
    params?: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  fetchSimilarOffers: (id: number, params?: OfferFilterData) => void;
  onBannerGoBack?: () => void;
  onCancel: () => void;
  updateLevel?: (
    id: number,
    data: Omit<Level, 'id'>,
    options: OptionCallback<Level>,
  ) => void;
};

type FormProps = {
  onSubmit: (data: { offerId: number; data: OfferEdit }) => void;
};

type Props = ComponentProps & FormikProps<OfferFormValues>;

export const OfferEditForm = (props: Props) => {
  const {
    metaActivity,
    isOfferInGroup,
    activeCustomLevels,
    allCustomLevels,
    availableEstablishments,
    zoomAppDetail,
    timezone,
    showPartnership,
    allowGuestMaster,
    coaches,
    editableCoachPaymentRule,
    coachPaymentRulesByKind,
    roomBlueprints,
    tagList,
    isWherebyIntegrationEnabled,
    processing,
    isLoading,
    hideBanner,
    onCancelText,
    onSubmitText,
    offer,
    metaActivities,
    similarOffers,
    similarOffersLoading,
    createLevel,
    deleteLevel,
    fetchLevelList,
    fetchSimilarOffers,
    onBannerGoBack,
    onCancel,
    updateLevel,
  } = props;

  const [editCurrentStep, setEditCurrentStep] = useState(
    OFFER_EDIT_FORM_STEPS.GATHER_INFO,
  );
  const [isUSCWarningModalDisplayed, setIsUSCWarningModalDisplayed] =
    useState(false);

  const { t } = useTranslation(['common', 'offer']);
  const classes = useOfferFormStyles();
  const { values, isValid, setFieldValue, handleSubmit, initialValues } =
    useFormikContext<OfferFormValues>();

  useEffect(() => {
    if (fetchSimilarOffers && offer?.id) {
      fetchSimilarOffers(offer.id);
    }
  }, [fetchSimilarOffers, offer?.id]);

  const isWarningStep = useMemo(
    () => editCurrentStep === OFFER_EDIT_FORM_STEPS.SHOW_WARNING,
    [editCurrentStep],
  );

  const handleDeleteLevel = useCallback(
    (deleteLevelId: number) => {
      deleteLevel(deleteLevelId, {
        onSuccess: () => {
          if (deleteLevelId === values.level) {
            setFieldValue('level', 1);
          }
          fetchLevelList();
        },
      });
    },
    [deleteLevel, fetchLevelList, setFieldValue, values.level],
  );

  const handleCancel = useCallback(() => {
    isWarningStep
      ? setEditCurrentStep(OFFER_EDIT_FORM_STEPS.GATHER_INFO)
      : onCancel();
  }, [isWarningStep, onCancel]);

  const shouldDisplayUSCWarningModal = useMemo(() => {
    if (!offer || (offer && !offer.usc_event_id)) {
      return false;
    }

    // Display if date_start changes
    if (
      values.dateIntervalStart.diff(initialValues.dateIntervalStart, 'seconds')
        .seconds !== 0
    ) {
      return true;
    }
    // Display if both establishments have different usc_location_id
    if (values.establishment && initialValues.establishment) {
      const previousUSCLocationId = availableEstablishments.find(
        (establishment) => establishment.id === initialValues.establishment,
      ).usc_location_id;
      const newUSCLocationId = availableEstablishments.find(
        (establishment) => establishment.id === values.establishment,
      ).usc_location_id;
      if (previousUSCLocationId !== newUSCLocationId) return true;
    }

    return false;
  }, [
    availableEstablishments,
    initialValues.dateIntervalStart,
    initialValues.establishment,
    offer,
    values.dateIntervalStart,
    values.establishment,
  ]);

  const handleNext = useCallback(
    (submitEvent: React.FormEvent<HTMLFormElement>) => {
      submitEvent.preventDefault();
      if (editCurrentStep === OFFER_EDIT_FORM_STEPS.GATHER_INFO && offer) {
        // if first step, trigger form validation first
        shouldDisplayUSCWarningModal
          ? setIsUSCWarningModalDisplayed(true)
          : setEditCurrentStep(OFFER_EDIT_FORM_STEPS.SHOW_WARNING);
      } else if (
        editCurrentStep === OFFER_EDIT_FORM_STEPS.SHOW_WARNING ||
        (editCurrentStep === OFFER_EDIT_FORM_STEPS.GATHER_INFO && !offer)
      ) {
        handleSubmit(submitEvent);
      }
    },
    [editCurrentStep, offer, handleSubmit, shouldDisplayUSCWarningModal],
  );

  const handleUSCWarningConfirm = useCallback(() => {
    setIsUSCWarningModalDisplayed(false);
    setEditCurrentStep(OFFER_EDIT_FORM_STEPS.SHOW_WARNING);
  }, []);

  const handleUSCWarningModalClose = useCallback(
    () => setIsUSCWarningModalDisplayed(false),
    [],
  );

  const submitButtonStartIcon = useMemo(() => {
    if (processing) {
      return <CircularProgress color="secondary" size={24} />;
    }
    return null;
  }, [processing]);

  const cancelButtonText = useMemo(() => {
    if (onCancelText) return onCancelText;
    if (editCurrentStep === OFFER_EDIT_FORM_STEPS.SHOW_WARNING) {
      return t('common:back');
    }
    return t('common:cancel');
  }, [editCurrentStep, onCancelText, t]);

  const submitButtonText = useMemo(() => {
    if (onSubmitText) return onSubmitText;
    if (editCurrentStep === OFFER_EDIT_FORM_STEPS.GATHER_INFO) {
      return t('common:next');
    }
    return t('common:saveRecord');
  }, [editCurrentStep, onSubmitText, t]);

  if (isLoading) {
    return (
      <div data-testid="offer-edit-form">
        <OfferFormSkeleton />
      </div>
    );
  }

  return (
    <Form noValidate data-testid="offer-edit-form" onSubmit={handleNext}>
      <OfferFormUpdateUSCWarning
        handleCancel={handleUSCWarningModalClose}
        handleConfirm={handleUSCWarningConfirm}
        isOpen={isUSCWarningModalDisplayed}
      />
      {!hideBanner && (
        <OfferFormBanner
          isEditOffer
          onBannerGoBack={onBannerGoBack}
          onCancel={onCancel}
          picture={offer?.meta_activity.cover_main ?? metaActivity?.cover_main}
        />
      )}

      <FormSection noPadding>
        <EditOfferStepper activeStep={editCurrentStep} />
      </FormSection>

      {isOfferInGroup && (
        <Alert
          className={classes.groupedOfferAlert}
          severity="error"
          variant="outlined"
        >
          {t('offer:form.groupedOffer.warning', {
            name: offer?.group.name,
            interpolation: { escapeValue: false },
          })}
        </Alert>
      )}
      {values?.is_hybrid && metaActivity?.is_broadcast && (
        <Alert className={classes.groupedOfferAlert} severity="info">
          {t('offer:form.section.specificities.field.hybridEditHelper')}
        </Alert>
      )}
      {isWarningStep && (
        <>
          <OfferFormEditSettings similarOffersLength={similarOffers?.length} />
          {values.isModifyRecursively && similarOffers?.length > 1 && (
            <>
              <OfferFormEditSimilarOffers
                coaches={coaches}
                offerCoach={offer?.coach}
                offerId={offer?.id}
                similarOffers={similarOffers}
                similarOffersLoading={similarOffersLoading}
              />
              {values.coachOverride && (
                <OfferFormEditCoachOverride
                  coaches={coaches}
                  offerCoachOverrideId={offer?.coach_override?.id}
                  offerId={offer?.id}
                  similarOffers={similarOffers}
                  similarOffersLoading={similarOffersLoading}
                />
              )}
            </>
          )}
        </>
      )}

      {!isWarningStep && (
        <>
          <OfferFormSpecificities
            isEditOffer
            activeCustomLevels={activeCustomLevels}
            allCustomLevels={allCustomLevels}
            availableEstablishments={availableEstablishments}
            createLevel={createLevel}
            deleteLevel={handleDeleteLevel}
            fetchLevelList={fetchLevelList}
            initialOfferCredits={offer?.credit_price}
            isBroadcast={metaActivity?.is_broadcast}
            isOfferInGroup={isOfferInGroup}
            isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
            metaActivities={metaActivities}
            metaActivity={metaActivity}
            roomBlueprints={roomBlueprints}
            updateLevel={updateLevel}
            zoomAppDetail={zoomAppDetail}
          />

          <OfferFormDateTime
            isEditOffer
            disabled={values.is_hybrid && offer?.meta_activity?.is_broadcast}
            isOfferInGroup={isOfferInGroup}
            timezone={offer?.timezone_name ?? timezone}
          />

          <OfferFormCoach
            isEditOffer
            coaches={coaches}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            disabled={values.is_hybrid && offer?.meta_activity?.is_broadcast}
            editableCoachPaymentRule={editableCoachPaymentRule}
            isWorkshop={metaActivity?.is_workshop}
          />

          <OfferFormSettings
            isEditOffer
            allowGuestMaster={allowGuestMaster}
            availableEstablishments={availableEstablishments}
            hasActivityGroup={!!props.offer?.group}
            isOfferInGroup={isOfferInGroup}
            roomBlueprints={roomBlueprints}
            showPartnership={showPartnership}
          />

          {!isOfferInGroup && <OfferFormTags tagList={tagList} />}
        </>
      )}
      <div className={classes.buttonsContainer} id="offer-edit-form-actions">
        <Button onClick={handleCancel}>{cancelButtonText}</Button>
        <Button
          color="primary"
          disabled={processing || !isValid}
          startIcon={submitButtonStartIcon}
          type="submit"
          variant="contained"
        >
          {submitButtonText}
        </Button>
      </div>
    </Form>
  );
};

const formikFormWrapper = withFormik<
  ComponentProps & FormProps,
  OfferFormValues
>({
  mapPropsToValues: (props: ComponentProps & FormProps) => ({
    allowGuestOffer: props.offer?.allow_guest_offer,
    availableOnPartnership: props.isOfferInGroup
      ? false
      : props.offer?.available_on_partnership,
    broadcastLink: props.offer?.broadcast_link,
    /* This value is only here to check if the custom name / description has changed. We use it to compare the field values to the  
    chosenMetaActivity.name and chosenMetaActivity.description */
    chosenMetaActivity: props.offer?.meta_activity,
    coach: props.offer?.coach.id,
    coachOverride: props.offer?.coach_override?.id ?? null,
    coachOverridePropagateMode:
      PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY,
    coachPaymentRule: props.offer?.coach_payment_rule_id ?? null,
    credits:
      props.offer?.credit_price !== undefined
        ? props.offer?.credit_price
        : props.offer?.credits,
    dateIntervalStart: props.offer
      ? DateTime.fromISO(props.offer.date_start)
      : DateTime.now(),
    descriptionOverride: props.offer?.description_override ?? '',
    durationMinute: props.offer?.duration_minute,
    effectif: props.offer?.effectif,
    establishment: props.offer?.establishment.id,
    is_hybrid: !!props.offer?.linked_hybrid_offer_id,
    isCoachOverridePropagate: true,
    isManagerOnly: props.offer?.manager_only,
    isMetaActivityBroadcast: !!props.offer?.meta_activity?.is_broadcast,
    isModifyRecursively: false,
    isNotifyConsumers: false,
    isOfferInGroup: props.isOfferInGroup,
    isShowPartnership: props.showPartnership,
    isZoomAppEnabled: false,
    level: props.offer?.custom_level,
    nameOverride: props.offer?.name_override ?? '',
    partnerMaxBookingCount: props.isOfferInGroup
      ? 0
      : props.offer?.partner_max_booking_count ?? 0,
    partnerSpotCappingStrategy:
      props.offer?.partner_spot_capping_strategy ??
      PartnerSpotCappingStrategy.COMBINED,
    roomBlueprint: props.offer?.room_blueprint ?? null,
    roomBlueprintSlots: SpotSchedulingHelper.getInitialRoomBlueprintSpots(
      props.offer?.room_blueprint ?? null,
      props.roomBlueprints,
    ),
    selectedBlacklistTags: props.offer?.blacklist_tags.map((tag) => tag.id),
    selectedMetaActivity: Number.isInteger(props.offer?.meta_activity)
      ? props.offer?.meta_activity
      : props.offer?.meta_activity.id,
    selectedSimilarOffers: props.similarOffers?.map((offer) => offer.id) ?? [],
    selectedWhitelistTags: props.offer?.whitelist_tags.map((tag) => tag.id),
    syncOfferOnSpivi: props.offer?.sync_on_spivi,
    waitingListMaxSize: props.offer?.waiting_list_max_size,
    wellhubProductId: props.offer?.wellhub_product_id,
    isWellhubProductRequired: false,
    partnershipOffers: props.offer?.partnership_offers ?? [],
  }),
  enableReinitialize: true,
  validationSchema: OfferEditFormValidationSchema,
  validateOnBlur: false,
  handleSubmit: (values, { props: { offer, similarOffers, onSubmit } }) => {
    const {
      allowGuestOffer,
      availableOnPartnership,
      broadcastLink,
      chosenMetaActivity,
      coach,
      coachOverride,
      coachOverridePropagateMode,
      coachPaymentRule,
      credits,
      dateIntervalStart,
      descriptionOverride,
      durationMinute,
      effectif,
      establishment,
      isCoachOverridePropagate,
      isManagerOnly,
      isModifyRecursively,
      isNotifyConsumers,
      isOfferInGroup,
      level,
      nameOverride,
      partnerMaxBookingCount,
      partnerSpotCappingStrategy,
      partnershipOffers,
      roomBlueprint,
      selectedBlacklistTags,
      selectedMetaActivity,
      selectedSimilarOffers,
      selectedWhitelistTags,
      syncOfferOnSpivi,
      waitingListMaxSize,
      wellhubProductId,
    } = values;

    const isAllSimilarOfferSelected =
      similarOffers.length === selectedSimilarOffers.length;

    const didNameOrDescriptionChange = !(
      nameOverride === chosenMetaActivity?.name &&
      descriptionOverride === chosenMetaActivity?.description
    );

    const sanitizedNameOverride = didNameOrDescriptionChange
      ? nameOverride
      : '';

    const sanitizedDescriptionOverride = didNameOrDescriptionChange
      ? descriptionOverride
      : '';

    let validatedPartnerMaxBookingCount = null;
    let validatedPartnershipOffers = partnershipOffers;
    switch (partnerSpotCappingStrategy) {
      case PartnerSpotCappingStrategy.COMBINED:
        validatedPartnerMaxBookingCount = isOfferInGroup
          ? 0
          : partnerMaxBookingCount;
        validatedPartnershipOffers = partnershipOffers.map(
          (partnershipOffer) => ({
            ...partnershipOffer,
            spot_limit: null,
          }),
        );
        break;
      case PartnerSpotCappingStrategy.UNLIMITED:
        validatedPartnerMaxBookingCount = null;
        validatedPartnershipOffers = partnershipOffers.map(
          (partnershipOffer) => ({
            ...partnershipOffer,
            spot_limit: null,
          }),
        );
        break;
      case PartnerSpotCappingStrategy.PER_PARTNER:
        validatedPartnerMaxBookingCount = null;
        break;
    }

    const offerData: OfferEdit = {
      allow_guest_offer: allowGuestOffer,
      available_on_partnership: availableOnPartnership,
      blacklist_tags: selectedBlacklistTags,
      broadcast_link: broadcastLink,
      coach_override: coachOverride ?? null,
      coach_payment_rule: coachPaymentRule,
      coach,
      custom_selection_ids: selectedSimilarOffers,
      custom_selection: isModifyRecursively,
      date_start: dateIntervalStart,
      description_override: sanitizedDescriptionOverride,
      duration_minute: durationMinute,
      effectif,
      establishment,
      id: offer.id,
      level,
      manager_only: isManagerOnly,
      meta_activity: selectedMetaActivity,
      modifyAllDates: isModifyRecursively && isAllSimilarOfferSelected,
      name_override: sanitizedNameOverride,
      notifyConsumers: isNotifyConsumers,
      partner_max_booking_count: validatedPartnerMaxBookingCount,
      partner_spot_capping_strategy: partnerSpotCappingStrategy,
      partnership_offers: validatedPartnershipOffers,
      propagate_coach_override_value: isCoachOverridePropagate
        ? coachOverridePropagateMode
        : PropagateCoachOverrideToSimilarOffers.NO_PROPAGATION,
      sync_on_spivi: syncOfferOnSpivi,
      waiting_list_max_size: waitingListMaxSize,
      wellhub_product_id: wellhubProductId,
      whitelist_tags: selectedWhitelistTags,
    };

    if (offer.credit_price !== undefined && credits !== offer.credit_price) {
      offerData.credit_price_override = credits;
    } else {
      offerData.credits = credits;
    }

    if (roomBlueprint) {
      offerData.room_blueprint = roomBlueprint;
    }

    onSubmit({ offerId: offer.id, data: offerData });
  },
});

export default React.memo(formikFormWrapper(OfferEditForm));
