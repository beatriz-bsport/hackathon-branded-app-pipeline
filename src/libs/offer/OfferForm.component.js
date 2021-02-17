// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoIcon from '@material-ui/icons/Info';
import CalendarIcon from '@material-ui/icons/Today';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'material-ui-pickers/DatePicker';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import AddIcon from '@material-ui/icons/Add';
import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import EstablishmentSelector from '../establishment/components/EstablishmentSelectorWithCard.component';
import CoachSelector from '../associated-coach/components/CoachSelectorWithCard.component';
import FeatureListProvider from '../company/hocs/feature-list-provider.hoc';

import FormField, {
  NOT_RECURRENT,
  WEEKLY,
  MONTHLY,
} from '../../components/input/FormField.component';
import DurationInput from '../../components/input/DurationInput.component';
import DateTimeInput from '../../components/input/DateTimeInput.component';
import type { Coach, MetaActivity, Establishment } from '../../api/types';

const styles = (theme) => ({
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
  buttonLeft: {
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
});

type Props = {
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivity: MetaActivity,
  classes: Object,
  selectedDate: Object,
  t: (x: string) => string,
  discardButtonText: ?string,
  processing: boolean,
  onCancel: () => void,
  onSubmit: ({
    establishment: ?number,
    coach: ?number,
    credits: string,
    dates: Array<string>,
    effectif: ?string,
    waiting_list_max_size: ?number,
    level: ?number,
  }) => void,

  is_whereby_integration_enabled: boolean,
  timezone: string,
};

type State = {
  recurrence: string,
  date_interval_start: Object,
  date_interval_end: Object,
  hour: Object,
  coach: ?number,
  establishment: ?number,
  credits: string,
  level: ?number,
  effectif: ?string,
  waiting_list_max_size: ?number,
  duration_minute: number,
};

export class OfferForm extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      recurrence: NOT_RECURRENT,
      date_interval_start: moment(
        props.selectedDate ? props.selectedDate : null,
      ),
      date_interval_end: moment(props.selectedDate ? props.selectedDate : null),
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

  onFormFieldChange = (id: string) => (value) => {
    this.setState({ [id]: value });
  };

  generateOffers = (event: Object) => {
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
      coach,
      credits,
      duration_minute,
      broadcast_link,
    } = this.state;

    this.props.onSubmit({
      dates: datesToGenerate.map((d) => d.unix()),
      establishment,
      coach,
      effectif,
      waiting_list_max_size,
      level,
      credits,
      duration_minute,
      broadcast_link,
    });
  };

  getDates = () => {
    const { recurrence, date_interval_start, date_interval_end } = this.state;

    const firstSession = date_interval_start;

    const allDates = [];

    switch (recurrence) {
      case NOT_RECURRENT:
        return [firstSession];
      case WEEKLY: {
        let i = 0;
        while (
          moment(firstSession)
            .tz(this.props.timezone)
            .clone()
            .add(i, 'week')
            .isSameOrBefore(date_interval_end, 'day')
        ) {
          allDates.push(
            moment(firstSession).tz(this.props.timezone).clone().add(i, 'week'),
          );
          i += 1;
        }
        return allDates;
      }
      case MONTHLY: {
        let i = 0;
        while (
          moment(firstSession)
            .tz(this.props.timezone)
            .clone()
            .add(i, 'month')
            .isSameOrBefore(date_interval_end, 'day')
        ) {
          allDates.push(
            moment(firstSession.clone())
              .tz(this.props.timezone)
              .add(i, 'month'),
          );
          i += 1;
        }
        return allDates;
      }
      default:
        return [];
    }
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
    const { establishments, coaches, t } = this.props;
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
            onChange={(establishment) => {
              this.onFormFieldChange('establishment')(
                establishment ? establishment.id : null,
              );
            }}
            placeholder={t('establishment:search')}
          />
        </Grid>
        <Grid item>
          <CoachSelector
            id="coach"
            coaches={coaches}
            value={this.props.coaches.find((c) => c.id === this.state.coach)}
            onChange={(coach) =>
              this.onFormFieldChange('coach')(coach ? coach.id : null)
            }
            placeholder={t('coach:search')}
          />
        </Grid>
        <FeatureListProvider>
          {(featureList) => {
            const hasZoomApp = !!(
              featureList &&
              featureList.upsell &&
              featureList.upsell.find((f) => f.readable_identifier === 'zoom')
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
                <FormField
                  id="recurrence"
                  required
                  value={this.state.recurrence}
                  onChange={this.onFormFieldChange}
                />
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
                        onChange={(date_interval_start) =>
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
                        format="DD/MM/YYYY"
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
          className={classes.buttonLeft}
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
            disabled={!this.state.establishment || !this.state.coach}
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
      parseInt(this.state.credits, 10) === 0 || this.state.credits > 4;
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

export default withStyles(styles)(withTranslation()(OfferForm));
