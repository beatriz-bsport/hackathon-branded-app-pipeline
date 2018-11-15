// @flow

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';

import PaymentPackForm from '../../components/form/PackForm.component';
import { paymentPack as paymentPackActions } from '../../actions';

import api from '../../api';
import type { SCT, MetaActivity } from '../../api/types';

type Props = {
  categories: Array<SCT>,
  metaActivities: Array<MetaActivity>,
  fetchPaymentPacks: () => void,
  classes: Object,
};
type State = {
  open: boolean,
  loading: boolean,
  created: boolean,
  error: boolean,
};

export class CoachFormPage extends Component<Props, State> {
  state = { error: false, loading: false, open: false, created: false };

  createPack = async (data: *) => {
    this.setState({ loading: true });
    try {
      const response = await api.paymentPack.create(data);
      if (response.status === 200) {
        this.setState({
          created: true,
          loading: false,
          error: false,
        });
        return;
      }
      this.setState({ error: false, loading: false });
    } catch (err) {
      this.setState({ error: true });
    }
  };

  render() {
    const { categories, metaActivities, classes } = this.props;
    const { error, created, loading } = this.state;
    const availableCategoriesId = metaActivities.map((a) => a.category_id);
    const filterableCategories = categories.filter(
      (c) => availableCategoriesId.indexOf(c.id) !== -1,
    );
    if (created) {
      this.props.fetchPaymentPacks();
      return <Redirect to="/payment-pack" />;
    }
    return (
      <div>
        <Grid container>
          <Grid xs={12} md={8}>
            <Paper className={classes.paperContainer}>
              <PaymentPackForm
                onSubmit={this.createPack}
                categories={filterableCategories || []}
                metaActivities={metaActivities}
                processing={loading}
                error={error}
              />
            </Paper>
          </Grid>
        </Grid>
        <Snackbar open={this.state.open} message="Pass créé" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.category.SCTs,
    metaActivities: state.metaActivity.all,
  };
}

function mapDisPatchToProps(dispatch) {
  return {
    fetchPaymentPacks() {
      dispatch(paymentPackActions.fetchAll());
    },
  };
}

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 2,
  },
});

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDisPatchToProps,
    )(CoachFormPage),
  ),
);
