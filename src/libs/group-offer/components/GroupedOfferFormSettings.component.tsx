import React, { useState, useEffect, useCallback } from 'react';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps, Field, FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import DateRangeIcon from '@material-ui/icons/DateRange';
import RefreshIcon from '@material-ui/icons/Refresh';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import InfoIcon from '@material-ui/icons/Info';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  Collapse,
  Divider,
  FormLabel,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Theme,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert } from '@material-ui/lab';
import useFeaturesProvider from '#src/libs/company/hooks/feature-list-provider.hook';

import {
  TextField,
  Submit,
  SwitchField,
  DateField,
  CheckboxField,
  IntegerField,
  AlertError,
  IntervalRecurrenceSelectField,
  // @ts-expect-error
} from '#src/components/forms';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import OfferCreateForm from '#src/libs/offer/OfferCreateForm.component';
import OfferEditForm from '#src/libs/offer/OfferEditForm.component';

import { CompanyTheme } from '#src/libs/theme/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { Offer } from '#src/libs/offer/types';
import CoachAvatar from '#src/libs/associated-coach/components/CoachAvatar.component';
import {
  FREQUENCE_NUMBER_CONVERTER,
  FREQUENCE_STRING_CONVERTER,
  getDisplayDateFromRecurrence,
} from '#src/libs/group-offer/utils';
import LevelSelectorFormik from '#src/libs/level/components/LevelSelectorFormik.component';
import { Level } from '#src/libs/level/types';
import ManagerOnlyToggle from '#src/libs/offer/form/ManagerOnlyToggle.component';
import BlackWhiteListing from '#src/libs/offer/BlackWhiteListing.component';
import FormToggle from '#src/components/forms/FormToggle.component';
import { ZoomApp } from '#src/libs/zoom-app/types';
import Tooltip from '#src/components/Tooltip.component';
import { AdditionalCoachesTooltipTitle } from '#src/libs/associated-coach/components/CoachToolTip.component';
import { OptionCallback } from '../../../state/types';

type OuterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: OffersGroup<Offer>;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (arg1: { values: Values; options: OptionCallback }) => void;

  coaches: Array<Coach>;
  availableEstablishments: Array<Establishment>;
  allEstablishments: Array<Establishment>;
  metaActivity: MetaActivity;
  availableRoomBlueprints: RoomBlueprint[];
  allRoomBlueprints: RoomBlueprint[];
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  tagList: Array<Tag<TagGroup>>;
  theme: CompanyTheme;
  customLevels: Level[];
  editingLiveOffer?: boolean;
  open: boolean;
  fetchLevelList: () => void;
  updateLevel: (id: number, data: Level, options: OptionCallback) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  handlePreviousStep: () => void;
  zoomAppDetail: ZoomApp;
};

type Values = {
  name: string;
  level: number;
  offers: Omit<Offer, 'level'>[];
  full_booking_only: boolean;
  allow_booking_after_start: boolean;
  manager_only: boolean;
  withRecurrence: boolean;
  recurrence_frequence: string;
  count: number;
  until: string;
  recurrence_interval: number;
  recurrence_method: string;
  whitelist_tags: number[];
  blacklist_tags: number[];
};

const GroupedOfferFormSettingsSchema = Yup.object().shape({
  name: Yup.string().required(),
  full_booking_only: Yup.boolean().required(),
  allow_booking_after_start: Yup.boolean().required(),
  manager_only: Yup.boolean().required(),
  withRecurrence: Yup.boolean()
    .required()
    .test('Recurrence is rightly set', '', function checkRecurrence(item) {
      if (!item) return true;
      if (!this.parent.recurrence_interval) return false;
      if (!this.parent.recurrence_frequence) return false;
      if (!this.parent.recurrence_method) return false;
      if (this.parent.recurrence_method === 'count') return this.parent.count;
      if (this.parent.recurrence_method === 'until') return this.parent.until;
      return false;
    }),
  recurrence_frequence: Yup.string(),
  recurrence_interval: Yup.number().test(
    'Recurrence number exist',
    'error',
    function checkRecurrence(item) {
      if (!this.parent.withRecurrence) return true;
      if (!item) return false;
      return true;
    },
  ),
  recurrence_method: Yup.string(),
  count: Yup.number().test(
    'Recurrence number exist',
    'error',
    function checkCount(item) {
      if (!this.parent.withRecurrence) return true;
      if (this.parent.recurrence_method === 'until') return true;
      if (!item) return false;
      return true;
    },
  ),
  until: Yup.string(),
  offers: Yup.array()
    .of(
      Yup.object().shape({
        coach: Yup.number().required(),
        establishment: Yup.number().required(),
        duration_minute: Yup.number().required(),
        effectif: Yup.number().required(),
        partner_max_booking_count: Yup.number().required(),
        available_on_partnership: Yup.boolean().required(),
        waiting_list_max_size: Yup.number().required(),
        whitelist_tags: Yup.array().of(Yup.number()),
        blacklist_tags: Yup.array().of(Yup.number()),
      }),
    )
    .min(2),
  whitelist_tags: Yup.array().of(Yup.number()),
  blacklist_tags: Yup.array().of(Yup.number()),
});

export const GroupedOfferFormSettings: React.FC<
  OuterProps & FormikProps<Values>
> = ({
  values,
  errors,
  touched,
  isSubmitting,
  open,
  coaches,
  coachPaymentRulesByKind,
  availableEstablishments,
  allEstablishments,
  metaActivity,
  availableRoomBlueprints,
  allRoomBlueprints,
  tagList,
  theme,
  customLevels,
  editingLiveOffer = false,
  fetchLevelList,
  updateLevel,
  createLevel,
  deleteLevel,
  setFieldValue,
  handlePreviousStep,
  resetForm,
  zoomAppDetail,
  getFieldHelpers,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();
  const [openOffersModal, setOpenOffersModal] = useState(false);
  const [offerEdited, setOfferEdited] = useState<Offer | null>(null);

  useEffect(() => {
    if (!open) {
      setOfferEdited(null);
      setOpenOffersModal(false);
      resetForm();
    }
  }, [open, resetForm]);

  useEffect(() => {
    if (!values.full_booking_only) {
      setFieldValue('allow_booking_after_start', false);
    }
  }, [values.full_booking_only, setFieldValue]);

  const handleCloseOffersModal = () => {
    setOpenOffersModal(false);
  };

  const handleOpenOffersModal = () => {
    setOpenOffersModal(true);
  };

  const handleResetEdit = () => {
    setOfferEdited(null);
  };

  const handleDeleteLevel = (deleteLevelId: number) => {
    deleteLevel(deleteLevelId, {
      onSuccess: () => {
        if (deleteLevelId === values.level) {
          setFieldValue('level', null);
        }
        fetchLevelList();
      },
    });
  };

  const { spiviEnabled } = useFeaturesProvider();

  const allOffersHaveSpiviBoxId = useCallback(
    (offers: Offer[]) => {
      return (
        offers.length > 0 &&
        offers.filter((offer) => {
          return availableRoomBlueprints.find(
            (roomBlueprint) => roomBlueprint.id === offer.room_blueprint,
          )?.spivi_box_id;
        }).length === offers.length
      );
    },
    [availableRoomBlueprints],
  );

  const editSyncOnSpivi = useCallback(
    (offers: Offer[]) => {
      const offersHaveSpiviBoxId = allOffersHaveSpiviBoxId(offers);
      // @ts-expect-error
      if (offersHaveSpiviBoxId && !touched.sync_on_spivi) {
        setFieldValue('sync_on_spivi', true);
      } else if (!offersHaveSpiviBoxId) {
        setFieldValue('sync_on_spivi', false);
      }
    },
    // @ts-expect-error
    [touched.sync_on_spivi, setFieldValue, allOffersHaveSpiviBoxId],
  );

  const handleChangeSyncOnSpivi = useCallback(
    (sync_on_spivi) => {
      const helpers = getFieldHelpers('sync_on_spivi');
      helpers.setTouched(true);
      setFieldValue('sync_on_spivi', !sync_on_spivi);
    },
    [getFieldHelpers, setFieldValue],
  );

  const handleAddOffer = useCallback(
    (data) => {
      const offers = [
        ...values.offers,
        // @ts-expect-error
        ...data.dates.map((date) => ({
          ...data,
          group: -1,
          meta_activity: metaActivity,
          dates: [],
          date_start: date,
          customlevel: {
            id: values.level,
          },
        })),
      ].sort((a, b) => a.date_start - b.date_start);
      setFieldValue('offers', offers);
      if (spiviEnabled) editSyncOnSpivi(offers);
      handleCloseOffersModal();
    },
    [
      metaActivity,
      setFieldValue,
      values.level,
      values.offers,
      editSyncOnSpivi,
      spiviEnabled,
    ],
  );

  const handleEditOffer = useCallback(
    ({ data }) => {
      const offers = values.offers
        .reduce((acc, value) => {
          if (
            // @ts-expect-error
            DateTime.fromSeconds(value.date_start).toFormat(
              'yyyy-LL-dd HH:mm',
            ) !== offerEdited.date_start
          ) {
            acc.push(value);
            return acc;
          }

          acc.push({
            ...offerEdited,
            // @ts-expect-error
            establishment: offerEdited?.establishment?.id,
            // @ts-expect-error
            coach: offerEdited?.coach?.id,
            // @ts-expect-error
            coach_override: offerEdited?.coach_override?.id,
            ...data,
            ...(data?.date_start
              ? {
                  date_start: data.date_start.unix(),
                }
              : {
                  date_start: DateTime.fromISO(
                    offerEdited.date_start,
                  ).toUnixInteger(),
                }),
          });
          return acc;
        }, [])
        .sort((a, b) => a.date_start - b.date_start);
      setFieldValue('offers', offers);
      if (spiviEnabled) editSyncOnSpivi(offers);
      handleResetEdit();
    },
    [offerEdited, setFieldValue, values.offers, editSyncOnSpivi, spiviEnabled],
  );

  const handleWhiteListChange = (tags: number[]) => {
    setFieldValue('whitelist_tags', tags);
  };

  const handleBlackListChange = (tags: number[]) => {
    setFieldValue('blacklist_tags', tags);
  };

  return (
    <>
      <Form>
        <div className={classes.wrapper}>
          <div className={classes.subtitle}>
            {/* @ts-expect-error */}
            <InfoIcon className={classes.sectionIcon} />
            <Typography variant="h6">
              {t('groupedOption.modal.form.subtitle')}
            </Typography>
          </div>
          <div className={classes.column}>
            <TextField
              required
              label={t('groupedOption.modal.form.name')}
              name="name"
            />
            <Typography color="textSecondary" variant="caption">
              {t('groupedOption.modal.form.nameCaption')}
            </Typography>
            <AlertError name="name" />
          </div>
          <LevelSelectorFormik
            customLevels={customLevels}
            fetchLevelList={fetchLevelList}
            name="level"
            onCreateLevel={createLevel}
            onDeleteLevel={handleDeleteLevel}
            // @ts-expect-error
            onEditLevel={updateLevel}
          />
        </div>
        {!editingLiveOffer && (
          <>
            <Divider className={classes.divider} />
            <div className={classes.wrapper}>
              <div className={classes.subtitle}>
                <DateRangeIcon className={classes.icon} />
                <Typography variant="h6">
                  {t('groupedOption.modal.form.subtitleOffers')}
                </Typography>
              </div>
              <FieldArray name="offers">
                {({
                  remove,
                  form: {
                    values: { offers },
                  },
                }) => (
                  <OffersList
                    coaches={coaches}
                    establishments={allEstablishments}
                    level={values.level}
                    metaActivity={metaActivity}
                    offers={offers}
                    onRemove={remove}
                    recurrence_frequence={values.recurrence_frequence}
                    recurrence_interval={values.recurrence_interval}
                    setOfferEdited={setOfferEdited}
                    syncEditOnSpivi={editSyncOnSpivi}
                  />
                )}
              </FieldArray>
              {errors.offers && touched.offers && (
                <Alert className={classes.alertError} severity="error">
                  {t('groupedOption.errors.offers_length')}
                </Alert>
              )}
              <div className={classes.buttonAdd}>
                <Button
                  color="primary"
                  onClick={handleOpenOffersModal}
                  variant="outlined"
                >
                  <AddIcon color="primary" />
                  {t('groupedOption.modal.form.addOffers')}
                </Button>
              </div>
            </div>
          </>
        )}

        <Divider className={classes.divider} />
        <div className={classes.wrapper}>
          <div className={classes.subtitle}>
            <ToggleOnIcon className={classes.icon} />
            <Typography variant="h6">
              {t('groupedOption.modal.form.subtitleSettings')}
            </Typography>
          </div>
          <CheckboxField
            label={t('groupedOption.modal.form.fullBookingOnly')}
            name="full_booking_only"
          />
          <Typography color="textSecondary" variant="caption">
            {t('groupedOption.modal.form.fullBookingOnlyCaption')}
          </Typography>
          {values.full_booking_only && (
            <>
              <CheckboxField
                label={t('groupedOption.modal.form.allowBookingAfterStart')}
                name="allow_booking_after_start"
              />
              <Typography color="textSecondary" variant="caption">
                {t('groupedOption.modal.form.allowBookingAfterStartCaption')}
              </Typography>
            </>
          )}
          <ManagerOnlyToggle
            manager_only={values.manager_only}
            onChange={(manager_only) =>
              setFieldValue('manager_only', manager_only)
            }
          />
          {theme.allow_guest_activatable && theme.allow_guest && (
            <div>
              <FormToggle
                disabled
                title={t('groupedOption.modal.form.allowGuest')}
              />
              <Typography color="textSecondary" variant="caption">
                {t('groupedOption.modal.form.allowGuestUnavailable')}
              </Typography>
            </div>
          )}
          {/* @ts-expect-error */}
          <Collapse in={spiviEnabled && allOffersHaveSpiviBoxId(values.offers)}>
            <FormToggle
              onChange={handleChangeSyncOnSpivi}
              title={t('groupedOption.modal.form.syncOnSpivi')}
              // @ts-expect-error
              value={values.sync_on_spivi}
            />
          </Collapse>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.wrapper}>
          <BlackWhiteListing
            blacklist_tags={values.blacklist_tags}
            disableTag={false}
            onBlackListChange={handleBlackListChange}
            onWhiteListChange={handleWhiteListChange}
            tagList={tagList}
            whitelist_tags={values.whitelist_tags}
          />
        </div>
        {!editingLiveOffer && (
          <>
            <Divider className={classes.divider} />
            <div className={classes.wrapper}>
              <div className={classes.subtitle}>
                <RefreshIcon className={classes.icon} />
                <Typography variant="h6">
                  {t('groupedOption.modal.form.subtitleRecurrence')}
                </Typography>
              </div>
              <SwitchField
                // @ts-expect-error
                className={classes.switch}
                color="primary"
                label={t('groupedOption.modal.form.withRecurrence')}
                name="withRecurrence"
              />

              <Collapse in={values.withRecurrence}>
                <div className={classes.collapse}>
                  <div>
                    <FormLabel>
                      {t('groupedOption.modal.form.recurrence')}
                    </FormLabel>
                    <div className={classes.recurenceRow}>
                      {t('groupedOption.modal.form.recurrenceNumberPrefix')}
                      <IntegerField
                        className={classes.intervalIntegerField}
                        name="recurrence_interval"
                      />
                      <IntervalRecurrenceSelectField
                        displayPeriod
                        withoutDaily
                        className={classes.intervalSelectorField}
                        name="recurrence_frequence"
                        variant="outlined"
                      />
                    </div>
                  </div>

                  <Field name="recurrence_method">
                    {/* @ts-expect-error */}
                    {({ field }) => (
                      <RadioGroup
                        onChange={(_, value) =>
                          setFieldValue(field.name, value)
                        }
                      >
                        <FormLabel>
                          {t('groupedOption.modal.form.recurrenceCount')}
                        </FormLabel>
                        <div className={classes.radioRow}>
                          <Radio
                            checked={`${field.value}` === 'count'}
                            value="count"
                          />
                          <IntegerField
                            label={t(
                              'groupedOption.modal.form.recurrenceCount',
                            )}
                            name="count"
                          />
                        </div>
                        <div className={classes.radioRow}>
                          <Radio
                            checked={`${field.value}` === 'until'}
                            value="until"
                          />
                          <DateField
                            label={t(
                              'groupedOption.modal.form.recurrenceUntil',
                            )}
                            name="until"
                          />
                        </div>
                        {field.value === 'until' && (
                          <div className={classes.radioHelper}>
                            <Typography color="textSecondary" variant="caption">
                              {t(
                                'groupedOption.modal.form.recurrenceUntilHelper',
                              )}
                            </Typography>
                            <Typography color="textSecondary" variant="caption">
                              {t(
                                'groupedOption.modal.form.recurrenceUntilHelper2',
                              )}
                            </Typography>
                          </div>
                        )}
                      </RadioGroup>
                    )}
                  </Field>
                </div>
              </Collapse>
            </div>
          </>
        )}
        <div className={classes.buttonContainer}>
          <Button onClick={handlePreviousStep}>
            {t('translation:common.cancel')}
          </Button>
          <Submit
            color="primary"
            disabled={isSubmitting || !values.offers.some((o) => o)}
          >
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              t(
                editingLiveOffer
                  ? 'groupedOption.modal.form.save'
                  : 'groupedOption.modal.form.preview',
              )
            )}
          </Submit>
        </div>
      </Form>
      <OfferDialogs
        allEstablishments={allEstablishments}
        allRoomBlueprints={allRoomBlueprints}
        availableEstablishments={availableEstablishments}
        availableRoomBlueprints={availableRoomBlueprints}
        coaches={coaches}
        coachPaymentRulesByKind={coachPaymentRulesByKind}
        // @ts-expect-error
        handleAddOffer={handleAddOffer}
        handleCloseOffersModal={handleCloseOffersModal}
        handleEditOffer={handleEditOffer}
        handleResetEdit={handleResetEdit}
        metaActivity={metaActivity}
        offerEdited={offerEdited}
        openOffersModal={openOffersModal}
        tagList={tagList}
        theme={theme}
        zoomAppDetail={zoomAppDetail}
      />
    </>
  );
};

const OfferDialogs: React.FC<{
  coaches: Array<Coach>;
  availableEstablishments: Array<Establishment>;
  allEstablishments: Array<Establishment>;
  metaActivity: MetaActivity;
  availableRoomBlueprints: RoomBlueprint[];
  allRoomBlueprints: RoomBlueprint[];
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  tagList: Array<Tag<TagGroup>>;
  theme: CompanyTheme;
  offerEdited: any;
  openOffersModal: boolean;
  handleCloseOffersModal: () => void;
  handleResetEdit: () => void;
  handleEditOffer: ({
    offerId,
    data,
  }: {
    offerId: number;
    data: Object;
  }) => void;
  handleAddOffer: () => void;
  zoomAppDetail: ZoomApp;
}> = ({
  theme,
  coaches,
  allEstablishments,
  availableEstablishments,
  availableRoomBlueprints,
  openOffersModal,
  metaActivity,
  tagList,
  handleCloseOffersModal,
  coachPaymentRulesByKind,
  offerEdited,
  handleResetEdit,
  allRoomBlueprints,
  handleEditOffer,
  handleAddOffer,
  zoomAppDetail,
}) => {
  const { t } = useTranslation('metaActivity');

  const isWherebyIntegrationEnabled =
    theme?.is_whereby_integration_enabled &&
    theme?.is_whereby_integration_allowed;

  return (
    <>
      <GenericResponsiveDrawer
        withoutHeaderContainer
        withoutPadding
        onClose={handleCloseOffersModal}
        open={!!openOffersModal}
        subtitle={t('translation:common.offerCreation')}
        title={t('translation:common.offers')}
      >
        <OfferCreateForm
          editableCoachPaymentRule
          hideActivitySection
          isOfferInGroup
          availableEstablishments={availableEstablishments}
          coaches={coaches}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
          metaActivity={metaActivity}
          onCancel={handleCloseOffersModal}
          onSubmit={handleAddOffer}
          processing={false}
          roomBlueprints={availableRoomBlueprints}
          selectedDate={DateTime.now()}
          showPartnership={theme.has_partnership}
          tagList={tagList}
          timezone={theme.timezone_name}
          zoomAppDetail={zoomAppDetail}
        />
      </GenericResponsiveDrawer>
      <GenericResponsiveDrawer
        withoutHeaderContainer
        withoutPadding
        onClose={handleResetEdit}
        open={!!offerEdited}
        subtitle={t('translation:common.offerEdition')}
        title={t('translation:common.offers')}
      >
        <OfferEditForm
          editableCoachPaymentRule
          isOfferInGroup
          // @ts-expect-error
          allEstablishments={allEstablishments}
          allRoomBlueprints={allRoomBlueprints}
          availableEstablishments={availableEstablishments}
          coaches={coaches}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          creditScaleFactor={creditScaleFactor || 1}
          isLoading={!offerEdited}
          isWherebyIntegrationEnabled={isWherebyIntegrationEnabled}
          metaActivities={[metaActivity]}
          offer={offerEdited}
          onCancel={handleResetEdit}
          onSubmit={handleEditOffer}
          processing={false}
          roomBlueprints={availableRoomBlueprints}
          showPartnership={theme.has_partnership}
          similarOffers={[]}
          tagList={tagList}
          zoomAppDetail={zoomAppDetail}
        />
      </GenericResponsiveDrawer>
    </>
  );
};

const OffersList: React.FC<{
  offers: Offer[];
  establishments: Establishment[];
  coaches: Coach[];
  metaActivity: MetaActivity;
  onRemove: (id: number) => void;
  setOfferEdited: (offer: Offer) => void;
  recurrence_frequence: string;
  recurrence_interval: number;
  level: number;
  syncEditOnSpivi: (offers: Offer[]) => void;
}> = ({
  offers,
  establishments,
  coaches,
  metaActivity,
  onRemove,
  setOfferEdited,
  recurrence_frequence,
  recurrence_interval,
  level,
  syncEditOnSpivi,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();

  return (
    <Paper>
      {offers.map((o, index) => {
        const establishment = establishments?.find(
          (e) => e.id === o.establishment,
        );
        const offer = {
          ...o,
          establishment,
          timezone_name: establishment?.tzname,
          coach: coaches?.find((c) => c.id === o.coach),
          additional_coaches: o?.additional_coaches
            ?.map((coachId) => coaches?.find((c) => c.id === coachId) ?? null)
            ?.filter((c) => c !== null),
          coach_override: coaches?.find((c) => c.id === o.coach_override),
          // @ts-expect-error
          credit_price_override: o.credits,
        };

        return (
          <ListItem
            key={o.date_start}
            style={{
              borderLeftWidth: 5,
              borderLeftStyle: 'solid',
              borderLeftColor: metaActivity?.color,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            }}
          >
            <div className={classes.coachAvatar}>
              <CoachAvatar
                coach={offer.coach}
                coach_override={offer.coach_override}
              />
            </div>
            <ListItemText
              primary={metaActivity?.name}
              secondary={
                <div>
                  <div>
                    {getDisplayDateFromRecurrence(
                      // @ts-expect-error
                      DateTime.fromSeconds(offer.date_start).setZone(
                        offer.timezone_name,
                      ),
                      {
                        interval: recurrence_interval,
                        // @ts-expect-error
                        frequence:
                          FREQUENCE_NUMBER_CONVERTER[recurrence_frequence],
                      },
                    )}
                  </div>
                  <div>
                    {/* @ts-expect-error */}
                    {`${DateTime.fromSeconds(offer.date_start)
                      .setZone(offer.timezone_name)
                      .toFormat('HH:mm')} - ${DateTime.fromSeconds(
                      // @ts-expect-error
                      offer.date_start,
                    )
                      .setZone(offer.timezone_name)
                      .plus({ minutes: offer.duration_minute })
                      .toFormat('HH:mm')}`}
                  </div>
                </div>
              }
            />
            <ListItemText
              primary={offer.establishment?.title}
              secondary={
                offer?.additional_coaches?.length > 0 ? (
                  <Tooltip
                    placement="bottom-start"
                    title={
                      <AdditionalCoachesTooltipTitle
                        coaches={offer?.additional_coaches}
                        mainCoachName={offer.coach?.name}
                      />
                    }
                  >
                    <div>
                      {t('offer:allCoaches', {
                        count: offer?.additional_coaches?.length + 1,
                      })}
                    </div>
                  </Tooltip>
                ) : (
                  offer.coach?.name
                )
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  onRemove(index);
                  syncEditOnSpivi(offers.filter((_, i) => i !== index));
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => {
                  setOfferEdited({
                    ...offer,
                    // @ts-expect-error
                    date_start: DateTime.fromSeconds(offer.date_start),
                    customlevel: {
                      id: level,
                    },
                  });
                }}
              >
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    paddingBottom: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  collapse: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  buttonContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioRow: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  radioHelper: {
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  intervalIntegerField: {
    height: theme.spacing(-2),
    width: theme.spacing(5),
  },
  intervalSelectorField: {
    height: theme.spacing(4),
  },
  recurenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  buttonAdd: {
    display: 'flex',
  },
  coachAvatar: {
    marginRight: theme.spacing(2),
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  icon: {
    fill: '#747474',
  },
  alertError: {
    alignItems: 'center',
  },
}));

export default compose<any, OuterProps>(
  withFormik<OuterProps, Values>({
    mapPropsToValues: ({ initial }: OuterProps) => {
      if (initial) {
        return {
          name: initial.name,
          // @ts-expect-error
          level: initial.level || initial.level_id || 1,
          full_booking_only: initial.full_booking_only,
          allow_booking_after_start: initial.allow_booking_after_start,
          manager_only: initial.manager_only,
          withRecurrence: !!initial.recurrence_rule,
          recurrence_interval: initial?.recurrence_rule?.interval ?? 1,
          recurrence_frequence:
            FREQUENCE_STRING_CONVERTER?.[initial?.recurrence_rule?.frequence] ??
            'week',
          recurrence_method: initial.recurrence_rule?.count ? 'count' : 'until',
          count: initial.recurrence_rule?.count ?? 1,
          until: initial.recurrence_rule?.until
            ? DateTime.fromSeconds(initial.recurrence_rule.until).toISODate()
            : DateTime.now().plus({ months: 1 }).toISODate(),
          offers: [...(initial?.offers ?? [])]?.sort(
            // @ts-expect-error
            (a, b) => a.date_start - b.date_start,
          ),
          whitelist_tags: initial?.offers?.[0]?.whitelist_tags ?? [],
          blacklist_tags: initial?.offers?.[0]?.blacklist_tags ?? [],
          isOfferInGroup: true,
          // @ts-expect-error
          sync_on_spivi: initial?.sync_on_spivi,
        };
      }

      return {
        name: '',
        level: 1,
        full_booking_only: true,
        allow_booking_after_start: false,
        manager_only: false,
        withRecurrence: false,
        recurrence_interval: 1,
        recurrence_frequence: 'week',
        recurrence_method: 'count',
        count: 1,
        until: DateTime.now().plus({ months: 1 }).toISODate(),
        offers: [],
        whitelist_tags: [],
        blacklist_tags: [],
        isOfferInGroup: true,
        sync_on_spivi: false,
      };
    },
    validationSchema: GroupedOfferFormSettingsSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      onSubmit({
        values,
        options: {
          onSuccess: () => setSubmitting(false),
          onError: () => setSubmitting(false),
        },
      });
    },
  }),
)(GroupedOfferFormSettings);
