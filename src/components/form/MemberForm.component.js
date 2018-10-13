// @flow
import React, { Component } from 'react';
import { Button, Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FormField } from '../input';
import { AvatarUploader } from '..';

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
  initial: *,
  update: boolean,
};

type State = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  sex: string,
  avatar: *,
};

export class MemberForm extends Component<Props, State> {
  state = {
    firstname: null,
    lastname: null,
    email: null,
    phone: '',
    sex: 'M',
    avatar: null,
  };

  constructor(props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
    if (props.initial) {
      if (props.initial.phone_number) {
        this.state.phone = props.initial.phone_number;
      }
      if (props.initial.photo) {
        this.state.avatar = props.initial.photo;
      }
    }
  }

  onFormFieldChange = (id: string) => (value, error: boolean) => {
    this.setState({ [id]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { sex, firstname, lastname, email, phone, avatar } = this.state;

    const data = {
      lastname,
      firstname,
      email,
      phone,
      sex,
    };

    if (avatar && typeof avatar !== 'string') {
      data.avatar = avatar;
    }

    this.props.onSubmit(data);
  };

  render() {
    const { classes, t, initial } = this.props;
    const { firstname, lastname } = initial || {};
    const title = firstname
      ? `${firstname} ${lastname}`
      : t('member.forms.create.title');
    return (
      <Paper className={classes.paperContainer}>
        <form target="/member" onSubmit={this.onSubmit}>
          <Typography variant="title">{title}</Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} md={12}>
              <AvatarUploader
                initial={this.state.avatar}
                onChange={this.onFormFieldChange('avatar')}
              />
            </Grid>
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
                required
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
