import React, { Component } from 'react';
import type { Moment } from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers, withState } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OptionCallback } from '../../state/types';
import withTitle from '../../hocs/with-title.hoc';
import { downloadAsCsv } from '../../utils/downloader';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  setCoachPaymentRule,
  setCoachPrivatePaymentRule,
  setCoachWorkshopPaymentRule,
  fetchAssociatedCoachesList,
  setCoachPaymentRuleGroup,
} from '#libs/associated-coach/actions';

import {
  fetchAllCoachPaymentRules,
  fetchAllCoachPaymentRuleGroups,
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  setSessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRule as updatePrivateBookingCoachPaymentRule,
} from '#libs/coach-payment-rules/actions';

import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  withCoachPerformance,
  getCoachPaymentRuleGroups,
} from '#libs/coach-payment-rules/selectors';

import CoachPerformanceForm from '../../libs/associated-coach/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSynthese from '#libs/associated-coach/components/performance/CoachPerformanceSynthese.component';
import { computePerformanceSynthese } from '../../libs/coach-payment-rules/utils';

import type { RootState } from '../../reducers';
import type { Coach } from '#libs/associated-coach/types';
import { WithHandlerType } from '../../utils/types';

const styles = (theme: Theme) =>
  createStyles({
    bar: {
      width: `calc(100% + ${theme.spacing(6)}px)`,
      marginTop: theme.spacing(-2),
      marginRight: theme.spacing(-3),
      marginLeft: theme.spacing(-3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
    },
    performanceContainer: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(4),
    },
    container: {
      marginBottom: theme.spacing(32),
      width: '100%',
    },
    generalLoader: {
      marginBottom: theme.spacing(1),
    },
  });

type OwnProps = {
  setPerformanceLoading: (loading: boolean) => void;
  setFormDates: ({
    dateStart,
    dateEnd,
  }: {
    dateStart: number;
    dateEnd: number;
  }) => void;
  formDates: { dateStart: number; dateEnd: number };
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;
type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

export class AllCoachPerformancePage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAssociatedCoachesList({ disabled: false });
    this.props.fetchAllCoachPaymentRuleGroups();
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.bar}>
          <CoachPerformanceForm
            disabled={this.props.coachLoading}
            onSubmit={this.props.onSubmit}
            loading={this.props.loading}
          />
        </AppBar>
        {this.props.coachLoading || this.props.performanceLoading ? (
          <LinearProgress className={classes.generalLoader} />
        ) : null}
        <Button
          variant="contained"
          color="primary"
          disabled={this.props.coachLoading || this.props.performanceLoading}
          onClick={() => {
            downloadAsCsv(
              [
                t('coach:performance.coachName'),
                t('coach:performance.payment'),
                t('coach:performance.bonus'),
                t('coach:performance.nbOffersTotal'),
                t('coach:performance.nbConfirmedBookings'),
                t('coach:performance.nbCancelledBookings'),
              ],

              computePerformanceSynthese(
                this.props.associatedCoachWithCoachPaymentRuleAndPerformance,
              ).map((perf) => [
                perf.name,
                perf.payment,
                perf.bonus,
                perf.nbSessions,
                perf.confirmedBookings,
                perf.cancelledBookings,
              ]),
              'payroll.csv',
            );
          }}
        >
          <AttachFileIcon />
          {t('coachPerformance:table.downloadAll')}
        </Button>
        {this.props.associatedCoachWithCoachPaymentRuleAndPerformance.map(
          (coach: Coach) => (
            <CoachPerformanceSynthese
              coach={coach}
              key={coach.id}
              loading={this.props.loading || this.props.performanceLoading}
              setSessionCoachPaymentRule={this.props.setSessionCoachPaymentRule}
              updatePrivateBookingCoachPaymentRule={
                this.props.updatePrivateBookingCoachPaymentRule
              }
              coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
              setCoachPaymentRule={this.props.setCoachPaymentRule}
              setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
              setCoachWorkShopPaymentRule={
                this.props.setCoachWorkShopPaymentRule
              }
              performance={coach.performance}
              coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
              coachPaymentRuleGroupsDict={this.props.coachPaymentRuleGroupsDict}
              setCoachPaymentRuleGroup={this.props.setCoachPaymentRuleGroup}
            />
          ),
        )}
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    coachPaymentRulesList: CoachPaymentRulesSelector(state),
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    coachLoading: state.coach.loading,
    performanceLoading: state.coachPaymentRules.performance.loading,
    associatedCoachWithCoachPaymentRuleAndPerformance:
      withCoachPerformance(getActiveCoaches)(state),
    coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
    coachPaymentRuleGroupsDict: state.coachPaymentRules.groups.byId,
  }),
  {
    setSessionCoachPaymentRuleAction: setSessionCoachPaymentRule,
    updatePrivateBookingCoachPaymentRuleAction:
      updatePrivateBookingCoachPaymentRule,
    fetchAssociatedCoachesList,
    fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
    fetchCoachPrivateServicePerformance:
      fetchCoachPrivateServicePerformanceAction,
    setCoachPaymentRuleAction: setCoachPaymentRule,
    setCoachPrivatePaymentRule,
    setCoachWorkshopPaymentRuleAction: setCoachWorkshopPaymentRule,
    fetchAllCoachPaymentRules,
    fetchAllCoachPaymentRuleGroups,
    setCoachPaymentRuleGroupAction: setCoachPaymentRuleGroup,
  },
);

const mapWithHandlers = {
  onSubmit:
    ({
      associatedCoachWithCoachPaymentRuleAndPerformance,
      fetchCoachSessionPerformance,
      fetchCoachPrivateServicePerformance,
      setPerformanceLoading,
      setFormDates,
    }: OwnAndConnectedProps) =>
    async (
      data: { dateStart: Moment; dateEnd: Moment },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      setFormDates({ dateStart: dateStart.unix(), dateEnd: dateEnd.unix() });
      setPerformanceLoading(true);
      await associatedCoachWithCoachPaymentRuleAndPerformance.reduce(
        async (prevPromise: Promise<void>, nextCoach: Coach) => {
          await prevPromise;
          const promises = [
            fetchCoachSessionPerformance(
              {
                associatedCoachId: nextCoach.associated_coach_id,
                start_timestamp: dateStart.unix(),
                end_timestamp: dateEnd.unix(),
              },
              options,
            ),
            fetchCoachPrivateServicePerformance(
              {
                associatedCoachId: nextCoach.associated_coach_id,
                start_timestamp: dateStart.unix(),
                end_timestamp: dateEnd.unix(),
              },
              options,
            ),
          ];
          return Promise.all(promises);
        },
        Promise.resolve(),
      );
      setPerformanceLoading(false);
    },
  setCoachPaymentRule:
    ({
      setCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (coachId: number, paymentRuleId: number, associatedCoachId: number) => {
      setCoachPaymentRuleAction(coachId, paymentRuleId, {
        onSuccess: async () => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachSessionPerformance({
              associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  setCoachWorkShopPaymentRule:
    ({
      setCoachWorkshopPaymentRuleAction,
      fetchCoachSessionPerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (coachId: number, paymentRuleId: number, associatedCoachId: number) => {
      setCoachWorkshopPaymentRuleAction(coachId, paymentRuleId, {
        onSuccess: async () => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachSessionPerformance({
              associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  updatePrivateBookingCoachPaymentRule:
    ({
      updatePrivateBookingCoachPaymentRuleAction,
      fetchCoachPrivateServicePerformance,
      setPerformanceLoading,
      formDates,
    }: OwnAndConnectedProps) =>
    (data: {
      associatedCoachId: number;
      privateBookingId: number;
      coachPaymentRuleId: number;
    }) => {
      updatePrivateBookingCoachPaymentRuleAction(data, {
        onSuccess: async (payload) => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachPrivateServicePerformance({
              associatedCoachId: payload.associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
              privateBookingId: payload.privateBookingId,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  setSessionCoachPaymentRule:
    ({
      setSessionCoachPaymentRuleAction,
      fetchCoachSessionPerformance,
      formDates,
      setPerformanceLoading,
    }: OwnAndConnectedProps) =>
    (data: {
      associatedCoachId: number;
      sessionId: number;
      coachPaymentRuleId: number;
    }) => {
      setSessionCoachPaymentRuleAction(data, {
        onSuccess: async (payload) => {
          setPerformanceLoading(true);
          const promises = [
            fetchCoachSessionPerformance({
              associatedCoachId: payload.associatedCoachId,
              start_timestamp: formDates.dateStart,
              end_timestamp: formDates.dateEnd,
              sessionId: payload.sessionId,
            }),
          ];
          await Promise.all(promises);
          setPerformanceLoading(false);
        },
      });
    },
  setCoachPaymentRuleGroup:
    ({ setCoachPaymentRuleGroupAction }: OwnAndConnectedProps) =>
    (coachId: number, value: number) => {
      setCoachPaymentRuleGroupAction(coachId, value);
    },
};

export default compose(
  withStyles(styles),
  withState('formDates', 'setFormDates', {}),
  withTranslation(['coachPerformance', 'coach']),
  connector,
  withStateHandlers(
    {
      performanceLoading: false,
    },
    {
      setPerformanceLoading: () => (loading: boolean) => ({
        performanceLoading: loading,
      }),
    },
  ),
  withHandlers(mapWithHandlers),
  withTitle(({ t }) => t('titles:coach.allCoachPerformance')),
)(AllCoachPerformancePage);
