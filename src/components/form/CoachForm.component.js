// @flow

import React, { Component } from 'react';

import { Grid, CircularProgress, Button, Paper, withStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { AvatarUploader } from '..';
import FormField from '../input/FormField.component';

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
    marginRight: 10,
  },
});

type Props = {
  processing: boolean,
  initial: { [string]: string },
  onSubmit: (FormData) => void,
  classes: Object,
  t: (x: string) => string,
};

type State = {
  avatar: ?string,
  firstname: string,
  lastname: string,
  birthdayYear: string,
  phone: string,
  sex: 'M' | 'F',
  description: string,
  email: string,
};

export class CoachForm extends Component<Props, State> {
  state = {
    avatar: null,
    firstname: '',
    lastname: '',
    birthdayYear: '',
    email: '',
    phone: '',
    sex: 'M',
    description: '',
  };

  constructor(props: Props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
  }

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    const {
      avatar,
      firstname,
      lastname,
      birthdayYear,
      description,
      email,
      phone,
      sex,
    } = this.state;
    const formData = new FormData();
    if (avatar) {
      formData.append('avatar', avatar);
    }
    formData.append('lastname', lastname);
    formData.append('firstname', firstname);
    formData.append('birthdayYear', birthdayYear);
    formData.append('description', description);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('sex', sex);
    this.props.onSubmit(formData);
  };

  renderButton = () => {
    if (this.state.processing) {
      return (
        <Grid container item direction="row" justify="flex-end" spacing={16}>
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <Grid container direction="row" justify="flex-end" spacing={16}>
        <Grid item>
          <Link to="/coach" style={{ textDecoration: 'none' }}>
            <Button>{this.props.t('form.discard')}</Button>
          </Link>
        </Grid>
        <Grid item>
          <Button variant="raised" color="primary" type="submit">
            {this.props.t('form.send')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <form target="/coach" onSubmit={this.onSubmit}>
              <Grid container direction="column" spacing={16}>
                <Grid item>
                  <Typography variant="title">{t('form.newCoach')}</Typography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={16}
                    alignItems="center"
                  >
                    <Grid item className={classes.avatarLarge}>
                      <AvatarUploader
                        onChange={this.onFormFieldChange('avatar')}
                      />
                    </Grid>
                    <Grid item>
                      <Grid container direction="column">
                        <Grid item>
                          <FormField
                            id="firstname"
                            required
                            value={this.state.firstname}
                            onChange={this.onFormFieldChange}
                          />
                        </Grid>
                        <Grid item>
                          <FormField
                            id="lastname"
                            value={this.state.lastname}
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
                  <FormField
                    required
                    id="birthdayYear"
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="phone"
                    value={this.state.phone}
                    required
                    onChange={this.onFormFieldChange}
                  />
                  <FormField
                    id="email"
                    value={this.state.email}
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    fullWidth
                    multiline
                    required
                    id="description"
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>{this.renderButton()}</Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(CoachForm));
