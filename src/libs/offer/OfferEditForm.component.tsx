import React, { Component } from 'react';
import moment from 'moment-timezone';
import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';

import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import InfoIcon from '@material-ui/icons/Info';
import { Alert } from '@material-ui/lab';

import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { Moment } from '../../i18n';

import DurationInput from '#components/input/DurationInput.component';
import NumericInput from '#components/input/NumericInput.component';
import DateTimeInput from '#components/input/DateTimeInput.component';

import RecursionToogle from '#libs/offer/form/RecursionToogle.component';
import EstablishmentSubForm from '#libs/offer/form/EstablishmentSubForm.component';
import CoachSubForm from '#libs/offer/form/CoachSubForm.component';
import NotificationToogle from '#libs/offer/form/NotificationToogle.component';
import PartnershipToogle from '#libs/offer/form/PartnershipToogle.component';
import ManagerOnlyToogle from '#libs/offer/form/ManagerOnlyToogle.component';

import MetaActivitySelector from '#libs/meta-activity/components/MetaActivitySelector.component';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import RoomBlueprintSelector from '#libs/spot-scheduling/component/RoomBlueprintSelector.component';
import SpotSchedulingHelper from '#libs/spot-scheduling/utils';

import TagSelector from '#libs/tag/components/TagSelector.selector';

import { Coach, Establishment, Offer } from '../../api/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Tag, TagGroup } from '#libs/tag/types';
import { Level } from '#libs/level/types';
import { OptionCallback } from '../../state/types';
import LevelSelector from '#libs/level/components/LevelSelector.component';
import FormToggle from '#components/forms/FormToggle.component';
import { ZoomApp } from '#libs/zoom-app/types';
import {
  OFFER_EDIT_FORM_FIELDS,
  OFFER_EDIT_FORM_STEPS,
  PropagateCoachOverrideToSimilarOffers,
  SIMILAR_OFFERS_PAGE_SIZE,
} from '#libs/offer/constants';
import { OfferFilterData } from '#libs/offer/types';
import OfferEditSubteacherChangeSettings from '#libs/offer/components/OfferEditSubteacherChangeSettings.component';

type OwnProps = {
  processing: boolean;
  similarOfferLoading: boolean;
  is_whereby_integration_enabled: boolean;

  offer: Offer;
  similarOffers: Array<Offer>;
  similarOffersPage: number;
  similarOffersCount: number;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  roomBlueprints: RoomBlueprint[];
  allRoomBlueprints: RoomBlueprint[];
  allowGuestMaster?: boolean;
  onCancel: () => void;
  fetchSimilarOffers: (id: number, params?: OfferFilterData) => void;
  fetchSimilarOffersWithReset: (
    offerId: number,
    params?: any,
    options?: OptionCallback<Offer[]>,
  ) => void;
  onConfirm: ({ offerId, data }: { offerId: number; data: FormData }) => void;
  metaActivities: Array<MetaActivity>;
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  showPartnership: boolean;
  tagList: Array<Tag<TagGroup>>;

  activeCustomLevels: Level[];
  allCustomLevels: Level[];
  updateLevel: (id: number, data: Level, options: OptionCallback) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  zoomAppDetail: ZoomApp;
  isOfferInGroup?: boolean;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;
type State = {
  hour: string;
  step: number;
  coach: number;
  establishment: number;
  modifyRecursively: boolean;
  notifyConsumers: boolean;
  date: moment.Moment;
  duration_minute?: number;

  coach_override?: number;
  establishment_override?: Establishment;
  isSimilarOfferListExpanded: boolean;
  selectedSimilarOfferIds: number[];
  coach_payment_rule: number | null;
  manager_only: boolean;
  openAdvancedOptions: boolean;
  whitelist_tags: Array<number>;
  blacklist_tags: Array<number>;
  level: number;
  allow_guest_offer?: boolean;
  should_modify_all_dates: boolean;
  subTeacherEditPropagationMode: PropagateCoachOverrideToSimilarOffers;
};

export type FormData = Object;

function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

type OfferData = {
  [key: string]: any;
};
const getModifiedFields = (oldData: OfferData, newData: OfferData) => {
  const modifiedFields = [];
  for (const field of OFFER_EDIT_FORM_FIELDS) {
    if (oldData[field] !== newData[field]) {
      modifiedFields.push(field);
    }
  }
  return modifiedFields;
};
const appendModifiedData = (
  oldData: OfferData,
  newData: OfferData,
  data: OfferData,
) => {
  for (const field of OFFER_EDIT_FORM_FIELDS) {
    if (oldData[field] !== newData[field]) {
      // eslint-disable-next-line
      data[field] = newData[field];
    }
  }
  // eslint-disable-next-line
  data.coach_override = newData.coach_override;
  // eslint-disable-next-line
  data.establishment_override = newData.establishment_override;
};

export class OfferEditForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSimilarOfferListExpanded: true,
      step: OFFER_EDIT_FORM_STEPS.GATHER_INFO,
      modifyRecursively: false,
      notifyConsumers: false,
      broadcast_link: props.offer.broadcast_link || '',
      establishment: props.offer.establishment.id,
      roomBlueprint: props.offer.room_blueprint,
      establishment_override: props.offer.establishment_override
        ? props.offer.establishment_override.id
        : null,
      coach: props.offer.coach.id,
      coach_payment_rule: props.offer.coach_payment_rule_id,
      coach_override: props.offer.coach_override
        ? props.offer.coach_override.id
        : null,
      date: Moment(props.offer.date_start),
      duration_minute: props.offer.duration_minute,
      available_on_partnership: !!props.offer.available_on_partnership,
      manager_only: !!props.offer.manager_only,
      hour: moment(props.offer.date_start).format('HH:mm'),
      effectif: props.offer.effectif,
      partner_max_booking_count: props.offer.partner_max_booking_count,
      credit_price_override: props.offer.credit_price_override,
      waiting_list_max_size: props.offer.waiting_list_max_size,
      level: props.offer?.customLevel?.id,
      meta_activity:
        props.offer.meta_activity && this.props.offer.meta_activity.id,
      should_modify_all_dates: false,
      selectedSimilarOfferIds: [],

      whitelist_tags: props.offer.whitelist_tags?.map((tag) => tag.id) || [],
      blacklist_tags: props.offer.blacklist_tags?.map((tag) => tag.id) || [],
      openAdvancedOptions: false,
      allow_guest_offer: !!props.offer.allow_guest_offer,
      subTeacherEditPropagationMode:
        PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY,
    };
    this.initialOfferState = {
      date_start: Moment(props.offer.date_start),
      coach_override: props.offer.coach_override
        ? props.offer.coach_override.id
        : null,
      establishment_override: props.offer.establishment_override
        ? props.offer.establishment_override.id
        : null,
      coach: props.offer.coach.id,
      coach_payment_rule: props.offer.coach_payment_rule_id,
      meta_activity:
        this.props.offer.meta_activity && this.props.offer.meta_activity.id,
      establishment: props.offer.establishment.id,
      duration_minute: props.offer.duration_minute,
      effectif: props.offer.effectif,
      partner_max_booking_count: props.offer.partner_max_booking_count,
      available_on_partnership: props.offer.available_on_partnership,
      manager_only: props.offer.manager_only,
      credit_price_override: props.offer.credit_price_override,
      waiting_list_max_size: props.offer.waiting_list_max_size,
      level: props.offer.level_id,
      whitelist_tags: props.offer.whitelist_tags?.map((tag) => tag.id) || [],
      blacklist_tags: props.offer.blacklist_tags?.map((tag) => tag.id) || [],
      allow_guest_offer: props.offer.allow_guest_offer,
    };
  }

  componentDidMount() {
    this.props?.fetchSimilarOffers?.(this.props.offer.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.offer || !prevProps.offer) return;
    if (
      this.props.offer.meta_activity &&
      (!prevProps.offer.meta_activity ||
        prevProps.offer.meta_activity.id !== this.props.offer.meta_activity.id)
    ) {
      this.initialOfferState = {
        ...this.initialOfferState,
        meta_activity: this.props.offer.meta_activity.id,
      };
      this.setState({ meta_activity: this.props.offer.meta_activity.id });
    }
    if (
      (prevProps.similarOffers || []).length !==
        (this.props.similarOffers || []).length &&
      this.state.step === OFFER_EDIT_FORM_STEPS.GATHER_INFO
    ) {
      this.setState({
        selectedSimilarOfferIds: this.props.similarOffers.map(
          (offer) => offer.id,
        ),
      });
    }
  }

  dateIsTooFarInFuture = (inputDate: string | moment.Moment): boolean => {
    return moment(inputDate).diff(moment(), 'years', true) > 3;
  };

  handleChangeSelection = (offerId: number) => {
    const getNewState = (prevState: State) => {
      const isOfferInArr = prevState.selectedSimilarOfferIds.includes(offerId);
      if (isOfferInArr) {
        return prevState.selectedSimilarOfferIds.filter(
          (offer: number) => offer !== offerId,
        );
      }
      return [...prevState.selectedSimilarOfferIds, offerId];
    };
    this.setState((prevState) => ({
      selectedSimilarOfferIds: getNewState(prevState),
    }));
  };

  selectAll = () => {
    this.setState({
      selectedSimilarOfferIds: this.props.similarOffers.map(
        (offer: Offer) => offer.id,
      ),
    });
  };

  unselectAll = () => {
    this.setState((prevState) => ({
      selectedSimilarOfferIds: prevState.selectedSimilarOfferIds.filter(
        (offer: number) => offer === this.props.offer.id,
      ),
    }));
  };

  handleDeleteLevel = (deleteLevelId: number) => {
    this.props.deleteLevel(deleteLevelId, {
      onSuccess: () => {
        if (deleteLevelId === this.state.level) {
          this.setState({
            level: null,
          });
        }

        this.props.fetchLevelList({
          company: this.props.companyId,
        });
      },
    });
  };

  expandSimilarOfferList = () => {
    this.setState((prevState) => ({
      isSimilarOfferListExpanded: !prevState.isSimilarOfferListExpanded,
    }));
  };

  hasChangedDatetime = () => {
    const { date, hour } = this.state;
    const initialDateStart = this.initialOfferState.date_start;
    return (
      date.date() !== initialDateStart.date() ||
      date.month() !== initialDateStart.month() ||
      date.year() !== initialDateStart.year() ||
      Moment(hour, 'HH:mm').hour() !== initialDateStart.hour() ||
      Moment(hour, 'HH:mm').minute() !== initialDateStart.minute()
    );
  };

  onConfirm = () => {
    const { offer } = this.props;
    const {
      notifyConsumers,
      date,
      hour,
      subTeacherEditPropagationMode,
      selectedSimilarOfferIds,
      modifyRecursively,
    } = this.state;

    const data = {
      notifyConsumers,
      available_on_partnership: this.state.available_on_partnership,
      manager_only: this.state.manager_only,
      modifyAllDates:
        this.state.modifyRecursively && this.state.should_modify_all_dates,
      custom_selection: this.state.modifyRecursively,
      custom_selection_ids: selectedSimilarOfferIds,
      allow_guest_offer: this.state.allow_guest_offer,
      propagate_coach_override_value: modifyRecursively
        ? subTeacherEditPropagationMode
        : PropagateCoachOverrideToSimilarOffers.NO_PROPAGATION,
    };
    if (this.hasChangedDatetime()) {
      data.date_start = Moment(
        `${pad(date.date())}/${pad(date.month() + 1)}/${pad(date.year())} ${pad(
          Moment(hour, 'HH:mm').hour(),
        )}:${pad(Moment(hour, 'HH:mm').minute())}`,
        'DD/MM/YYYY hh:mm',
      );
    }

    appendModifiedData(this.initialOfferState, this.state, data);

    data.room_blueprint = this.state.roomBlueprint;

    this.props.onConfirm({ offerId: offer.id, data });
  };

  onFormFieldChange = (id: string) => (value: any) => {
    this.setState({ [id]: value });
  };

  renderButton = () => {
    const { t, similarOfferLoading, onCancel, processing } = this.props;
    const { step } = this.state;

    const handleCancelOrPreviousStep = () => {
      return step === OFFER_EDIT_FORM_STEPS.SHOW_WARNING
        ? this.setState({ step: OFFER_EDIT_FORM_STEPS.GATHER_INFO }, () =>
            this.props.fetchSimilarOffers?.(this.props.offer.id),
          )
        : onCancel;
    };

    const cancelOrPreviousLabel =
      step === OFFER_EDIT_FORM_STEPS.SHOW_WARNING
        ? t('common.previous')
        : t('common.cancel');

    if (processing) {
      return (
        <Grid
          container
          item
          justify="flex-end"
          alignItems="center"
          direction="row"
        >
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Grid item>
          <Button onClick={() => handleCancelOrPreviousStep()}>
            {cancelOrPreviousLabel}
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={this.onConfirm}
            variant="contained"
            color="primary"
            disabled={
              this.state.coach === null ||
              this.state.establishment === null ||
              (similarOfferLoading && this.state.modifyRecursively) ||
              !(
                getModifiedFields(this.initialOfferState, this.state).length ||
                this.hasChangedDatetime()
              ) ||
              this.roomBluePrintError()
            }
          >
            {t('common.confirm')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  handleFetchPaginatedSimilarOffers = (page_number: number) => {
    const initialCoachOverrideId = this.props.offer.coach_override?.id;
    const fetchSimilarOffersParams: OfferFilterData = {
      page: page_number,
      page_size: SIMILAR_OFFERS_PAGE_SIZE,
    };

    if (this.state.modifyRecursively) {
      fetchSimilarOffersParams.id__in = this.state.selectedSimilarOfferIds;
    }
    if (!initialCoachOverrideId) {
      fetchSimilarOffersParams.similars__coach_override__isnull = false;
    } else {
      fetchSimilarOffersParams.similars__coach_override__ne =
        initialCoachOverrideId;
    }

    this.props.fetchSimilarOffersWithReset(
      this.props.offer.id,
      fetchSimilarOffersParams,
    );
  };

  hasChangedCoachOverride = () =>
    this.state.coach_override !== this.initialOfferState.coach_override;

  hasChangedLevel = () => this.state.level !== this.initialOfferState.level;

  hasChangedCredit = () =>
    this.state.credit_price_override !==
    this.initialOfferState.credit_price_override;

  hasChangedEstablishment = () =>
    this.state.establishment !== this.initialOfferState.establishment;

  onConfirmStep = () => {
    const { step, selectedSimilarOfferIds, modifyRecursively } = this.state;
    if (
      step === OFFER_EDIT_FORM_STEPS.GATHER_INFO &&
      selectedSimilarOfferIds.length > 1 &&
      modifyRecursively &&
      this.hasChangedCoachOverride()
    ) {
      this.setState(
        {
          step: OFFER_EDIT_FORM_STEPS.SHOW_WARNING,
          should_modify_all_dates:
            this.props.similarOffers.length === selectedSimilarOfferIds.length,
        },
        () => this.handleFetchPaginatedSimilarOffers(1),
      );
    } else {
      this.onConfirm();
    }
  };

  renderNextStepButton = () => {
    const { processing, t, onCancel, similarOfferLoading } = this.props;
    return (
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Grid item onClick={onCancel}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
        </Grid>
        <Grid item>
          {processing ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={
                this.state.coach === null ||
                this.state.establishment === null ||
                (similarOfferLoading && this.state.modifyRecursively) ||
                !(
                  getModifiedFields(this.initialOfferState, this.state)
                    .length || this.hasChangedDatetime()
                ) ||
                this.roomBluePrintError() ||
                (this.props.isOfferInGroup &&
                  this.dateIsTooFarInFuture(this.state.date))
              }
              onClick={this.onConfirmStep}
            >
              {t('common.continue')}
            </Button>
          )}
        </Grid>
      </Grid>
    );
  };

  roomBluePrintError = () => {
    if (this.state.roomBlueprint) {
      const roomBlueprint = this.props.allRoomBlueprints.find(
        (r) => r.id === this.state.roomBlueprint,
      );

      let effectif =
        typeof this.state.effectif === 'string'
          ? parseInt(this.state.effectif)
          : this.state.effectif;

      /* eslint-disable-next-line */
      if (isNaN(effectif)) {
        effectif = 0;
      }

      if (
        roomBlueprint &&
        typeof this.state.effectif === 'number' &&
        SpotSchedulingHelper.getSpotCount(roomBlueprint) < effectif
      ) {
        return true;
      }
    }
    return false;
  };

  renderChangeWarning = () => (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Alert severity="info" className={this.props.classes.alignCenter}>
          {this.props.t('form.offer.warningPackonEdit')}
        </Alert>
      </Grid>
    </Grid>
  );

  renderBilling = () => null;

  renderChangeForm = () => {
    const hasErrorCredit =
      parseInt(this.state.credit_price_override, 10) === 0 ||
      this.state.credit_price_override > 4;

    const roomBlueprintsForEstablishment = this.props.roomBlueprints.filter(
      (roomBlueprint: RoomBlueprint) => {
        return roomBlueprint.establishment === this.state.establishment;
      },
    );

    const handleChangeRecursion = (ev: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ modifyRecursively: ev.target.checked });

    return (
      <div className={this.props.classes.container}>
        {this.props.offer?.group?.name && (
          <Alert
            severity="error"
            variant="outlined"
            className={this.props.classes.alert}
          >
            {this.props.t('form.offer.editingGroup', {
              name: this.props.offer.group.name,
            })}
          </Alert>
        )}
        <div className={this.props.classes.fieldGroup}>
          <Typography variant="subtitle2">
            {this.props.t('form.caracteristics')}
          </Typography>
          <div className={this.props.classes.groupContainer}>
            <div className={this.props.classes.borderBar} />
            <div className={this.props.classes.columnFullWidth}>
              <div className={this.props.classes.field}>
                <MetaActivitySelector
                  metaActivities={this.props.metaActivities || []}
                  closeMenuOnSelect
                  selectedMetaActivities={
                    this.state.meta_activity
                      ? [this.state.meta_activity]
                      : undefined
                  }
                  noMulti
                  selectOption={({ value }) =>
                    this.onFormFieldChange('meta_activity')(value)
                  }
                  disabled={this.props.offer.group}
                />
              </div>
              <div className={this.props.classes.field}>
                <NumericInput
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                  label={this.props.t('offer.effectif')}
                  value={this.state.effectif}
                  onChange={(event) =>
                    this.onFormFieldChange('effectif')(event.target.value)
                  }
                />
              </div>
              {!!this.props.showPartnership && (
                <div className={this.props.classes.field}>
                  <NumericInput
                    required
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                    label={this.props.t('offer.partner_max_booking_count')}
                    value={this.state.partner_max_booking_count}
                    onChange={(event) =>
                      this.onFormFieldChange('partner_max_booking_count')(
                        event.target.value,
                      )
                    }
                    disabled={!!this.props.offer?.group}
                  />
                  {this.props.offer?.group && (
                    <Typography variant="caption" color="textSecondary">
                      {this.props.t('form.noPartnershipIntegration')}
                    </Typography>
                  )}
                </div>
              )}
              <div className={this.props.classes.field}>
                <NumericInput
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                  value={this.state.waiting_list_max_size}
                  label={this.props.t('offer.sizeOfWaitingList')}
                  onChange={(event) =>
                    this.onFormFieldChange('waiting_list_max_size')(
                      event.target.value,
                    )
                  }
                  disabled={this.props.offer?.group ?? false}
                />
                {this.props.offer?.group && (
                  <Typography variant="caption" color="textSecondary">
                    {this.props.t('form.noWaitingList')}
                  </Typography>
                )}
              </div>
              <div className={this.props.classes.field}>
                <NumericInput
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                  label={this.props.t('form.credit_price')}
                  value={this.state.credit_price_override}
                  error={hasErrorCredit}
                  onChange={(event) =>
                    this.onFormFieldChange('credit_price_override')(
                      event.target.value,
                    )
                  }
                />
              </div>
              {hasErrorCredit ? (
                <Typography color="error" variant="caption">
                  {this.props.t('form.noAvailableCredit')}
                </Typography>
              ) : null}
              {this.hasChangedCredit() ? (
                <Typography color="error" variant="caption">
                  {this.props.t('form.warningCreditChange')}
                </Typography>
              ) : null}
              <div className={this.props.classes.field}>
                <LevelSelector
                  inScrollBar
                  selectedLevel={this.state.level}
                  onSelect={(level) => {
                    this.onFormFieldChange('level')(level);
                  }}
                  customLevels={this.props.activeCustomLevels}
                  memoryLevels={this.props.allCustomLevels}
                  onCreateLevel={this.props.createLevel}
                  onEditLevel={this.props.updateLevel}
                  onDeleteLevel={this.handleDeleteLevel}
                  isDisabled={!!this.props.offer.group}
                />
              </div>
              {this.props.offer.group && (
                <div className={this.props.classes.row}>
                  <InfoIcon color="disabled" />
                  <Typography variant="caption" color="textSecondary">
                    {this.props.t('form.editGroup')}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={this.props.classes.fieldGroup}>
          {this.renderBilling()}
        </div>
        <div className={this.props.classes.fieldGroup}>
          <Typography variant="subtitle2">
            {this.props.t('form.timeSettings')}
          </Typography>
          <div className={this.props.classes.groupContainer}>
            <div className={this.props.classes.borderBar} />
            <div>
              <div className={this.props.classes.field}>
                <DateTimeInput
                  timezone={this.props.offer.timezone_name}
                  value={moment(this.state.date)
                    .set('hour', this.state.hour.split(':')[0])
                    .set('minute', this.state.hour.split(':')[1])}
                  onChange={(date_interval_start) => {
                    this.setState({
                      date: moment(date_interval_start),
                      hour: moment(date_interval_start).format('HH:mm'),
                    });
                  }}
                  hasDateTooFarError={
                    this.props.isOfferInGroup &&
                    this.dateIsTooFarInFuture(this.state.date)
                  }
                />
              </div>
              <div className={this.props.classes.field}>
                <DurationInput
                  required
                  value={this.state.duration_minute}
                  disallowedNullDuration={this.state.duration_minute === 0}
                  durationError={this.props.t('offer.noEmptyDuration')}
                  onChange={(e) => {
                    this.onFormFieldChange('duration_minute')(e || 0);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={this.props.classes.fieldGroup}>
          <Typography variant="subtitle2">
            {this.props.t('coach:coach')}
          </Typography>
          <div className={this.props.classes.groupContainer}>
            <div className={this.props.classes.borderBar} />
            <CoachSubForm
              coaches={this.props.coaches}
              coach={this.props.coaches.find((c) => c.id === this.state.coach)}
              coach_override={this.props.coaches.find(
                (c) => c.id === this.state.coach_override,
              )}
              coachs_override={this.props.coaches.filter(
                (c) => c.id !== this.state.coach,
              )}
              offer={this.props.offer}
              onChangeCoach={(coach) =>
                this.onFormFieldChange('coach')(coach ? coach.id : null)
              }
              onChangeCoachOverride={(coach) =>
                this.onFormFieldChange('coach_override')(
                  coach ? coach.id : null,
                )
              }
              onDeleteCoachSubstitute={() =>
                this.setState({ coach_override: null })
              }
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
              onChangeCoachPaymentRule={this.onFormFieldChange(
                'coach_payment_rule',
              )}
              coach_payment_rule={this.state.coach_payment_rule}
            />
          </div>
        </div>
        <div className={this.props.classes.fieldGroup}>
          <Typography variant="subtitle2">
            {this.props.t('establishment:room')}
          </Typography>
          <div className={this.props.classes.groupContainer}>
            <div className={this.props.classes.borderBar} />
            <EstablishmentSubForm
              required
              onChangeEstablishment={(establishment) =>
                this.onFormFieldChange('establishment')(
                  establishment ? establishment.id : null,
                )
              }
              establishment={this.props.establishments.find(
                (es) => es.id === this.state.establishment,
              )}
              establishments={this.props.establishments}
              offer={this.props.offer}
              hasChangedEstablishment={this.hasChangedEstablishment()}
            />
          </div>
        </div>

        {(this.state.roomBlueprint ||
          roomBlueprintsForEstablishment.length > 0) && (
          <div className={this.props.classes.fieldGroup}>
            <Typography variant="subtitle2">
              {this.props.t('spotScheduling:roomBlueprints')}
            </Typography>

            <div className={this.props.classes.groupContainer}>
              <div className={this.props.classes.borderBar} />

              <div className={this.props.classes.blueprintSelectorContainer}>
                <RoomBlueprintSelector
                  id="roomBlueprint"
                  roomBlueprints={roomBlueprintsForEstablishment}
                  value={this.props.allRoomBlueprints.find(
                    (room) => room.id === this.state.roomBlueprint,
                  )}
                  onChange={(roomBlueprint: RoomBlueprint) => {
                    this.onFormFieldChange('roomBlueprint')(
                      roomBlueprint ? roomBlueprint.id : null,
                    );
                  }}
                  placeholder={this.props.t('spotScheduling:search')}
                />

                {!this.roomBluePrintError() && !this.state.roomBlueprint && (
                  <Typography
                    color="textSecondary"
                    variant="caption"
                    className={this.props.classes.marginTop1}
                  >
                    {this.props.t('spotScheduling:searchHelper')}
                  </Typography>
                )}

                {this.roomBluePrintError() && (
                  <Typography variant="caption" color="error">
                    {this.props.t('spotScheduling:effectifError')}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={this.props.classes.fieldGroup}>
          {!(this.props.offer?.group ?? false) && this.renderAdvancedSettings()}
        </div>

        <FeatureListProvider>
          {(featureList) => {
            const hasZoomApp =
              featureList?.upsell?.find(
                (f) => f.readable_identifier === 'zoom',
              ) ?? false;
            if (
              this.props.offer &&
              this.props.offer.meta_activity &&
              this.props.offer.meta_activity.is_broadcast &&
              !this.props.is_whereby_integration_enabled
            ) {
              return (
                <div className={this.props.classes.fieldGroup}>
                  {(() => {
                    const hasError =
                      this.state.broadcast_link &&
                      !this.state.broadcast_link.startsWith('https://') &&
                      !this.state.broadcast_link.startsWith('http://');
                    return (
                      <TextField
                        variant="outlined"
                        error={hasError}
                        value={this.state.broadcast_link}
                        label={this.props.t('offer.broadcast_link')}
                        disabled={
                          hasZoomApp &&
                          (this.props.zoomAppDetail
                            ? !this.props.zoomAppDetail.is_disabled
                            : false)
                        }
                        helperText={
                          // eslint-disable-next-line
                          hasZoomApp
                            ? this.props.t(
                                'form.offer.broadcast_link.explainZoomApp',
                              )
                            : hasError
                            ? this.props.t('form.offer.broadcast_link.error')
                            : null
                        }
                        placeholder="https://zoom.us/123456789"
                        onChange={(event) => {
                          this.onFormFieldChange('broadcast_link')(
                            event.target.value,
                          );
                        }}
                        fullWidth
                      />
                    );
                  })()}
                </div>
              );
            }
            return null;
          }}
        </FeatureListProvider>
        <div className={this.props.classes.fieldGroup}>
          {this.props.offer.id && (
            <>
              <div className={this.props.classes.field}>
                <NotificationToogle
                  notifyConsumers={this.state.notifyConsumers}
                  onNotificationChange={(notifyConsumers) =>
                    this.setState({ notifyConsumers })
                  }
                />
              </div>
              {!!this.props.showPartnership && (
                <div className={this.props.classes.field}>
                  <PartnershipToogle
                    disabled={
                      this.state.manager_only || !!this.props.offer?.group
                    }
                    available_on_partnership={
                      this.state.available_on_partnership
                    }
                    onChange={(available_on_partnership) =>
                      this.setState({ available_on_partnership })
                    }
                  />
                </div>
              )}
              <div className={this.props.classes.field}>
                <ManagerOnlyToogle
                  manager_only={this.state.manager_only}
                  onChange={(manager_only) => this.setState({ manager_only })}
                  disabled={this.props.offer.group}
                />
              </div>
              {(this.state.selectedSimilarOfferIds?.length ||
                this.props.similarOfferLoading) && (
                <div className={this.props.classes.field}>
                  <RecursionToogle
                    edit
                    loading={this.props.similarOfferLoading}
                    message={this.props.t(
                      this.props.offer?.group
                        ? 'offer:liveOfferEdit.editSimilarOffersGroup'
                        : 'offer:liveOfferEdit.editSimilarOffers',
                    )}
                    listTitle={this.props.t('offer:liveOfferEdit.selectEdit')}
                    modifyRecursively={this.state.modifyRecursively}
                    dateTimeDiff={Moment(
                      `${pad(this.state.date.date())}/${pad(
                        this.state.date.month() + 1,
                      )}/${pad(this.state.date.year())} ${pad(
                        Moment(this.state.hour, 'HH:mm').hour(),
                      )}:${pad(Moment(this.state.hour, 'HH:mm').minute())}`,
                      'DD/MM/YYYY hh:mm',
                    ).diff(this.initialOfferState.date_start)}
                    onChangeRecursion={handleChangeRecursion}
                    handleChange={this.handleChangeSelection}
                    selectedSimilarOfferIds={this.state.selectedSimilarOfferIds}
                    similarOffers={this.props.similarOffers?.filter(
                      (so) => so.available,
                    )}
                    selectAll={this.selectAll}
                    unselectAll={this.unselectAll}
                  />
                </div>
              )}
              {this.props.allowGuestMaster && (
                <div className={this.props.classes.field}>
                  <FormToggle
                    value={this.state.allow_guest_offer}
                    onChange={(allow_guest_offer: boolean) =>
                      this.setState({ allow_guest_offer: !allow_guest_offer })
                    }
                    title={this.props.t('form.offer.explainAllowGuest')}
                  />
                </div>
              )}
            </>
          )}
          {this.renderNextStepButton()}
        </div>
      </div>
    );
  };

  renderAdvancedSettings = () => {
    const { classes, t, tagList } = this.props;
    const { openAdvancedOptions } = this.state;
    if (!tagList) {
      return <div />;
    }
    return (
      <>
        <div className={classes.advancedOptionsSection}>
          <ButtonBase
            onClick={() =>
              this.setState((prevState: State) => ({
                openAdvancedOptions: !prevState.openAdvancedOptions,
              }))
            }
            className={classes.advancedOptionsHeader}
          >
            <SettingsIcon className={classes.settings} />
            <Typography variant="h6">
              {t('form.offer.advancedOptions.header')}
            </Typography>
            {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ButtonBase>
          <Collapse in={openAdvancedOptions}>
            <div className={classes.tagSection}>
              <Typography className={classes.title}>
                {`${t('form.offer.advancedOptions.tag.header')}\u00A0`}
              </Typography>
              <Typography variant="caption">
                {t('form.offer.advancedOptions.tag.helperText')}
              </Typography>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <CheckIcon className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('form.offer.advancedOptions.tag.allowed')}
                  </Typography>
                </div>
                {tagList && (
                  <TagSelector
                    allTagsWithTagGroup={
                      [
                        ...(tagList || [])?.filter(
                          (tag) => !this.state.blacklist_tags?.includes(tag.id),
                        ),
                      ] || []
                    }
                    placeholder={t(
                      'form.offer.advancedOptions.tag.doNotSelectToAllowAllMembers',
                    )}
                    onChange={(
                      items: Array<{
                        item: Tag & { label: string; value: number };
                      }>,
                    ) =>
                      this.setState({
                        whitelist_tags: items.map((item) => item.value),
                      })
                    }
                    onDeleteTag={(itemId: number) =>
                      this.setState((prevState: State) => ({
                        ...prevState,
                        whitelist_tags: prevState.whitelist_tags.filter(
                          (tg) => tg !== itemId,
                        ),
                      }))
                    }
                    selectedTags={this.state.whitelist_tags}
                    isClearable
                    closeMenuOnSelect
                    inScrollBar
                  />
                )}
              </div>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <BlockIcon className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('form.offer.advancedOptions.tag.notAllowed')}
                  </Typography>
                </div>
                {tagList && (
                  <TagSelector
                    allTagsWithTagGroup={
                      [
                        ...(tagList || [])?.filter(
                          (tag) => !this.state.whitelist_tags?.includes(tag.id),
                        ),
                      ] || []
                    }
                    placeholder={t(
                      'form.offer.advancedOptions.tag.doNotSelectToAllowAllMembers',
                    )}
                    onChange={(
                      items: Array<{
                        item: Tag & { label: string; value: number };
                      }>,
                    ) =>
                      this.setState({
                        blacklist_tags: items.map((item) => item.value),
                      })
                    }
                    onDeleteTag={(itemId: number) =>
                      this.setState((prevState: State) => ({
                        ...prevState,
                        blacklist_tags: prevState.blacklist_tags.filter(
                          (tg) => tg !== itemId,
                        ),
                      }))
                    }
                    selectedTags={this.state.blacklist_tags}
                    isClearable
                    closeMenuOnSelect
                    inScrollBar
                  />
                )}
              </div>
            </div>
          </Collapse>
        </div>
      </>
    );
  };

  renderConfirmChange = () => {
    const {
      classes,
      similarOffers,
      coaches,
      similarOfferLoading,
      similarOffersCount,
      similarOffersPage,
    } = this.props;
    const { subTeacherEditPropagationMode, selectedSimilarOfferIds } =
      this.state;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = !!e.target.checked;
      const togglePropagationValue = isChecked
        ? PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY
        : PropagateCoachOverrideToSimilarOffers.NO_PROPAGATION;

      this.setState({
        subTeacherEditPropagationMode: togglePropagationValue,
      });
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({
        subTeacherEditPropagationMode: parseInt(e.target.value),
      });

    const handlePageChange = (
      ev: React.ChangeEvent<HTMLButtonElement>,
      page_number: number,
    ) => this.handleFetchPaginatedSimilarOffers(page_number);

    return (
      <Grid container direction="column" spacing={4}>
        <Grid item>{this.renderChangeWarning()}</Grid>
        <Grid item>
          <OfferEditSubteacherChangeSettings
            classes={classes}
            similarOffers={similarOffers}
            selectedSimilarOfferIds={selectedSimilarOfferIds}
            coaches={coaches}
            similarOfferLoading={similarOfferLoading}
            similarOffersCount={similarOffersCount}
            similarOffersPage={similarOffersPage}
            subTeacherEditPropagationMode={subTeacherEditPropagationMode}
            onCheckboxChange={handleCheckboxChange}
            onRadioChange={handleRadioChange}
            onPageChange={handlePageChange}
          />
        </Grid>
        <Grid item>{this.renderButton()}</Grid>
      </Grid>
    );
  };

  render() {
    if (!this.props.offer) return null;
    switch (this.state.step) {
      case OFFER_EDIT_FORM_STEPS.GATHER_INFO:
      default:
        return this.renderChangeForm();

      case OFFER_EDIT_FORM_STEPS.SHOW_WARNING:
        return this.renderConfirmChange();
    }
  }
}

const styles = (theme: Theme) =>
  createStyles({
    subtitle: { marginBottom: theme.spacing(1) },
    fieldGroup: { marginBottom: theme.spacing(4) },
    fieldLeft: {
      marginLeft: theme.spacing(1),
    },
    field: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(2),
      width: '100%',
    },
    columnFullWidth: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
    borderBar: {
      backgroundColor: theme.palette.primary.main,
      heigth: '100%',
      width: '2.8px',
      marginRight: theme.spacing(1),
    },
    groupContainer: {
      display: 'flex',
      width: '100%',
    },
    blueprintSelectorContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    marginTop1: {
      marginTop: theme.spacing(1),
    },
    advancedOptionsSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontWeight: 500,
      color: '#000',
    },
    settings: {
      color: '#868686',
    },
    tagSelectorLabel: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: theme.spacing(1),
    },
    tagSelectorLabelIcon: {
      marginRight: theme.spacing(1),
    },
    tagSelector: {
      paddingBottom: theme.spacing(2),
    },
    tagSectionHeader: {
      paddingBottom: theme.spacing(1),
    },
    tagSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    advancedOptionsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: theme.spacing(2),
    },
    alert: {
      marginBottom: theme.spacing(2),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    sessionItem: {
      borderLeft: `3px solid ${theme.palette.primary.main}`,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
    paginationIndicator: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    sessionsList: {
      border: `1px solid ${theme.palette.grey[200]}`,
      borderRadius: 4,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    alignCenter: {
      alignItems: 'center',
    },
    propagateInfo: {
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(OfferEditForm);
