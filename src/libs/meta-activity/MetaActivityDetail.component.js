// @flow
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
  Paper,
  TextField,
  Input,
  Divider,
  List,
  Grid,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import type { TFunction } from 'react-i18next';

import { Moment } from '../../i18n';

import {
  Review,
  PackMinimalSummary,
  Calendar,
  TimeTable,
} from '../../components';
import type {
  Activity,
  Offer,
  MetaActivity as MetaActivityType,
  Stat,
} from '../../api/types';
import { formatMinutes } from '../../datetime';

import {
  MetaActivityCover,
  MetaActivityBasicInfo,
  ActivityStats,
} from './components';

type Props = {
  metaActivity: MetaActivityType,
  // eslint-disable-next-line
  stats: Stat,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  createActivityOffers: (metActivityId: number) => void,
  events: Array<Event>,
  timetableLoading: boolean,
  activities: Array<Activity>,
  offers: Array<Offer>,
  goToOffer: (offer: Offer) => void,
  classes: Object,
  t: TFunction,
};

type State = {
  editable: boolean,
  data: *,
  sportCategories: Array<number>,
  dateSelected: Object,
};

export class MetaActivityDetail extends Component<Props, State> {
  state = {
    editable: false,
    data: [],
    sportCategories: [],
    dateSelected: Moment(),
  };

  onEditToogle = () => {
    this.setState((prevState) => ({ editable: !prevState.editable }));
  };

  onEdit = () => {};

  // prettier-ignore
  getById = (array: Array<{ id: number }>, id: number): Array<{id: number}> => (
    array.filter((a) => a.id === id) || [{}]
  )[0]

  handleChange = (fieldName: string) => (event: Object) => {
    const { data } = this.state;
    data[fieldName] = event.target.value;
    this.setState({ data });
  };

  getHeader = (activity: Activity) => {
    const { classes, t } = this.props;
    const { editable, data } = this.state;

    let name = null;
    let category = null;
    if (editable) {
      name = data.name || activity.name;
      category = data.category || activity.category_id;
    } else {
      // eslint-disable-next-line
      name = activity.name;
      category = activity.category_id;
    }

    const categorySelectedName =
      (
        this.state.sportCategories.filter(
          (s) => s.id === activity.category_id,
        )[0] || {}
      ).name || category;

    return editable ? (
      <div>
        <TextField
          id="name"
          label={t('activity.name')}
          className={classes.textField}
          value={name}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        <FormControl noValidate className={classes.formControl}>
          <InputLabel htmlFor="age-simple">{t('common.sport')}</InputLabel>
          <Select
            value={categorySelectedName}
            input={<Input id="category" />}
            renderValue={(e) => e}
            onChange={this.handleChange('category')}
          >
            {this.state.sportCategories.map((sport) => (
              <MenuItem value={sport.id} key={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    ) : (
      <Typography variant="h6">{name}</Typography>
    );
  };

  getDescription = () => {
    const { t, metaActivity, classes } = this.props;
    const { description } = metaActivity;
    return (
      <div>
        <Typography variant="h6" className={classes.blockTitle}>
          {t('activity.description')}
        </Typography>
        <Typography>{description}</Typography>
      </div>
    );
  };

  getCalendar = () => {
    const { metaActivity } = this.props;
    const { dateSelected } = this.state;
    const events = this.props.events.filter((e) =>
      metaActivity.activities.find((a) => a.id === e.activity),
    );
    const events_ = {};
    for (const o of events) {
      const midnight = Moment(o.date_start).startOf('day');
      // eslint-disable-next-line
      if (events_.hasOwnProperty(midnight)) {
        events_[midnight].push(o);
      } else {
        events_[midnight] = [o];
      }
    }
    return (
      <Calendar
        events={events_}
        date={dateSelected}
        onDateClick={this.handleDayClick}
        forceMonthDisplay
      />
    );
  };

  handleDayClick = (date: Object) => {
    this.setState({ dateSelected: date });
    this.props.fetchOffersByDay({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    });
  };

  getActivitiesWithCalendar = () => {
    const {
      t,
      metaActivity,
      classes,
      timetableLoading,
      activities,
      offers,
    } = this.props;
    const { dateSelected } = this.state;
    return (
      <Grid container direction="row" alignItems="flex-start">
        <Grid item xs={12} md={6} className={classes.responsiveSubBlock}>
          <div className={classes.calendarContainer}>{this.getCalendar()}</div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container direction="column" spacing={32}>
            <Grid item>
              <Typography
                variant="h6"
                className={classes.blockTitleLargeMargin}
              >
                {t('activity.offersThisDay')}
              </Typography>
              <TimeTable
                date={dateSelected}
                metaActivityId={metaActivity.id}
                offers={offers.filter(
                  (o) => o.meta_activity_id === metaActivity.id,
                )}
                loading={timetableLoading}
                activities={activities}
                onOfferSelected={(o) => this.props.goToOffer(o)}
              />
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={16}
              >
                <Grid item>
                  <Button
                    variant="extendedFab"
                    aria-label="Add"
                    className={classes.button}
                    color="primary"
                    onClick={() =>
                      this.props.createActivityOffers(metaActivity.id)
                    }
                  >
                    <AddIcon className={classes.extendedIcon} />
                    {t('activity.addOffers')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getPriceAndPacks = () => {
    const { metaActivity, classes, t } = this.props;
    const {
      payment_packs_available,
      last_booking_minutes,
      last_discard_minutes,
    } = metaActivity;
    return (
      <Grid container direction="row" justify="center">
        <Grid item xs={12} md={6}>
          <Typography className={classes.blockTitleLargeMargin} variant="h6">
            {t('activity.settings')}
          </Typography>
          <Grid container direction="column" spacing={16}>
            <Grid item>
              <Typography variant="subtitle1">
                {`${t('activity.lastBookingBeforeMinutes')}`}
              </Typography>
              <Typography variant="h6">
                {formatMinutes(last_booking_minutes)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                {`${t('activity.lastDiscardBeforeMinutes')}`}
              </Typography>
              <Typography variant="h6">
                {formatMinutes(last_discard_minutes)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.blockTitleLargeMargin} variant="h6">
            {t('activity.packsAvailable')}
          </Typography>
          {payment_packs_available && payment_packs_available.length ? (
            <Paper>
              <List>
                {payment_packs_available
                  .filter((pp) => !pp.disabled)
                  .map((p) => (
                    <PackMinimalSummary key={p.id} pack={p} />
                  ))}
              </List>
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    );
  };

  getReviews = () => {
    const { metaActivity, classes, t } = this.props;
    const { reviews } = metaActivity;
    if (reviews.length) {
      return (
        <Paper className={classes.paddedPaper}>
          <Typography variant="h6" className={classes.blockTitleLargeMargin}>
            {t('activity.reviews')}
          </Typography>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="row"
            spacing={32}
          >
            {reviews.map((r) => (
              <Grid item xs={6} md={4} key={r.id}>
                <Review review={r} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      );
    }
    return null;
  };

  render() {
    const { metaActivity } = this.props;
    // const stats = this.getById(this.props.stats, this.metaActivityId);

    const { classes } = this.props;

    return (
      <Grid container direction="row" spacing={32}>
        <Grid item xs={12} xl={6}>
          <Paper>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <MetaActivityCover metaActivity={metaActivity} large />
              </Grid>
              <Grid item className={classes.paddedBlock}>
                <MetaActivityBasicInfo metaActivity={metaActivity} />
              </Grid>
              <Grid item>
                <ActivityStats stats={{}} />
              </Grid>
              <Divider className={classes.horizontalDivider} />
              <Grid item className={classes.paddedBlock}>
                {this.getDescription()}
              </Grid>
              <Divider className={classes.horizontalDivider} />
              <Grid item className={classes.paddedBlock} xs={12}>
                {this.getActivitiesWithCalendar()}
              </Grid>
              <Divider className={classes.horizontalDivider} />
              <Grid item className={classes.paddedBlock} xs={12}>
                {this.getPriceAndPacks()}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} xl={6}>
          {this.getReviews()}
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  inner: {
    margin: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  paddedBlock: {
    margin: theme.spacing.unit * 3,
  },
  paddedPaper: {
    padding: theme.spacing.unit * 3,
  },
  blockTitle: {
    marginBottom: theme.spacing.unit,
  },
  blockTitleLargeMargin: {
    marginBottom: theme.spacing.unit * 2,
  },
  horizontalDivider: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  responsiveSubBlock: {
    marginBottom: theme.spacing.unit * 3,
  },
  calendarContainer: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
)(MetaActivityDetail);
