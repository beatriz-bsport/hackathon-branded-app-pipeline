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
  upsertCoachPaymentRuleGroup,
  fetchAllCoachPaymentRules,
  deleteCoachPaymentRule,
  runCoachPaymenrRuleSimulation,
  showDialog,
  showSimulationDialog,
  showGroupDialog,
  coachPaymentSimulation,
  fetchAllCoachPaymentRuleGroups,
  deleteCoachPaymentRuleGroup,
} from '../../libs/coach-payment-rules/actions';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  getCoachPaymentRuleGroups,
} from '../../libs/coach-payment-rules/selectors';

import CoachPaymentRuleFormDialog from '../../libs/coach-payment-rules/components/CoachPaymentRuleFormDialog.component';
import CoachPaymentRuleGroupFormDialog from '../../libs/coach-payment-rules/components/CoachPaymentRuleGroupFormDialog.component';
import CoachPaymentRuleTabs from '../../libs/coach-payment-rules/components/CoachPaymentRuleTabs.components';
import CoachPaymentRuleSimulationDialog from '../../libs/coach-payment-rules/components/CoachPaymentRuleSimulationDialog.component.js';
import type {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
  CoachPaymentRuleGroupAPI,
} from '../../libs/coach-payment-rules/types';
import {
  getAll as getPaymentPacks,
  getEnabled as getPaymentPackAvailable,
} from '../../libs/payment-packs/selectors';

import FabWithItems from '../../components/button/FabWithItems';
import withTitle from '../../hocs/with-title.hoc';
import type { paymentPack } from '../../libs/payment-packs/types';
import { RootState } from '../../reducers/index';
import { fetchAllPrivateSlots } from '../../libs/private-service/actions';
import type { PrivateSlot } from '../../libs/private-service/types';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import type { Coach } from '../../libs/associated-coach/types';

type OwnProps = {
  fetchAllCoachPaymentRulesAction: () => void,
  fetchAllCoachPaymentRuleGroups: () => void,
  classes: { [string]: string },
  t: TFunction,
  initial: ?CoachPaymentRule,
  ruleForSimulation: ?CoachPaymentRule,
  upsertCoachPaymentRule: (CoachPaymentRule) => void,
  upsertCoachPaymentRuleGroup: (CoachPaymentRuleGroup) => void,
  removeCoachPaymentRule: (CoachPaymentRule) => void,
  removeCoachPaymentGroup: (CoachPaymentRuleGroup) => void,
  setInitial: (CoachPaymentRule) => void,
  setInitialGroup: (CoachPaymentRuleGroup) => void,
  error: ?Error,
  rulesByKind: object<CoachPaymentRule[]>,
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>,
  fetchAllPrivateSlots: () => void,
  initialGroup: CoachPaymentRuleGroupAPI,
  privateSlots: { [id: number]: PrivateSlot },
  associated_coaches: Array<Coach>,
  loading: boolean,
};
type Props = OwnProps & {
  ruleDialogFormOpen: boolean,
  simulationOpen: boolean,
  groupDialogFormOpen: boolean,
  handleOpen: () => void,
  handleClose: () => void,
  handleCloseSimulation: () => void,
  handleOpenGroup: () => void,
  handleCloseGroup: () => void,
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
    this.props.fetchAllCoachPaymentRuleGroups();
    this.props.fetchAllPrivateSlots();
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
            {
              label: t('fabButton.addNewPaymentRuleGroup'),
              onClick: () => {
                this.props.setInitialGroup(null);
                this.props.handleOpenGroup();
              },
            },
          ]}
        />
        {this.props.ruleDialogFormOpen ? (
          <CoachPaymentRuleFormDialog
            open={this.props.ruleDialogFormOpen}
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
        {this.props.groupDialogFormOpen ? (
          <CoachPaymentRuleGroupFormDialog
            open={this.props.groupDialogFormOpen}
            handleClose={this.props.handleCloseGroup}
            handleOpen={this.props.handleOpenGroup}
            onSubmit={this.props.upsertCoachPaymentRuleGroup}
            error={this.props.error}
            initial={this.props.initialGroup}
            rulesByKind={this.props.rulesByKind}
            privateSlots={this.props.privateSlots}
            associated_coaches={this.props.associated_coaches}
          />
        ) : null}
        <Paper className={classes.table}>
          <CoachPaymentRuleTabs
            loading={this.props.loading}
            items={this.props.rulesByKind}
            onDeletePaymentRule={this.props.removeCoachPaymentRule}
            onDeletePaymentRuleGroup={this.props.removeCoachPaymentGroup}
            onEditPaymentRule={(paymentRule) => {
              this.props.setInitial(paymentRule);
              this.props.handleOpen();
            }}
            onEditPaymentRuleGroup={(paymentRuleGroup) => {
              this.props.setInitialGroup(paymentRuleGroup);
              this.props.handleOpenGroup();
            }}
            coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
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

function mapStateToProps(state: RootState) {
  return {
    loading: state.coachPaymentRules.loading,
    ruleDialogFormOpen: state.coachPaymentRules.dialog,
    simulationOpen: state.coachPaymentRules.simulationDialog,
    groupDialogFormOpen: state.coachPaymentRules.groupDialog,
    error: state.coachPaymentRules.upsert.error,
    rules: CoachPaymentRulesSelector(state),
    paymentPacks: getPaymentPacks(state),
    paymentPackList: getPaymentPackAvailable(state),
    simulationResult: state.coachPaymentRules.simulation.result,
    rulesByKind: CoachPaymentRuleByKindSelector(state),
    coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
    privateSlots: state.privateService.privateSlot.byId,
    associated_coaches: getActiveCoaches(state),
  };
}

export default compose(
  withStyles(styles),
  withTranslation(['paymentRules']),
  withTitle(({ t }) => t('pageTitle')),
  withState('initial', 'setInitial', null),
  withState('initialGroup', 'setInitialGroup', null),
  withState(
    'ruleTypeCreation',
    'setRuleTypeCreation',
    COACH_PAYMENT_RULE_FOR_SESSION,
  ),
  withState('ruleForSimulation', 'setRuleForSimulation'),
  connect(
    mapStateToProps,
    (dispatch, { setInitial, setRuleForSimulation, setInitialGroup }) => ({
      removeCoachPaymentRule: (p) => dispatch(deleteCoachPaymentRule(p)),
      removeCoachPaymentGroup: (g) => dispatch(deleteCoachPaymentRuleGroup(g)),
      handleOpen: () => dispatch(showDialog(true)),
      handleClose: () => {
        dispatch(showDialog(false));
        setInitial(null);
      },
      handleOpenGroup: () => dispatch(showGroupDialog(true)),
      handleCloseGroup: () => {
        dispatch(showGroupDialog(false));
        setInitialGroup(null);
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
      upsertCoachPaymentRuleGroup: (g) =>
        dispatch(upsertCoachPaymentRuleGroup(g)),
      runCoachPaymenrRuleSimulation: (id, params) =>
        dispatch(runCoachPaymenrRuleSimulation(id, params)),
      fetchAllCoachPaymentRulesAction: fetchAllCoachPaymentRules,
      fetchAllCoachPaymentRuleGroups,
      fetchAllPrivateSlots,
    }),
  ),
)(PaymentRulesDashboard);
