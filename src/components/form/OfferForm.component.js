// @flow

import React, { Component } from 'react';

import { Button, Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { Info as InfoIcon, Today as CalendarIcon } from '@material-ui/icons';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Moment } from '../../i18n';
import FormField, {
  NOT_RECURRENT,
  WEEKLY,
  MONTHLY,
} from '../input/FormField.component';
import type { Coach, MetaActivity, Establishment } from '../../api/types';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  headlineElt: {
    marginLeft: theme.spacing.unit,
  },
  generationSummary: {
    marginTop: theme.spacing.unit * 4,
  },
});

type Props = {
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivity: MetaActivity,
  classes: Object,
  t: (x: string) => string,
  onSubmit: ({
    establishment: ?number,
    coach: ?number,
    price: ?string,
    credits: string,
    dates: Array<string>,
    effectif: ?string,
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
  price: ?string,
  credits: string,
  level: ?number,
  effectif: ?string,
  duration_minute: number,
};

export class OfferForm extends Component<Props, State> {
  state = {
    recurrence: NOT_RECURRENT,
    date_interval_start: Moment(),
    date_interval_end: Moment(),
    hour: Moment(),
    effectif: null,
    coach: null,
    establishment: null,
    price: null,
    credits: '1',
    level: null,
    duration_minute: 30,
  };

  onFormFieldChange = (id: string) => (value) => {
    this.setState({ [id]: value });
  };

  generateOffers = (event: Object) => {
    event.preventDefault();
    const datesToGenerate = this.getDates();
    const {
      level,
      effectif,
      establishment,
      coach,
      price,
      credits,
      duration_minute,
    } = this.state;

    this.props.onSubmit({
      dates: datesToGenerate.map((d) => d.unix()),
      establishment,
      coach,
      price,
      effectif,
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
    firstSession.set('hour', hour.get('hour'));
    firstSession.set('minute', hour.get('minute'));

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
          <Typography variant="subheading" color="primary">
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
              <Typography variant="headline">
                {`${t('form.addingSessionFor')}`}
              </Typography>
            </Grid>
            <Grid item className={classes.headlineElt}>
              <Typography variant="headline" color="primary">
                {metaActivity.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderSpecificities = () => {
    const { t, establishments, coaches } = this.props;
    return (
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <Typography variant="title">{t('form.caracteristics')}</Typography>
        </Grid>
        <Grid item>
          <FormField
            id="effectif"
            required
            onChange={this.onFormFieldChange}
            value={this.state.effectif}
          />
          <FormField
            id="level"
            value={this.state.level}
            required
            onChange={this.onFormFieldChange}
          />
        </Grid>
        <Grid item>
          <FormField
            id="establishment"
            choices={establishments}
            value={this.state.establishment}
            required
            onChange={this.onFormFieldChange}
          />
        </Grid>
        <Grid item>
          <FormField
            id="coach"
            required
            choices={coaches}
            value={this.state.coach}
            onChange={this.onFormFieldChange}
          />
        </Grid>
      </Grid>
    );
  };

  renderTimeSettings = () => {
    const { t, classes } = this.props;
    const { recurrence } = this.state;
    return (
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <Typography variant="title">{t('form.timeSettings')}</Typography>
        </Grid>
        <Grid item>
          <FormField
            id="duration_minute"
            value={this.state.duration_minute}
            required
            onChange={this.onFormFieldChange}
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
                  <FormField
                    id="date_interval_start"
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
                  <FormField
                    id="date_interval_end"
                    required
                    disabled={recurrence === NOT_RECURRENT}
                    onChange={this.onFormFieldChange}
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

  renderBilling = () => {
    const { t } = this.props;
    return (
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <Typography variant="title">{t('form.priceCategory')}</Typography>
        </Grid>
        <Grid item>
          <FormField
            id="credits"
            required
            value={this.state.credits}
            onChange={this.onFormFieldChange}
          />
          <FormField
            id="price"
            required
            value={this.state.price}
            onChange={this.onFormFieldChange}
          />
        </Grid>
      </Grid>
    );
  };

  renderFooter = () => {
    const { t, metaActivity } = this.props;
    return (
      <Grid
        container
        direction="row"
        spacing={16}
        justify="flex-end"
        alignItems="center"
      >
        <Grid item>
          <Link
            to={`/activity/${metaActivity.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Button>{t('form.discard')}</Button>
          </Link>
        </Grid>
        <Grid item>
          <Button variant="raised" color="primary" type="submit">
            {t('form.generateOffers')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paperContainer}>
        <form onSubmit={this.generateOffers}>
          <Grid container direction="column" spacing={40}>
            <Grid item>{this.renderTitle()}</Grid>
            <Grid item>{this.renderTimeSettings()}</Grid>
            <Grid item>{this.renderBilling()}</Grid>
            <Grid item>{this.renderSpecificities()}</Grid>
            <Grid item>{this.renderFooter()}</Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(translate()(OfferForm));
