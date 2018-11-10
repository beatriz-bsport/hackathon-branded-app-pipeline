// @flow

import _ from 'lodash';
import React from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  Collapse,
  FormControlLabel,
  RadioGroup,
  Checkbox,
  Button,
  Grid,
  Radio,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import LEVELS from 'bsport-commons/lib/master-data/levels';

import FormField from '../input/FormField.component';
import { Moment } from '../../i18n';

type Props = {
  categories: *[],
  activities: *[],
  onSubmit: (*) => void,
  loading: boolean,
  t: (x: string) => string,
};

type State = {
  name: ?string,
  price: number,
  starting_date: ?string,
  ending_date: ?string,
  credits: ?number,
  categories: Object,
  activities: Object,
  timeType: number,
  lower_date: Object,
  upper_date: Object,
  max_bookings_per_week: number,
};

/*
 * VALID_BY_DURATION:
 * the pack will be active on the specified
 * number of days after the consumer bought it
 *
 * VALID_BY_DATERANGE:
 *  the pack is valid on a fixed daterange
 */
const VALID_BY_DURATION = 0;
const VALID_BY_DATERANGE = 1;

export class PackForm extends React.Component<Props, State> {
  state = {
    name: null,
    price: 0,
    starting_date: null,
    ending_date: null,
    credits: null,
    categories: {},
    activities: {},
    timeType: VALID_BY_DURATION,
    duration_days: 30,
    max_bookings_per_week: 10,
    lower_date: Moment(),
    upper_date: Moment().add('days', 365),
  };

  handleChange = (name: string) => (element: Object) => {
    this.setState({ [name]: element.target.value });
  };

  handleFormFieldChange = (name: string) => (element: Object) => {
    this.setState({ [name]: element });
  };

  handleCheck = (valuesKey: string, valueId: Object) => (event: Object) => {
    // eslint-disable-next-line
    const currentValues = this.state[valuesKey];
    currentValues[valueId] = event.target.checked;
    // eslint-disable-next-line
    this.setState({ [valuesKey]: currentValues });
  };

  isChecked = (valuesKey: string, valueId: Object) => {
    const values = this.state[valuesKey];
    return values[valueId];
  };

  onSubmit = (event: Object) => {
    event.preventDefault();

    const keys = ['name', 'price', 'credits', 'max_bookings_per_week'];
    const data = _.pick(this.state, keys);
    data.categories = Object.keys(this.state.categories);
    data.activities = Object.keys(this.state.activities);

    switch (this.state.timeType) {
      case VALID_BY_DATERANGE: {
        data.validity_daterange = {
          lower: this.state.lower_date,
          upper: this.state.upper_date,
        };
        data.duration_days = null;
        break;
      }
      case VALID_BY_DURATION:
      default:
        data.duration_days = this.state.duration_days;
        data.validity_daterange = null;
        break;
    }

    this.props.onSubmit(data);
  };

  setTimeTypeToDuration = (event) => {
    if (event.target.checked) {
      this.setState({ timeType: VALID_BY_DURATION });
    }
  };

  setTimeTypeToDaterange = (event) => {
    if (event.target.checked) {
      this.setState({ timeType: VALID_BY_DATERANGE });
    }
  };

  renderTimeSetting = () => {
    const { t } = this.props;
    const { timeType } = this.state;
    return (
      <Grid container direction="row" alignItems="flex-start" spacing={24}>
        <Grid item xs={12}>
          <Typography variant="title">
            {t('form.paymentPack.timeSettingsTitle')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup>
            <FormControlLabel
              value="duration"
              control={
                <Radio
                  checked={timeType === VALID_BY_DURATION}
                  onChange={this.setTimeTypeToDuration}
                  name="radio-button-time-type-duration"
                />
              }
              label={t('form.paymentPack.validByDuration')}
            />
            <FormControlLabel
              value="daterange"
              control={
                <Radio
                  checked={timeType === VALID_BY_DATERANGE}
                  onChange={this.setTimeTypeToDaterange}
                  name="radio-button-time-type-daterange"
                />
              }
              label={t('form.paymentPack.validByDaterange')}
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container direction="column" spacing={16}>
            <Grid item>
              <Grid container direction="column" spacing={8}>
                <Collapse in={timeType === VALID_BY_DURATION}>
                  <Grid item>
                    <TextField
                      label={t('form.paymentPack.durationDays')}
                      required
                      type="number"
                      fullWidth
                      onChange={this.handleChange('duration_days')}
                      value={this.state.duration_days}
                    />
                  </Grid>
                </Collapse>
                <Collapse in={timeType === VALID_BY_DATERANGE}>
                  <Grid item>
                    <FormField
                      id="lower_date"
                      value={this.state.lower_date}
                      onChange={this.handleFormFieldChange}
                    />
                  </Grid>
                  <Grid item>
                    <FormField
                      id="upper_date"
                      value={this.state.upper_date}
                      onChange={this.handleFormFieldChange}
                    />
                  </Grid>
                </Collapse>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderNamePriceSettings = () => (
    <Grid container direction="column" spacing={16}>
      <Grid item>
        <Typography variant="title">
          {this.props.t('form.paymentPack.generalSettingsTitle')}
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          id="name"
          label={this.props.t('common.name')}
          required
          fullWidth
          onChange={this.handleChange('name')}
          helperText={this.props.t('form.paymentPack.helper.name')}
          value={this.state.name}
        />
      </Grid>
      <Grid item>
        <TextField
          id="price"
          label={this.props.t('common.price')}
          required
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          fullWidth
          onChange={this.handleChange('price')}
          helperText={this.props.t('form.paymentPack.helper.price')}
          value={this.state.price}
        />
      </Grid>
      <Grid item>
        <TextField
          id="credits"
          label={this.props.t('common.credits')}
          type="number"
          fullWidth
          onChange={this.handleChange('credits')}
          helperText={this.props.t('form.paymentPack.helper.credits')}
          value={this.state.credits}
        />
      </Grid>
    </Grid>
  );

  renderRestrictions = () => {
    const { t, categories, activities } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="title">
            {t('form.paymentPack.restrictionsTitle')}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            label={t('form.paymentPack.maxBookingPerWeek')}
            required
            type="number"
            fullWidth
            onChange={this.handleChange('max_bookings_per_week')}
            helperText={t('form.paymentPack.helper.maxBookingPerWeek')}
            value={this.state.max_bookings_per_week}
          />
        </Grid>
        <Grid item>
          <Typography variant="subheading">{t('common.sports')}</Typography>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              label={category.name}
              control={
                <Checkbox
                  checked={this.isChecked('categories', category.id)}
                  onChange={this.handleCheck('categories', category.id)}
                />
              }
            />
          ))}
        </Grid>
        <Grid item>
          <Typography variant="subheading">{t('common.activities')}</Typography>
          {activities.map((activity) => (
            <FormControlLabel
              key={activity.id}
              label={`${activity.name} - ${activity.coach.name} - ${
                activity.etablissement.title
              } - ${t(
                `level.${
                  LEVELS.filter((l) => l.id === activity.level)[0].text
                }`,
              )}`}
              control={
                <Checkbox
                  checked={this.isChecked('activities', activity.id)}
                  onChange={this.handleCheck('activities', activity.id)}
                />
              }
            />
          ))}
        </Grid>
      </Grid>
    );
  };

  render() {
    const { t, loading } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container direction="column" spacing={32}>
          <Grid item>{this.renderNamePriceSettings()}</Grid>
          <Grid item>{this.renderTimeSetting()}</Grid>
          <Grid item>{this.renderRestrictions()}</Grid>
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="raised" color="primary">
                {t('common.create')}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default translate()(PackForm);
