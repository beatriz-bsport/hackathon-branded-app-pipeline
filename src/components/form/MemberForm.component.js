// @flow
import React, { Component } from 'react';
import {
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
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
  membership_ID: ?string,
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
    membership_ID: null,
    birthdayYear: null,
    accept_email: true,
    accept_sms: true,
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
      membership_ID,
      birthdayYear,
      lastname,
      email,
      phone,
      avatar,
      accept_email,
      accept_sms,
    } = this.state;

    const data = {
      lastname,
      firstname,
      email,
      phone,
      accept_email,
      accept_sms,
      gender,
      membership_ID,
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
        membership_ID: value.slice(0, 12).toUpperCase(),
      });
    }
    return this.setState({ membership_ID: value });
  };

  render() {
    const { classes, t, initial } = this.props;
    const { firstname, lastname } = initial || {};
    const title = firstname
      ? `${firstname} ${lastname}`
      : t('member.forms.create.title');
    return (
      <div className={classes.paperContainer}>
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
                shrink={this.state.membership_ID}
                value={this.state.membership_ID}
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
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" className={classes.rgpdControl}>
                <FormLabel component="legend">
                  {t('form.member.rgpdTitle')}
                </FormLabel>
                <FormGroup
                  aria-label="Communication"
                  name="communication"
                  className={classes.radioGroup}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.accept_email}
                        onChange={(e) =>
                          this.setState({ accept_email: e.target.checked })
                        }
                      />
                    }
                    label={t('form.signup.communication.email')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.accept_sms}
                        onChange={(e) =>
                          this.setState({ accept_sms: e.target.checked })
                        }
                      />
                    }
                    label={t('form.signup.communication.sms')}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="row" justify="flex-end" spacing={16}>
                <Grid item>
                  <Button onClick={this.props.onCancel}>
                    {t('form.discard')}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    disabled={this.props.processing}
                    variant="contained"
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
      </div>
    );
  }
}

export default withStyles(styles)(translate()(MemberForm));
