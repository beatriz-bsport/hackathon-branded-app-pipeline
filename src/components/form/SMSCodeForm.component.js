// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';

import { FormField } from '../input';

type Props = {
  t: (x: string) => string,
  onComplete: (code: ?string) => void,
};

type State = {
  code: ?string,
};

export class SMSCodeForm extends Component<Props, State> {
  state = {
    code: null,
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  submitSMSCode = (event: Object) => {
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

export default withNamespaces()(SMSCodeForm);
