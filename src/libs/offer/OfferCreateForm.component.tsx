import React, { useCallback, useEffect, useMemo } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withFormik, useFormikContext, FormikProps, Form } from 'formik';
import moment, { Moment } from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import OfferFormRecurrencePreview from '#libs/offer/form/OfferFormRecurrencePreview.dialog';
import OfferFormSkeleton from '#libs/offer/components/OfferFormSkeleton.component';
import OfferFormBanner from '#libs/offer/form/OfferFormBanner.component';
import OfferFormSpecificities from '#libs/offer/form/sections/OfferFormSpecificities.component';
import OfferFormDateTime from '#libs/offer/form/sections/OfferFormDateTime.component';
import OfferFormCoach from '#libs/offer/form/sections/OfferFormCoach.component';
import OfferFormSettings from '#libs/offer/form/sections/OfferFormSettings.component';
import OfferFormTags from '#libs/offer/form/sections/OfferFormTags.component';
import OfferFormCreationValidationSchema from '#libs/offer/form/CreationValidationSchema';
import { useOfferFormStyles } from '#libs/offer/hooks';
import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook';
import { getIsoWeekDay, getOfferRecurrenceDates } from '#libs/offer/utils';

import { OptionCallback, OptionPaginatedCallback } from '../../state/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level, LevelFilterSet } from '#libs/level/types';
import { Establishment } from '#libs/establishment/types';
import { ZoomApp } from '#libs/zoom-app/types';
import { Coach } from '#libs/associated-coach/types';
import { OfferCreate, OfferFormValues } from '#libs/offer/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#libs/tag/types';
import { OFFER_RECURRENCE } from '#libs/offer/constants';

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
  // @ts-ignore
  // eslint-disable-next-line
  creditScaleFactor: number;
};

type FormProps = {
  selectedDate: Moment;
  onSubmit: (data: OfferCreate) => void;
};

type Props = ComponentProps & FormikProps<OfferFormValues>;

export const OfferCreateForm = (props: Props) => {
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
    fetchLevelList,
    updateLevel,
    createLevel,
    deleteLevel,
    onCancel,
    onBannerGoBack,
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

  return (
    <Form noValidate data-testid="offer-form" onSubmit={handleSubmit}>
      <OfferFormRecurrencePreview timezone={timezone} />

      {!hideBanner && (
        <OfferFormBanner
          name={metaActivity?.name}
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
        isBroadcast={metaActivity?.is_broadcast}
        isOfferInGroup={isOfferInGroup}
        isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
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
    const isoWeekDay = getIsoWeekDay();
    return {
      allowGuestOffer: true,
      availableOnPartnership: !props.isOfferInGroup,
      broadcastLink: '',
      calendarSelectedDate: moment(props.selectedDate ?? undefined).format(),
      coach: null,
      coachPaymentRule: null,
      credits: 1,
      dateIntervalEnd: moment(props.selectedDate ?? undefined).add(1, 'day'),
      dateIntervalStart: moment(props.selectedDate ?? undefined).startOf('day'),
      dates: [],
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
      additionalCoaches: [],
      partnerMaxBookingCount: props.isOfferInGroup ? 0 : 6,
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
      roomBlueprint: null,
      roomBlueprintSlots: null,
      selectedBlacklistTags: [],
      selectedWhitelistTags: [],
      waitingListMaxSize: props.isOfferInGroup ? 0 : null,
    };
  },
  enableReinitialize: false,
  validationSchema: OfferFormCreationValidationSchema,
  validateOnBlur: false,
  handleSubmit: (
    values,
    { props: { timezone, creditScaleFactor, onSubmit } },
  ) => {
    const {
      level,
      effectif,
      partnerMaxBookingCount,
      waitingListMaxSize,
      establishment,
      roomBlueprint,
      coach,
      additionalCoaches,
      credits,
      durationMinute,
      broadcastLink,
      coachPaymentRule,
      availableOnPartnership,
      isManagerOnly,
      selectedWhitelistTags,
      selectedBlacklistTags,
      allowGuestOffer,
      is_hybrid,
      syncOfferOnSpivi,
    } = values;

    const offer: OfferCreate = {
      dates: getOfferRecurrenceDates(
        {
          recurrence: values.isRecurrence ? values.recurrence : null,
          recurrenceWeekDay: values.recurrenceWeekDay,
          dateIntervalStart: values.dateIntervalStart,
          dateIntervalEnd: values.dateIntervalEnd,
        },
        timezone,
      ).map((d: Moment) => d.unix()),
      establishment,
      coach,
      additional_coaches: additionalCoaches,
      effectif,
      partner_max_booking_count: partnerMaxBookingCount,
      waiting_list_max_size: waitingListMaxSize,
      level,
      credits: credits * (creditScaleFactor || 1),
      duration_minute: durationMinute,
      broadcast_link: broadcastLink,
      coach_payment_rule: coachPaymentRule,
      available_on_partnership: availableOnPartnership,
      manager_only: isManagerOnly,
      whitelist_tags: selectedWhitelistTags,
      blacklist_tags: selectedBlacklistTags,
      allow_guest_offer: allowGuestOffer,
      is_hybrid,
      sync_on_spivi: syncOfferOnSpivi,
    };

    if (roomBlueprint) {
      offer.room_blueprint = roomBlueprint;
    }

    onSubmit(offer);
  },
});

export default formikFormWrapper(OfferCreateForm);
