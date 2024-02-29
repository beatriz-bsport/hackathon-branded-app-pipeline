// @ts-nocheck
import React from 'react';
import values from 'lodash/values';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import GroupIcon from '@material-ui/icons/Group';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import { Alert } from '@material-ui/lab';
import memoize from 'memoize-one';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import type {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
} from '#libs/coach-payment-rules/types';
import type { MaterialStyleType } from '../../../../utils/types';
import type { Coach } from '#libs/associated-coach/types';
import {
  DISSOCIATED_COACH_PAYMENT_RULE,
  DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
} from '#libs/coach-payment-rules/constants';
import PrivateSlotSelectorStyled from '#libs/coach-payment-rules/components/PrivateSlotSelectorStyled.component';
import { PrivateServiceWithSlots } from '#libs/private-service/types';
import CoachPaymentRuleSelectorStyled from '#libs/coach-payment-rules/components/coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import type { OptionCallback } from '../../../state/types';

type OwnProps = {
  coach: Coach;
  coachPaymentRulesByKind: {
    [kind: number]: Array<CoachPaymentRule>;
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
  ) => void;
  remunerateCoach: () => void;
  privateServices: Array<PrivateServiceWithSlots>;
  updateCoachPrivateSlotsPaymentRule: (
    data: {
      id: number;
      associated_coach_id: number;
      private_slots_coach_payment_rules: Array<{
        private_slot: number;
        coach_payment_rule: number;
      }>;
    },
    options?: OptionCallback,
  ) => void;
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
  private_slots_errors: boolean;
};
class CoachPaymentRuleBanner extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      private_slots_coach_payment_rules: [
        ...props.coach.private_slots_coach_payment_rules,
      ],
      enableSaveButton: false,
      private_slots_errors: false,
    };
  }

  componentDidUpdate(prevProps: Props, previousState: State) {
    if (
      previousState &&
      previousState.private_slots_coach_payment_rules !==
        this.state.private_slots_coach_payment_rules
    ) {
      if (
        this.state.private_slots_coach_payment_rules.find(
          (specific_rule) =>
            !specific_rule.private_slot || !specific_rule.coach_payment_rule,
        )
      ) {
        // eslint-disable-next-line
        this.setState((prevState) => ({
          ...prevState,
          enableSaveButton: false,
        }));
      } else {
        // eslint-disable-next-line
        this.setState((prevState) => ({
          ...prevState,
          enableSaveButton: true,
        }));
      }
    }
  }

  getSelectedPaymentRules = memoize(
    (coach: Coach, coachPaymentRuleGroups: CoachPaymentRuleGroup[]) => {
      if (coach.coach_payment_rule_group_id) {
        const group = coachPaymentRuleGroups.find(
          (g: CoachPaymentRuleGroup) =>
            g.id === coach.coach_payment_rule_group_id,
        );
        return {
          session_coach_payment_rule:
            group.session_coach_payment_rule &&
            group.session_coach_payment_rule.id,
          workshop_coach_payment_rule:
            group.workshop_coach_payment_rule &&
            group.workshop_coach_payment_rule.id,
          private_service_coach_payment_rule:
            group.private_service_coach_payment_rule &&
            group.private_service_coach_payment_rule.id,
        };
      }
      return {
        session_coach_payment_rule: coach.coach_payment_rule_id,
        workshop_coach_payment_rule: coach.workshop_coach_payment_rule_id,
        private_service_coach_payment_rule: coach.private_coach_payment_rule_id,
      };
    },
  );

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
      privateServices,
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
        const update_list = [
          ...private_slots_coach_payment_rules.slice(0, index),
          ...private_slots_coach_payment_rules.slice(index + 1),
        ];
        this.setState({ private_slots_coach_payment_rules: update_list });
      } else if (identifier === 'add') {
        const { private_slots_coach_payment_rules } = this.state;
        this.setState({
          private_slots_coach_payment_rules: [
            ...private_slots_coach_payment_rules,
            { private_slot: 0, coach_payment_rule: 0 },
          ],
        });
      } else {
        const { private_slots_coach_payment_rules } = this.state;
        const update_item = private_slots_coach_payment_rules.slice(
          index,
          index + 1,
        )[0];
        this.setState({
          private_slots_coach_payment_rules: [
            ...private_slots_coach_payment_rules.slice(0, index),
            { ...update_item, [identifier]: value },
            ...private_slots_coach_payment_rules.slice(index + 1),
          ],
        });
      }
    };
    const checkPrivateSlotUnicity = (newPrivateSlot: {
      value: number;
      label: string;
    }) => {
      const findSimilar = this.state.private_slots_coach_payment_rules.find(
        (specific_rule) => specific_rule.private_slot === newPrivateSlot.value,
      );
      return !findSimilar;
    };

    const displayPrivateSlotError = async () => {
      this.setState({ private_slots_errors: true });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      this.setState({ private_slots_errors: false });
    };

    const {
      session_coach_payment_rule,
      workshop_coach_payment_rule,
      private_service_coach_payment_rule,
    } = this.getSelectedPaymentRules(coach, coachPaymentRuleGroups);

    const coachHasPaymentRule = !!(
      session_coach_payment_rule ||
      workshop_coach_payment_rule ||
      private_service_coach_payment_rule ||
      coach.private_slots_coach_payment_rules?.length
    );

    return (
      <>
        <div className={classes.flexRow}>
          <Typography variant="h5">{t('coach:paymentRule')}</Typography>
          <Button
            color="primary"
            id="button_teacher_remunerate"
            onClick={this.props.remunerateCoach}
            variant="contained"
          >
            {getCurrencyDisplay() === '€' ? (
              <EuroSymbolIcon />
            ) : (
              <AttachMoneyIcon />
            )}
            {t('showPerformance')}
          </Button>
        </div>

        {!coachHasPaymentRule && (
          <Alert className={classes.alert} severity="warning">
            {t('coach:detail.noPaymentRule')}
          </Alert>
        )}

        <Grid item className={classes.payrollGroup} xs={12}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item md={4} xs={12}>
              <Typography>
                {t('paymentRules:coach_payment_rule_groups.dialogTitle')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <CoachPaymentRuleSelectorStyled
                isClearable
                isGroupSelect
                noMulti
                coachPaymentRulesList={coachPaymentRuleGroups}
                onChange={(item: { value: number; label: string }) => {
                  this.setState({
                    private_slots_coach_payment_rules: [],
                  });
                  setCoachPaymentRuleGroup(
                    coach.id,
                    item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE_GROUP,
                  );
                  if (!item) {
                    this.setState({
                      private_slots_coach_payment_rules: specificPrivateSlots,
                    });
                  }
                }}
                placeholder={t('paymentRules:select.group')}
                selectedRules={[coach.coach_payment_rule_group_id]}
              />
            </Grid>
          </Grid>
          <Grid item className={classes.button}>
            <Button
              color="secondary"
              disabled={!coach.coach_payment_rule_group_id}
              onClick={() => {
                this.setState({
                  private_slots_coach_payment_rules: specificPrivateSlots,
                });
                setCoachPaymentRuleGroup(coach.id, -8000);
              }}
              variant="outlined"
            >
              {t('paymentRules:coach_payment_rule_groups.dissociate')}
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            spacing={1}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <div className={classes.title}>
                <Typography variant="h6">
                  {t('paymentRules:coach_payment_rule_groups.subtitle.default')}
                </Typography>
                {coach.coach_payment_rule_group_id ? (
                  <GroupIcon className={classes.blockIcon} color="secondary" />
                ) : null}
              </div>
            </Grid>
            <Grid item className={classes.label} md={4} xs={12}>
              <Typography>
                {t('paymentRules:coach_payment_rule_groups.fields.activity')}
              </Typography>
            </Grid>
            <Grid item className={classes.selector} xs={8}>
              <CoachPaymentRuleSelectorStyled
                isClearable
                noMulti
                coachPaymentRulesList={coachPaymentRulesByKind[
                  COACH_PAYMENT_RULE_FOR_SESSION
                ].concat(
                  coachPaymentRulesByKind[
                    COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY
                  ],
                )}
                disabled={!!coach.coach_payment_rule_group_id}
                onChange={(item: { value: number; label: string }) => {
                  setCoachPaymentRule(
                    coach.id,
                    item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  );
                }}
                placeholder={t('paymentRules:label')}
                selectedRules={[session_coach_payment_rule]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            spacing={1}
            style={{ alignItems: 'center' }}
          >
            <Grid item className={classes.label} md={4} xs={12}>
              <Typography>
                {t('paymentRules:coach_payment_rule_groups.fields.workshop')}
              </Typography>
            </Grid>
            <Grid item className={classes.selector} xs={8}>
              <CoachPaymentRuleSelectorStyled
                isClearable
                noMulti
                coachPaymentRulesList={coachPaymentRulesByKind[
                  COACH_PAYMENT_RULE_FOR_SESSION
                ].concat(
                  coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_WORKSHOP],
                )}
                disabled={!!coach.coach_payment_rule_group_id}
                onChange={(item: { value: number; label: string }) => {
                  setCoachWorkshopPaymentRule(
                    coach.id,
                    item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  );
                }}
                placeholder={t('paymentRules:label')}
                selectedRules={[workshop_coach_payment_rule]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            spacing={1}
            style={{ alignItems: 'center' }}
          >
            <Grid item className={classes.label} md={4} xs={12}>
              <Typography>
                {t(
                  'paymentRules:coach_payment_rule_groups.fields.private_service',
                )}
              </Typography>
            </Grid>
            <Grid item className={classes.selector} xs={8}>
              <CoachPaymentRuleSelectorStyled
                isClearable
                noMulti
                coachPaymentRulesList={
                  coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT]
                }
                disabled={!!coach.coach_payment_rule_group_id}
                onChange={(item: { value: number; label: string }) => {
                  setCoachPrivatePaymentRule(
                    coach.id,
                    item ? item.value : DISSOCIATED_COACH_PAYMENT_RULE,
                  );
                }}
                placeholder={t('paymentRules:label')}
                selectedRules={[private_service_coach_payment_rule]}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            spacing={2}
            style={{ alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <div className={classes.title}>
                <Typography variant="h6">
                  {t(
                    'paymentRules:coach_payment_rule_groups.subtitle.specfic_private_slot',
                  )}
                </Typography>
                {coach.coach_payment_rule_group_id ? (
                  <GroupIcon className={classes.blockIcon} color="secondary" />
                ) : null}
              </div>
              {this.state.private_slots_errors && (
                <Typography color="error" variant="caption">
                  {t(
                    'paymentRules:coach_payment_rules.Errors.privateSlotAlreadySelected',
                  )}
                </Typography>
              )}
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
                    {values(specificPrivateSlots).map(
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
                              <PrivateSlotSelectorStyled
                                noMulti
                                disabled={!!coach.coach_payment_rule_group_id}
                                onChange={(item: {
                                  value: number;
                                  label: string;
                                }) => {
                                  if (!checkPrivateSlotUnicity(item)) {
                                    displayPrivateSlotError();
                                  } else {
                                    updateState('private_slot', item.value, i);
                                  }
                                }}
                                placeholder={t('paymentRules:privateSlotLabel')}
                                privateServiceList={privateServices}
                                selectedServices={[privateSlot.private_slot]}
                              />
                            </TableCell>
                            <TableCell>
                              <CoachPaymentRuleSelectorStyled
                                noMulti
                                coachPaymentRulesList={
                                  coachPaymentRulesByKind[
                                    COACH_PAYMENT_RULE_FOR_APPOINTMENT
                                  ]
                                }
                                disabled={!!coach.coach_payment_rule_group_id}
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
                                placeholder={t('paymentRules:label')}
                                selectedRules={[privateSlot.coach_payment_rule]}
                              />
                            </TableCell>
                            <TableCell align="left" padding="none" size="small">
                              {!coach.coach_payment_rule_group_id && (
                                <IconButton
                                  aria-label="Delete"
                                  disabled={!!coach.coach_payment_rule_group_id}
                                  onClick={() => updateState('delete', 0, i)}
                                >
                                  <ClearIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        </>
                      ),
                    )}
                  </TableBody>
                </>
              </Table>
            </TableContainer>
            <Grid item className={classes.flexRow} xs={12}>
              <Button
                aria-haspopup="true"
                color="secondary"
                disabled={!!coach.coach_payment_rule_group_id}
                onClick={() => updateState('add', 0, 0)}
              >
                <AddIcon
                  color={
                    coach.coach_payment_rule_group_id ? 'disabled' : 'secondary'
                  }
                />
                {t(
                  'paymentRules:coach_payment_rule_groups.fields.addPrivateSlot',
                )}
              </Button>
              <Button
                aria-haspopup="true"
                color="secondary"
                disabled={
                  !!coach.coach_payment_rule_group_id ||
                  !this.state.enableSaveButton
                }
                onClick={() => {
                  this.setState((prevState) => ({
                    ...prevState,
                    enableSaveButton: false,
                  }));
                  this.props.updateCoachPrivateSlotsPaymentRule({
                    id: coach.id,
                    associated_coach_id: coach.associated_coach_id,
                    private_slots_coach_payment_rules: specificPrivateSlots,
                  });
                }}
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

const styles = (theme) => ({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    paddingTop: theme.spacing(2),
  },
  blockIcon: {
    paddingLeft: theme.spacing(1),
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  label: {
    [theme.breakpoints.up('md')]: { marginRight: theme.spacing(2) },
  },
  selector: {
    [theme.breakpoints.down('md')]: { marginBottom: theme.spacing(1) },
  },
  payrollGroup: { marginTop: theme.spacing(2) },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['coach', 'paymentRules']),
)(CoachPaymentRuleBanner);
