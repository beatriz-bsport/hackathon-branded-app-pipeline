import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles, Typography, Grid, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { translate } from 'react-i18next';

import { Filter } from '../components';

const styles = (theme) => ({
  root: {
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
  },
});

export class GreatFilter extends Component {
  render() {
    const { t, activities, classes } = this.props;

    const coaches = activities.map((a) => ({
      id: a.coach.id,
      name: a.coach.name,
    }));
    const coachKeys = _.uniq(coaches.map((c) => c.id));
    const coachValues = coachKeys.map(
      (coachId) => coaches.filter((c) => c.id === coachId)[0].name,
    );

    const companies = activities.map((a) => ({
      id: a.company.id,
      name: a.company.name,
    }));
    const companyKeys = _.uniq(companies.map((c) => c.id));
    const companyValues = companyKeys.map(
      (id) => companies.filter((c) => c.id === id)[0].name,
    );

    const sportCategories = activities.map((a) => a.category);
    console.log(JSON.stringify(companyKeys));
    console.log(JSON.stringify(coachKeys));

    return (
      <Paper>
        <Grid
          container
          spacing={8}
          alignItems="baseline"
          justify="center"
          direction="row"
          className={classes.root}
        >
          <Grid item>
            <Search />
          </Grid>
          {sportCategories.length > 0 ? (
            <Grid item>
              <Filter
                filterName={t('common.sport')}
                names={sportCategories}
                keys={sportCategories}
              />
            </Grid>
          ) : null}
          {coachKeys.length > 0 ? (
            <Grid item>
              <Filter
                filterName={t('common.coach')}
                names={coachValues}
                keys={coachKeys}
              />
            </Grid>
          ) : null}
          {companyKeys.length > 0 ? (
            <Grid item>
              <Filter
                filterName={t('common.company')}
                names={companyValues}
                keys={companyKeys}
              />
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activity.all,
  };
}

export default translate()(
  connect(mapStateToProps)(withStyles(styles)(GreatFilter)),
);
