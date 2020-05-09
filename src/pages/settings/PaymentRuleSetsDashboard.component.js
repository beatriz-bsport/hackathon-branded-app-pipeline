// @flow

import React, { Component } from 'react';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import * as actions from '../../libs/payment-rules/actions';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';

import PaymentRuleFormDialog from '../../libs/payment-rules/components/PaymentRuleFormDialog.component';
import PaymentRuleTable from '../../libs/payment-rules/components/PaymentRuleTable.component';

import type { PaymentRule } from '../../api/types';

type Props = {
  loadPaymentRules: () => void,
  classes: { [string]: string },
  initial: ?PaymentRule,
  upsertPaymentRule: (PaymentRule) => void,
  removePaymentRule: (paymentRule) => void,
  setInitial: (PaymentRule) => void,
  error: ?Error,
  rules: PaymentRule[],
} & {
  open: boolean,
  handleOpen: () => void,
  handleClose: () => void,
};
type State = {};

export class PaymentRulesDashboard extends Component<Props, State> {
  componentWillMount() {
    this.props.loadPaymentRules();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Fab
          onClick={this.props.handleOpen}
          className={classes.button}
          color="primary"
        >
          <AddIcon />
        </Fab>
        {this.props.open ? (
          <PaymentRuleFormDialog
            open={this.props.open}
            initial={
              this.props.initial &&
              this.props.initial &&
              this.props.initial.bonuses
                ? {
                    ...this.props.initial,
                    bonuses: [...this.props.initial.bonuses],
                  }
                : this.props.initial
            }
            handleOpen={this.props.handleOpen}
            handleClose={this.props.handleClose}
            onSubmit={this.props.upsertPaymentRule}
            error={this.props.error}
          />
        ) : null}
        <Paper className={classes.table}>
          <PaymentRuleTable
            items={this.props.rules}
            onDeletePaymentRule={this.props.removePaymentRule}
            onEditPaymentRule={(paymentRule) => {
              this.props.setInitial(paymentRule);
              this.props.handleOpen();
            }}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  form: {
    padding: theme.spacing(2),
  },
  table: {
    margin: theme.spacing(2),
  },
  button: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

function mapStateToProps(state) {
  return {
    open: state.paymentRules.dialog,
    error: state.paymentRules.upsert.error,
    rules: paymentRulesSelector(state),
  };
}

export default compose(
  withStyles(styles),
  withNamespaces(['paymentRules']),
  withState('initial', 'setInitial', null),
  connect(
    mapStateToProps,
    (dispatch, { setInitial }) => ({
      removePaymentRule: (p) => dispatch(actions.deletePaymentRule(p)),
      handleOpen: () => dispatch(actions.showDialog(true)),
      handleClose: () => {
        dispatch(actions.showDialog(false));
        setInitial(null);
      },
      upsertPaymentRule: (p, options) =>
        dispatch(actions.upsertPaymentRule(p, options)),
      loadPaymentRules: (p) => dispatch(actions.fetchPaymentRules(p)),
    }),
  ),
)(PaymentRulesDashboard);
