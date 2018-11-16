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
  FormHelperText,
  FormGroup,
  Grid,
  Radio,
  CircularProgress,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import FormField from '../input/FormField.component';
import { Moment } from '../../i18n';

type Props = {
  categories: *[],
  metaActivities: *[],
  onSubmit: (*) => void,
  loading: boolean,
  t: (x: string) => string,
};

type State = {
  name: ?string,
  price: number,
  credits: ?number,
  categories: Object,
  metaActivities: Object,
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
  constructor(props) {
    super(props);
    if (props.initial) {
      const valid_by_duration = props.initial.duration_days;
      this.state = {
        id: props.initial.id,
        name: props.initial.name,
        price: props.initial.price,
        credits: props.initial.credits,
        categories: props.initial.categories.map((c) => c.id),
        metaActivities: props.initial.metaActivities,
        timeType: valid_by_duration ? VALID_BY_DURATION : VALID_BY_DATERANGE,
        duration_days: 30,
        max_bookings_per_week: props.initial.max_bookings_per_week,
        lower_date: valid_by_duration
          ? Moment()
          : Moment(JSON.parse(props.initial.validity_daterange).lower),
        upper_date: valid_by_duration
          ? Moment().add('days', 365)
          : Moment(JSON.parse(props.initial.validity_daterange).upper),
      };
    } else {
      this.state = {
        name: null,
        price: 0,
        credits: null,
        categories: [],
        metaActivities: [],
        timeType: VALID_BY_DURATION,
        duration_days: 30,
        max_bookings_per_week: null,
        lower_date: Moment(),
        upper_date: Moment().add('days', 365),
      };
    }
  }

  handleChange = (name: string) => (element: Object) => {
    this.setState({ [name]: element.target.value });
  };

  handleFormFieldChange = (name: string) => (element: Object) => {
    this.setState({ [name]: element });
  };

  handleCatCheck = (checked: boolean, id: number) => {
    if (checked && !this.state.categories.find((cat) => id === cat)) {
      return this.setState((prevState) => ({
        categories: [...prevState.categories, id],
      }));
    }
    if (!checked) {
      return this.setState((prevState) => ({
        categories: prevState.categories.filter((c) => c !== id),
      }));
    }
  };

  handleMetaActivityCheck = (checked: boolean, id: number) => {
    if (checked && !this.state.metaActivities.find((cat) => id === cat)) {
      return this.setState((prevState) => ({
        metaActivities: [...prevState.metaActivities, id],
      }));
    }
    if (!checked) {
      return this.setState((prevState) => ({
        metaActivities: prevState.metaActivities.filter((c) => c !== id),
      }));
    }
  };

  onSubmit = (event: Object) => {
    event.preventDefault();

    const keys = ['name', 'price', 'credits', 'max_bookings_per_week', 'id'];
    const data = _.pick(this.state, keys);
    data.categories = this.state.categories;
    data.metaActivities = this.state.metaActivities;

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
    const { t, categories, metaActivities } = this.props;
    return (
      <Grid container direction="column" spacing={32}>
        <Grid item>
          <Typography variant="title">
            {t('form.paymentPack.restrictionsTitle')}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            label={t('form.paymentPack.maxBookingPerWeek')}
            type="number"
            fullWidth
            onChange={this.handleChange('max_bookings_per_week')}
            helperText={t('form.paymentPack.helper.maxBookingPerWeek')}
            value={this.state.max_bookings_per_week}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={32}>
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">{t('common.sports')}</FormLabel>
                <FormGroup>
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      label={category.name}
                      control={
                        <Checkbox
                          checked={this.state.categories.find(
                            (cat) => category.id === cat,
                          )}
                          onChange={(event) =>
                            this.handleCatCheck(
                              event.target.checked,
                              category.id,
                            )
                          }
                        />
                      }
                    />
                  ))}
                </FormGroup>
                <FormHelperText>
                  {t('form.paymentPack.noneMeansAll')}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  {t('common.activities')}
                </FormLabel>
                <FormGroup>
                  {metaActivities.map((metaActivity) => (
                    <FormControlLabel
                      key={metaActivity.id}
                      label={metaActivity.name}
                      control={
                        <Checkbox
                          checked={this.state.metaActivities.find(
                            (ma) => ma === metaActivity.id,
                          )}
                          onChange={(event) =>
                            this.handleMetaActivityCheck(
                              event.target.checked,
                              metaActivity.id,
                            )
                          }
                        />
                      }
                    />
                  ))}
                </FormGroup>
                <FormHelperText>
                  {t('form.paymentPack.noneMeansAll')}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
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
