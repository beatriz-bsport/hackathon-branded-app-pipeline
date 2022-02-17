import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import { WithStyles, createStyles, Theme } from '@material-ui/core';
import moment from 'moment-timezone';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import CoachPerformanceForm from '#libs/coach-payment-rules/components/performance/CoachPerformanceForm.component';
import CoachPerformanceSummaryHeader from '#libs/coach-payment-rules/components/performance/CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from '#libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import { RootState } from '../../reducers';
import { withCoachPerformance } from '#libs/coach-payment-rules/selectors';
import {
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
} from '#libs/coach-payment-rules/actions';
import withTitle from '#hocs/with-title.hoc';
import { OptionCallback } from '../../state/types';

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
    container: {
      marginBottom: theme.spacing(32),
    },
  });

type OwnProps = {
  performanceLoading: boolean;
};

type stateHandlerType = {
  performanceLoading: boolean;
  setPerformanceLoading: (loading: boolean) => void;
  formDates: { dateStart: moment.Moment; dateEnd: moment.Moment };
  setFormDates: (dates: { dateStart: number; dateEnd: number }) => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export const CoachProfilePerformance: React.FC<Props> = (props: Props) => {
  const {
    classes,
    loading,
    onSubmit,
    coachWithPerformance,
    performanceLoading,
  } = props;
  return (
    <div className={classes.container}>
      <AppBar position="static" color="default" className={classes.bar}>
        <CoachPerformanceForm
          onSubmit={onSubmit}
          loading={loading || performanceLoading}
          hideExport
        />
      </AppBar>
      {coachWithPerformance ? (
        <>
          <CoachPerformanceSummaryHeader
            performances={coachWithPerformance.performance}
            isCoach
          />
          <Paper>
            {loading || performanceLoading ? <LinearProgress /> : null}
            <CoachPerformanceTabs
              hideRuleSetter
              coachWithPerformance={coachWithPerformance}
              asCoach
            />
          </Paper>
        </>
      ) : (
        <LinearProgress />
      )}
    </div>
  );
};

const mapWithHandlers = {
  onSubmit:
    (props: stateHandlerType & ConnectedProps<typeof connector>) =>
    async (
      data: { dateStart: moment.Moment; dateEnd: moment.Moment },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      props.setFormDates({
        dateStart: dateStart.unix(),
        dateEnd: dateEnd.unix(),
      });
      props.setPerformanceLoading(true);
      const promises = [
        props.fetchCoachSessionPerformance(
          {
            associatedCoachId: props.coachWithPerformance.associated_coach_id,
            start_timestamp: dateStart.unix(),
            end_timestamp: dateEnd.unix(),
          },
          options,
        ),
        props.fetchCoachPrivateServicePerformance(
          {
            associatedCoachId: props.coachWithPerformance.associated_coach_id,
            start_timestamp: dateStart.unix(),
            end_timestamp: dateEnd.unix(),
          },
          options,
        ),
      ];
      await Promise.all(promises);
      props.setPerformanceLoading(false);
    },
};
const connector = connect(
  (state: RootState) => ({
    coachWithPerformance: withCoachPerformance(getMyAssociatedCoachProfile)(
      state,
    ),
    loading: state.coachPaymentRules.performance.loading,
  }),
  {
    fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
    fetchCoachPrivateServicePerformance:
      fetchCoachPrivateServicePerformanceAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation('coach'),
  withState('formDates', 'setFormDates', {}),
  withStateHandlers(
    { performanceLoading: false },
    {
      setPerformanceLoading: () => (loading) => ({
        performanceLoading: loading,
      }),
    },
  ),
  connector,
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:coachUserSpace.performance'),
  ),
)(CoachProfilePerformance);
