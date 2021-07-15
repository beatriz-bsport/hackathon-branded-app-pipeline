import React from 'react';
import lodash from 'lodash';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import type {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
} from '../../../coach-payment-rules/types';
import CoachPaymentRuleSelector from '../../../coach-payment-rules/components/CoachPaymentRuleSelector.component';
import CoachPaymentRuleGroupSelector from '../../../coach-payment-rules/components/CoachPaymentRuleGroupSelector.component';
import PrivateSlotSelectorSimple from '../../../coach-payment-rules/components/PrivateSlotSelector.component';
import type { MaterialStyleType } from '../../../../utils/types';
import type { Coach } from '../../types';
import { DISSOCIATED_COACH_PAYMENT_RULE } from '../../../coach-payment-rules/utils';
import type { PrivateSlot } from '../../../private-service/types';

type OwnProps = {
  coach: Coach;
  coachPaymentRulesByKind: {
    [kind: number]: { [id: number]: CoachPaymentRule };
  };
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  setCoachPaymentRule: (coachId: number, coach_payment_rule_id: number) => void;
  setCoachWorkshopPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void;
  setCoachPrivatePaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void;
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_group_id: number,
  ) => number;
  privateSlots: { [privateSlotId: number]: PrivateSlot };
  remunerateCoach: () => (coach: Coach) => void;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  private_slots_coach_payment_rules: Array<{
    private_slot: number;
    coach_payment_rule: number;
  }>;
  enableSaveButton: boolean;
};
class CoachPaymentRuleBanner extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      private_slots_coach_payment_rules: [
        ...props.coach.private_slots_coach_payment_rules,
      ],
      enableSaveButton: false,
    };
  }

  componentDidUpdate(prevProps: Props, previousState: State) {
    if (
      previousState &&
      previousState.private_slots_coach_payment_rules !==
        this.state.private_slots_coach_payment_rules
    ) {
      this.setState((prevState) => ({ ...prevState, enableSaveButton: true }));
    }
  }

  render() {
    const {
      classes,
      t,
      coach,
      coachPaymentRulesByKind,
      coachPaymentRuleGroups,
      setCoachPaymentRule,
      setCoachWorkshopPaymentRule,
      setCoachPrivatePaymentRule,
      setCoachPaymentRuleGroup,
      privateSlots,
    } = this.props;

    const specificPrivateSlots = coach.coach_payment_rule_group_id
      ? coachPaymentRuleGroups.find(
          (group: CoachPaymentRuleGroup) =>
            group.id === coach.coach_payment_rule_group_id,
        ).private_slots_coach_payment_rules
      : this.state.private_slots_coach_payment_rules;

    const updateState = (identifier: string, value: number, index: number) => {
      if (identifier === 'delete') {
        const { private_slots_coach_payment_rules } = this.state;
        private_slots_coach_payment_rules.splice(index, 1);
        this.setState({ private_slots_coach_payment_rules });
      } else if (identifier === 'add') {
        const { private_slots_coach_payment_rules } = this.state;
        private_slots_coach_payment_rules.splice(
          private_slots_coach_payment_rules.length,
          0,
          { private_slot: 0, coach_payment_rule: 0 },
        );
        this.setState({ private_slots_coach_payment_rules });
      } else {
        const { private_slots_coach_payment_rules } = this.state;
        private_slots_coach_payment_rules.splice(index, 1, {
          ...private_slots_coach_payment_rules[index],
          [identifier]: value,
        });
        this.setState({ private_slots_coach_payment_rules });
      }
    };
    return (
      <>
        <div className={classes.flexRow}>
          <Typography variant="h6">{t('coach:paymentRule')}</Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={this.props.remunerateCoach}
            id="button_teacher_remunerate"
          >
            <EuroSymbolIcon />
            {t('showPerformance')}
          </Button>
        </div>
        <Typography variant="h6">
          {t('paymentRules:coach_payment_rule_groups.subtitle.default')}
        </Typography>
        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={4}>
              <Typography>
                {t('paymentRules:coach_payment_rule_groups.dialogTitle')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CoachPaymentRuleGroupSelector
                id="coach_payment_rule_group_selector"
                coachPaymentRuleGroupsList={coachPaymentRuleGroups}
                selected={coach.coach_payment_rule_group_id}
                isOverride
                onChange={(item: { value: number; label: string }) => {
                  this.setState({
                    private_slots_coach_payment_rules: [],
                  });
                  setCoachPaymentRuleGroup(coach.id, item.value);
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                this.setState({
                  private_slots_coach_payment_rules: specificPrivateSlots,
                });
                setCoachPaymentRuleGroup(coach.id, -8000);
              }}
              disabled={!coach.coach_payment_rule_group_id}
            >
              {t('paymentRules:coach_payment_rule_groups.dissociate')}
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <Typography variant="h6">
                {t('paymentRules:coach_payment_rule_groups.subtitle.default')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                {t('paymentRules:coach_payment_rule_groups.fields.activity')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CoachPaymentRuleSelector
                id="session_coach_payment_rule"
                coachPaymentRulesList={
                  coachPaymentRulesByKind[COACH_PERFORMANCE_FOR_SESSION]
                }
                nullCurrentValue
                selected={coach.coach_payment_rule_id}
                isOverride
                onChange={(item: { value: number; label: string }) => {
                  setCoachPaymentRule(coach.id, item.value);
                }}
                disabled={coach.coach_payment_rule_group_id}
              />
            </Grid>
            <Grid item>
              <IconButton
                onClick={() =>
                  setCoachPaymentRule(coach.id, DISSOCIATED_COACH_PAYMENT_RULE)
                }
                disabled={coach.coach_payment_rule_group_id}
                aria-label="delete-session-coach-payment-rule"
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={4}>
              <Typography>
                {t('paymentRules:coach_payment_rule_groups.fields.workshop')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CoachPaymentRuleSelector
                id="session_coach_payment_rule"
                coachPaymentRulesList={
                  coachPaymentRulesByKind[COACH_PERFORMANCE_FOR_SESSION]
                }
                nullCurrentValue
                selected={coach.workshop_coach_payment_rule_id}
                isOverride
                onChange={(item: { value: number; label: string }) => {
                  setCoachWorkshopPaymentRule(coach.id, item.value);
                }}
                disabled={coach.coach_payment_rule_group_id}
              />
            </Grid>
            <Grid item>
              <IconButton
                onClick={() =>
                  setCoachWorkshopPaymentRule(
                    coach.id,
                    DISSOCIATED_COACH_PAYMENT_RULE,
                  )
                }
                disabled={coach.coach_payment_rule_group_id}
                aria-label="delete-session-coach-payment-rule"
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={4}>
              <Typography>
                {t(
                  'paymentRules:coach_payment_rule_groups.fields.private_service',
                )}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CoachPaymentRuleSelector
                id="session_coach_payment_rule"
                coachPaymentRulesList={
                  coachPaymentRulesByKind[COACH_PERFORMANCE_FOR_APPOINTMENT]
                }
                nullCurrentValue
                selected={coach.private_coach_payment_rule_id}
                isOverride
                onChange={(item: { value: number; label: string }) => {
                  setCoachPrivatePaymentRule(coach.id, item.value);
                }}
                disabled={coach.coach_payment_rule_group_id}
              />
            </Grid>
            <Grid item>
              <IconButton
                onClick={() =>
                  setCoachPrivatePaymentRule(
                    coach.id,
                    DISSOCIATED_COACH_PAYMENT_RULE,
                  )
                }
                disabled={coach.coach_payment_rule_group_id}
                aria-label="delete-session-coach-payment-rule"
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <Typography variant="h6">
                {t(
                  'paymentRules:coach_payment_rule_groups.subtitle.specfic_private_slot',
                )}
              </Typography>
            </Grid>
            <TableContainer>
              <Table size="small">
                <>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t(
                          'paymentRules:coach_payment_rule_groups.fields.private_service_name',
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          'paymentRules:coach_payment_rule_groups.fields.coach_payment_rule',
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lodash
                      .values(specificPrivateSlots)
                      .map(
                        (
                          privateSlot: {
                            private_slot: number;
                            coach_payment_rule: number;
                          },
                          i: number,
                        ) => (
                          <>
                            <TableRow>
                              <TableCell>
                                <PrivateSlotSelectorSimple
                                  id={`private_slots_coach_payment_rules.${i}.private_slot`}
                                  privateSlotList={Object.values(privateSlots)}
                                  nullCurrentValue
                                  isOverride
                                  selected={privateSlot.private_slot}
                                  onChange={(item: {
                                    value: number;
                                    label: string;
                                  }) =>
                                    updateState('private_slot', item.value, i)
                                  }
                                  disabled={coach.coach_payment_rule_group_id}
                                />
                              </TableCell>
                              <TableCell>
                                <CoachPaymentRuleSelector
                                  id={`private_slots_coach_payment_rules.${i}.coach_payment_rule`}
                                  coachPaymentRulesList={
                                    coachPaymentRulesByKind[
                                      COACH_PERFORMANCE_FOR_APPOINTMENT
                                    ]
                                  }
                                  nullCurrentValue
                                  selected={privateSlot.coach_payment_rule}
                                  isOverride
                                  onChange={(item: {
                                    value: number;
                                    label: string;
                                  }) =>
                                    updateState(
                                      'coach_payment_rule',
                                      item.value,
                                      i,
                                    )
                                  }
                                  disabled={coach.coach_payment_rule_group_id}
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                padding="none"
                                size="small"
                              >
                                <IconButton
                                  onClick={() => updateState('delete', 0, i)}
                                  aria-label="Delete"
                                  disabled={coach.coach_payment_rule_group_id}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          </>
                        ),
                      )}
                  </TableBody>
                </>
              </Table>
            </TableContainer>
            <Grid item xs={12} className={classes.flexRow}>
              <Button
                aria-haspopup="true"
                color="secondary"
                onClick={() => updateState('add', 0, 0)}
                disabled={coach.coach_payment_rule_group_id}
              >
                <AddIcon color="secondary" />
                {t(
                  'paymentRules:coach_payment_rule_groups.fields.addPrivateSlot',
                )}
              </Button>
              <Button
                aria-haspopup="true"
                color="secondary"
                onClick={() => {
                  this.setState((prevState) => ({
                    ...prevState,
                    enableSaveButton: false,
                  }));
                  this.props.updateCoach({
                    id: coach.id,
                    associated_coach_id: coach.associated_coach_id,
                    private_slots_coach_payment_rules: specificPrivateSlots,
                  });
                }}
                disabled={
                  coach.coach_payment_rule_group_id ||
                  !this.state.enableSaveButton
                }
              >
                {t('paymentRules:save')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

const styles = () => ({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['coach', 'paymentRules']),
)(CoachPaymentRuleBanner);
