import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Paper, Typography, Button, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { FormField } from '../components';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
});

type Props = {};

export class MetaActivityForm extends Component<Props> {
  onSubmit = (event) => {
    event.preventDefault();
    const {
      name,
      SCT,
      description,
      coach,
      establishment,
      default_price,
      default_credits,
      default_last_booking_minutes,
      default_last_discard_minutes,
      default_duration_minutes,
      customer_enabled,
    } = this.state;

    api.activity.addMetaActivity({
      name,
      SCT,
      description,
      coach,
      establishment,
      default_price,
      default_credits,
      default_last_booking_minutes,
      default_last_discard_minutes,
      default_duration_minutes,
      customer_enabled,
    });
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: (value, error) });
  };

  render() {
    const { SCTs, associatedCoaches, establishments, classes, t } = this.props;
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
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="SCT"
                    required
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
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="coach"
                    required
                    choices={associatedCoaches}
                    onChange={this.onFormFieldChange}
                  />
                  <FormField
                    id="establishment"
                    required
                    choices={establishments}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_price"
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_credits"
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_last_booking_minutes"
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_last_discard_minutes"
                    required
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="default_duration_minutes"
                    required
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

function mapStateToProps(state) {
  return {
    associatedCoaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    SCTs: state.category.SCTs,
  };
}
export default withStyles(styles)(
  translate()(connect(mapStateToProps)(MetaActivityForm)),
);
