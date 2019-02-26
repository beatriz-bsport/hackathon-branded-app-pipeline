// @flow

import { compose, withState, withProps, withPropsOnChange } from 'recompose';
import lodash from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

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
import { withNamespaces } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import DatePicker from 'material-ui-pickers/DatePicker';

import withSnackbar from '../../hocs/with-snackbar.hoc';
import { API_URI, getAuth, postAuth } from '../../http';
import { member as memberActions } from '../../actions';
import { FormField } from '../../components/input';
import { AvatarUploader } from '../../components';
import { Moment } from '../../i18n';
import AddressForm from '../../components/form/AddressForm.component';

import AlertExistingUser from '../members/AlertExistingUser.component';

const styles = (theme) => ({
  container: {
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
  processing: boolean,
  goToMember: (number) => void,
  linkMember: (number) => void,
  onSubmit: (*) => void,
  onCancel: () => void,
  emailExists: *,
  checkUserExists: ({ email?: string, phonenumber?: string }) => void,
};

type State = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  sex: string,
  gender: string,
  membership_ID: ?string,
  birthdayYear: ?number,
  date_joined: ?Object,
  avatar: *,
  processing: boolean,
  address: {
    address_line_1: ?string,
    address_line_2: ?string,
    city: ?string,
    country: ?string,
    zipcode: ?string,
  },
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
    date_joined: Moment(),
    address: {},
  };

  constructor(props: Props) {
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
      if (props.initial.date_joined) {
        this.state.date_joined = Moment(
          props.initial.date_joined,
          'YYYY-MM-DD',
        );
      }
      if (props.initial.sex) {
        this.state.gender = props.initial.sex;
      }
      if (props.initial.address) {
        this.state.address = props.initial.address || {};
      } else {
        this.state.address = {};
      }
    }
  }

  onFormFieldChange = (id: string) => (value: string) => {
    this.setState({ [id]: value });

    if (id === 'email') this.props.checkUserExists({ email: value });
    if (id === 'phone') this.props.checkUserExists({ phonenumber: value });
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
      date_joined,
      address,
    } = this.state;

    const data = {
      lastname,
      firstname,
      email,
      phone,
      accept_email,
      address: JSON.stringify(address),
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
    if (date_joined) {
      data.date_joined = Moment(date_joined).format('YYYY-MM-DD');
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

  handleAddressChange = (id: string) => (event: Object) => {
    this.setState((prevState) => ({
      address: { ...prevState.address, [id]: event.target.value },
    }));
  };

  renderMemberExists = () => {
    const { emailExists, goToMember, linkMember } = this.props;
    const { email, phonenumber, exists } = emailExists;
    if (!exists) {
      return null;
    }

    return (
      <AlertExistingUser
        email={email}
        phonenumber={phonenumber}
        memberId={exists.member_pk}
        goToMember={goToMember}
        linkMember={linkMember}
      />
    );
  };

  render() {
    const { classes, t, initial } = this.props;
    const { address } = this.state;
    const { firstname, lastname } = initial || {};
    const title = firstname
      ? `${firstname} ${lastname}`
      : t('member.forms.create.title');
    return (
      <div>
        {this.renderMemberExists()}
        <div className={classes.container}>
          <form target="/member" onSubmit={this.onSubmit}>
            <Typography variant="h6">{title}</Typography>
            <Grid container spacing={16}>
              <Grid item xs={12} md={12}>
                <AvatarUploader
                  initial={this.state.avatar}
                  onChange={this.onFormFieldChange('avatar')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  id="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PhoneInput
                  country="FR"
                  name="phone_number"
                  placeholder={t('form.member.phone')}
                  value={this.state.phone}
                  onChange={this.onFormFieldChange('phone')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  id="firstname"
                  name="firstname"
                  required
                  value={this.state.firstname}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  id="lastname"
                  name="lastname"
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
                <Grid container direction="row" spacing={16}>
                  <Grid item>
                    <TextField
                      name="birthday_year"
                      type="number"
                      value={this.state.birthdayYear}
                      shrink={this.state.birthdayYear}
                      onChange={(e) =>
                        this.onFormFieldChange('birthdayYear')(e.target.value)
                      }
                      label={t('form.member.birthdayYear')}
                    />
                  </Grid>
                  <Grid item>
                    <DatePicker
                      name="date_joined"
                      format="DD/MM/YYYY"
                      value={this.state.date_joined}
                      label={t('member.date_joined')}
                      onChange={(d) =>
                        this.setState({ date_joined: Moment(d) })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="membership_id"
                  label={t('form.member.referenceNumber')}
                  helperText={t('form.member.referenceNumberHelper')}
                  shrink={this.state.membership_ID}
                  value={this.state.membership_ID}
                  fullWidth
                  onChange={this.handleReferenceNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AddressForm
                  address_line_1={address.address_line_1}
                  address_line_2={address.address_line_2}
                  city={address.city}
                  country={address.country}
                  zipcode={address.zipcode}
                  onChange={this.handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  component="fieldset"
                  className={classes.rgpdControl}
                >
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
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withNamespaces(),
  withState('emailExists', 'setEmailExists', false),
  withPropsOnChange(['setEmailExists'], ({ setEmailExists }) => ({
    checkUserExists: lodash.debounce(({ email, phonenumber }) => {
      const q = email
        ? `email=${email}`
        : `phonenumber=${encodeURIComponent(phonenumber)}`;
      getAuth(`${API_URI}/saas/members/members/exists/?${q}`).catch((error) => {
        const { status, data } = error.response || {};
        if (status !== 404) {
          setEmailExists({ email, phonenumber, exists: data || {} });
        }
      });
    }, 1000),
  })),
  connect(
    null,
    {
      goToMember: (memberPk: number) => push(`/member/${memberPk}`),
      goToMemberList: () => push('/member'),
      refreshListMember: memberActions.fetchAll,
    },
  ),
  withSnackbar,
  withProps(
    ({
      emailExists,
      goToMemberList,
      goToMember,
      refreshListMember,
      snackbar,
      t,
    }) => ({
      linkMember: () => {
        const { email, phonenumber } = emailExists;
        postAuth(`${API_URI}/saas/members/members/link/`, {
          email,
          phonenumber,
        })
          .then(() => {
            snackbar.success(t('member.link.success'));
            refreshListMember();
            goToMemberList();
          })
          .catch((error) => {
            const { status, data } = error.response || {};
            if (status === 302) {
              goToMember(data.member_pk);
            }
          });
      },
    }),
  ),
)(MemberForm);
