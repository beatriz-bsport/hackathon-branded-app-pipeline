// @flow
import React, { Component } from 'react';

import { Paper, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { InvoiceForm } from '../components';
import type { InvoiceFormData } from '../components/form/types';
import type { Offer, Activity, Member, PaymentPack } from '../api/types';

type Props = {
  classes: Object,
  offers: Array<Offer>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,
  members: Array<Member>,
};

export class InvoiceFormPage extends Component<Props> {
  onSubmit = (formData: InvoiceForm) => {
    console.log(formData);
  };

  render() {
    const { classes, offers, members, activities, paymentPacks } = this.props;
    return (
      <Paper className={classes.paperContainer}>
        <InvoiceForm
          paymentPacks={paymentPacks}
          activities={activities}
          offers={offers}
          members={members}
          onSubmit={this.onSubmit}
        />
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    members: state.member.all,
    offers: state.offer.calendar,
    activities: state.activity.all,
    paymentPacks: state.paymentPack.all,
  };
}

const styles = (theme) => ({
  paperContainer: {
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(InvoiceFormPage)),
);
