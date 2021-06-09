// @flow

import React, { Component } from 'react';
import { compose, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import {
  upsertCoachPaymentRule,
  fetchAllCoachPaymentRules,
  deleteCoachPaymentRule,
  runCoachPaymenrRuleSimulation,
  showDialog,
  showSimulationDialog,
  coachPaymentSimulation,
} from '../../libs/coach-payment-rules/actions';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
} from '../../libs/coach-payment-rules/selectors';

import CoachPaymentRuleFormDialog from '../../libs/coach-payment-rules/components/CoachPaymentRuleFormDialog.component';
import CoachPaymentRuleTabs from '../../libs/coach-payment-rules/components/CoachPaymentRuleTabs.components';
import CoachPaymentRuleSimulationDialog from '../../libs/coach-payment-rules/components/CoachPaymentRuleSimulationDialog.component.js';
import type { CoachPaymentRule } from '../../libs/coach-payment-rules/types';
import {
  getAll as getPaymentPacks,
  getEnabled as getPaymentPackAvailable,
} from '../../libs/payment-packs/selectors';
import FabWithItems from '../../components/button/FabWithItems';
import withTitle from '../../hocs/with-title.hoc';
import type { paymentPack } from '../../libs/payment-packs/types';

type Props = {
  fetchAllCoachPaymentRulesAction: () => void,
  classes: { [string]: string },
  t: TFunction,
  initial: ?CoachPaymentRule,
  ruleForSimulation: ?CoachPaymentRule,
  upsertCoachPaymentRule: (CoachPaymentRule) => void,
  removeCoachPaymentRule: (CoachPaymentRule) => void,
  setInitial: (CoachPaymentRule) => void,
  error: ?Error,
  rulesByKind: object<CoachPaymentRule[]>,
} & {
  open: boolean,
  simulationOpen: boolean,
  handleOpen: () => void,
  handleClose: () => void,
  handleCloseSimulation: () => void,
  handlePrevious: () => void,
  runCoachPaymenrRuleSimulation: () => void,
  paymentPackList: Array<paymentPack>,
  simulationResult: Object<any>,
  setRuleTypeCreation: (type: number) => void,
  ruleTypeCreation: Number,
};
type State = {};

export class PaymentRulesDashboard extends Component<Props, State> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRulesAction();
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        <FabWithItems
          items={[
            {
              label: t('fabButton.addNewForSession'),
              onClick: () => {
                this.props.setRuleTypeCreation(COACH_PAYMENT_RULE_FOR_SESSION);
                this.props.handleOpen();
              },
            },
            {
              label: t('fabButton.addNewForRDV'),
              onClick: () => {
                this.props.setRuleTypeCreation(
                  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
                );
                this.props.handleOpen();
              },
            },
          ]}
        />
        {this.props.open ? (
          <CoachPaymentRuleFormDialog
            open={this.props.open}
            handleClose={this.props.handleClose}
            handleOpen={this.props.handleOpen}
            initial={
              this.props.initial && this.props.initial.bonus_coach_payment
                ? {
                    ...this.props.initial,
                    bonus_coach_payment: [
                      ...this.props.initial.bonus_coach_payment,
                    ],
                  }
                : this.props.initial
            }
            onSubmit={this.props.upsertCoachPaymentRule}
            error={this.props.error}
            paymentPackList={this.props.paymentPackList}
            ruleTypeCreation={this.props.ruleTypeCreation}
          />
        ) : null}
        {this.props.simulationOpen && this.props.ruleForSimulation ? (
          <CoachPaymentRuleSimulationDialog
            open={this.props.simulationOpen}
            onSubmit={this.props.runCoachPaymenrRuleSimulation}
            handleCloseSimulation={this.props.handleCloseSimulation}
            handlePrevious={(payment_rule) => {
              this.props.handlePrevious(payment_rule);
            }}
            coachPaymentRule={this.props.ruleForSimulation}
            simulationResult={this.props.simulationResult}
          />
        ) : null}
        <Paper className={classes.table}>
          <CoachPaymentRuleTabs
            items={this.props.rulesByKind}
            onDeletePaymentRule={this.props.removeCoachPaymentRule}
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
    open: state.coachPaymentRules.dialog,
    simulationOpen: state.coachPaymentRules.simulationDialog,
    error: state.coachPaymentRules.upsert.error,
    rules: CoachPaymentRulesSelector(state),
    paymentPacks: getPaymentPacks(state),
    paymentPackList: getPaymentPackAvailable(state),
    simulationResult: state.coachPaymentRules.simulation.result,
    rulesByKind: CoachPaymentRuleByKindSelector(state),
  };
}

export default compose(
  withStyles(styles),
  withTranslation(['paymentRules']),
  withTitle(({ t }) => t('pageTitle')),
  withState('initial', 'setInitial', null),
  withState(
    'ruleTypeCreation',
    'setRuleTypeCreation',
    COACH_PAYMENT_RULE_FOR_SESSION,
  ),
  withState('ruleForSimulation', 'setRuleForSimulation'),
  connect(
    mapStateToProps,
    (dispatch, { setInitial, setRuleForSimulation }) => ({
      removeCoachPaymentRule: (p) => dispatch(deleteCoachPaymentRule(p)),
      handleOpen: () => dispatch(showDialog(true)),
      handleClose: () => {
        dispatch(showDialog(false));
        setInitial(null);
      },
      handleCloseSimulation: () => {
        dispatch(showSimulationDialog(false));
        setInitial(null);
        dispatch(coachPaymentSimulation.reset());
      },
      handlePrevious: (payment_rule) => {
        setInitial(payment_rule);
        dispatch(showDialog(true));
        dispatch(showSimulationDialog(false));
        dispatch(coachPaymentSimulation.reset());
      },
      upsertCoachPaymentRule: (p) =>
        dispatch(
          upsertCoachPaymentRule(p, {
            onSuccess: (payload) => {
              dispatch(showSimulationDialog(true));
              setRuleForSimulation(payload);
            },
          }),
        ),
      runCoachPaymenrRuleSimulation: (id, params) =>
        dispatch(runCoachPaymenrRuleSimulation(id, params)),
      fetchAllCoachPaymentRulesAction: fetchAllCoachPaymentRules,
    }),
  ),
)(PaymentRulesDashboard);
