import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { withFormik, useFormikContext, FormikProps, Form } from 'formik';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import OfferFormSkeleton from '#libs/offer/components/OfferFormSkeleton.component';
import OfferFormBanner from '#libs/offer/form/OfferFormBanner.component';
import OfferFormSpecificities from '#libs/offer/form/sections/OfferFormSpecificities.component';
import OfferFormDateTime from '#libs/offer/form/sections/OfferFormDateTime.component';
import OfferFormCoach from '#libs/offer/form/sections/OfferFormCoach.component';
import OfferFormSettings from '#libs/offer/form/sections/OfferFormSettings.component';
import OfferFormTags from '#libs/offer/form/sections/OfferFormTags.component';
import OfferEditFormValidationSchema from '#libs/offer/form/EditValidationSchema';
import FormSection from '#components/forms/FormSection';
import OfferFormEditSettings from '#libs/offer/form/sections/OfferFormEditSettings.component';
import OfferFormEditCoachOverride from '#libs/offer/form/sections/OfferFormEditCoachOverride.component';
import OfferFormEditSimilarOffers from '#libs/offer/form/sections/OfferFormEditSimilarOffers.component';
import EditOfferStepper from '#libs/offer/form/EditOfferStepper.component';
import { useOfferFormStyles } from '#libs/offer/hooks';

import { OptionCallback, OptionPaginatedCallback } from '../../state/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level, LevelFilterSet } from '#libs/level/types';
import { Establishment } from '#libs/establishment/types';
import { ZoomApp } from '#libs/zoom-app/types';
import { Coach } from '#libs/associated-coach/types';
import {
  Offer as SimilarOffer,
  OfferFormValues,
  OfferFilterData,
  OfferEdit,
} from '#libs/offer/types';
import { Offer } from '../../api/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#libs/tag/types';
import {
  OFFER_EDIT_FORM_STEPS,
  PropagateCoachOverrideToSimilarOffers,
} from '#libs/offer/constants';
import { OffersGroup } from '#libs/group-offer/types';

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
  const { values, errors, setFieldValue, handleSubmit, validateForm } =
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
        validateForm().then(() => {
          if (!Object.keys(errors).length) {
            setEditCurrentStep(OFFER_EDIT_FORM_STEPS.SHOW_WARNING);
          }
        });
      } else {
        handleSubmit(submitEvent);
      }
    },
    [editCurrentStep, offer, errors, handleSubmit, validateForm],
  );

  const submitButtonStartIcon = useMemo(() => {
    if (processing) {
      return <CircularProgress size={24} color="secondary" />;
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
    <Form onSubmit={handleNext} data-testid="offer-edit-form" noValidate>
      {!hideBanner && (
        <OfferFormBanner
          name={offer?.meta_activity.name ?? metaActivity?.name}
          picture={offer?.meta_activity.cover_main ?? metaActivity?.cover_main}
          isEditOffer
          onCancel={onCancel}
          onBannerGoBack={onBannerGoBack}
        />
      )}

      <FormSection noPadding>
        <EditOfferStepper activeStep={editCurrentStep} />
      </FormSection>

      {isOfferInGroup && (
        <Alert
          severity="error"
          variant="outlined"
          className={classes.groupedOfferAlert}
        >
          {t('offer:form.groupedOffer.warning', {
            name: offer?.group.name,
          })}
        </Alert>
      )}
      {values?.is_hybrid && metaActivity?.is_broadcast && (
        <Alert severity="info" className={classes.groupedOfferAlert}>
          {t('offer:form.section.specificities.field.hybridEditHelper')}
        </Alert>
      )}
      {isWarningStep && (
        <>
          <OfferFormEditSettings similarOffersLength={similarOffers?.length} />
          {values.isModifyRecursively && similarOffers?.length > 1 && (
            <>
              <OfferFormEditSimilarOffers
                similarOffers={similarOffers}
                similarOffersLoading={similarOffersLoading}
                coaches={coaches}
                offerCoach={offer?.coach}
                offerId={offer?.id}
              />
              {values.coachOverride && (
                <OfferFormEditCoachOverride
                  similarOffers={similarOffers}
                  similarOffersLoading={similarOffersLoading}
                  coaches={coaches}
                  offerId={offer?.id}
                  offerCoachOverrideId={offer?.coach_override?.id}
                />
              )}
            </>
          )}
        </>
      )}

      {!isWarningStep && (
        <>
          <OfferFormSpecificities
            activeCustomLevels={activeCustomLevels}
            allCustomLevels={allCustomLevels}
            availableEstablishments={availableEstablishments}
            isBroadcast={metaActivity?.is_broadcast}
            isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
            zoomAppDetail={zoomAppDetail}
            roomBlueprints={roomBlueprints}
            isOfferInGroup={isOfferInGroup}
            isEditOffer
            metaActivities={metaActivities}
            initialOfferCredits={offer?.credit_price}
            updateLevel={updateLevel}
            createLevel={createLevel}
            deleteLevel={handleDeleteLevel}
            fetchLevelList={fetchLevelList}
          />

          <OfferFormDateTime
            timezone={offer?.timezone_name ?? timezone}
            isOfferInGroup={isOfferInGroup}
            isEditOffer
            disabled={values.is_hybrid && offer?.meta_activity?.is_broadcast}
          />

          <OfferFormCoach
            coaches={coaches}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            editableCoachPaymentRule={editableCoachPaymentRule}
            isEditOffer
            disabled={values.is_hybrid && offer?.meta_activity?.is_broadcast}
            isWorkshop={metaActivity?.is_workshop}
          />

          <OfferFormSettings
            allowGuestMaster={allowGuestMaster}
            showPartnership={showPartnership}
            isOfferInGroup={isOfferInGroup}
            isEditOffer
          />

          {!isOfferInGroup && <OfferFormTags tagList={tagList} />}
        </>
      )}
      <div className={classes.buttonsContainer} id="offer-edit-form-actions">
        <Button onClick={handleCancel}>{cancelButtonText}</Button>
        <Button
          disabled={processing}
          variant="contained"
          color="primary"
          type="submit"
          startIcon={submitButtonStartIcon}
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
    coach: props.offer?.coach.id,
    coachOverride: props.offer?.coach_override?.id ?? null,
    coachOverridePropagateMode:
      PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY,
    coachPaymentRule: props.offer?.coach_payment_rule_id ?? null,
    credits:
      props.offer?.credit_price !== undefined
        ? props.offer?.credit_price
        : props.offer?.credits,
    dateIntervalStart: moment(props.offer?.date_start),
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
    roomBlueprintSlots: null,
    selectedBlacklistTags: props.offer?.blacklist_tags.map((tag) => tag.id),
    selectedMetaActivity: props.offer?.meta_activity.id,
    selectedSimilarOffers: props.similarOffers?.map((offer) => offer.id) ?? [],
    selectedWhitelistTags: props.offer?.whitelist_tags.map((tag) => tag.id),
    waitingListMaxSize: props.offer?.waiting_list_max_size,
    is_hybrid: !!props.offer?.linked_hybrid_offer_id,
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
      selectedMetaActivity,
      isModifyRecursively,
      dateIntervalStart,
      selectedSimilarOffers,
      coachOverridePropagateMode,
      isCoachOverridePropagate,
      partnerMaxBookingCount,
      isOfferInGroup,
    } = values;

    const isAllSimilarOfferSelected =
      similarOffers.length === selectedSimilarOffers.length;

    const offerData: OfferEdit = {
      establishment,
      coach,
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

export default formikFormWrapper(OfferEditForm);
