import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { withFormik, useFormikContext, FormikProps, Form } from 'formik';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import OfferFormSkeleton from '#src/libs/offer/components/OfferFormSkeleton.component';
import OfferFormBanner from '#src/libs/offer/form/OfferFormBanner.component';
import OfferFormSpecificities from '#src/libs/offer/form/sections/OfferFormSpecificities.component';
import OfferFormDateTime from '#src/libs/offer/form/sections/OfferFormDateTime.component';
import OfferFormCoach from '#src/libs/offer/form/sections/OfferFormCoach.component';
import OfferFormSettings from '#src/libs/offer/form/sections/OfferFormSettings.component';
import OfferFormTags from '#src/libs/offer/form/sections/OfferFormTags.component';
import OfferEditFormValidationSchema from '#src/libs/offer/form/EditValidationSchema';
import FormSection from '#src/components/forms/FormSection';
import OfferFormEditSettings from '#src/libs/offer/form/sections/OfferFormEditSettings.component';
import OfferFormEditCoachOverride from '#src/libs/offer/form/sections/OfferFormEditCoachOverride.component';
import OfferFormEditSimilarOffers from '#src/libs/offer/form/sections/OfferFormEditSimilarOffers.component';
import EditOfferStepper from '#src/libs/offer/form/EditOfferStepper.component';
import { useOfferFormStyles } from '#src/libs/offer/hooks';

import { MetaActivity } from '#src/libs/meta-activity/types';
import { Level, LevelFilterSet } from '#src/libs/level/types';
import { Establishment } from '#src/libs/establishment/types';
import { ZoomApp } from '#src/libs/zoom-app/types';
import { Coach } from '#src/libs/associated-coach/types';
import {
  Offer as SimilarOffer,
  OfferFormValues,
  OfferFilterData,
  OfferEdit,
} from '#src/libs/offer/types';
import { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#src/libs/tag/types';
import {
  OFFER_EDIT_FORM_STEPS,
  PropagateCoachOverrideToSimilarOffers,
} from '#src/libs/offer/constants';
import { OffersGroup } from '#src/libs/group-offer/types';
import SpotSchedulingHelper from '#src/libs/spot-scheduling/utils';
import { Offer } from '../../api/types';
import { OptionCallback, OptionPaginatedCallback } from '#src/state/types';

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
    additional_coaches: Coach[];
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
  fetchLevelList?: (
    params?: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  updateLevel?: (
    id: number,
    data: Omit<Level, 'id'>,
    options: OptionCallback<Level>,
  ) => void;
  createLevel?: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel?: (id: number, options?: OptionCallback) => void;
  onCancel: () => void;
  onBannerGoBack?: () => void;
  fetchSimilarOffers: (id: number, params?: OfferFilterData) => void;
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
    fetchSimilarOffers,
    fetchLevelList,
    updateLevel,
    createLevel,
    deleteLevel,
    onCancel,
    onBannerGoBack,
  } = props;

  const [editCurrentStep, setEditCurrentStep] = useState(
    OFFER_EDIT_FORM_STEPS.GATHER_INFO,
  );
  const { t } = useTranslation(['common', 'offer']);
  const classes = useOfferFormStyles();
  const { values, isValid, setFieldValue, handleSubmit } =
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

  const handleNext = useCallback(
    (submitEvent: React.FormEvent<HTMLFormElement>) => {
      submitEvent.preventDefault();
      if (editCurrentStep === OFFER_EDIT_FORM_STEPS.GATHER_INFO && offer) {
        // if first step, trigger form validation first
        setEditCurrentStep(OFFER_EDIT_FORM_STEPS.SHOW_WARNING);
      } else {
        handleSubmit(submitEvent);
      }
    },
    [editCurrentStep, offer, handleSubmit],
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
            hasActivityGroup={!!props.offer?.group}
            isOfferInGroup={isOfferInGroup}
            isWorkshop={metaActivity?.is_workshop}
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
    additionalCoaches:
      props.offer?.additional_coaches?.map((coach) => coach?.id) ?? [],
    allowGuestOffer: props.offer?.allow_guest_offer,
    availableOnPartnership: props.isOfferInGroup
      ? false
      : props.offer?.available_on_partnership,
    broadcastLink: props.offer?.broadcast_link,
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
    durationMinute: props.offer?.duration_minute,
    effectif: props.offer?.effectif,
    establishment: props.offer?.establishment.id,
    isCoachOverridePropagate: true,
    isManagerOnly: props.offer?.manager_only,
    isMetaActivityBroadcast: !!props.offer?.broadcast_link,
    isModifyRecursively: false,
    isNotifyConsumers: false,
    isOfferInGroup: props.isOfferInGroup,
    isShowPartnership: props.showPartnership,
    isZoomAppEnabled: false,
    level: props.offer?.custom_level,
    partnerMaxBookingCount: props.isOfferInGroup
      ? 0
      : props.offer?.partner_max_booking_count ?? 0,
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
    waitingListMaxSize: props.offer?.waiting_list_max_size,
    is_hybrid: !!props.offer?.linked_hybrid_offer_id,
    syncOfferOnSpivi: props.offer?.sync_on_spivi,
    nameOverride: props.offer?.name_override ?? '',
    descriptionOverride: props.offer?.description_override ?? '',
    /* This value is only here to check if the custom name / description has changed. We use it to compare the field values to the  
    chosenMetaActivity.name and chosenMetaActivity.description */
    chosenMetaActivity: props.offer?.meta_activity,
  }),
  enableReinitialize: true,
  validationSchema: OfferEditFormValidationSchema,
  validateOnBlur: false,
  handleSubmit: (values, { props: { offer, similarOffers, onSubmit } }) => {
    const {
      level,
      effectif,
      waitingListMaxSize,
      establishment,
      roomBlueprint,
      coach,
      additionalCoaches,
      credits,
      durationMinute,
      broadcastLink,
      coachPaymentRule,
      coachOverride,
      availableOnPartnership,
      isManagerOnly,
      selectedWhitelistTags,
      selectedBlacklistTags,
      allowGuestOffer,
      isNotifyConsumers,
      isModifyRecursively,
      dateIntervalStart,
      selectedSimilarOffers,
      coachOverridePropagateMode,
      isCoachOverridePropagate,
      selectedMetaActivity,
      partnerMaxBookingCount,
      isOfferInGroup,
      syncOfferOnSpivi,
      nameOverride,
      descriptionOverride,
      chosenMetaActivity,
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

    const offerData: OfferEdit = {
      establishment,
      coach,
      additional_coaches: additionalCoaches,
      effectif,
      waiting_list_max_size: waitingListMaxSize,
      level,
      duration_minute: durationMinute,
      broadcast_link: broadcastLink,
      coach_payment_rule: coachPaymentRule,
      available_on_partnership: availableOnPartnership,
      manager_only: isManagerOnly,
      whitelist_tags: selectedWhitelistTags,
      blacklist_tags: selectedBlacklistTags,
      allow_guest_offer: allowGuestOffer,

      id: offer.id,
      notifyConsumers: isNotifyConsumers,
      modifyAllDates: isModifyRecursively && isAllSimilarOfferSelected,
      coach_override: coachOverride ?? null,
      custom_selection: isModifyRecursively,
      custom_selection_ids: selectedSimilarOffers,
      propagate_coach_override_value: isCoachOverridePropagate
        ? coachOverridePropagateMode
        : PropagateCoachOverrideToSimilarOffers.NO_PROPAGATION,
      meta_activity: selectedMetaActivity,
      date_start: dateIntervalStart,
      partner_max_booking_count: isOfferInGroup ? 0 : partnerMaxBookingCount,
      sync_on_spivi: syncOfferOnSpivi,
      name_override: sanitizedNameOverride,
      description_override: sanitizedDescriptionOverride,
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
