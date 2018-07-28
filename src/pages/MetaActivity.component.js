import React, { Component } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
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
  CircularProgress,
  Divider,
} from '@material-ui/core';
import SPORTS from 'bsport-commons/lib/master-data/sports';
import { colors } from 'bsport-commons/lib/colors';

import { isSameDay } from '../datetime';
import api from '../api';
import {
  Sport,
  Review,
  ActivityCover,
  ActivityBasicInfo,
  ActivityStats,
  DayPicker,
  ActivityMinimalSummary,
  PackMinimalSummary,
} from '../components';
import { metaActivity as metaActivityActions } from '../actions';

type Props = {};

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
  dot: {
    backgroundColor: colors.primaryDark,
    height: 4,
    width: 4,
    marginLeft: 1,
    marginRight: 2,
    borderRadius: 4,
  },
});

export class MetaActivity extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      data: [],
      sportCategories: [],
      offersOnSelectedDay: [],
    };
  }

  componentDidMount() {
    this.activityId = parseInt(this.props.match.params.id, 10);
    this.props.fetchMetaActivityDetails(this.activityId);
  }

  onEditToogle = () => {
    this.setState({ editable: !this.state.editable });
  };
  onEdit = () => {};

  getById = (array, id) => {
    // used to object from store collection on each render, default to {}
    return (array.filter((a) => a.id === id) || [{}])[0];
  };

  handleChange = (fieldName) => {
    return (event) => {
      const { data } = this.state;
      data[fieldName] = event.target.value;
      this.setState({ data });
    };
  };

  getHeader = (activity) => {
    const { classes, t } = this.props;
    const { editable, data } = this.state;

    let name = null;
    let category = null;
    if (editable) {
      name = data['name'] || activity.name;
      category = data['category'] || activity.category_id;
    } else {
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
      <Typography variant="title">{name}</Typography>
    );
  };

  getDescription = () => {
    const { t, metaActivity, classes } = this.props;
    const { description } = metaActivity;
    return (
      <div>
        <Typography variant="title" className={classes.blockTitle}>
          {t('activity.description')}
        </Typography>
        <Typography>{description}</Typography>
      </div>
    );
  };

  renderDay = (selected_date) => {
    const { classes } = this.props;
    const day = selected_date.getDate();
    const month = selected_date.getMonth();
    const year = selected_date.getYear();

    let eventsThisDay = 0;
    for (const o of this.props.metaActivity.offers) {
      const date = new Date(o.date_start);
      if (selected_date) {
        if (isSameDay(date, selected_date)) {
          eventsThisDay += 1;
        }
      }
    }

    const dots = [];
    while (dots.length < eventsThisDay) {
      dots.push(<Grid key={dots.length} item className={classes.dot} />);
    }

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="flex-start"
        style={{ width: 28, height: 28 }}
      >
        <Grid item>{day}</Grid>
        <Grid item style={{ marginTop: 5 }}>
          <Grid container direction="row" justify="center">
            {eventsThisDay ? dots : null}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  handleDayClick = (date) => {
    const { metaActivity } = this.props;
    const offersOnSelectedDay = metaActivity.offers.filter((o) =>
      isSameDay(new Date(o.date_start), date),
    );
    this.setState({ offersOnSelectedDay });
  };

  getActivitiesWithCalendar = () => {
    const { t, metaActivity, classes } = this.props;
    const { activities } = metaActivity;
    const { offersOnSelectedDay } = this.state;
    return (
      <Grid container direction="row" alignItems="flex-start">
        <Grid item xs={12} md={6} className={classes.responsiveSubBlock}>
          <DayPicker
            handleDayClick={this.handleDayClick}
            renderDay={this.renderDay}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="title" className={classes.blockTitleLargeMargin}>
            {t('activity.offersThisDay')}
          </Typography>
          {offersOnSelectedDay.length ? (
            offersOnSelectedDay
              .filter((a) => {
                return true;
              })
              .map((o) => (
                <ActivityMinimalSummary
                  key={o.id}
                  activity={o.activity}
                  date={o.date_start}
                  showCoach
                />
              ))
          ) : (
            <Typography variant="caption">
              {t('activity.noOfferThisDay')}
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  };

  getPriceAndPacks = () => {
    const { metaActivity, classes, t } = this.props;
    const {
      payment_packs_available,
      default_price,
      default_credits,
    } = metaActivity;
    return (
      <Grid container direction="row" alignItems="center" justify="center">
        <Grid item xs={12} md={6}>
          <Grid
            container
            direction="column"
            spacing={16}
            justify="center"
            alignItems="center"
            className={classes.responsiveSubBlock}
          >
            <Grid item>
              <Typography variant="display2">{default_price} €</Typography>
            </Grid>
            <Grid item>-</Grid>
            <Grid item>
              <Typography>{`${t('activity.orNcredits1')} ${default_credits} ${t(
                'activity.orNcredits2',
              )}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.blockTitleLargeMargin} variant="title">
            {t('activity.packsAvailable')}
          </Typography>
          {payment_packs_available.map((p) => (
            <PackMinimalSummary key={p.id} pack={p} />
          ))}
        </Grid>
      </Grid>
    );
  };

  getReviews = () => {
    const { metaActivity, classes, t } = this.props;
    const { reviews } = metaActivity;
    return (
      <div className={classes.paddedPaper}>
        <Typography variant="title" className={classes.blockTitleLargeMargin}>
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
      </div>
    );
  };

  render() {
    if (this.props.loading || !this.props.metaActivity) {
      return <CircularProgress />;
    }
    const activity = this.props.metaActivity;
    const stats = this.getById(this.props.stats, this.activityId);

    const { classes, t } = this.props;

    return (
      <Grid container direction="row" spacing={32}>
        <Grid item xs={12} xl={6}>
          <Paper>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <ActivityCover activity={activity} />
              </Grid>
              <Grid item className={classes.paddedBlock}>
                <ActivityBasicInfo activity={activity} />
              </Grid>
              <Grid item>
                <ActivityStats activity={activity} stats={stats} />
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
          <Paper>{this.getReviews()}</Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.metaActivity.loading,
    metaActivity: state.metaActivity.metaActivity,
    stats: state.stats.activities,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMetaActivityDetails(id) {
      dispatch(metaActivityActions.fetchMetaActivityDetails(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(translate()(MetaActivity)),
);
