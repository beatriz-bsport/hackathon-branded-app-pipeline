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
} from '@material-ui/core';

type Props = {
  categories: *[],
  activities: *[],
  onSubmit: (*) => void,
};

type State = {
  name: string,
  price: number,
  starting_date: string,
  ending_date: string,
  credits: number,
  categories: *[],
  activities: *[],
};

export class PackForm extends React.Component<Props, State> {
  state = {
    name: '',
    price: 0,
    starting_date: '',
    ending_date: '',
    credits: '',
    categories: {},
    activities: {},
  };

  handleChange = (name: string) => (element) => {
    this.setState({ [name]: element.value });
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
    const { categories, activities } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="name"
          label="Name"
          required
          fullWidth
          onChange={this.handleChange('name')}
          helperText="Name for the payment pack"
          value={this.state.name}
        />
        <TextField
          id="price"
          label="Price"
          required
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          fullWidth
          onChange={this.handleChange('price')}
          helperText="Price for user for the whole pack"
          value={this.state.price}
        />
        <TextField
          id="starting_date"
          label="Starting date"
          type="date"
          helperText="Start date for pack, leave blank for direct availability"
          onChange={this.handleChange('starting_date')}
          fullWidth
          value={this.state.starting_date}
        />
        <TextField
          id="ending_date"
          label="Ending date"
          type="date"
          fullWidth
          onChange={this.handleChange('ending_date')}
          helperText="End date for pack, leave blank for no end"
          value={this.state.ending_date}
        />
        <TextField
          id="credits"
          label="Credits"
          type="number"
          fullWidth
          onChange={this.handleChange('credits')}
          helperText="Credits for the pack, leave blank for unlimited"
          value={this.state.credits}
        />
        <Typography variant="subheading">Categories</Typography>
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
        <Typography variant="subheading">Activities</Typography>
        {activities.map((activity) => (
          <FormControlLabel
            key={activity.id}
            label={activity.name}
            control={
              <Checkbox
                checked={this.isChecked('activities', activity.id)}
                onChange={this.handleCheck('activities', activity.id)}
              />
            }
          />
        ))}
        <Button type="submit">Add</Button>
      </form>
    );
  }
}

export default PackForm;
