// @flow

import _ from 'lodash';
import React from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import LEVELS from 'bsport-commons/lib/master-data/levels';

type Props = {
  categories: *[],
  activities: *[],
  onSubmit: (*) => void,
  loading: boolean,
  t: (x: string) => string,
};

type State = {
  name: string,
  price: number,
  starting_date: ?string,
  ending_date: string,
  credits: number,
  categories: *[],
  activities: *[],
};

export class PackForm extends React.Component<Props, State> {
  state = {
    name: null,
    price: 0,
    starting_date: null,
    ending_date: null,
    credits: null,
    categories: {},
    activities: {},
  };

  handleChange = (name: string) => (element) => {
    this.setState({ [name]: element.target.value });
  };

  handleCheck = (valuesKey: string, valueId) => {
    const values = this.props[valuesKey];
    return (event) => {
      const currentValues = this.state[valuesKey];
      currentValues[valueId] = event.target.checked;
      this.setState({ [valuesKey]: currentValues });
    };
  };

  isChecked = (valuesKey: string, valueId) => {
    const values = this.state[valuesKey];
    return values[valueId];
  };

  onSubmit = (event) => {
    event.preventDefault();

    const keys = ['name', 'price', 'starting_date', 'ending_date', 'credits'];
    const data = _.pick(this.state, keys);
    data.categories = Object.keys(this.state.categories);
    data.activities = Object.keys(this.state.activities);

    this.props.onSubmit(data);
  };

  render() {
    const { t, categories, loading, activities } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <TextField
              id="name"
              label={t('common.name')}
              required
              fullWidth
              onChange={this.handleChange('name')}
              helperText={t('form.paymentPack.helper.name')}
              value={this.state.name}
            />
          </Grid>
          <Grid item>
            <TextField
              id="price"
              label={t('common.price')}
              required
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
              fullWidth
              onChange={this.handleChange('price')}
              helperText={t('form.paymentPack.helper.price')}
              value={this.state.price}
            />
          </Grid>
          <Grid item>
            <TextField
              id="starting_date"
              type="date"
              helperText={t('form.paymentPack.helper.starting_date')}
              onChange={this.handleChange('starting_date')}
              fullWidth
              value={this.state.starting_date}
            />
          </Grid>
          <Grid item>
            <TextField
              id="ending_date"
              type="date"
              fullWidth
              onChange={this.handleChange('ending_date')}
              helperText={t('form.paymentPack.helper.ending_date')}
              value={this.state.ending_date}
            />
          </Grid>
          <Grid item>
            <TextField
              id="credits"
              label={t('common.credits')}
              type="number"
              fullWidth
              onChange={this.handleChange('credits')}
              helperText={t('form.paymentPack.helper.credits')}
              value={this.state.credits}
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
            <Typography variant="subheading">Activities</Typography>
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
