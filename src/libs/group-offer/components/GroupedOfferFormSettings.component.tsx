import React, { useState, useEffect, useCallback } from 'react';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps, Field, FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import InfoIcon from '@material-ui/icons/Info';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RefreshIcon from '@material-ui/icons/Refresh';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
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
import {
  TextField,
  Submit,
  SwitchField,
  DateField,
  CheckboxField,
  IntegerField,
  AlertError,
  IntervalRecurrenceSelectField,
} from '#components/forms';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import OfferForm from '#libs/offer/OfferForm.component';
import OfferEditForm from '#libs/offer/OfferEditForm.component';

import { CompanyTheme } from '#libs/theme/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup } from '#libs/group-offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#libs/tag/types';
import { Offer } from '#libs/offer/types';
import { OptionCallback } from '../../../state/types';
import CoachAvatar from '#libs/associated-coach/components/CoachAvatar.component';
import {
  FREQUENCE_NUMBER_CONVERTER,
  FREQUENCE_STRING_CONVERTER,
  getDisplayDateFromRecurrence,
} from '#libs/group-offer/utils';
import LevelSelectorFormik from '#libs/level/components/LevelSelectorFormik.component';
import { Level } from '#libs/level/types';
import ManagerOnlyToogle from '#libs/offer/form/ManagerOnlyToogle.component';
import BlackWhiteListing from '#libs/offer/BlackWhiteListing.component';
import FormToggle from '#components/forms/FormToggle.component';
import { ZoomApp } from '#libs/zoom-app/types';

import { Config } from '../../../config';

type OuterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: OffersGroup<Offer>;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (arg1: { values: Values; options: OptionCallback }) => void;

  coaches: Array<Coach>;
  establishments: Array<Establishment>;
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
  establishments,
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

  const handleAddOffer = useCallback(
    (data) => {
      setFieldValue(
        'offers',
        [
          ...values.offers,
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
        ].sort((a, b) => a.date_start - b.date_start),
      );
      handleCloseOffersModal();
    },
    [metaActivity, setFieldValue, values.level, values.offers],
  );

  const handleEditOffer = useCallback(
    ({ data }) => {
      setFieldValue(
        'offers',

        values.offers
          .reduce((acc, value) => {
            if (
              moment.unix(value.date_start).format('YYYY-MM-DD HH:mm') !==
              offerEdited.date_start
            ) {
              acc.push(value);
              return acc;
            }

            acc.push({
              ...offerEdited,
              establishment: offerEdited?.establishment?.id,
              coach: offerEdited?.coach?.id,
              coach_override: offerEdited?.coach_override?.id,
              ...data,
              ...(data?.date_start
                ? {
                    date_start: data.date_start.unix(),
                  }
                : {
                    date_start: moment(offerEdited.date_start).unix(),
                  }),
            });
            return acc;
          }, [])
          .sort((a, b) => a.date_start - b.date_start),
      );
      handleResetEdit();
    },
    [offerEdited, setFieldValue, values.offers],
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
            <InfoIcon className={classes.icon} />
            <Typography variant="h6">
              {t('groupedOption.modal.form.subtitle')}
            </Typography>
          </div>
          <div className={classes.column}>
            <TextField
              name="name"
              label={t('groupedOption.modal.form.name')}
              required
            />
            <Typography color="textSecondary" variant="caption">
              {t('groupedOption.modal.form.nameCaption')}
            </Typography>
            <AlertError name="name" />
          </div>
          <LevelSelectorFormik
            name="level"
            customLevels={customLevels}
            fetchLevelList={fetchLevelList}
            onEditLevel={updateLevel}
            onCreateLevel={createLevel}
            onDeleteLevel={handleDeleteLevel}
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
                    offers={offers}
                    establishments={establishments}
                    coaches={coaches}
                    metaActivity={metaActivity}
                    onRemove={remove}
                    setOfferEdited={setOfferEdited}
                    recurrence_frequence={values.recurrence_frequence}
                    recurrence_interval={values.recurrence_interval}
                    level={values.level}
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
                  variant="outlined"
                  onClick={handleOpenOffersModal}
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
          {/* Will be MEP when apps are ready */}
          {['local', 'dev'].includes(Config.REACT_APP_SENTRY_ENVIRONMENT) ? (
            <>
              <CheckboxField
                name="full_booking_only"
                label={t('groupedOption.modal.form.fullBookingOnly')}
              />
              <Typography color="textSecondary" variant="caption">
                {t('groupedOption.modal.form.fullBookingOnlyCaption')}
              </Typography>
              {values.full_booking_only && (
                <>
                  <CheckboxField
                    name="allow_booking_after_start"
                    label={t('groupedOption.modal.form.allowBookingAfterStart')}
                  />
                  <Typography color="textSecondary" variant="caption">
                    {t(
                      'groupedOption.modal.form.allowBookingAfterStartCaption',
                    )}
                  </Typography>
                </>
              )}
            </>
          ) : null}

          <ManagerOnlyToogle
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
        </div>
        <Divider className={classes.divider} />
        <div className={classes.wrapper}>
          <BlackWhiteListing
            tagList={tagList}
            disableTag={false}
            whitelist_tags={values.whitelist_tags}
            blacklist_tags={values.blacklist_tags}
            onWhiteListChange={handleWhiteListChange}
            onBlackListChange={handleBlackListChange}
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
                name="withRecurrence"
                label={t('groupedOption.modal.form.withRecurrence')}
                color="primary"
                className={classes.switch}
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
                        name="recurrence_interval"
                        classes={{ field: classes.noMargin }}
                      />
                      <IntervalRecurrenceSelectField
                        name="recurrence_frequence"
                        withoutDaily
                      />
                    </div>
                  </div>

                  <Field name="recurrence_method">
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
                            value="count"
                            checked={`${field.value}` === 'count'}
                          />
                          <IntegerField
                            name="count"
                            label={t(
                              'groupedOption.modal.form.recurrenceCount',
                            )}
                          />
                        </div>
                        <div className={classes.radioRow}>
                          <Radio
                            value="until"
                            checked={`${field.value}` === 'until'}
                          />
                          <DateField
                            name="until"
                            label={t(
                              'groupedOption.modal.form.recurrenceUntil',
                            )}
                          />
                        </div>
                        {field.value === 'until' && (
                          <div className={classes.radioHelper}>
                            <Typography variant="caption" color="textSecondary">
                              {t(
                                'groupedOption.modal.form.recurrenceUntilHelper',
                              )}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
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
            disabled={isSubmitting || !values.offers.some((o) => o)}
            color="primary"
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
        coaches={coaches}
        establishments={establishments}
        metaActivity={metaActivity}
        availableRoomBlueprints={availableRoomBlueprints}
        allRoomBlueprints={allRoomBlueprints}
        coachPaymentRulesByKind={coachPaymentRulesByKind}
        tagList={tagList}
        theme={theme}
        offerEdited={offerEdited}
        openOffersModal={openOffersModal}
        handleCloseOffersModal={handleCloseOffersModal}
        handleResetEdit={handleResetEdit}
        handleEditOffer={handleEditOffer}
        handleAddOffer={handleAddOffer}
        zoomAppDetail={zoomAppDetail}
      />
    </>
  );
};

const OfferDialogs: React.FC<{
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
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
  establishments,
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
  const classes = useStyles();

  const isWherebyIntegrationEnabled =
    theme?.is_whereby_integration_enabled &&
    theme?.is_whereby_integration_allowed;

  return (
    <>
      <GenericResponsiveDrawer
        open={!!openOffersModal}
        onClose={handleCloseOffersModal}
        title={t('translation:common.offers')}
        subtitle={t('translation:common.offerCreation')}
        className={classes.paperInset}
      >
        <OfferForm
          selectedDate={moment()}
          coaches={coaches}
          timezone={theme.timezone_name}
          establishments={establishments}
          roomBlueprints={availableRoomBlueprints}
          metaActivity={metaActivity}
          onCancel={handleCloseOffersModal}
          processing={false}
          is_whereby_integration_enabled={isWherebyIntegrationEnabled}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          editableCoachPaymentRule
          showPartnership={theme.has_partnership}
          tagList={tagList}
          isOfferInGroup
          disableWaitingList
          disableTag
          onSubmit={handleAddOffer}
          zoomAppDetail={zoomAppDetail}
        />
      </GenericResponsiveDrawer>
      <GenericResponsiveDrawer
        open={!!offerEdited}
        onClose={handleResetEdit}
        title={t('translation:common.offers')}
        subtitle={t('translation:common.offerEdition')}
        className={classes.paperInset}
      >
        <div className={classes.editOfer}>
          <OfferEditForm
            offer={offerEdited}
            metaActivities={[metaActivity]}
            coaches={coaches}
            establishments={establishments}
            roomBlueprints={availableRoomBlueprints}
            allRoomBlueprints={allRoomBlueprints}
            is_whereby_integration_enabled={isWherebyIntegrationEnabled}
            loading={false}
            processing={false}
            fetchSimilarOffers={null}
            similarOffers={[]}
            similarOfferLoading={false}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            showPartnership={theme.has_partnership}
            tagList={tagList}
            onConfirm={handleEditOffer}
            onCancel={handleResetEdit}
            zoomAppDetail={zoomAppDetail}
            isOfferInGroup
          />
        </div>
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
          coach_override: coaches?.find((c) => c.id === o.coach_override),
          credit_price_override: o.credits,
        };

        return (
          <ListItem
            style={{
              borderLeftWidth: 5,
              borderLeftStyle: 'solid',
              borderLeftColor: metaActivity?.color,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            }}
            key={o.date_start}
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
                      moment.unix(offer.date_start).tz(offer.timezone_name),
                      {
                        interval: recurrence_interval,
                        frequence:
                          FREQUENCE_NUMBER_CONVERTER[recurrence_frequence],
                      },
                      t,
                    )}
                  </div>
                  <div>
                    {`${moment
                      .unix(offer.date_start)
                      .tz(offer.timezone_name)
                      .format('HH:mm')} - ${moment
                      .unix(offer.date_start)
                      .tz(offer.timezone_name)
                      .add(offer.duration_minute, 'minutes')
                      .format('HH:mm')}`}
                  </div>
                </div>
              }
            />
            <ListItemText
              primary={offer.establishment?.title}
              secondary={offer.coach?.name}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  onRemove(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => {
                  setOfferEdited({
                    ...offer,
                    date_start: moment
                      .unix(offer.date_start)
                      .format('YYYY-MM-DD HH:mm'),
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
  recurenceRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  noMargin: {
    margin: 0,
  },
  buttonAdd: {
    display: 'flex',
  },
  paperInset: {
    paddingLeft: theme.spacing(8),
    boxShadow: 'none',
  },
  editOfer: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
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
            ? moment.unix(initial.recurrence_rule.until).format('YYYY-MM-DD')
            : moment().add(1, 'month').format('YYYY-MM-DD'),
          offers: [...(initial?.offers ?? [])]?.sort(
            (a, b) => a.date_start - b.date_start,
          ),
          whitelist_tags: initial?.offers?.[0]?.whitelist_tags ?? [],
          blacklist_tags: initial?.offers?.[0]?.blacklist_tags ?? [],
        };
      }

      return {
        name: '',
        level: 1,
        full_booking_only: false,
        allow_booking_after_start: false,
        manager_only: false,
        withRecurrence: false,
        recurrence_interval: 1,
        recurrence_frequence: 'week',
        recurrence_method: 'count',
        count: 1,
        until: moment().add(1, 'month').format('YYYY-MM-DD'),
        offers: [],
        whitelist_tags: [],
        blacklist_tags: [],
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
