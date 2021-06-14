// @flow

import React, { Component } from 'react';
import compose from 'recompose/compose';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoIcon from '@material-ui/icons/Info';
import CalendarIcon from '@material-ui/icons/Today';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { Theme } from '@material-ui/core';
import DatePicker from 'material-ui-pickers/DatePicker';

import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import AddIcon from '@material-ui/icons/Add';
import { WithTranslation, withTranslation } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import EstablishmentSelector from '../establishment/components/EstablishmentSelectorWithCard.component';
import CoachSelector from '../associated-coach/components/CoachSelectorWithCard.component';
import FeatureListProvider from '../company/hocs/feature-list-provider.hoc';

import FormField, {
  NOT_RECURRENT,
  WEEKLY,
  MONTHLY,
  DAILY,
} from '../../components/input/FormField.component';
import DurationInput from '../../components/input/DurationInput.component';
import DateTimeInput from '../../components/input/DateTimeInput.component';
import type { Coach, MetaActivity, Establishment } from '../../api/types';
import { MaterialStyleType } from '../../utils/types';
import { RoomBlueprint } from '../spot-scheduling/types';
import RoomBlueprintSelector from '../spot-scheduling/component/RoomBlueprintSelector.component';
import SpotSchedulingHelper from '../spot-scheduling/utils';

const styles = (theme: Theme) => ({
  paperContainer: {
    padding: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(2),
  },
  headlineElt: {
    marginLeft: theme.spacing(1),
  },
  generationSummary: {
    marginTop: theme.spacing(4),
  },
  fieldGroup: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  marginTop1: {
    marginTop: theme.spacing(1),
  },
  marginTop2: {
    marginTop: theme.spacing(2),
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
});

type OwnProps = {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivity: MetaActivity;
  roomBlueprints: RoomBlueprint[];
  classes: Object;
  selectedDate: Object;
  discardButtonText?: string;
  processing: boolean;
  onCancel: () => void;
  onSubmit: (args: {
    establishment?: number;
    coach?: number;
    credits: string;
    dates?: number[];
    effectif?: string;
    waiting_list_max_size?: number;
    level?: number;
    duration_minute: number;
    broadcast_link: string;
    room_blueprint?: number;
  }) => void;

  is_whereby_integration_enabled: boolean;
  timezone: string;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  recurrence: '0' | '1' | '2' | '3';
  recurrenceWeekDay: {
    '1': boolean;
    '2': boolean;
    '3': boolean;
    '4': boolean;
    '5': boolean;
    '6': boolean;
    '7': boolean;
  };
  date_interval_start: Moment;
  date_interval_end: Moment;
  broadcast_link: string; // TODO check this
  // hour: any; // TODO check this
  coach?: number;
  establishment?: number;
  roomBlueprint?: number;
  credits: string;
  level?: number;
  effectif?: string;
  waiting_list_max_size?: number;
  duration_minute: number;
};

export class OfferForm extends Component<Props, State> {
  get effectif() {
    let effectif = parseInt(this.state.effectif);
    /* eslint-disable-next-line */
    if (isNaN(effectif)) {
      effectif = 0;
    }
    return effectif;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      recurrence: NOT_RECURRENT,
      recurrenceWeekDay: {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false,
        '6': false,
        '7': false,
      },
      date_interval_start: moment(
        props.selectedDate ? props.selectedDate : undefined,
      ),
      date_interval_end: moment(
        props.selectedDate ? props.selectedDate : undefined,
      ),
      broadcast_link: '',
      effectif: null,
      waiting_list_max_size: 0,
      coach: null,
      establishment: null,
      credits: '1',
      level: 1,
      duration_minute: 30,
    };
  }

  onFormFieldChange = (id: keyof State) => (value: any) => {
    // @ts-ignore
    this.setState({ [id]: value });
  };

  generateOffers = (event: any) => {
    event.preventDefault();
    if (this.endDateIsInvalid()) {
      return;
    }
    const datesToGenerate = this.getDates();
    const {
      level,
      effectif,
      waiting_list_max_size,
      establishment,
      roomBlueprint,
      coach,
      credits,
      duration_minute,
      broadcast_link,
    } = this.state;

    const offer: any = {
      dates: datesToGenerate.map((d) => d.unix()),
      establishment,
      coach,
      effectif,
      waiting_list_max_size,
      level,
      credits,
      duration_minute,
      broadcast_link,
    };

    if (roomBlueprint) {
      offer.room_blueprint = roomBlueprint;
    }

    this.props.onSubmit(offer);
  };

  generateRecurrenceDates = (
    begin: Moment,
    end: Moment,
    recurrence: '1' | '2' | '3',
    isoWeekdayRecurrenceArray?: number[],
  ) => {
    const dates = [];

    const unit = {
      [WEEKLY]: 'week',
      [MONTHLY]: 'month',
      [DAILY]: 'day',
      // @ts-ignore
    }[recurrence];

    let dateIteration = moment(begin).tz(this.props.timezone);

    while (dateIteration.isSameOrBefore(end, 'day')) {
      if (unit === 'week') {
        // eslint-disable-next-line
        [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
          const currentDateOfTheWeek = dateIteration.clone().add(i, 'day');
          if (
            currentDateOfTheWeek.isSameOrAfter(begin, 'day') &&
            currentDateOfTheWeek.isSameOrBefore(end, 'day') &&
            isoWeekdayRecurrenceArray.includes(
              currentDateOfTheWeek.isoWeekday(),
            )
          ) {
            dates.push(currentDateOfTheWeek);
          }
        });
      } else {
        dates.push(dateIteration);
      }

      dateIteration = moment(dateIteration).add(1, unit);
    }
    return dates;
  };

  getDates = () => {
    const { recurrence, date_interval_start, date_interval_end } = this.state;

    if (recurrence === NOT_RECURRENT) {
      return [date_interval_start];
    }

    const { recurrenceWeekDay } = this.state;
    const selectedDayRecurrence = Object.keys(recurrenceWeekDay)
      .filter((k: keyof State['recurrenceWeekDay']) => recurrenceWeekDay[k])
      .map((d) => parseInt(d));

    return this.generateRecurrenceDates(
      date_interval_start,
      date_interval_end,
      recurrence,
      selectedDayRecurrence,
    );
  };

  onChangeRecurrence = (event: any) => {
    const recurrence = event.target.value;

    this.setState((prevState: State) => {
      const recurrenceWeekDay = { ...prevState.recurrenceWeekDay };

      if (recurrence === WEEKLY) {
        const day = this.state.date_interval_start
          .tz(this.props.timezone)
          .isoWeekday();

        for (const key in recurrenceWeekDay) {
          // @ts-ignore
          if (recurrenceWeekDay[key.toString()]) {
            // @ts-ignore
            recurrenceWeekDay[key.toString()] = false;
          }
        }
        // @ts-ignore
        recurrenceWeekDay[day] = true;
      }

      return {
        recurrence,
        recurrenceWeekDay,
      };
    });
  };

  onChangeWeekDayRecurrences = (
    isoWeekday: keyof State['recurrenceWeekDay'],
  ) => {
    this.setState((prevState: State) => ({
      recurrenceWeekDay: {
        ...prevState.recurrenceWeekDay,
        [isoWeekday]: !prevState.recurrenceWeekDay[isoWeekday],
      },
    }));
  };

  roomBluePrintError = () => {
    if (this.state.roomBlueprint) {
      const roomBlueprint = this.props.roomBlueprints.find(
        (r) => r.id === this.state.roomBlueprint,
      );

      if (
        roomBlueprint &&
        SpotSchedulingHelper.getSpotCount(roomBlueprint) < this.effectif
      ) {
        return true;
      }
    }
    return false;
  };

  renderSummary = () => {
    const { t } = this.props;
    const nbOffer = this.getDates().length;
    return (
      <Grid
        container
        direction="row"
        spacing={1}
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <InfoIcon />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" color="primary">
            {nbOffer}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {nbOffer > 1
              ? t('form.offersWillBeGenerated')
              : t('form.offerWillBeGenerated')}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  renderTitle = () => {
    const { t, metaActivity, classes } = this.props;
    return (
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid
            container
            alignItems="center"
            direction="row"
            justify="flex-end"
          >
            <Grid item>
              <CalendarIcon />
            </Grid>
            <Grid item className={classes.headlineElt}>
              <Typography variant="h5">
                {`${t('form.addingSessionFor')}`}
              </Typography>
            </Grid>
            <Grid item className={classes.headlineElt}>
              <Typography variant="h5" color="primary">
                {metaActivity ? metaActivity.name : ' - '}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderSpecificities = () => {
    const { establishments, roomBlueprints, coaches, t } = this.props;

    const roomBlueprintsForEstablishment = roomBlueprints.filter(
      (roomBlueprint: RoomBlueprint) => {
        return roomBlueprint.establishment === this.state.establishment;
      },
    );

    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <FormField
            id="level"
            value={this.state.level}
            required
            onChange={this.onFormFieldChange}
          />
        </Grid>
        <Grid item>
          <EstablishmentSelector
            id="establishment"
            establishments={establishments}
            value={this.props.establishments.find(
              (es) => es.id === this.state.establishment,
            )}
            onChange={(establishment: Establishment) => {
              this.onFormFieldChange('establishment')(
                establishment ? establishment.id : null,
              );
              !establishment && this.onFormFieldChange('roomBlueprint')(null);
            }}
            placeholder={t('establishment:search')}
          />
        </Grid>

        {!!roomBlueprintsForEstablishment.length && (
          <Grid item>
            <RoomBlueprintSelector
              id="roomBlueprint"
              roomBlueprints={roomBlueprintsForEstablishment}
              value={this.props.roomBlueprints.find(
                (room) => room.id === this.state.roomBlueprint,
              )}
              onChange={(roomBlueprint: RoomBlueprint) => {
                this.onFormFieldChange('roomBlueprint')(
                  roomBlueprint ? roomBlueprint.id : null,
                );
              }}
              placeholder={t('spotScheduling:search')}
            />

            {!this.roomBluePrintError() && !this.state.roomBlueprint && (
              <Typography
                color="textSecondary"
                className={this.props.classes.marginTop1}
              >
                {t('spotScheduling:searchHelper')}
              </Typography>
            )}

            {this.roomBluePrintError() && (
              <Typography color="error">
                {t('spotScheduling:effectifError')}
              </Typography>
            )}
          </Grid>
        )}

        <Grid item>
          <CoachSelector
            id="coach"
            coaches={coaches}
            value={this.props.coaches.find((c) => c.id === this.state.coach)}
            onChange={(coach: Coach) =>
              this.onFormFieldChange('coach')(coach ? coach.id : null)
            }
            placeholder={t('coach:search')}
          />
        </Grid>
        <FeatureListProvider>
          {(featureList: any) => {
            const hasZoomApp = !!(
              featureList &&
              featureList.upsell &&
              featureList.upsell.find(
                (f: any) => f.readable_identifier === 'zoom',
              )
            );
            if (
              this.props.metaActivity &&
              this.props.metaActivity.is_broadcast &&
              !this.props.is_whereby_integration_enabled
            ) {
              return (() => {
                const hasError =
                  this.state.broadcast_link &&
                  !this.state.broadcast_link.startsWith('https://') &&
                  !this.state.broadcast_link.startsWith('http://');
                return (
                  <Grid item>
                    <TextField
                      variant="outlined"
                      value={this.state.broadcast_link}
                      label={this.props.t('offer.broadcast_link')}
                      placeholder="https://zoom.us/123456789"
                      disabled={hasZoomApp}
                      error={hasError}
                      onChange={(event) => {
                        this.onFormFieldChange('broadcast_link')(
                          event.target.value,
                        );
                      }}
                      helperText={
                        // eslint-disable-next-line
                        hasZoomApp
                          ? this.props.t('offer.broadcast_link.explainZoomApp')
                          : hasError
                          ? this.props.t('offer.broadcast_link.error')
                          : null
                      }
                      fullWidth
                    />
                  </Grid>
                );
              })();
            }
            return null;
          }}
        </FeatureListProvider>
      </Grid>
    );
  };

  endDateIsInvalid = () => {
    if (this.state.recurrence !== NOT_RECURRENT) {
      return this.state.date_interval_start
        .clone()
        .startOf('day')
        .isSameOrAfter(this.state.date_interval_end.startOf('day'));
    }
    return false;
  };

  renderTimeSettings = () => {
    const { t, classes } = this.props;
    const hasError = this.state.duration_minute === 0;
    return (
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        moment={moment}
        locale={moment.locale()}
      >
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h6">{t('form.timeSettings')}</Typography>
          </Grid>
          <Grid item>
            <DurationInput
              required
              value={this.state.duration_minute}
              disallowedNullDuration={hasError}
              durationError={this.props.t('offer.noEmptyDuration')}
              onChange={this.onFormFieldChange('duration_minute')}
            />
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="caption">
                  {t('form.recurrence')}
                </Typography>
              </Grid>
              <Grid item>
                <FormControl component="fieldset">
                  <RadioGroup
                    id="recurrence_checkbox"
                    aria-label={t('form.recurrence')}
                    row
                    value={this.state.recurrence}
                    onChange={this.onChangeRecurrence}
                  >
                    <FormControlLabel
                      id="not_recurrent"
                      value={NOT_RECURRENT}
                      control={<Radio />}
                      label={t('form.notRecurrent')}
                    />
                    <FormControlLabel
                      id="weekly"
                      value={WEEKLY}
                      control={<Radio />}
                      label={t('form.weekly')}
                    />
                    <FormControlLabel
                      id="monthly"
                      value={MONTHLY}
                      control={<Radio />}
                      label={t('form.monthly')}
                    />
                    <FormControlLabel
                      id="daily"
                      value={DAILY}
                      control={<Radio />}
                      label={t('form.daily')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography variant="caption">
                        {t('form.firstSessionOn')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <DateTimeInput
                        value={moment(this.state.date_interval_start).format()}
                        timezone={this.props.timezone}
                        onChange={(date_interval_start: string) =>
                          this.setState({
                            date_interval_start: moment(date_interval_start),
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography variant="caption">
                        {t('form.lastSession')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <DatePicker
                        id="last_date_picker"
                        format="L"
                        keyboard
                        required
                        returnMoment={false}
                        disabled={this.state.recurrence === NOT_RECURRENT}
                        error={this.endDateIsInvalid()}
                        value={this.state.date_interval_end}
                        minDate={this.state.date_interval_start}
                        onChange={(e) =>
                          this.onFormFieldChange('date_interval_end')(e)
                        }
                        mask={(value) => {
                          if (value) {
                            return [
                              /\d/,
                              /\d/,
                              '/',
                              /\d/,
                              /\d/,
                              '/',
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/,
                            ];
                          }
                          return [];
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {this.state.recurrence === WEEKLY && (
                <Grid item className={classes.marginTop2}>
                  <Grid container direction="row" spacing={1}>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                      const day = moment().startOf('week').add(i, 'days');
                      const isoweekday = day.isoWeekday();
                      return (
                        <Grid item key={isoweekday}>
                          <Button
                            disableElevation
                            onClick={() =>
                              this.onChangeWeekDayRecurrences(isoweekday)
                            }
                            variant={
                              this.state.recurrenceWeekDay[isoweekday]
                                ? 'contained'
                                : 'outlined'
                            }
                            color="secondary"
                          >
                            {t(
                              `datetime:time.isoWeekdayNumber.${isoweekday}`,
                            ).slice(0, 3)}
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item className={classes.generationSummary}>
              {this.renderSummary()}
            </Grid>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  };

  renderFooter = () => {
    const { t, processing, onCancel, classes } = this.props;
    return (
      <div className={classes.buttonContainer}>
        <Button
          disabled={processing}
          onClick={onCancel}
          className={classes.marginRight}
        >
          {this.props.discardButtonText || t('form.discard')}
        </Button>
        {processing ? (
          <CircularProgress
            size={24}
            color="secondary"
            className={classes.leftIcon}
          />
        ) : (
          <Button
            disabled={
              !this.state.establishment ||
              !this.state.coach ||
              !this.effectif ||
              this.roomBluePrintError()
            }
            variant="contained"
            color="primary"
            type="submit"
          >
            <AddIcon className={classes.leftIcon} />
            <div id="button_sessions_add">{t('form.generateOffers')}</div>
          </Button>
        )}
      </div>
    );
  };

  renderCaracteristics = () => {
    const hasErrorCredits =
      parseInt(this.state.credits, 10) === 0 ||
      parseInt(this.state.credits) > 4;

    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h6">
            {this.props.t('form.caracteristics')}
          </Typography>
        </Grid>
        <Grid item>
          <FormField
            id="effectif"
            required
            onChange={this.onFormFieldChange}
            value={this.state.effectif}
          />
          <FormField
            id="waiting_list_max_size"
            required
            onChange={this.onFormFieldChange}
            value={this.state.waiting_list_max_size}
          />
        </Grid>

        <Grid item>
          <FormField
            id="credits"
            required
            value={this.state.credits}
            disallowedCredits={hasErrorCredits}
            creditError={this.props.t('form.noAvailableCredit')}
            onChange={this.onFormFieldChange}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.paperContainer}>
        <form onSubmit={this.generateOffers} id="select_sessions_all">
          <div className={classes.fieldGroup}>{this.renderTitle()}</div>
          <div className={classes.fieldGroup}>
            {this.renderCaracteristics()}
          </div>
          <div className={classes.fieldGroup}>{this.renderTimeSettings()}</div>
          <div className={classes.fieldGroup}>{this.renderSpecificities()}</div>
          <div className={classes.fieldGroup}>{this.renderFooter()}</div>
        </form>
      </div>
    );
  }
}

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(),
)(OfferForm);
