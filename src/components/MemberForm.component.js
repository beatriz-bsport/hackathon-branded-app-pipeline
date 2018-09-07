// @flow

import React, { Component } from 'react';

import { Button, Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AvatarUploader, FormField } from '../components';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  textInput: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    minWidth: 130,
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  classes: Object,
  t: (x: string) => string,
};

type State = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  sex: string,
};

export class MemberForm extends Component<Props, State> {
  state = {
    firstname: null,
    lastname: null,
    email: null,
    phone: '',
    sex: 'M',
  };

  constructor(props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
  }

  onFormFieldChange = (id: string) => (value, error: boolean) => {
    this.setState({ [id]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { sex, firstname, lastname, email, phone } = this.state;
    this.props.onSubmit({
      lastname,
      firstname,
      email,
      phone,
      sex,
    });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Paper className={classes.paperContainer}>
        <form target="/member" onSubmit={this.onSubmit}>
          <Typography variant="title">{t('form.newMember')}</Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <FormField
                id="firstname"
                required
                value={this.state.firstname}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="lastname"
                required
                value={this.state.lastname}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="gender"
                value={this.state.gender}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="phone"
                value={this.state.phone}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="email"
                required
                value={this.state.email}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="row" justify="flex-end" spacing={16}>
                <Grid item>
                  <Link to="/member" style={{ textDecoration: 'none' }}>
                    <Button>{t('form.discard')}</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Button variant="raised" color="primary" type="submit">
                    {t('form.send')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(translate()(MemberForm));
