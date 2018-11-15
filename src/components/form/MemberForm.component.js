// @flow
import React, { Component } from 'react';
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import { FormField } from '../input';
import { AvatarUploader } from '..';
import { Moment } from '../../i18n';

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
  reference_number: ?string,
  birthdayYear: ?number,
  avatar: *,
  processing: boolean,
};

export class MemberForm extends Component<Props, State> {
  state = {
    firstname: null,
    lastname: null,
    email: null,
    phone: '',
    gender: 'M',
    avatar: null,
    reference_number: null,
    birthdayYear: null,
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
      if (props.initial.birthday) {
        this.state.birthdayYear = Moment(
          props.initial.birthday,
          'YYYY-MM-DD',
        ).year();
      }
    }
  }

  onFormFieldChange = (id: string) => (value, error: boolean) => {
    this.setState({ [id]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const {
      gender,
      firstname,
      reference_number,
      birthdayYear,
      lastname,
      email,
      phone,
      avatar,
    } = this.state;

    const data = {
      lastname,
      firstname,
      email,
      phone,
      gender,
      reference_number,
    };

    if (avatar && typeof avatar !== 'string') {
      data.avatar = avatar;
    }

    if (birthdayYear) {
      data.birthdayYear = parseInt(birthdayYear, 10);
    }

    this.props.onSubmit(data);
  };

  handleReferenceNumber = (e) => {
    const { value } = e.target;
    if (value) {
      return this.setState({
        reference_number: value.slice(0, 12).toUpperCase(),
      });
    }
    return this.setState({ reference_number: value });
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
          <Grid container spacing={16}>
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
                id="email"
                required
                value={this.state.email}
                onChange={this.onFormFieldChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('form.member.referenceNumber')}
                helperText={t('form.member.referenceNumberHelper')}
                shrink={this.state.reference_number}
                value={this.state.reference_number}
                fullWidth
                onChange={this.handleReferenceNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                value={this.state.birthdayYear}
                shrink={this.state.birthdayYear}
                onChange={(e) =>
                  this.onFormFieldChange('birthdayYear')(e.target.value)
                }
                label={t('form.member.birthdayYear')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PhoneInput
                country="FR"
                placeholder={t('form.member.phone')}
                value={this.state.phone}
                required
                onChange={this.onFormFieldChange('phone')}
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
                  <Button
                    disabled={this.props.processing}
                    variant="raised"
                    color="primary"
                    type="submit"
                  >
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
