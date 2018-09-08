import React, { Component } from 'react';

import { Grid, Paper, Typography, Button, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { FormField } from '../input';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
});

type Props = {
  initial: *,
  coaches: *[],
  establishments: *[],
  SCTs: *[],
  onSubmit: (*) => void,
};

export class MetaActivityForm extends Component<Props> {
  state = { default_waiting_list_max_size: 0 };

  constructor(props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {
      name,
      SCT,
      description,
      coach,
      establishment,
      default_waiting_list_max_size,
      default_price,
      default_credits,
      default_last_booking_minutes,
      default_last_discard_minutes,
      default_duration_minutes,
      customer_enabled,
    } = this.state;

    this.props.onSubmit({
      name,
      SCT,
      description,
      coach,
      establishment,
      default_waiting_list_max_size,
      default_price,
      default_credits,
      default_last_booking_minutes,
      default_last_discard_minutes,
      default_duration_minutes,
      customer_enabled,
    });
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: value });
  };

  render() {
    const { SCTs, coaches, establishments, classes, t } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <form onSubmit={this.onSubmit}>
              <Grid container direction="column" spacing={16}>
                <Grid item>
                  <Typography variant="title">
                    {t('form.newMetaActivity')}
                  </Typography>
                </Grid>
                <Grid item>
                  <FormField
                    id="name"
                    required
                    value={this.state.name}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="SCT"
                    required
                    value={this.state.SCT}
                    choices={SCTs}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="description"
                    required
                    multiline
                    fullWidth
                    value={this.state.description}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="coach"
                    required
                    value={this.state.coach}
                    choices={coaches}
                    onChange={this.onFormFieldChange}
                  />
                  <FormField
                    id="establishment"
                    required
                    value={this.state.establishment}
                    choices={establishments}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_price"
                    required
                    value={this.state.default_price}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_credits"
                    required
                    value={this.state.default_credits}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_last_booking_minutes"
                    required
                    value={this.state.default_last_booking_minutes}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_last_discard_minutes"
                    required
                    value={this.state.default_last_discard_minutes}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_duration_minutes"
                    required
                    value={this.state.default_duration_minutes}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_waiting_list_max_size"
                    required
                    value={this.state.default_waiting_list_max_size}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="customer_enabled"
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" justify="flex-end">
                <Grid item>
                  <Link to="/activity" style={{ textDecoration: 'none' }}>
                    <Button>{t('form.discard')}</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Button variant="raised" color="primary" type="submit">
                    {t('form.send')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(MetaActivityForm));
