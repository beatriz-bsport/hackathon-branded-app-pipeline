// @flow

import React, { Component } from 'react';

import { translate } from 'react-i18next';
import { Paper, Grid, withStyles, Typography } from '@material-ui/core';

import FormField from './FormField.component';

type Props = {};
type State = {};

export class EstablishmentForm extends Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { title } = this.state;

    this.props.onSubmit({ title });
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: value });
  };

  render() {
    const { t } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <form onSubmit={this.onSubmit}>
              <Typography variant="title">
                {t('establishment.form.new.title')}
              </Typography>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <FormField
                    id="title"
                    required
                    value={this.state.title}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
});
export default withStyles(styles)(translate()(EstablishmentForm));
