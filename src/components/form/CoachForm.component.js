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
  gender: 'M' | 'F',
  description: string,
  email: string,
  facebook_url: '',
  instagram_url: '',
};

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
      birthdayYear,
      description,
      email,
      phone,
      gender,
      facebook_url,
      instagram_url,
    };
    if (avatar && typeof avatar !== 'string') {
      data.avatar = avatar;
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
          <Button variant="raised" color="primary" type="submit">
            {this.props.t('form.send')}
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, t, initial } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <form target="/coach" onSubmit={this.onSubmit}>
              <Grid container direction="column" spacing={16}>
                <Grid item>
                  <Typography variant="title">
                    {t(
                      `coach.forms.${
                        initial && initial.id ? 'update' : 'create'
                      }.title`,
                    )}
                  </Typography>
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
                        initial={this.state.avatar}
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
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={16}
                  >
                    <Grid item>
                      <FormField
                        id="gender"
                        value={this.state.gender}
                        onChange={this.onFormFieldChange}
                      />
                    </Grid>
                    <Grid item>
                      <FormField
                        required
                        id="birthdayYear"
                        value={this.state.birthdayYear}
                        onChange={this.onFormFieldChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={16}
                    alignItems="center"
                  >
                    <Grid item>
                      <FormField
                        id="phone"
                        value={this.state.phone}
                        required
                        onChange={this.onFormFieldChange}
                      />
                    </Grid>
                    <Grid item>
                      <FormField
                        id="email"
                        value={this.state.email}
                        required
                        onChange={this.onFormFieldChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <FormField
                    fullWidth
                    multiline
                    id="description"
                    value={this.state.description}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item>
                      <TextField
                        label="Facebook url"
                        value={this.state.facebook_url}
                        onChange={(e) =>
                          this.onFormFieldChange('facebook_url')(e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Instagram url"
                        value={this.state.instagram_url}
                        onChange={(e) =>
                          this.onFormFieldChange('instagram_url')(
                            e.target.value,
                          )
                        }
                      />
                    </Grid>
                  </Grid>
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
