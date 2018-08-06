import React, { Component } from 'react';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Input,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { Avatar } from '../components';

const styles = (theme) => ({
  textInput: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  id: String,
  onChange: () => void,
};

//prettier-ignore
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$');

export class FormField extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      value: null,
    };
  }

  validator = (value) => {
    /*
     * Return true if error in input
     */
    const { id, required } = this.props;
    if (required && !value) {
      return true;
    }
    switch (id) {
      case 'email':
        if (value) {
          return !emailRegexp.test(value);
        } else {
          return true;
        }
      case 'birthdayYear':
        const year = parseInt(value, 10);
        return year > 2020 || 1900 > year;
      default:
        return false;
    }
  };

  formatInput = (input) => {
    const { id } = this.props;
    switch (id) {
      case 'birthdayYear':
      case 'phone':
        return input.replace(/[^0-9+]/g, '');
      default:
        return input;
    }
  };

  handleChange = (event) => {
    const { id } = this.props;
    if (id === 'photo') {
      this.setState({ value: event.target.files[0] });
    }
    const formattedInput = this.formatInput(event.target.value);
    const error = this.validator(formattedInput);
    this.setState({
      value: formattedInput,
      error,
    });
    this.props.onChange(id)(formattedInput, error);
  };

  uploadHandler = () => {};

  render() {
    const { id, t, multiline, fullWidth, required, classes } = this.props;
    const { value, error } = this.state;

    switch (id) {
      case 'birthdayYear':
      case 'email':
      case 'phone':
      case 'lastname':
      case 'firstname':
      case 'description':
        return (
          <TextField
            className={classes.textInput}
            required={required}
            value={value}
            id={id}
            label={t(`form.${id}`)}
            onChange={this.handleChange}
            error={error}
            multiline={multiline}
            fullWidth={fullWidth}
          />
        );
      case 'gender':
        return (
          <FormControl className={classes.formControl} margin="normal">
            <InputLabel htmlFor="gender-helper">{t('form.gender')}</InputLabel>
            <Select value={value || 'M'} onChange={this.handleChange}>
              <MenuItem value="M">{t('common.male')}</MenuItem>
              <MenuItem value="F">{t('common.female')}</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  }
}

export default withStyles(styles)(translate()(FormField));
