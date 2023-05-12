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
import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook ';
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
  const { values, isValid, dirty, setFieldValue, setErrors, handleSubmit } =
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
      return <CircularProgress size={24} color="secondary" />;
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
    <Form onSubmit={handleSubmit} data-testid="offer-form" noValidate>
      <OfferFormRecurrencePreview timezone={timezone} />

      {!hideBanner && (
        <OfferFormBanner
          name={metaActivity?.name}
          picture={metaActivity?.cover_main}
          onCancel={onCancel}
          onBannerGoBack={onBannerGoBack}
        />
      )}

      <OfferFormSpecificities
        activeCustomLevels={activeCustomLevels}
        allCustomLevels={allCustomLevels}
        availableEstablishments={availableEstablishments}
        isBroadcast={metaActivity?.is_broadcast}
        isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
        zoomAppDetail={zoomAppDetail}
        roomBlueprints={roomBlueprints}
        isOfferInGroup={isOfferInGroup}
        updateLevel={updateLevel}
        createLevel={createLevel}
        deleteLevel={handleDeleteLevel}
        fetchLevelList={fetchLevelList}
      />

      <OfferFormDateTime timezone={timezone} isOfferInGroup={isOfferInGroup} />

      <OfferFormCoach
        coaches={coaches}
        coachPaymentRulesByKind={coachPaymentRulesByKind}
        editableCoachPaymentRule={editableCoachPaymentRule}
      />

      {!isOfferInGroup && (
        <OfferFormSettings
          allowGuestMaster={allowGuestMaster}
          showPartnership={showPartnership}
          isOfferInGroup={isOfferInGroup}
        />
      )}

      {!isOfferInGroup && <OfferFormTags tagList={tagList} />}

      <div className={classes.buttonsContainer} id="offer-form-actions">
        <Button onClick={onCancel}>{onCancelText ?? t('cancel')}</Button>
        <Button
          disabled={processing || !isValid || !dirty}
          variant="contained"
          color="primary"
          type="submit"
          startIcon={submitButtonStartIcon}
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
      dates: [],
      effectif: null,
      waitingListMaxSize: props.isOfferInGroup ? 0 : null,
      level: 1,
      establishment: null,
      broadcastLink: '',
      credits: 1,
      dateIntervalStart: moment(props.selectedDate ?? undefined).startOf('day'),
      dateIntervalEnd: moment(props.selectedDate ?? undefined).add(1, 'day'),
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
      calendarSelectedDate: moment(props.selectedDate ?? undefined).format(),
      isRecurrenceWeekDayDialogOpen: false,
      coach: null,
      coachPaymentRule: null,
      isManagerOnly: false,
      allowGuestOffer: true,
      partnerMaxBookingCount: props.isOfferInGroup ? 0 : 6,
      availableOnPartnership: !props.isOfferInGroup,
      selectedWhitelistTags: [],
      selectedBlacklistTags: [],
      roomBlueprint: null,
      roomBlueprintSlots: null,
      isMetaActivityBroadcast: props.metaActivity?.is_broadcast,
      isZoomAppEnabled: false,
      isOfferInGroup: props.isOfferInGroup,
      isShowPartnership: props.showPartnership,
    };
  },
  enableReinitialize: true,
  validationSchema: OfferFormCreationValidationSchema,
  validateOnBlur: false,
  handleSubmit: (values, { props: { timezone, onSubmit } }) => {
    const {
      level,
      effectif,
      partnerMaxBookingCount,
      waitingListMaxSize,
      establishment,
      roomBlueprint,
      coach,
      credits,
      durationMinute,
      broadcastLink,
      coachPaymentRule,
      availableOnPartnership,
      isManagerOnly,
      selectedWhitelistTags,
      selectedBlacklistTags,
      allowGuestOffer,
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
      effectif,
      partner_max_booking_count: partnerMaxBookingCount,
      waiting_list_max_size: waitingListMaxSize,
      level,
      credits,
      duration_minute: durationMinute,
      broadcast_link: broadcastLink,
      coach_payment_rule: coachPaymentRule,
      available_on_partnership: availableOnPartnership,
      manager_only: isManagerOnly,
      whitelist_tags: selectedWhitelistTags,
      blacklist_tags: selectedBlacklistTags,
      allow_guest_offer: allowGuestOffer,
    };

    if (roomBlueprint) {
      offer.room_blueprint = roomBlueprint;
    }

    onSubmit(offer);
  },
});

export default formikFormWrapper(OfferCreateForm);
