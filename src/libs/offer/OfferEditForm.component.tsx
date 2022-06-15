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

import RecursionToogle from './form/RecursionToogle.component';
import EstablishmentSubForm from './form/EstablishmentSubForm.component';
import CoachSubForm from './form/CoachSubForm.component';
import NotificationToogle from './form/NotificationToogle.component';
import PartnershipToogle from './form/PartnershipToogle.component';
import ManagerOnlyToogle from './form/ManagerOnlyToogle.component';

import MetaActivitySelector from '../meta-activity/components/MetaActivitySelector.component';
import FeatureListProvider from '../company/hocs/feature-list-provider.hoc';
import RoomBlueprintSelector from '../spot-scheduling/component/RoomBlueprintSelector.component';
import SpotSchedulingHelper from '../spot-scheduling/utils';

import TagSelector from '#libs/tag/components/TagSelector.selector';

import { Coach, Establishment, Offer } from '../../api/types';
import { RoomBlueprint } from '../spot-scheduling/types';
import { CoachPaymentRule } from '../coach-payment-rules/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Tag, TagGroup } from '#libs/tag/types';
import { Level } from '#libs/level/types';
import { OptionCallback } from '../../state/types';
import LevelSelector from '#libs/level/components/LevelSelector.component';
import FormToggle from '#components/forms/FormToggle.component';

type OwnProps = {
  processing: boolean;
  similarOfferLoading: boolean;
  is_whereby_integration_enabled: boolean;

  offer: Offer;
  similarOffers: Array<Offer>;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  roomBlueprints: RoomBlueprint[];
  allRoomBlueprints: RoomBlueprint[];
  allowGuestMaster?: boolean;
  onCancel: () => void;
  fetchSimilarOffers: (id: number) => void;
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

  coach_override?: Coach;
  establishment_override?: Establishment;
  isSimilarOfferListExpanded: boolean;
  similarOffersWithSelectedStatus: Array<Object>;
  coach_payment_rule: number | null;
  manager_only: boolean;
  openAdvancedOptions: boolean;
  whitelist_tags: Array<number>;
  blacklist_tags: Array<number>;
  level: number;
  allow_guest_offer?: boolean;
};

export type FormData = Object;

function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

const STEPS = {
  GATHER_INFO: 0,
  SHOW_WARNING: 1,
};

const FIELDS = [
  'broadcast_link',
  'establishment',
  'establishment_override',
  'coach',
  'coach_override',
  'duration_minute',
  'effectif',
  'partner_max_booking_count',
  'credit_price_override',
  'waiting_list_max_size',
  'level',
  'meta_activity',
  'coach_payment_rule',
  'whitelist_tags',
  'blacklist_tags',
];

type OfferData = {
  [key: string]: any;
};
const getModifiedFields = (oldData: OfferData, newData: OfferData) => {
  const modifiedFields = [];
  for (const field of FIELDS) {
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
  for (const field of FIELDS) {
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
      step: STEPS.GATHER_INFO,
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
      similarOffersWithSelectedStatus: (this.props.similarOffers || [])
        .filter((so) => so.available)
        .map((so) => ({
          ...so,
          selected: true,
        })),

      whitelist_tags: props.offer.whitelist_tags?.map((tag) => tag.id) || [],
      blacklist_tags: props.offer.blacklist_tags?.map((tag) => tag.id) || [],
      openAdvancedOptions: false,
      allow_guest_offer: !!props.offer.allow_guest_offer,
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
      (this.props.similarOffers || []).length
    ) {
      this.setState({
        similarOffersWithSelectedStatus: (this.props.similarOffers || [])
          .filter((so) => so.available)
          .map((so) => ({
            ...so,
            selected: true,
          })),
      });
    }
  }

  handleChangeSelection = (index: number) => {
    this.setState((prevState) => {
      const similarOffersWithSelectedStatus = [
        ...prevState.similarOffersWithSelectedStatus,
      ];
      similarOffersWithSelectedStatus[index] = {
        ...similarOffersWithSelectedStatus[index],
        selected: !prevState.similarOffersWithSelectedStatus[index].selected,
      };
      return { similarOffersWithSelectedStatus };
    });
  };

  selectAll = () => {
    this.setState((prevState) => ({
      similarOffersWithSelectedStatus:
        prevState.similarOffersWithSelectedStatus.map((so) => ({
          ...so,
          selected: true,
        })),
    }));
  };

  unselectAll = () => {
    this.setState((prevState) => ({
      similarOffersWithSelectedStatus:
        prevState.similarOffersWithSelectedStatus.map((so, index) => ({
          ...so,
          selected: index === 0,
        })),
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

  shouldModifyAllDates = () => this.state.modifyRecursively;

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
    const { notifyConsumers, date, hour } = this.state;
    const data = {
      notifyConsumers,
      available_on_partnership: this.state.available_on_partnership,
      manager_only: this.state.manager_only,
      modifyAllDates:
        this.shouldModifyAllDates() &&
        !this.state.similarOffersWithSelectedStatus.filter((so) => !so.selected)
          .length &&
        !!this.state.similarOffersWithSelectedStatus.length,
      custom_selection: !!this.state.similarOffersWithSelectedStatus.filter(
        (so) => !so.selected,
      ).length,
      custom_selection_ids: this.state.similarOffersWithSelectedStatus
        .filter((so) => so.selected)
        .map((so) => so.id),
      allow_guest_offer: this.state.allow_guest_offer,
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
        <Grid item onClick={onCancel}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
        </Grid>
        <Grid item>
          <Button
            onClick={this.onConfirm}
            variant="contained"
            color="primary"
            disabled={
              this.state.coach === null ||
              this.state.establishment === null ||
              (similarOfferLoading && this.shouldModifyAllDates()) ||
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

  onConfirmGatherInfoStep = () => {
    if (this.shouldModifyAllDates()) {
      this.setState({ step: STEPS.SHOW_WARNING });
    } else {
      this.onConfirm();
    }
  };

  hasChangedCoach = () => this.state.coach !== this.initialOfferState.coach;

  hasChangedLevel = () => this.state.level !== this.initialOfferState.level;

  hasChangedCredit = () =>
    this.state.credit_price_override !==
    this.initialOfferState.credit_price_override;

  hasChangedEstablishment = () =>
    this.state.establishment !== this.initialOfferState.establishment;

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
                (similarOfferLoading && this.shouldModifyAllDates()) ||
                !(
                  getModifiedFields(this.initialOfferState, this.state)
                    .length || this.hasChangedDatetime()
                ) ||
                this.roomBluePrintError()
              }
              onClick={this.onConfirmGatherInfoStep}
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

  renderWarning = () => (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography>{this.props.t('form.offer.warningPackonEdit')}</Typography>
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
                    label={this.props.t('offer.partner_max_booking_count')}
                    value={this.state.partner_max_booking_count}
                    onChange={(event) =>
                      this.onFormFieldChange('partner_max_booking_count')(
                        event.target.value,
                      )
                    }
                  />
                </div>
              )}
              <div className={this.props.classes.field}>
                <NumericInput
                  required
                  fullWidth
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
                  onChange={(date_interval_start) =>
                    this.setState({
                      date: moment(date_interval_start),
                      hour: moment(date_interval_start).format('HH:mm'),
                    })
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
                        disabled={hasZoomApp}
                        helperText={
                          // eslint-disable-next-line
                          hasZoomApp
                            ? this.props.t(
                                'offer.broadcast_link.explainZoomApp',
                              )
                            : hasError
                            ? this.props.t('offer.broadcast_link.error')
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
              {(this.state?.similarOffersWithSelectedStatus?.length > 1 ||
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
                    shouldModifyAllDates={this.shouldModifyAllDates()}
                    dateTimeDiff={Moment(
                      `${pad(this.state.date.date())}/${pad(
                        this.state.date.month() + 1,
                      )}/${pad(this.state.date.year())} ${pad(
                        Moment(this.state.hour, 'HH:mm').hour(),
                      )}:${pad(Moment(this.state.hour, 'HH:mm').minute())}`,
                      'DD/MM/YYYY hh:mm',
                    ).diff(this.initialOfferState.date_start)}
                    onChangeRecursion={() =>
                      this.setState((prevState) => ({
                        modifyRecursively: !prevState.modifyRecursively,
                      }))
                    }
                    handleChange={this.handleChangeSelection}
                    similarOffersWithSelectedStatus={
                      this.state.similarOffersWithSelectedStatus
                    }
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

  renderConfirmChange = () => (
    <Grid container direction="column" spacing={4}>
      <Grid item>
        <Typography variant="h6" className={this.props.classes.subtitle}>
          {this.props.t('calendar.modifyOffer')}
        </Typography>
      </Grid>
      <Grid item>{this.renderWarning()}</Grid>
      <Grid item>{this.renderButton()}</Grid>
    </Grid>
  );

  render() {
    if (!this.props.offer) return null;
    switch (this.state.step) {
      case STEPS.GATHER_INFO:
      default:
        return this.renderChangeForm();

      case STEPS.SHOW_WARNING:
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
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(OfferEditForm);
