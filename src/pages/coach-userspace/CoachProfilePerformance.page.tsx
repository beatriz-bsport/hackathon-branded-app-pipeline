import React from 'react';
import moment, { Moment as MomentType } from 'moment-timezone';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithStyles, createStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import CoachPerformanceDateAndEstablishmentFilter from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateAndEstablishmentFilter.component';
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
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';
import type { CoachwithPerformance } from '#libs/coach-payment-rules/types';
import {
  getFilteredAssociatedCoachWithPerformance,
  getFilteredEstablishments,
} from '#libs/coach-payment-rules/utilstsx';

const styles = (theme: Theme) =>
  createStyles({
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
    companyTheme,
    establishmentGroupList,
    establishmentGroupListLoading,
    establishments,
    establishmentsLoading,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
  } = props;
  const [selectedEstablishments, setSelectedEstablishments] = React.useState<
    number[]
  >([]);
  const [selectedLocations, setSelectedLocations] = React.useState<number[]>(
    [],
  );

  const setSelectedEstablishmentFilter = React.useCallback(
    (establishmentsIds: number[], locationsIds: number[]) => {
      setSelectedEstablishments(establishmentsIds);
      setSelectedLocations(locationsIds);
    },
    [],
  );

  React.useEffect(() => {
    fetchEstablishments({ company: companyTheme.company });
    companyTheme.enable_multi_localization &&
      fetchAllEstablishmentGroup(companyTheme.company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAssociatedCoachWithPerformance = React.useMemo(() => {
    const establishmentIds = getFilteredEstablishments(
      selectedEstablishments,
      selectedLocations,
      establishmentGroupList,
    );
    if (establishmentIds && establishmentIds?.length) {
      return getFilteredAssociatedCoachWithPerformance(
        establishmentIds,
        coachWithPerformance,
      );
    }
    return coachWithPerformance;
  }, [
    selectedEstablishments,
    selectedLocations,
    coachWithPerformance,
    establishmentGroupList,
  ]);

  return (
    <div className={classes.container}>
      <CoachPerformanceDateAndEstablishmentFilter
        establishmentGroupList={establishmentGroupList}
        establishmentGroupListLoading={establishmentGroupListLoading}
        establishments={establishments}
        establishmentsLoading={establishmentsLoading}
        handleDateFiltersChange={handleDateFiltersChange}
        isMultiLocalizationEnabled={companyTheme.enable_multi_localization}
        loading={loading || performanceLoading}
        onSubmit={onSubmit}
        selectedEstablishments={selectedEstablishments}
        selectedLocations={selectedLocations}
        setSelectedEstablishmentFilter={setSelectedEstablishmentFilter}
        updateStateDate={changeDate}
      />
      {coachWithPerformance ? (
        <>
          <CoachPerformanceSummaryHeader
            isCoach
            performances={
              filteredAssociatedCoachWithPerformance?.performance || {}
            }
          />
          {loading || performanceLoading ? <LinearProgress /> : null}
          <CoachPerformanceTabs
            asCoach
            hideRuleSetter
            coachWithPerformance={filteredAssociatedCoachWithPerformance}
            handlePdfExportation={handlePdfExportation}
            has_coach_access_to_compensation_downloading={
              has_coach_access_to_compensation_downloading
            }
            isMultiLocalizationEnabled={companyTheme?.enable_multi_localization}
          />
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
    ) as CoachwithPerformance,
    loading: state.coachPaymentRules.performance.loading,
    has_coach_access_to_compensation_downloading:
      state.theme.theme.has_coach_access_to_compensation_downloading,
    companyId: getTheme(state).company,
    companyTheme: getTheme(state),
    establishments: getAllEstablishments(state),
    establishmentsLoading: state.establishment.loading,
    establishmentGroupList: getAssociatedEstablishmentGroup(state),
    establishmentGroupListLoading:
      state.establishment.establishmentGroup.loading,
  }),
  {
    fetchCoachSessionPerformance: fetchCoachSessionPerformanceAction,
    fetchCoachPrivateServicePerformance:
      fetchCoachPrivateServicePerformanceAction,
    exportPdfPerformanceAction: exportPdfPerformance,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
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
