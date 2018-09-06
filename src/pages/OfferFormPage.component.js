import React, { Component } from 'react';

import { Grid, CircularProgress, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { OfferForm } from '../components';

const styles = (theme) => ({
  container: {},
});

type Props = {};

export class OfferFormPage extends Component<Props> {
  componentWillMount() {
    this.metaActivityId = parseInt(this.props.match.params.id, 10);
  }

  render() {
    const { metaActivities, loading } = this.props;
    if (loading) {
      return <CircularProgress />;
    }

    const metaActivity = metaActivities.filter(
      (m) => m.id === this.metaActivityId,
    )[0];
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <OfferForm
            metaActivity={metaActivity}
            coaches={this.props.coaches}
            establishments={this.props.establishments}
          />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    metaActivities: state.metaActivity.all,
    coaches: state.coach.companyAssociated,
    establishments: state.establishment.all,
    loading: state.metaActivity.loading,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(OfferFormPage)),
);
