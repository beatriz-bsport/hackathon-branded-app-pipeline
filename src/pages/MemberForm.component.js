// @flow

import React, { Component } from 'react';

import { Button, Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../api';
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
  avatarLarge: {
    marginTop: 70,
    marginRight: 100,
    marginBottom: 40,
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

  onFormFieldChange = (id: string) => (value, error: boolean) => {
    this.setState({ [id]: (value, error) });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { sex, firstname, lastname, email, phone } = this.state;
    api.member.addMember({
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
      <Grid container direction="row">
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <form target="/member" onSubmit={this.onSubmit}>
              <Grid container direction="column" spacing={16}>
                <Grid item>
                  <Typography variant="title">{t('form.newMember')}</Typography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={16}
                    alignItems="center"
                  >
                    <Grid item className={classes.avatarLarge}>
                      <AvatarUploader />
                    </Grid>
                    <Grid item>
                      <Grid container direction="column">
                        <Grid item>
                          <FormField
                            id="firstname"
                            required
                            onChange={this.onFormFieldChange}
                          />
                        </Grid>
                        <Grid item>
                          <FormField
                            id="lastname"
                            required
                            onChange={this.onFormFieldChange}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <FormField id="gender" onChange={this.onFormFieldChange} />
                </Grid>
                <Grid item>
                  <FormField id="phone" onChange={this.onFormFieldChange} />
                  <FormField
                    id="email"
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    spacing={16}
                  >
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
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(MemberForm));
