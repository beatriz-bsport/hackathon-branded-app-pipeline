import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithStyles, createStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import CoachPerformanceDateAndEstablishmentFilter from '#libs/coach-payment-rules/components/performance/filters/CoachPerformanceDateAndEstablishmentFilter.component';
import CoachPerformanceSummaryHeader from '#libs/coach-payment-rules/components/performance/CoachPerformanceSummaryHeader.component';
import CoachPerformanceTabs from '#libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import { withCoachPerformance } from '#libs/coach-payment-rules/selectors';
import {
  fetchCoachSessionPerformanceAction,
  fetchCoachPrivateServicePerformanceAction,
  exportPdfPerformance,
} from '#libs/coach-payment-rules/actions';
import withTitle from '#hocs/with-title.hoc';
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
  getEstablishmentGroupNames,
  getEstablishmentNames,
  getFilteredAssociatedCoachWithPerformance,
  getFilteredEstablishments,
  // @ts-expect-error
} from '#libs/coach-payment-rules/utils';
import { WithHandlerType } from '../../utils/types';
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';

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
  formDates: { dateStart: DateTime; dateEnd: DateTime };
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

  const handlePdfExport = React.useCallback(
    (associatedCoachId: number, dataToExport: number) =>
      handlePdfExportation(
        associatedCoachId,
        dataToExport,
        getFilteredEstablishments(
          selectedEstablishments,
          selectedLocations,
          establishmentGroupList,
        ),
        getEstablishmentGroupNames(establishmentGroupList, selectedLocations),
        getEstablishmentNames(establishments, selectedEstablishments),
      ),
    [
      establishmentGroupList,
      establishments,
      selectedEstablishments,
      selectedLocations,
      handlePdfExportation,
    ],
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
            filtersApplied={
              !!getFilteredEstablishments(
                selectedEstablishments,
                selectedLocations,
                establishmentGroupList,
              )?.length
            }
            handlePdfExportation={handlePdfExport}
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
      data: { dateStart: DateTime; dateEnd: DateTime },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;
      props.setFormDates({
        dateStart: dateStart.toUnixInteger(),
        dateEnd: dateEnd.toUnixInteger(),
      });
      props.setPerformanceLoading(true);
      const promises = [
        props.fetchCoachSessionPerformance(
          {
            associatedCoachId: props.coachWithPerformance.associated_coach_id,
            start_timestamp: dateStart.toUnixInteger(),
            end_timestamp: dateEnd.toUnixInteger(),
          },
          options,
        ),
        props.fetchCoachPrivateServicePerformance(
          {
            associatedCoachId: props.coachWithPerformance.associated_coach_id,
            start_timestamp: dateStart.toUnixInteger(),
            end_timestamp: dateEnd.toUnixInteger(),
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
      data: { dateStart: DateTime; dateEnd: DateTime },
      options: OptionCallback,
    ) => {
      const { dateStart, dateEnd } = data;

      setFormDates({
        dateStart: dateStart.toUnixInteger(),
        dateEnd: dateEnd.toUnixInteger(),
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
    (
      associatedCoachId: number,
      dataToExport: number,
      establishmentFilterIds: number[],
      establismentGroupFilterNames: string[],
      establishmentFilterNames: string[],
    ) => {
      const params = {
        start_timestamp: formDates.dateStart.valueOf(),
        end_timestamp: formDates.dateEnd.valueOf(),
        associated_coaches_in: [associatedCoachId],
        data_to_export: dataToExport,
        company_id: companyId,
        establishmentFilterIds,
        establismentGroupFilterNames,
        establishmentFilterNames,
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
