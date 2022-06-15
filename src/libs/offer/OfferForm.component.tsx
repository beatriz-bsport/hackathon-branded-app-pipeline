import React, { Component } from 'react';
import compose from 'recompose/compose';

import { Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import DatePicker from 'material-ui-pickers/DatePicker';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';

import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import CalendarIcon from '@material-ui/icons/Today';
import InfoIcon from '@material-ui/icons/Info';

import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import AddIcon from '@material-ui/icons/Add';
import { WithTranslation, withTranslation } from 'react-i18next';
import moment, { Moment } from 'moment-timezone';
import { COACH_PAYMENT_RULE_FOR_SESSION } from '@bsport/common/lib/master-data/coach_payment_rule';
import EstablishmentSelector from '../establishment/components/EstablishmentSelectorWithCard.component';
import CoachSelector from '../associated-coach/components/coach-selector/CoachSelectorWithCard.component';
import FeatureListProvider from '../company/hocs/feature-list-provider.hoc';

import FormField, {
  NOT_RECURRENT,
  WEEKLY,
  MONTHLY,
  DAILY,
} from '../../components/input/FormField.component';
import DurationInput from '../../components/input/DurationInput.component';
import DateTimeInput from '../../components/input/DateTimeInput.component';
import { Coach, MetaActivity, Establishment } from '../../api/types';
import { MaterialStyleType } from '../../utils/types';
import { RoomBlueprint } from '../spot-scheduling/types';
import RoomBlueprintSelector from '../spot-scheduling/component/RoomBlueprintSelector.component';
import SpotSchedulingHelper from '../spot-scheduling/utils';
import type { CoachPaymentRule } from '../coach-payment-rules/types';
import CoachPaymentRuleSelectorStyled from '../coach-payment-rules/components/coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import PartnershipToogle from './form/PartnershipToogle.component';
import ManagerOnlyToogle from './form/ManagerOnlyToogle.component';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import type { Tag, TagGroup } from '#libs/tag/types';
import LevelSelector from '#libs/level/components/LevelSelector.component';
import { Level, LevelFilterSet } from '#libs/level/types';
import { OptionCallback } from '../../state/types';
import FormToggle from '#components/forms/FormToggle.component';

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
  advancedOptionsSection: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(10),
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
    partner_max_booking_count?: string;
    waiting_list_max_size?: number;
    level?: number;
    duration_minute: number;
    broadcast_link: string;
    room_blueprint?: number;
    allow_guest_offer?: boolean;
  }) => void;
  allowGuestMaster?: boolean;
  is_whereby_integration_enabled: boolean;
  timezone: string;
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  editableCoachPaymentRule: boolean;
  showPartnership: boolean;
  tagList: Array<Tag<TagGroup>>;
  activeCustomLevels: Level[];
  allCustomLevels: Level[];
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionCallback<Level[]>,
  ) => void;
  updateLevel: (id: number, data: Level, options: OptionCallback) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  isOfferInGroup: boolean;
  disableWaitingList: boolean;
  disableTag: boolean;
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
  partner_max_booking_count: number;
  waiting_list_max_size?: number;
  duration_minute: number;
  coach_payment_rule: number;
  available_on_partnership: boolean;
  manager_only: boolean;
  whitelist_tags: number[];
  blacklist_tags: number[];
  openAdvancedOptions: boolean;
  allow_guest_offer: boolean;
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
      partner_max_booking_count: this.props.isOfferInGroup ? 0 : 6,
      waiting_list_max_size: 0,
      coach: null,
      establishment: null,
      credits: '1',
      level: 1,
      duration_minute: 30,
      coach_payment_rule: null,
      available_on_partnership: !this.props.isOfferInGroup,
      manager_only: false,
      whitelist_tags: [],
      blacklist_tags: [],
      openAdvancedOptions: false,
      allow_guest_offer: true,
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
      partner_max_booking_count,
      waiting_list_max_size,
      establishment,
      roomBlueprint,
      coach,
      credits,
      duration_minute,
      broadcast_link,
      coach_payment_rule,
      available_on_partnership,
      manager_only,
      whitelist_tags,
      blacklist_tags,
      allow_guest_offer,
    } = this.state;

    const offer: any = {
      dates: datesToGenerate.map((d) => d.unix()),
      establishment,
      coach,
      effectif,
      partner_max_booking_count,
      waiting_list_max_size,
      level,
      credits,
      duration_minute,
      broadcast_link,
      coach_payment_rule,
      available_on_partnership,
      manager_only,
      whitelist_tags,
      blacklist_tags,
      allow_guest_offer,
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

  handleDeleteLevel = (deleteLevelId: number) => {
    this.props.deleteLevel(deleteLevelId, {
      onSuccess: () => {
        if (deleteLevelId === this.state.level) {
          this.setState({
            level: null,
          });
        }
        this.props.fetchLevelList();
      },
    });
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
        {!this.props.isOfferInGroup && (
          <Grid item>
            <LevelSelector
              inScrollBar
              selectedLevel={this.state.level}
              onSelect={(level) => {
                this.onFormFieldChange('level')(level);
              }}
              customLevels={this.props.activeCustomLevels}
              memoryLevels={this.props.allCustomLevels}
              fetchLevelList={this.props.fetchLevelList}
              onEditLevel={this.props.updateLevel}
              onCreateLevel={this.props.createLevel}
              onDeleteLevel={this.handleDeleteLevel}
            />
          </Grid>
        )}
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
        {this.props.editableCoachPaymentRule && (
          <Grid item>
            <CoachPaymentRuleSelectorStyled
              coachPaymentRulesList={
                this.props.coachPaymentRulesByKind[
                  COACH_PAYMENT_RULE_FOR_SESSION
                ]
              }
              value={this.props.coachPaymentRulesByKind?.[
                COACH_PAYMENT_RULE_FOR_SESSION
              ]?.find((rule) => rule.id === this.state.coach_payment_rule)}
              placeholder={t('paymentRules:search')}
              disabled={!this.state.coach}
              onChange={(item: { value: number; label: string }) => {
                this.onFormFieldChange('coach_payment_rule')(
                  item ? item.value : null,
                );
              }}
              noMulti
              isClearable
            />
          </Grid>
        )}
        {!!this.props.showPartnership && !this.props.isOfferInGroup && (
          <PartnershipToogle
            available_on_partnership={this.state.available_on_partnership}
            onChange={(available_on_partnership: boolean) =>
              this.setState({ available_on_partnership })
            }
          />
        )}
        {!this.props.isOfferInGroup && (
          <ManagerOnlyToogle
            manager_only={this.state.manager_only}
            onChange={(manager_only: boolean) =>
              this.setState({ manager_only })
            }
          />
        )}
        {this.props.allowGuestMaster && (
          <FormToggle
            value={this.state.allow_guest_offer}
            onChange={(allow_guest_offer: boolean) =>
              this.setState({ allow_guest_offer: !allow_guest_offer })
            }
            title={this.props.t('form.offer.explainAllowGuest')}
          />
        )}
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
                    {!this.props.isOfferInGroup && (
                      <>
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
                      </>
                    )}
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
          {this.props.onCancelText || t('form.discard')}
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
              (!this.effectif &&
                this.state.effectif !== 0 &&
                this.state.effectif !== '0') ||
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
            disabled={this.props.disableWaitingList}
          />
          {this.props.disableWaitingList && (
            <Typography variant="caption" color="textSecondary">
              {this.props.t('form.noWaitingList')}
            </Typography>
          )}
          {!!this.props.showPartnership && (
            <FormField
              id="partner_max_booking_count"
              required
              onChange={this.onFormFieldChange}
              value={this.state.partner_max_booking_count}
              disabled={this.props.isOfferInGroup}
            />
          )}
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

  renderAdvancedSettings = () => {
    const { classes, t, tagList } = this.props;
    const { openAdvancedOptions } = this.state;
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
                <TagSelector
                  allTagsWithTagGroup={
                    [
                      ...tagList?.filter(
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
              </div>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <BlockIcon className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('form.offer.advancedOptions.tag.notAllowed')}
                  </Typography>
                </div>
                <TagSelector
                  allTagsWithTagGroup={
                    [
                      ...tagList?.filter(
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
              </div>
            </div>
          </Collapse>
        </div>
      </>
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
          {!this.props.disableTag && (
            <div className={classes.fieldGroup}>
              {this.renderAdvancedSettings()}
            </div>
          )}
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
