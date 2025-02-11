import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { withFormik, useFormikContext, FormikProps, Form } from 'formik';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import OfferFormBanner from '#src/libs/offer/form/OfferFormBanner.component';
import OfferFormCoach from '#src/libs/offer/form/sections/OfferFormCoach.component';
import OfferFormDateTime from '#src/libs/offer/form/sections/OfferFormDateTime.component';
import OfferFormRecurrencePreview from '#src/libs/offer/form/OfferFormRecurrencePreview.dialog';
import OfferFormSettings from '#src/libs/offer/form/sections/OfferFormSettings.component';
import OfferFormSkeleton from '#src/libs/offer/components/OfferFormSkeleton.component';
import OfferFormSpecificities from '#src/libs/offer/form/sections/OfferFormSpecificities.component';
import OfferFormTags from '#src/libs/offer/form/sections/OfferFormTags.component';

import { getCreditFactor } from '#src/libs/theme/selectors';
import { getOfferRecurrenceDates } from '#src/libs/offer/utils';
import { useOfferFormStyles } from '#src/libs/offer/hooks';
import useFeaturesProvider from '#src/libs/company/hooks/feature-list-provider.hook';

import { OFFER_RECURRENCE } from '#src/libs/offer/constants';
import OfferFormCreationValidationSchema from '#src/libs/offer/form/CreationValidationSchema';

import type { Coach } from '#src/libs/associated-coach/types';
import type { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Level, LevelFilterSet } from '#src/libs/level/types';
import type { LuxonDateTime } from '#src/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { OfferCreate, OfferFormValues } from '#src/libs/offer/types';
import type { OptionCallback, OptionPaginatedCallback } from '#src/state/types';
import type { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { ZoomApp } from '#src/libs/zoom-app/types';

type ComponentProps = {
  metaActivity: MetaActivity<number>;
  metaActivities?: MetaActivity[];
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
  hideActivitySection?: boolean;
  onCancelText?: string;
  isForbidden?: boolean;
  createLevel?: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel?: (id: number, options?: OptionCallback) => void;
  fetchLevelList?: (
    params?: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  onBannerGoBack?: () => void;
  onCancel: () => void;
  onSelectMetaActivity?: (activity: MetaActivity) => void;
  updateLevel?: (
    id: number,
    data: Omit<Level, 'id'>,
    options: OptionCallback<Level>,
  ) => void;
};

type FormProps = {
  selectedDate: LuxonDateTime;
  onSubmit: (data: OfferCreate) => void;
};

type Props = ComponentProps & FormikProps<OfferFormValues>;

const ForbiddenLayout: FC<{
  buttonsContainerClassName: string;
  alertClassName: string;
  className: string;
  nextText: string;
  onCancel: () => void;
  warningText: string;
}> = React.memo((props) => (
  <div className={props.className}>
    <Alert className={props.alertClassName} severity="warning">
      {props.warningText}
    </Alert>
    <div className={props.buttonsContainerClassName}>
      <Button color="primary" onClick={props.onCancel}>
        {props.nextText}
      </Button>
    </div>
  </div>
));

export const OfferCreateForm = (props: Props) => {
  const {
    metaActivity,
    metaActivities,
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
    hideActivitySection,
    onCancelText,
    createLevel,
    deleteLevel,
    fetchLevelList,
    onBannerGoBack,
    onCancel,
    onSelectMetaActivity,
    updateLevel,
  } = props;
  const { t } = useTranslation('common');
  const classes = useOfferFormStyles();
  const { values, isValid, setFieldValue, setErrors, handleSubmit } =
    useFormikContext<OfferFormValues>();
  const { zoomAppEnabled } = useFeaturesProvider();

  useEffect(() => {
    setFieldValue('isZoomAppEnabled', zoomAppEnabled, false);
  }, [setFieldValue, setErrors, showPartnership, zoomAppEnabled]);

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

  const submitButtonStartIcon = useMemo(() => {
    if (processing) {
      return <CircularProgress color="secondary" size={24} />;
    }
    return null;
  }, [processing]);

  if (isLoading) {
    return (
      <div data-testid="offer-form">
        <OfferFormSkeleton />
      </div>
    );
  }

  if (props?.isForbidden) {
    return (
      <ForbiddenLayout
        alertClassName={classes.alert}
        buttonsContainerClassName={classes.buttonsContainer}
        className={classes.forbiddenStepContainer}
        nextText={t('next')}
        onCancel={onCancel}
        warningText={t('offer:form.forbidden')}
      />
    );
  }

  return (
    <Form noValidate data-testid="offer-form" onSubmit={handleSubmit}>
      <OfferFormRecurrencePreview timezone={timezone} />

      {!hideBanner && (
        <OfferFormBanner
          onBannerGoBack={onBannerGoBack}
          onCancel={onCancel}
          picture={metaActivity?.cover_main}
        />
      )}

      <OfferFormSpecificities
        activeCustomLevels={activeCustomLevels}
        allCustomLevels={allCustomLevels}
        availableEstablishments={availableEstablishments}
        createLevel={createLevel}
        deleteLevel={handleDeleteLevel}
        fetchLevelList={fetchLevelList}
        hideActivitySection={hideActivitySection}
        isBroadcast={metaActivity?.is_broadcast}
        isOfferInGroup={isOfferInGroup}
        isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
        metaActivities={metaActivities}
        metaActivity={metaActivity}
        onSelectMetaActivity={onSelectMetaActivity}
        roomBlueprints={roomBlueprints}
        updateLevel={updateLevel}
        zoomAppDetail={zoomAppDetail}
      />

      <OfferFormDateTime isOfferInGroup={isOfferInGroup} timezone={timezone} />

      <OfferFormCoach
        coaches={coaches}
        coachPaymentRulesByKind={coachPaymentRulesByKind}
        editableCoachPaymentRule={editableCoachPaymentRule}
        isWorkshop={metaActivity?.is_workshop}
      />

      {!isOfferInGroup && (
        <OfferFormSettings
          allowGuestMaster={allowGuestMaster}
          availableEstablishments={availableEstablishments}
          isOfferInGroup={isOfferInGroup}
          roomBlueprints={roomBlueprints}
          showPartnership={showPartnership}
        />
      )}

      {!isOfferInGroup && <OfferFormTags tagList={tagList} />}

      <div className={classes.buttonsContainer} id="offer-form-actions">
        <Button onClick={onCancel}>{onCancelText ?? t('cancel')}</Button>
        <Button
          color="primary"
          disabled={processing || !isValid}
          startIcon={submitButtonStartIcon}
          type="submit"
          variant="contained"
        >
          {t('saveRecord')}
        </Button>
      </div>
    </Form>
  );
};

const formikFormWrapper = withFormik<
  ComponentProps & FormProps,
  OfferFormValues
>({
  mapPropsToValues: (props: ComponentProps & FormProps) => {
    const sanitizedSelectedDate =
      props.selectedDate && props.selectedDate.isValid
        ? props.selectedDate
        : DateTime.now();

    const dateIntervalStart = sanitizedSelectedDate.startOf('day');

    const recurrenceIsoWeekDay = dateIntervalStart.weekday;
    return {
      allowGuestOffer: true,
      availableOnPartnership: !props.isOfferInGroup,
      broadcastLink: '',
      calendarSelectedDate: sanitizedSelectedDate.toISO(),
      coach: null,
      coachPaymentRule: null,
      // Initial credits value is set to the creditFactor so that the helperText beneath the credit input displays exactly one credit
      credits: getCreditFactor(),
      dateIntervalEnd: sanitizedSelectedDate.plus({ day: 1 }),
      dateIntervalStart,
      dates: [],
      descriptionOverride: '',
      durationMinute: 60,
      effectif: null,
      establishment: null,
      is_hybrid: false,
      isManagerOnly: false,
      isMetaActivityBroadcast: props.metaActivity?.is_broadcast,
      isOfferInGroup: props.isOfferInGroup,
      isRecurrence: false,
      isRecurrenceWeekDayDialogOpen: false,
      isShowPartnership: props.showPartnership,
      isZoomAppEnabled: false,
      level: 1,
      nameOverride: '',
      partnerMaxBookingCount: props.isOfferInGroup ? 0 : 6,
      recurrence: OFFER_RECURRENCE.WEEKLY,
      recurrenceWeekDay: {
        '1': recurrenceIsoWeekDay === 1,
        '2': recurrenceIsoWeekDay === 2,
        '3': recurrenceIsoWeekDay === 3,
        '4': recurrenceIsoWeekDay === 4,
        '5': recurrenceIsoWeekDay === 5,
        '6': recurrenceIsoWeekDay === 6,
        '7': recurrenceIsoWeekDay === 7,
      },
      roomBlueprint: null,
      roomBlueprintSlots: null,
      selectedBlacklistTags: [],
      selectedMetaActivity: props.metaActivity?.id,
      selectedWhitelistTags: [],
      waitingListMaxSize: props.isOfferInGroup ? 0 : null,
      wellhubProductId: null,
      isWellhubProductRequired: false,
    };
  },
  enableReinitialize: false,
  validationSchema: OfferFormCreationValidationSchema,
  validateOnBlur: false,
  handleSubmit: (values, { props: { timezone, onSubmit, metaActivity } }) => {
    const {
      allowGuestOffer,
      availableOnPartnership,
      broadcastLink,
      coach,
      coachPaymentRule,
      credits,
      descriptionOverride,
      durationMinute,
      effectif,
      establishment,
      is_hybrid,
      isManagerOnly,
      level,
      nameOverride,
      partnerMaxBookingCount,
      roomBlueprint,
      selectedBlacklistTags,
      selectedWhitelistTags,
      syncOfferOnSpivi,
      waitingListMaxSize,
      wellhubProductId,
    } = values;

    const didNameOrDescriptionChange = !(
      nameOverride === metaActivity?.name &&
      descriptionOverride === metaActivity?.description
    );

    const sanitizedNameOverride = didNameOrDescriptionChange
      ? nameOverride
      : '';

    const sanitizedDescriptionOverride = didNameOrDescriptionChange
      ? descriptionOverride
      : '';

    const offer: OfferCreate = {
      allow_guest_offer: allowGuestOffer,
      available_on_partnership: availableOnPartnership,
      blacklist_tags: selectedBlacklistTags,
      broadcast_link: broadcastLink,
      coach_payment_rule: coachPaymentRule,
      coach,
      credits: credits,
      dates: getOfferRecurrenceDates(
        {
          recurrence: values.isRecurrence ? values.recurrence : null,
          recurrenceWeekDay: values.recurrenceWeekDay,
          dateIntervalStart: values.dateIntervalStart,
          dateIntervalEnd: values.dateIntervalEnd,
        },
        timezone,
      ).map((d: LuxonDateTime) => d.toUnixInteger()),
      description_override: sanitizedDescriptionOverride,
      duration_minute: durationMinute,
      effectif,
      establishment,
      is_hybrid,
      level,
      manager_only: isManagerOnly,
      name_override: sanitizedNameOverride,
      partner_max_booking_count: partnerMaxBookingCount,
      sync_on_spivi: syncOfferOnSpivi,
      waiting_list_max_size: waitingListMaxSize,
      whitelist_tags: selectedWhitelistTags,
      wellhub_product_id: wellhubProductId,
    };

    if (roomBlueprint) {
      offer.room_blueprint = roomBlueprint;
    }

    onSubmit(offer);
  },
});

export default React.memo(formikFormWrapper(OfferCreateForm));
