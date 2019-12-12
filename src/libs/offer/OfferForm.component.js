// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoIcon from '@material-ui/icons/Info';
import CalendarIcon from '@material-ui/icons/Today';
import AddIcon from '@material-ui/icons/Add';
import { withNamespaces } from 'react-i18next';

import DatePicker from 'material-ui-pickers/DatePicker';
import CoachInput from '../../components/input/CoachInput.component';
import EstablishmentInput from '../../components/input/EstablishmentInput.component';
import { Moment } from '../../i18n';
import FormField, {
  NOT_RECURRENT,
  WEEKLY,
  MONTHLY,
} from '../../components/input/FormField.component';
import DurationInput from '../../components/input/DurationInput.component';
import type { Coach, MetaActivity, Establishment } from '../../api/types';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: theme.spacing.unit,
  },
  buttonLeft: {
    marginRight: theme.spacing.unit * 2,
  },
  headlineElt: {
    marginLeft: theme.spacing.unit,
  },
  generationSummary: {
    marginTop: theme.spacing.unit * 4,
  },
  fieldGroup: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
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
      date_interval_start: props.selectedDate ? props.selectedDate : Moment(),
      date_interval_end: props.selectedDate ? props.selectedDate : Moment(),
      hour: null,
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
    });
  };

  getDates = () => {
    const {
      recurrence,
      hour,
      date_interval_start,
      date_interval_end,
    } = this.state;

    const firstSession = date_interval_start;
    firstSession.set('hour', Moment(hour, 'HH:mm').get('hour'));
    firstSession.set('minute', Moment(hour, 'HH:mm').get('minute'));

    const allDates = [];

    switch (recurrence) {
      case NOT_RECURRENT:
        return [firstSession];
      case WEEKLY: {
        let i = 0;
        while (
          Moment(firstSession)
            .add(i, 'week')
            .isSameOrBefore(date_interval_end, 'day')
        ) {
          allDates.push(Moment(firstSession).add(i, 'week'));
          i += 1;
        }
        return allDates;
      }
      case MONTHLY: {
        let i = 0;
        while (
          Moment(firstSession)
            .add(i, 'month')
            .isSameOrBefore(date_interval_end, 'day')
        ) {
          allDates.push(Moment(firstSession).add(i, 'month'));
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
        spacing={8}
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
          <Typography variant="body2">
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
      <Grid container direction="column" spacing={32}>
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
                {metaActivity.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderSpecificities = () => {
    const { establishments, coaches } = this.props;
    return (
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <FormField
            id="level"
            value={this.state.level}
            required
            onChange={this.onFormFieldChange}
          />
        </Grid>
        <Grid item>
          <EstablishmentInput
            noBlank
            id="establishment"
            label={this.props.t('form.offer.establishmentLabel')}
            onChange={this.onFormFieldChange('establishment')}
            establishments={establishments}
            value={this.state.establishment}
            required
          />
        </Grid>
        <Grid item>
          <CoachInput
            id="coach"
            label={this.props.t('form.offer.coachLabel')}
            required
            value={this.state.coach}
            onChange={(event) =>
              this.onFormFieldChange('coach')(event.target.value)
            }
            choices={coaches}
          />
        </Grid>
      </Grid>
    );
  };

  endDateIsInvalid = () => {
    if (this.state.recurrence !== NOT_RECURRENT) {
      return this.state.date_interval_start
        .startOf('day')
        .isSameOrAfter(this.state.date_interval_end.startOf('day'));
    }
    return false;
  };

  renderTimeSettings = () => {
    const { t, classes } = this.props;
    return (
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <Typography variant="h6">{t('form.timeSettings')}</Typography>
        </Grid>
        <Grid item>
          <DurationInput
            required
            value={this.state.duration_minute}
            onChange={this.onFormFieldChange('duration_minute')}
          />
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="caption">{t('form.recurrence')}</Typography>
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
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16}>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="caption">
                    {t('form.firstSessionOn')}
                  </Typography>
                </Grid>
                <Grid item>
                  <DatePicker
                    format="DD/MM/YYYY"
                    keyboard
                    required
                    returnMoment={false}
                    value={this.state.date_interval_start}
                    onChange={(e) =>
                      this.onFormFieldChange('date_interval_start')(e)
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
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="caption">
                    {t('form.firstSessionAt')}
                  </Typography>
                </Grid>
                <Grid item>
                  <FormField
                    id="hour"
                    required
                    onChange={this.onFormFieldChange}
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
    );
  };

  renderFooter = () => {
    const { t, processing, onCancel, classes } = this.props;
    return (
      <div className={classes.buttonContainer}>
        <Button
          disabled={processing}
          variant="contained"
          color="secondary"
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
            {t('form.generateOffers')}
          </Button>
        )}
      </div>
    );
  };

  renderCaracteristics = () => (
    <Grid container direction="column" spacing={8}>
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
          onChange={this.onFormFieldChange}
        />
      </Grid>
    </Grid>
  );

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.paperContainer}>
        <form onSubmit={this.generateOffers}>
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

export default withStyles(styles)(withNamespaces()(OfferForm));
