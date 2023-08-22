// @ts-nocheck
import React from 'react';

import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CoachSummaryBanner from './coach-detail/CoachSummaryBanner.component';
import CoachInformation from './coach-detail/CoachInformation.component';
import CoachPaymentRuleBanner from './coach-detail/CoachPaymentRuleBanner.component';
import CoachSpaceConfiguration from './coach-detail/CoachSpaceConfiguration.component';
import AssociatedCoachDisciplineGroupConfiguration from './coach-detail/AssociatedCoachDisciplineGroupConfiguration.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

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
import { hasUpsell } from '#libs/platform-billing/utils';
import { FeatureList } from '#libs/company/types';

import type { OptionCallback } from '../../../state/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import type { Theme as CompanyTheme } from '#libs/theme/types';

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
  establishmentList: Establishment[];
  establishmentGroupList: EstablishmentGroup[];
  companyTheme: CompanyTheme;
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
  establishmentList,
  establishmentGroupList,
  companyTheme,
  editAccessToCoachSpace,
  assignDisciplineGroup,
  updateAssociatedCoachReplacementPreferences,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      <div className={classes.presentation}>
        <Paper className={classes.paperContainer}>
          <CoachSummaryBanner
            coach={coach}
            coachPaymentRulesByKind={coachPaymentRulesByKind}
            setCoachPaymentRule={setCoachPaymentRule}
            setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
          />
        </Paper>
      </div>
      <div className={classes.activation}>
        <CoachSpaceConfiguration
          editAccessToCoachSpace={editAccessToCoachSpace}
          hasAccessToCoachSpace={coach?.has_access_to_coach_space}
        />
      </div>

      <ObjectLevelPermissionProvider
        requiredPermission={[
          'management.coach.allowed_actions.readPayroll',
          'management.coach.allowed_actions.substitution',
        ]}
      >
        {([hasPayrollPermission, hasSubstitutionPermission]: boolean[]) => (
          <>
            {hasPayrollPermission && (
              <div className={classes.payroll}>
                <Paper className={classes.paperContainer}>
                  <CoachPaymentRuleBanner
                    coach={coach}
                    coachPaymentRuleGroups={coachPaymentRuleGroups}
                    coachPaymentRulesByKind={coachPaymentRulesByKind}
                    privateServices={privateServices}
                    remunerateCoach={() => goToCoachPerformance(coach)}
                    setCoachPaymentRule={setCoachPaymentRule}
                    setCoachPaymentRuleGroup={setCoachPaymentRuleGroup}
                    setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
                    setCoachWorkshopPaymentRule={setCoachWorkshopPaymentRule}
                    updateCoachPrivateSlotsPaymentRule={
                      updateCoachPrivateSlotsPaymentRule
                    }
                  />
                </Paper>
              </div>
            )}

            <div className={classes.description}>
              <CoachInformation
                coach={coach}
                startUpdateCoach={startUpdateCoach}
              />
            </div>

            {hasSubstitutionPermission && (
              <div className={classes.remplacement}>
                {' '}
                <FeatureListProvider>
                  {(featureList: FeatureList) => (
                    <>
                      {hasUpsell(
                        featureList,
                        UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
                      ) && (
                        <Paper className={classes.paperReplacement}>
                          <AssociatedCoachDisciplineGroupConfiguration
                            activityList={activityList}
                            assignDisciplineGroup={assignDisciplineGroup}
                            categoryList={categoryList}
                            coach={coach}
                            companyTheme={companyTheme}
                            disciplineGroupList={disciplineGroupList}
                            establishmentGroupList={establishmentGroupList}
                            establishmentList={establishmentList}
                            updateAssociatedCoachReplacementPreferences={
                              updateAssociatedCoachReplacementPreferences
                            }
                            workshopList={workshopList}
                          />
                        </Paper>
                      )}
                    </>
                  )}
                </FeatureListProvider>
              </div>
            )}
          </>
        )}
      </ObjectLevelPermissionProvider>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  grid: {
    gridGap: theme.spacing(2),
    display: 'grid',
  },
  presentation: {
    [theme.breakpoints.down('md')]: { order: 1 },
    [theme.breakpoints.up('md')]: { gridRow: 1, gridColumn: 1 },
  },
  description: {
    [theme.breakpoints.down('md')]: { order: 2 },
    [theme.breakpoints.up('md')]: { gridRow: 2, gridColumn: 2 },
  },
  activation: {
    [theme.breakpoints.down('md')]: { order: 3 },
    [theme.breakpoints.up('md')]: { gridRow: 1, gridColumn: 2 },
  },
  payroll: {
    [theme.breakpoints.down('md')]: { order: 4 },
    [theme.breakpoints.up('md')]: { gridRow: 2, gridColumn: 1 },
  },
  remplacement: {
    [theme.breakpoints.down('md')]: { order: 5 },
    [theme.breakpoints.up('md')]: { gridRow: 3, gridColumn: 1 },
  },
  fullWidth: { width: '100%' },
  paperContainer: {
    padding: theme.spacing(2),
    flex: '5',
  },
  paperReplacement: {
    padding: theme.spacing(2),
  },
  leftButton: {
    paddingTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default CoachDetail;
