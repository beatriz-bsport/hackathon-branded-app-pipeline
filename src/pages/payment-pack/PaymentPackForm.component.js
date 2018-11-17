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

import type { SCT, MetaActivity } from '../../api/types';

type Props = {
  categories: Array<SCT>,
  metaActivities: Array<MetaActivity>,
  fetchPaymentPacks: () => void,
  update: ?PaymentPack,
  createOrUpdate: (data: [*]) => void,
  classes: Object,
};
type State = {
  open: boolean,
  loading: boolean,
  created: boolean,
  error: boolean,
};

export class PaymentPackFormPage extends Component<Props, State> {
  state = { error: false, loading: false, open: false, created: false };

  createPack = async (data: *) => {
    this.props.createOrUpdate(data);
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
                loading={loading}
                error={error}
                initial={this.props.update}
              />
            </Paper>
          </Grid>
        </Grid>
        <Snackbar open={this.state.open} message="Pass créé" />
      </div>
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    update: id !== null ? state.paymentPack.all.find((m) => m.id === id) : null,
    categories: state.category.SCTs,
    metaActivities: state.metaActivity.all,
    loading: state.paymentPack.createOrUpdate,
  };
}

function mapDisPatchToProps(dispatch) {
  return {
    fetchPaymentPacks() {
      dispatch(paymentPackActions.fetchAll());
    },
    createOrUpdate(data) {
      dispatch(paymentPackActions.createOrUpdate(data));
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
    )(PaymentPackFormPage),
  ),
);
