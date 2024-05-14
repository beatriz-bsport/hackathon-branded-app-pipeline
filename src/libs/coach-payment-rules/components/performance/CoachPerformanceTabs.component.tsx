import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
  COACH_PERFORMANCE_FOR_GROUP_ACTIVITY,
  COACH_PERFORMANCE_FOR_WORKSHOP,
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
  COACH_PERFORMANCE_FOR_ALL,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import Typography from '@material-ui/core/Typography';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core';
import CoachPerformanceSessionTable from './CoachPerformanceSessionTable.component';
import CoachPerformancePrivateServiceTable from './CoachPerformancePrivateServiceTable.component';
import type {
  CoachwithPerformance,
  CoachPaymentRuleGroup,
  CoachPaymentRule,
} from '#libs/coach-payment-rules/types';
import CoachPerformanceRuleSetter from './CoachPerformanceRuleSetter.component';

type CoachPaymentRuleTabPanelActions = {
  setSessionCoachPaymentRule: (params: {
    associatedCoachId: number;
    sessionId: number;
    coachPaymentRuleId: number;
  }) => void;
  updatePrivateBookingCoachPaymentRule: (params: {
    associatedCoachId: number;
    privateBookingId: number;
    coachPaymentRuleId: number;
  }) => void;
};

type TabPanelProps = {
  coachWithPerformance: CoachwithPerformance;
  value: number;
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  hideRuleSetter?: boolean;
  asCoach?: boolean;
  has_coach_access_to_compensation_downloading: boolean;
  handlePdfExportation?: (
    associatedCoachId: number,
    dataToExport: number,
  ) => void;
  isMultiLocalizationEnabled: boolean;
  filtersApplied: boolean;
} & CoachPaymentRuleTabPanelActions;

export const CoachPerformanceTabPanel = (props: TabPanelProps) => {
  const handlePdfExportation = props.handlePdfExportation;
  const associatedCoachId = props.coachWithPerformance.associated_coach_id;
  const coachSessionPaymentRulesList =
    (!props.hideRuleSetter &&
      !props.asCoach &&
      props.coachPaymentRulesByKind &&
      props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION]) ||
    [];

  const coachGroupActivityPaymentRulesList = React.useMemo(
    () =>
      (!props.hideRuleSetter &&
        !props.asCoach &&
        props.coachPaymentRulesByKind &&
        props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY]) ||
      [],
    [props.asCoach, props.coachPaymentRulesByKind, props.hideRuleSetter],
  );

  const coachWorkshopPaymentRulesList = React.useMemo(
    () =>
      (!props.hideRuleSetter &&
        !props.asCoach &&
        props.coachPaymentRulesByKind &&
        props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_WORKSHOP]) ||
      [],
    [props.asCoach, props.coachPaymentRulesByKind, props.hideRuleSetter],
  );

  const coachPrivateServicePaymentRulesList =
    (!props.hideRuleSetter &&
      !props.asCoach &&
      props.coachPaymentRulesByKind &&
      props.coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT]) ||
    [];

  const coachGroupActivityPerformances = React.useMemo(
    () =>
      props.coachWithPerformance?.performance[
        COACH_PERFORMANCE_FOR_SESSION
      ]?.filter((coachPerformance) => !coachPerformance.is_workshop),
    [props.coachWithPerformance?.performance],
  );

  const coachWorkshopPerformances = React.useMemo(
    () =>
      props.coachWithPerformance?.performance[
        COACH_PERFORMANCE_FOR_SESSION
      ]?.filter((coachPerformance) => coachPerformance.is_workshop),
    [props.coachWithPerformance?.performance],
  );

  const handlePdfExportationSession = React.useCallback(
    () =>
      handlePdfExportation?.(associatedCoachId, COACH_PAYMENT_RULE_FOR_SESSION),
    [handlePdfExportation, associatedCoachId],
  );

  const handlePdfExportationAppointment = React.useCallback(
    () =>
      handlePdfExportation?.(
        associatedCoachId,
        COACH_PERFORMANCE_FOR_APPOINTMENT,
      ),
    [handlePdfExportation, associatedCoachId],
  );

  const handlePdfExportationAll = React.useCallback(
    () => handlePdfExportation?.(associatedCoachId, COACH_PERFORMANCE_FOR_ALL),
    [handlePdfExportation, associatedCoachId],
  );

  if (props.value === COACH_PERFORMANCE_FOR_SESSION) {
    return (
      <CoachPerformanceSessionTable
        asCoach={props.asCoach}
        coach={props.coachWithPerformance}
        coachPaymentRulesList={coachSessionPaymentRulesList}
        disablePdfButton={!handlePdfExportation}
        filtersApplied={props.filtersApplied}
        handlePdfExportation={handlePdfExportationSession}
        has_coach_access_to_compensation_downloading={
          props.has_coach_access_to_compensation_downloading
        }
        hideRuleSetter={props.hideRuleSetter}
        isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
        performances={
          props.coachWithPerformance?.performance[COACH_PERFORMANCE_FOR_SESSION]
        }
        setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_GROUP_ACTIVITY) {
    return (
      <CoachPerformanceSessionTable
        asCoach={props.asCoach}
        coach={props.coachWithPerformance}
        coachPaymentRulesList={coachGroupActivityPaymentRulesList}
        disablePdfButton={!handlePdfExportation}
        filtersApplied={props.filtersApplied}
        handlePdfExportation={handlePdfExportationSession}
        has_coach_access_to_compensation_downloading={
          props.has_coach_access_to_compensation_downloading
        }
        hideRuleSetter={props.hideRuleSetter}
        isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
        performances={coachGroupActivityPerformances}
        setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_WORKSHOP) {
    return (
      <CoachPerformanceSessionTable
        asCoach={props.asCoach}
        coach={props.coachWithPerformance}
        coachPaymentRulesList={coachWorkshopPaymentRulesList}
        disablePdfButton={!handlePdfExportation}
        filtersApplied={props.filtersApplied}
        handlePdfExportation={handlePdfExportationSession}
        has_coach_access_to_compensation_downloading={
          props.has_coach_access_to_compensation_downloading
        }
        hideRuleSetter={props.hideRuleSetter}
        isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
        performances={coachWorkshopPerformances}
        setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_APPOINTMENT) {
    return (
      <CoachPerformancePrivateServiceTable
        asCoach={props.asCoach}
        coach={props.coachWithPerformance}
        coachPaymentRulesList={coachPrivateServicePaymentRulesList}
        disablePdfButton={!handlePdfExportation}
        filtersApplied={props.filtersApplied}
        handlePdfExportation={handlePdfExportationAppointment}
        has_coach_access_to_compensation_downloading={
          props.has_coach_access_to_compensation_downloading
        }
        hideRuleSetter={props.hideRuleSetter}
        isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
        performances={
          props.coachWithPerformance?.performance[
            COACH_PAYMENT_RULE_FOR_APPOINTMENT
          ]
        }
        updatePrivateBookingCoachPaymentRule={
          props.updatePrivateBookingCoachPaymentRule
        }
      />
    );
  }
  if (props.value === COACH_PERFORMANCE_FOR_ALL) {
    return (
      <div>
        <CoachPerformanceSessionTable
          displayChip
          asCoach={props.asCoach}
          coach={props.coachWithPerformance}
          coachPaymentRulesList={coachSessionPaymentRulesList}
          disablePdfButton={!handlePdfExportation}
          filtersApplied={props.filtersApplied}
          handlePdfExportation={handlePdfExportationAll}
          has_coach_access_to_compensation_downloading={
            props.has_coach_access_to_compensation_downloading
          }
          hideRuleSetter={props.hideRuleSetter}
          isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
          performances={
            props.coachWithPerformance?.performance[
              COACH_PAYMENT_RULE_FOR_SESSION
            ]
          }
          setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
        />

        <CoachPerformancePrivateServiceTable
          displayChip
          asCoach={props.asCoach}
          coach={props.coachWithPerformance}
          coachPaymentRulesList={coachPrivateServicePaymentRulesList}
          filtersApplied={props.filtersApplied}
          has_coach_access_to_compensation_downloading={
            props.has_coach_access_to_compensation_downloading
          }
          hideRuleSetter={props.hideRuleSetter}
          isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
          performances={
            props.coachWithPerformance?.performance[
              COACH_PAYMENT_RULE_FOR_APPOINTMENT
            ]
          }
          updatePrivateBookingCoachPaymentRule={
            props.updatePrivateBookingCoachPaymentRule
          }
        />
      </div>
    );
  }
  return null;
};

type CoachPaymentRuleTabsActions = {
  setSessionCoachPaymentRule?: (params: {
    associatedCoachId: number;
    sessionId: number;
    coachPaymentRuleId: number;
  }) => void;
  updatePrivateBookingCoachPaymentRule?: (params: {
    associatedCoachId: number;
    privateBookingId: number;
    coachPaymentRuleId: number;
  }) => void;
  setCoachPaymentRuleGroup?: (
    coachId: number,
    coach_payment_rule_group_id: number,
    associated_coach_id: number,
  ) => number;
  setCoachPaymentRule?: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
  setCoachPrivatePaymentRule?: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
  setCoachWorkShopPaymentRule?: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
};

type CoachPaymentRuleObjects = {
  coachPaymentRulesByKind?: { [kind: number]: Array<CoachPaymentRule> };
  coachPaymentRuleGroups?: Array<CoachPaymentRuleGroup>;
  coachPaymentRuleGroupsDict?: { [groupId: number]: CoachPaymentRuleGroup };
};

type TabProps = {
  coachWithPerformance: CoachwithPerformance;
  hideRuleSetter?: boolean;
  asCoach?: boolean;
  loading?: boolean;
  displayLastUpdate?: boolean;
  has_coach_access_to_compensation_downloading?: boolean;
  handlePdfExportation?: (coachId: number, dataToExport: number) => void;
  isMultiLocalizationEnabled: boolean;
  filtersApplied: boolean;
} & CoachPaymentRuleTabsActions &
  CoachPaymentRuleObjects;

export const CoachPerformanceTabs = (props: TabProps) => {
  const {
    coachWithPerformance,
    loading,
    has_coach_access_to_compensation_downloading,
    filtersApplied,
  } = props;
  const { performance } = coachWithPerformance;
  const { t } = useTranslation(['paymentRules', 'coachPerformance']);
  const classes = useStyles();
  const [value, setValue] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [oldestUpdate, setOldestUpdate] = React.useState<number | null>(null);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: 0 | 1 | 2 | 3 | 4,
  ) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (!loading && coachWithPerformance) {
      const last_update_bookings = coachWithPerformance?.performance[
        COACH_PERFORMANCE_FOR_SESSION
      ]?.map((coachPerf) => coachPerf.last_update);

      const last_update_private_bookings = coachWithPerformance?.performance[
        COACH_PERFORMANCE_FOR_SESSION
      ]?.map((coachPerf) => coachPerf.last_update);

      setOldestUpdate(
        Math.min(
          ...(last_update_bookings || [].concat(last_update_private_bookings)),
        ),
      );
    }
  }, [coachWithPerformance, loading]);

  return (
    <div>
      <Tabs
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        value={value}
      >
        <Tab
          label={`${t('tabs.session')}(${
            performance[COACH_PERFORMANCE_FOR_SESSION]
              ? performance[COACH_PERFORMANCE_FOR_SESSION].length
              : 0
          })`}
          value={COACH_PERFORMANCE_FOR_SESSION}
        />
        <Tab
          label={`${t('tabs.groupActivity')}(${
            performance[COACH_PERFORMANCE_FOR_SESSION]
              ? performance[COACH_PERFORMANCE_FOR_SESSION].filter(
                  (coachPerformance) => !coachPerformance.is_workshop,
                ).length ?? 0
              : 0
          })`}
          value={COACH_PERFORMANCE_FOR_GROUP_ACTIVITY}
        />
        <Tab
          label={`${t('tabs.workshop')}(${
            performance[COACH_PERFORMANCE_FOR_SESSION]
              ? performance[COACH_PERFORMANCE_FOR_SESSION].filter(
                  (coachPerformance) => coachPerformance.is_workshop,
                ).length ?? 0
              : 0
          })`}
          value={COACH_PERFORMANCE_FOR_WORKSHOP}
        />
        <Tab
          label={`${t('tabs.appointment')}(${
            performance[COACH_PERFORMANCE_FOR_APPOINTMENT]
              ? performance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
              : 0
          })`}
          value={COACH_PERFORMANCE_FOR_APPOINTMENT}
        />
        <Tab
          label={`${t('tabs.all')}(${
            (performance[COACH_PERFORMANCE_FOR_APPOINTMENT]
              ? performance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
              : 0) +
            (performance[COACH_PERFORMANCE_FOR_SESSION]
              ? performance[COACH_PERFORMANCE_FOR_SESSION].length
              : 0)
          })`}
          value={COACH_PERFORMANCE_FOR_ALL}
        />
      </Tabs>
      {!props.hideRuleSetter &&
        !props.asCoach &&
        props.setCoachPaymentRule &&
        props.setCoachPaymentRuleGroup &&
        props.setCoachPrivatePaymentRule &&
        props.setCoachWorkShopPaymentRule && (
          <CoachPerformanceRuleSetter
            coach={props.coachWithPerformance}
            coachPaymentRuleGroups={props.coachPaymentRuleGroups}
            coachPaymentRuleGroupsDict={props.coachPaymentRuleGroupsDict}
            coachPaymentRulesByKind={props.coachPaymentRulesByKind}
            setCoachPaymentRule={props.setCoachPaymentRule}
            setCoachPaymentRuleGroup={props.setCoachPaymentRuleGroup}
            setCoachPrivatePaymentRule={props.setCoachPrivatePaymentRule}
            setCoachWorkShopPaymentRule={props.setCoachWorkShopPaymentRule}
          />
        )}
      <div className={classes.lastUpdateSection}>
        <Typography color="secondary" variant="caption">
          {!props.asCoach && props.displayLastUpdate && oldestUpdate
            ? t('coachPerformance:cachedData.oldestUpdate', {
                date: DateTime.fromSeconds(oldestUpdate).toFormat(
                  'cccc, DD h:mm a',
                ),
              })
            : t('coachPerformance:cachedData.undeterminedOldestUpdate')}
        </Typography>
      </div>
      <CoachPerformanceTabPanel
        asCoach={props.asCoach}
        coachPaymentRulesByKind={props.coachPaymentRulesByKind}
        coachWithPerformance={props.coachWithPerformance}
        filtersApplied={filtersApplied}
        handlePdfExportation={props.handlePdfExportation ?? undefined}
        has_coach_access_to_compensation_downloading={
          has_coach_access_to_compensation_downloading
        }
        hideRuleSetter={props.hideRuleSetter}
        isMultiLocalizationEnabled={props.isMultiLocalizationEnabled}
        setSessionCoachPaymentRule={props.setSessionCoachPaymentRule}
        updatePrivateBookingCoachPaymentRule={
          props.updatePrivateBookingCoachPaymentRule
        }
        value={value}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  lastUpdateSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
}));
export default CoachPerformanceTabs;
