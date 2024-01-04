// @ts-nocheck
import React from 'react';
import moment, { Moment as MomentType } from 'moment-timezone';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import { WithStyles, createStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import CoachPerformanceDateFilter from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateFilter.component';
import CoachPerformanceSummaryHeader from '#libs/coach-payment-rules/components/performance/CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from '#libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import { RootState } from '../../reducers';
import { withCoachPerformance } from '#libs/coach-payment-rules/selectors';
import {
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  exportPdfPerformance,
} from '#libs/coach-payment-rules/actions';
import withTitle from '#hocs/with-title.hoc';
import { OptionCallback } from '../../state/types';
import { WithHandlerType } from '../../utils/types';
import { getTheme } from '#libs/theme/selectors';

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
  has_coach_access_to_compensation_downloading: boolean;
};

type stateHandlerType = {
  performanceLoading: boolean;
  setPerformanceLoading: (loading: boolean) => void;
  formDates: { dateStart: moment.Moment; dateEnd: moment.Moment };
  setFormDates: (dates: { dateStart: number; dateEnd: number }) => void;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

export const CoachProfilePerformance: React.FC<Props> = (props: Props) => {
  const {
    classes,
    loading,
    onSubmit,
    coachWithPerformance,
    performanceLoading,
    handleDateFiltersChange,
    changeDate,
    has_coach_access_to_compensation_downloading,
    handlePdfExportation,
  } = props;

  return (
    <div className={classes.container}>
      <AppBar className={classes.bar} color="default" position="static">
        <CoachPerformanceDateFilter
          hideExport
          handleDateFiltersChange={handleDateFiltersChange}
          loading={loading || performanceLoading}
          onSubmit={onSubmit}
          updateStateDate={changeDate}
        />
      </AppBar>
      {coachWithPerformance ? (
        <>
          <CoachPerformanceSummaryHeader
            isCoach
            performances={coachWithPerformance.performance}
          />
          <Paper>
            {loading || performanceLoading ? <LinearProgress /> : null}
            <CoachPerformanceTabs
              asCoach
              hideRuleSetter
              coachWithPerformance={coachWithPerformance}
              handlePdfExportation={handlePdfExportation}
              has_coach_access_to_compensation_downloading={
                has_coach_access_to_compensation_downloading
              }
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
    (props: OwnAndConnectedProps & stateHandlerType) =>
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
  handleDateFiltersChange:
    ({ setFormDates }: OwnAndConnectedProps & stateHandlerType) =>
    async (
      data: { dateStart: MomentType; dateEnd: MomentType },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;

      setFormDates({
        dateStart: dateStart.unix(),
        dateEnd: dateEnd.unix(),
      });
      if (options?.onSuccess) options.onSuccess();
    },

  changeDate:
    ({ setFormDates }: OwnAndConnectedProps & stateHandlerType) =>
    (dateStart: number, dateEnd: number) =>
      setFormDates({ dateStart, dateEnd }),

  handlePdfExportation:
    ({
      exportPdfPerformanceAction,
      formDates,
      companyId,
    }: OwnAndConnectedProps & stateHandlerType) =>
    (associatedCoachId: number, dataToExport: number) => {
      const params = {
        start_timestamp: formDates.dateStart.valueOf(),
        end_timestamp: formDates.dateEnd.valueOf(),
        associated_coaches_in: [associatedCoachId],
        data_to_export: dataToExport,
        company_id: companyId,
      };
      exportPdfPerformanceAction(params);
    },
};
const connector = connect(
  (state: RootState) => ({
    coachWithPerformance: withCoachPerformance(getMyAssociatedCoachProfile)(
      state,
    ),
    loading: state.coachPaymentRules.performance.loading,
    has_coach_access_to_compensation_downloading:
      state.theme.theme.has_coach_access_to_compensation_downloading,
    companyId: getTheme(state).company,
  }),
  {
    fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
    fetchCoachPrivateServicePerformance:
      fetchCoachPrivateServicePerformanceAction,
    exportPdfPerformanceAction: exportPdfPerformance,
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
