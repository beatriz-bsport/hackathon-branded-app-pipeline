// @flow

import React, { Component } from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect } from 'react-redux';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import {
  upsertCoachPaymentRule as upsertCoachPaymentRuleAction,
  upsertCoachPaymentRuleGroup as upsertCoachPaymentRuleGroupAction,
  fetchAllCoachPaymentRules as fetchAllCoachPaymentRulesAction,
  deleteCoachPaymentRule as deleteCoachPaymentRuleAction,
  runCoachPaymenrRuleSimulation as runCoachPaymenrRuleSimulationAction,
  showDialog as showDialogAction,
  showSimulationDialog as showSimulationDialogAction,
  showGroupDialog as showGroupDialogAction,
  coachPaymentSimulation as coachPaymentSimulationAction,
  resetCoachPaymentSimulation as resetCoachPaymentSimulationAction,
  fetchAllCoachPaymentRuleGroups as fetchAllCoachPaymentRuleGroupsAction,
  deleteCoachPaymentRuleGroup as deleteCoachPaymentRuleGroupAction,
} from '../../libs/coach-payment-rules/actions';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  getCoachPaymentRuleGroups,
} from '../../libs/coach-payment-rules/selectors';
import { fetchAssociatedCoachBulk } from '../../libs/associated-coach/actions';
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
import { RootState } from '../../reducers/index';
import {
  fetchAllPrivateSlots as fetchAllPrivateSlotsAction,
  fetchAllPrivateServices,
} from '../../libs/private-service/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import type { Coach } from '../../libs/associated-coach/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { OptionCallback } from '../../state/types';
import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import { PrivateServiceWithSlots } from '../../libs/private-service/types';

type OwnProps = {
  fetchAllCoachPaymentRules: () => void;
  fetchAllCoachPaymentRuleGroups: () => void;
  t: TFunction;
  initial?: CoachPaymentRule;
  ruleForSimulation?: CoachPaymentRule;
  upsertCoachPaymentRule: (CoachPaymentRule: CoachPaymentRule) => void;
  deleteCoachPaymentRuleGroup: (
    CoachPaymentRuleGroup: CoachPaymentRuleGroup,
    options: OptionCallback,
  ) => void;
  deleteCoachPaymentRule: (CoachPaymentRule: CoachPaymentRule) => void;
  removeCoachPaymentGroup: (CoachPaymentRuleGroupId: number) => void;
  setInitial: (CoachPaymentRule: CoachPaymentRule) => void;
  setInitialGroup: (CoachPaymentRuleGroup: CoachPaymentRuleGroup) => void;
  error?: Error;
  rulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  fetchAllPrivateSlots: () => void;
  fetchAllPrivateServices: () => void;
  initialGroup: CoachPaymentRuleGroupAPI;
  privateServices: Array<PrivateServiceWithSlots>;
  associated_coaches: Array<Coach>;
  loading: boolean;
  fetchAssociatedCoachBulk: (associatedCoachIds: Array<number>) => void;
};
type StateHandlerInit = {
  initial: CoachPaymentRule | null;
  initialGroup: CoachPaymentRuleGroup | null;
  ruleTypeCreation: number | null;
  ruleForSimulation: CoachPaymentRule | null;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class PaymentRulesDashboard extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAllCoachPaymentRuleGroups();
    this.props.fetchAllPrivateServices();
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
            handlePrevious={(payment_rule: CoachPaymentRule) => {
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
            onSubmit={(g) =>
              this.props.upsertCoachPaymentRuleGroup(g, {
                onSuccess: (group: CoachPaymentRuleGroup) => {
                  const updateCoacheIds = this.props.associated_coaches
                    .filter(
                      (coach: Coach) =>
                        coach.coach_payment_rule_group_id === group.id,
                    )
                    .map((coach: Coach) => coach.associated_coach_id);

                  this.props.fetchAssociatedCoachBulk(
                    updateCoacheIds.concat(g.associated_coach),
                  );
                  this.props.fetchAllCoachPaymentRules();
                },
              })
            }
            error={this.props.error}
            initial={this.props.initialGroup}
            rulesByKind={this.props.rulesByKind}
            associated_coaches={this.props.associated_coaches}
            privateServices={this.props.privateServices}
          />
        ) : null}
        <Paper className={classes.table}>
          <CoachPaymentRuleTabs
            loading={this.props.loading}
            items={this.props.rulesByKind}
            onDeletePaymentRule={this.props.deleteCoachPaymentRule}
            onDeletePaymentRuleGroup={this.props.deleteCoachPaymentRuleGroup}
            onEditPaymentRule={(paymentRule: CoachPaymentRule) => {
              this.props.setInitial(paymentRule);
              this.props.handleOpen();
            }}
            onEditPaymentRuleGroup={(
              paymentRuleGroup: CoachPaymentRuleGroup,
            ) => {
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

const styles = (theme: Theme) => ({
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

const mapStateToProps = (state: RootState) => ({
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
  associated_coaches: getActiveCoaches(state),
  privateServices: getAvailablePrivateServices(state),
});

const mapDispatchToProps = {
  fetchAssociatedCoachBulk,
  deleteCoachPaymentRule: deleteCoachPaymentRuleAction,
  deleteCoachPaymentRuleGroup: deleteCoachPaymentRuleGroupAction,
  showDialog: showDialogAction,
  showGroupDialog: showGroupDialogAction,
  showSimulationDialog: showSimulationDialogAction,
  coachPaymentSimulation: coachPaymentSimulationAction,
  resetCoachPaymentSimulation: resetCoachPaymentSimulationAction,
  upsertCoachPaymentRule: upsertCoachPaymentRuleAction,
  upsertCoachPaymentRuleGroup: upsertCoachPaymentRuleGroupAction,
  runCoachPaymenrRuleSimulation: runCoachPaymenrRuleSimulationAction,
  fetchAllCoachPaymentRules: fetchAllCoachPaymentRulesAction,
  fetchAllCoachPaymentRuleGroups: fetchAllCoachPaymentRuleGroupsAction,
  fetchAllPrivateSlots: fetchAllPrivateSlotsAction,
  fetchAllPrivateServices,
};

const mapWithHandlers = {
  handleOpen: (props: OwnAndConnectedProps) => () => props.showDialog(true),
  handleClose: (props: OwnAndConnectedProps) => () => {
    props.showDialog(false);
    props.setInitial(null);
  },
  handleOpenGroup: (props: OwnAndConnectedProps) => () => {
    props.showGroupDialog(true);
  },
  handleCloseGroup: (props: OwnAndConnectedProps) => () => {
    props.showGroupDialog(false);
    props.setInitialGroup(null);
  },
  handleCloseSimulation: (props: OwnAndConnectedProps) => () => {
    props.showSimulationDialog(false);
    props.setInitial(null);
    props.resetCoachPaymentSimulation();
  },
  handlePrevious: (props: OwnAndConnectedProps) => (
    payment_rule: CoachPaymentRule,
  ) => {
    props.setInitial(payment_rule);
    props.showDialog(true);
    props.showSimulationDialog(false);
    props.resetCoachPaymentSimulation();
  },
  upsertCoachPaymentRule: (props: OwnAndConnectedProps) => (
    p: CoachPaymentRule,
  ) =>
    props.upsertCoachPaymentRule(p, {
      onSuccess: (payload: CoachPaymentRule) => {
        props.showSimulationDialog(true);
        props.setRuleForSimulation(payload);
      },
    }),
  upsertCoachPaymentRuleGroup: (props: OwnAndConnectedProps) => (
    g: CoachPaymentRuleGroup,
    options: OptionCallback,
  ) => props.upsertCoachPaymentRuleGroup(g, options),
  runCoachPaymenrRuleSimulation: (props: OwnAndConnectedProps) => (
    id: number,
    params: any,
  ) => props.runCoachPaymenrRuleSimulation(id, params),
};

const withStateHandlersInit: StateHandlerInit = {
  initial: null,
  initialGroup: null,
  ruleTypeCreation: COACH_PAYMENT_RULE_FOR_SESSION,
  ruleForSimulation: null,
};

const withStateHandlersSetter = {
  setInitial: () => (initial: CoachPaymentRule | null) => {
    return { initial };
  },
  setInitialGroup: () => (initialGroup: CoachPaymentRuleGroup | null) => {
    return { initialGroup };
  },
  setRuleTypeCreation: () => (ruleTypeCreation: number) => {
    return { ruleTypeCreation };
  },
  setRuleForSimulation: () => (ruleForSimulation: CoachPaymentRule | null) => {
    return { ruleForSimulation };
  },
};
export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['paymentRules']),
  withTitle(({ t }: TFunction) => t('pageTitle')),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(PaymentRulesDashboard);
