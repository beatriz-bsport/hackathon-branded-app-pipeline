import React, { Component } from 'react';

import {
  Grid,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Typography,
  TextField,
  Paper,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { AvatarUploader, FormField } from '../components';
import api from '../api';

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

type Props = {};

//prettier-ignore
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$');

export class CoachForm extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      firstname: null,
      lastname: null,
      email: null,
      phone: '',
      sex: 'M',
      emailIsCorrect: true,
    };
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'email') {
      if (event.target.value) {
        const emailIsCorrect = emailRegexp.test(event.target.value);
        this.setState({ emailIsCorrect });
      } else {
        this.setState({ emailIsCorrect: true });
      }
    }
    if (name === 'phone') {
      const phone = event.target.value.replace(/[^0-9+]+/g, '');
      this.setState({ phone });
    }
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: (value, error) });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const {
      firstname,
      lastname,
      birthdayYear,
      description,
      email,
      phone,
    } = this.state;
    api.coach.addCoach({
      lastname,
      firstname,
      birthdayYear,
      description,
      email,
      phone,
    });
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
                  <FormField
                    id="birthdayYear"
                    onChange={this.onFormFieldChange}
                  />
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
                  <FormField
                    fullWidth
                    multiline
                    id="description"
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
                      <Link to="/coach" style={{ textDecoration: 'none' }}>
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

export default withStyles(styles)(translate()(CoachForm));
