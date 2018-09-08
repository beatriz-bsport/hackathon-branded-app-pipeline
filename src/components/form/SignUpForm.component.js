import React, { Component } from 'react';

import { Grid, Button } from '@material-ui/core';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { FormField } from '../input';

type Props = {
  onComplete: (Object) => void,
};
export default class SignUpForm extends Component<Props> {
  state = {
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
  };

  submitInfo = (event) => {
    event.preventDefault();
    const { email, firstname, lastname, phone } = this.state;
    this.props.onComplete({ email, firstname, lastname, phone });
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: value });
  };

  render() {
    return (
      <form onSubmit={this.submitInfo}>
        <Grid container direction="column" spacing={16} alignItems="flex-start">
          <Grid item>
            <FormField
              required
              id="firstname"
              onChange={this.onFormFieldChange}
            />
            <FormField
              required
              id="lastname"
              onChange={this.onFormFieldChange}
            />
          </Grid>
          <Grid item>
            <FormField required id="email" onChange={this.onFormFieldChange} />
          </Grid>
          <Grid item>
            <PhoneInput
              country="FR"
              placeholder="Enter phone number"
              required
              onChange={(phone) => this.setState({ phone })}
            />
          </Grid>
          <Grid item>
            <Button type="submit">OK</Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}
