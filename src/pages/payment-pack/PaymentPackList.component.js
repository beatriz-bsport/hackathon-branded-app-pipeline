// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { CircularProgress, Button, withStyles, Grid } from '@material-ui/core';
import { translate } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';

import { PaymentPackCard } from '../../components';
import { paymentPack as paymentPackActions } from '../../actions';

const styles = (theme) => ({
  paymentPackContainer: {
    paddingBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing.unit * 4,
    },
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  loading: boolean,
  packs: Array<Object>,
  updatingConsumerPacks: Array<number>,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  classes: Object,
  t: (x: string) => string,
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
      metaActivities,
      t,
    } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container direction="column" alignItems="center" spacing={24}>
        <Grid item>
          <Grid container direction="row">
            {packs.map((p) => (
              <Grid
                xs={12}
                md={6}
                xl={4}
                key={p.id}
                className={classes.paymentPackContainer}
              >
                <PaymentPackCard
                  pack={p}
                  metaActivities={metaActivities}
                  incrementCredit={incrementCredit}
                  decrementCredit={decrementCredit}
                  updatingConsumerPacks={updatingConsumerPacks}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Link to="/payment-pack/add" style={{ textDecoration: 'none' }}>
            <Button variant="extendedFab" color="primary">
              <AddIcon className={classes.extendedIcon} />
              {t('paymentPack.addButton')}
            </Button>
          </Link>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.paymentPack.loading,
    packs: state.paymentPack.all,
    metaActivities: state.metaActivity.all,
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
