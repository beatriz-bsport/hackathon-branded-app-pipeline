import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CircularProgress, withStyles, Grid } from '@material-ui/core';
import { translate } from 'react-i18next';

import { PaymentPack } from '../components';

const styles = (theme) => ({
  paymentPackContainer: {
    padding: theme.spacing.unit * 2,
  },
});

type Props = {
  loading: boolean,
  classes: Object,
  packs: Array,
};

export class PaymentPackList extends Component<Props> {
  render() {
    const { loading, classes } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    const { packs } = this.props;
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
            <PaymentPack pack={p} />
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
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(PaymentPackList)),
);
