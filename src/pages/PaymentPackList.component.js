import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CircularProgress, withStyles, Grid } from '@material-ui/core';
import { translate } from 'react-i18next';

import { PaymentPack } from '../components';
import { paymentPack as paymentPackActions } from '../actions';

const styles = (theme) => ({
  paymentPackContainer: {
    padding: theme.spacing.unit * 2,
  },
});

type Props = {
  loading: boolean,
  packs: Array<Object>,
  updatingConsumerPacks: Array<Number>,
  incrementCredit: (id: Number) => void,
  decrementCredit: (id: Number) => void,
  classes: Object,
};

export class PaymentPackList extends Component<Props> {
  render() {
    const {
      packs,
      loading,
      updatingConsumerPacks,
      incrementCredit,
      decrementCredit,
      classes,
    } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container direction="row">
        {packs.map((p) => (
          <Grid
            xs={12}
            md={6}
            xl={4}
            key={p.id}
            className={classes.paymentPackContainer}
          >
            <PaymentPack
              pack={p}
              incrementCredit={incrementCredit}
              decrementCredit={decrementCredit}
              updatingConsumerPacks={updatingConsumerPacks}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.paymentPack.loading,
    packs: state.paymentPack.all,
    updatingConsumerPacks: state.paymentPack.updatingConsumerPacks,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    incrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, -1));
    },
  };
}

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(PaymentPackList),
  ),
);
