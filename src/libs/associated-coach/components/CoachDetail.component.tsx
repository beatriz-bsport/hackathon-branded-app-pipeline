import React from 'react';

import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CoachSummaryBanner from './coach-detail/CoachSummaryBanner.component';
import Description from './coach-detail/Description.component';
import CoachPaymentRuleBanner from './coach-detail/CoachPaymentRuleBanner.component';
import CoachSpaceConfiguration from './coach-detail/CoachSpaceConfiguration.component';
import AssociatedCoachDisciplineGroupConfiguration from './coach-detail/AssociatedCoachDisciplineGroupConfiguration.component';

import type {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
} from '../../coach-payment-rules/types';
import type { PrivateServiceWithSlots } from '../../private-service/types';
import type { Coach, CoachReplacementPreferencesData } from '../types';
import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import {
  DisciplineGroup,
  AssignAssociatedCoachDisciplineGroupParams,
} from '#libs/replacement-request/types';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import { UPSELL_IDENTIFIER_SUBTEACHER_TOOL } from '#libs/platform-billing/upsell-identifiers';

import type { OptionCallback } from '../../../state/types';

type Props = {
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
    coach_payment_rule_id: number,
  ) => number;
  startUpdateCoach: (coach: Coach) => void;
  goToCoachPerformance: (coach: Coach) => void;
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
  privateServices: Array<PrivateServiceWithSlots>;
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  categoryList: SCT[];
  disciplineGroupList: DisciplineGroup[];
  editAccessToCoachSpace: (arg: boolean) => void;
  assignDisciplineGroup: (
    params: AssignAssociatedCoachDisciplineGroupParams,
    options?: OptionCallback,
  ) => void;
  updateAssociatedCoachReplacementPreferences: (
    id: number,
    data: CoachReplacementPreferencesData,
  ) => void;
};

export const CoachDetail: React.FC<Props> = ({
  coach,
  coachPaymentRulesByKind,
  coachPaymentRuleGroups,
  setCoachPaymentRule,
  setCoachWorkshopPaymentRule,
  setCoachPrivatePaymentRule,
  setCoachPaymentRuleGroup,
  startUpdateCoach,
  goToCoachPerformance,
  updateCoachPrivateSlotsPaymentRule,
  privateServices,
  activityList,
  workshopList,
  categoryList,
  disciplineGroupList,
  editAccessToCoachSpace,
  assignDisciplineGroup,
  updateAssociatedCoachReplacementPreferences,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.column}>
      <div className={classes.row}>
        <Paper className={classes.paperContainer}>
          <CoachSummaryBanner
            coach={coach}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            setCoachPaymentRule={setCoachPaymentRule}
            setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
          />
        </Paper>
        <div className={classes.right}>
          <CoachSpaceConfiguration
            editAccessToCoachSpace={editAccessToCoachSpace}
            hasAccessToCoachSpace={coach?.has_access_to_coach_space}
          />
        </div>
      </div>
      <div className={classes.row}>
        <Paper className={classes.paperContainer}>
          <CoachPaymentRuleBanner
            coach={coach}
            remunerateCoach={() => goToCoachPerformance(coach)}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            coachPaymentRuleGroups={coachPaymentRuleGroups}
            setCoachPaymentRule={setCoachPaymentRule}
            setCoachWorkshopPaymentRule={setCoachWorkshopPaymentRule}
            setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
            setCoachPaymentRuleGroup={setCoachPaymentRuleGroup}
            updateCoachPrivateSlotsPaymentRule={
              updateCoachPrivateSlotsPaymentRule
            }
            privateServices={privateServices}
          />
        </Paper>
        <div className={classes.right}>
          <Description coach={coach} startUpdateCoach={startUpdateCoach} />
        </div>
      </div>
      <FeatureListProvider>
        {(featureList) => (
          <>
            {!!featureList.upsell?.find(
              (f) => f.upsell_identifier === UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
            ) && (
              <div className={classes.row}>
                <Paper className={classes.paperReplacement}>
                  <AssociatedCoachDisciplineGroupConfiguration
                    coach={coach}
                    activityList={activityList}
                    workshopList={workshopList}
                    categoryList={categoryList}
                    disciplineGroupList={disciplineGroupList}
                    assignDisciplineGroup={assignDisciplineGroup}
                    updateAssociatedCoachReplacementPreferences={
                      updateAssociatedCoachReplacementPreferences
                    }
                  />
                </Paper>
              </div>
            )}
          </>
        )}
      </FeatureListProvider>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  row: { display: 'flex', gap: theme.spacing(2) },
  fullWidth: { width: '100%' },
  paperContainer: {
    padding: theme.spacing(2),
    flex: '5',
  },
  paperReplacement: {
    padding: theme.spacing(2),
    width: '62.5%',
  },
  right: {
    flex: '3',
  },
  leftButton: {
    paddingTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
}));

export default CoachDetail;
