import React, { Component } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

import { FormField } from '../input';

type Props = {
  onComplete: (code: String) => void,
};

type State = {
  code: String,
};

export class SMSCodeForm extends Component<Props, State> {
  state = {
    code: null,
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: value });
  };

  submitSMSCode = (event) => {
    event.preventDefault();
    this.props.onComplete(this.state.code);
  };

  render() {
    const { t } = this.props;
    return (
      <form onSubmit={this.submitSMSCode}>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <Typography>{t('form.pleaseEnterYourSMSCode')}</Typography>
          </Grid>
          <Grid item>
            <FormField
              id="code"
              onChange={this.onFormFieldChange}
              required
              value={this.state.code}
            />
          </Grid>
          <Grid item>
            <Button type="submit">OK</Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default translate()(SMSCodeForm);
