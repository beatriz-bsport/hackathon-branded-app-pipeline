// @flow

import React, { Component } from 'react';

import {
  Grid,
  CircularProgress,
  Button,
  Paper,
  withStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { AvatarUploader } from '..';
import FormField from '../input/FormField.component';

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
  gender: 'M' | 'F',
  description: string,
  email: string,
  facebook_url: '',
  instagram_url: '',
};

const MARGIN_AVATAR = 100;

export class CoachForm extends Component<Props, State> {
  state = {
    avatar: null,
    firstname: '',
    lastname: '',
    birthdayYear: '',
    email: '',
    phone: '',
    gender: 'M',
    description: '',
    instagram_url: '',
    facebook_url: '',
  };

  constructor(props: Props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
    if (props.initial) {
      if (props.initial.birthday) {
        this.state.birthdayYear = props.initial.birthday.slice(0, 4);
      }
      if (props.initial.photo) {
        this.state.avatar = props.initial.photo;
      }
    }
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
      gender,
      instagram_url,
      facebook_url,
    } = this.state;
    const data = {
      lastname,
      firstname,
      description,
      email,
      gender,
      facebook_url,
      instagram_url,
    };
    if (avatar && typeof avatar !== 'string') {
      data.avatar = avatar;
    }
    if (phone) {
      data.phone = phone;
    }
    if (birthdayYear) {
      data.birthdayYear = birthdayYear;
    }
    this.props.onSubmit(data);
  };

  renderButton = () => {
    if (this.props.processing) {
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
          <Button variant="contained" color="primary" type="submit">
            {this.props.t('form.send')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, t, initial } = this.props;
    return (
      <Paper className={classes.paperContainer}>
        <form target="/coach" onSubmit={this.onSubmit}>
          <div style={{ marginTop: -MARGIN_AVATAR }}>
            <AvatarUploader
              initial={this.state.avatar}
              onChange={this.onFormFieldChange('avatar')}
            />
          </div>
          <Grid container spacing={16} className={classes.fieldset}>
            <Grid item xs={12} md={6}>
              <FormField
                id="firstname"
                required
                fullWidth
                value={this.state.firstname}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="lastname"
                value={this.state.lastname}
                required
                fullWidth
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="email"
                value={this.state.email}
                required
                fullWidth
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormField
                id="phone"
                fullWidth
                value={this.state.phone}
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
                id="birthdayYear"
                value={this.state.birthdayYear}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label="Description"
                inputProps={{ maxLength: 4999 }}
                value={this.state.description}
                onChange={(event) =>
                  this.onFormFieldChange('description')(event.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Facebook url"
                fullWidth
                value={this.state.facebook_url}
                onChange={(e) =>
                  this.onFormFieldChange('facebook_url')(e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram url"
                value={this.state.instagram_url}
                onChange={(e) =>
                  this.onFormFieldChange('instagram_url')(e.target.value)
                }
              />
            </Grid>
          </Grid>
          {this.renderButton()}
        </form>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  paperContainer: {
    marginTop: MARGIN_AVATAR,
    padding: theme.spacing.unit * 3,
    maxWidth: 800,
  },
  fieldset: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)(translate()(CoachForm));
