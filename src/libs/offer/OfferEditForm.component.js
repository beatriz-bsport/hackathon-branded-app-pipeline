// @flow
import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import { Moment } from '../../i18n';
import DurationInput from '../../components/input/DurationInput.component';
import NumericInput from '../../components/input/NumericInput.component';
import type { Coach, Establishment, Offer } from '../../api/types';

import RecursionToogle from './form/RecursionToogle.component';
import EstablishmentSubForm from './form/EstablishmentSubForm.component';
import CoachSubForm from './form/CoachSubForm.component';
import NotificationToogle from './form/NotificationToogle.component';
import WarningForceRecursion from './form/WarningForceRecursion.component';

import LevelInput from '../../components/input/LevelInput.component';
import DateTimeInput from '../../components/input/DateTimeInput.component';

import MetaActivitySelector from '../meta-activity/components/MetaActivitySelector.component';

type Props = {
  processing: boolean,
  similarOfferLoading: boolean,
  is_whereby_integration_enabled: boolean,
  t: TFunction,
  classes: Object,

  offer: Offer,
  similarOffers: Array<Offer>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,

  onCancel: () => void,
  fetchSimilarOffers: (id: number) => void,
  onConfirm: ({ offerId: number, data: FormData }) => void,
  metaActivities: Array<MetaActivity>,
};

type State = {
  hour: string,
  step: number,
  coach: number,
  establishment: number,
  modifyRecursively: boolean,
  notifyConsumers: boolean,
  date: Object,
  duration_minute: ?number,

  coach_override: ?Coach,
  establishment_override: ?Establishment,
  isSimilarOfferListExpanded: boolean,
  similarOffersWithSelectedStatus: Array<Object>,
};

export type FormData = Object;

function pad(n) {
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
  'credit_price_override',
  'waiting_list_max_size',
  'level',
  'meta_activity',
];

const getModifiedFields = (oldData, newData) => {
  const modifiedFields = [];
  for (const field of FIELDS) {
    if (oldData[field] !== newData[field]) {
      modifiedFields.push(field);
    }
  }
  return modifiedFields;
};
const appendModifiedData = (oldData, newData, data) => {
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

export class EditLiveOfferForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSimilarOfferListExpanded: true,
      step: STEPS.GATHER_INFO,
      modifyRecursively: false,
      notifyConsumers: false,
      broadcast_link: props.offer.broadcast_link || '',
      establishment: props.offer.establishment.id,
      establishment_override: props.offer.establishment_override
        ? props.offer.establishment_override.id
        : null,
      coach: props.offer.coach.id,
      coach_override: props.offer.coach_override
        ? props.offer.coach_override.id
        : null,
      date: Moment(props.offer.date_start),
      duration_minute: props.offer.duration_minute,
      hour: moment(props.offer.date_start).format('HH:mm'),
      effectif: props.offer.effectif,
      credit_price_override: props.offer.credit_price_override,
      waiting_list_max_size: props.offer.waiting_list_max_size,
      level: props.offer.level,
      meta_activity:
        props.offer.meta_activity && this.props.offer.meta_activity.id,
      similarOffersWithSelectedStatus: (this.props.similarOffers || [])
        .filter((so) => so.available)
        .map((so) => ({
          ...so,
          selected: true,
        })),
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
      meta_activity:
        this.props.offer.meta_activity && this.props.offer.meta_activity.id,
      establishment: props.offer.establishment.id,
      duration_minute: props.offer.duration_minute,
      effectif: props.offer.effectif,
      credit_price_override: props.offer.credit_price_override,
      waiting_list_max_size: props.offer.waiting_list_max_size,
      level: props.offer.level_id,
    };
  }

  componentDidMount() {
    this.props.fetchSimilarOffers(this.props.offer.id);
  }

  componentDidUpdate(prevProps: Props) {
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
      similarOffersWithSelectedStatus: prevState.similarOffersWithSelectedStatus.map(
        (so) => ({
          ...so,
          selected: true,
        }),
      ),
    }));
  };

  unselectAll = () => {
    this.setState((prevState) => ({
      similarOffersWithSelectedStatus: prevState.similarOffersWithSelectedStatus.map(
        (so, index) => ({
          ...so,
          selected: index === 0,
        }),
      ),
    }));
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
    const data: FormData = {
      notifyConsumers,
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
    this.props.onConfirm({ offerId: offer.id, data });
  };

  onFormFieldChange = (id: string) => (value: *) => {
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
              )
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
                )
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

    return (
      <div className={this.props.classes.container}>
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
                />
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
              <div className={this.props.classes.fieldLeft}>
                <LevelInput
                  required
                  value={this.state.level}
                  onChange={(e) =>
                    parseInt(
                      this.onFormFieldChange('level')(e.target.value),
                      10,
                    )
                  }
                />
              </div>
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
            />
          </div>
        </div>
        <div className={this.props.classes.fieldGroup}>
          <Typography variant="subtitle2">
            {this.props.t('establishment:establishment')}
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
        {this.props.offer &&
        this.props.offer.meta_activity &&
        this.props.offer.meta_activity.is_broadcast &&
        !this.props.is_whereby_integration_enabled ? (
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
                  helperText={
                    hasError
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
        ) : null}
        <div className={this.props.classes.fieldGroup}>
          <div className={this.props.classes.field}>
            <NotificationToogle
              notifyConsumers={this.state.notifyConsumers}
              onNotificationChange={(notifyConsumers) =>
                this.setState({ notifyConsumers })
              }
            />
          </div>
          <div className={this.props.classes.field}>
            <RecursionToogle
              edit
              loading={this.props.similarOfferLoading}
              message={this.props.t('offer:liveOfferEdit.editSimilarOffers')}
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
          {this.renderNextStepButton()}
        </div>
      </div>
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
    switch (this.state.step) {
      case STEPS.GATHER_INFO:
      default:
        return this.renderChangeForm();

      case STEPS.SHOW_WARNING:
        return this.renderConfirmChange();
    }
  }
}

const styles = (theme) => ({
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
});

export default compose(
  withStyles(styles),
  withTranslation(),
)(EditLiveOfferForm);
