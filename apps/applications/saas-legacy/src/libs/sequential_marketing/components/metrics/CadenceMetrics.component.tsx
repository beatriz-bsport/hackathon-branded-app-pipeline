import React from 'react';
import { DateTime } from 'luxon';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import DateRangeSelector from '#src/components/date/DateRangeSelector.component';
import SwitchHorizontalIcon from '#src/components/icons/SwitchHorizontalIcon.component';

import type {
  Cadence,
  CadenceGlobalMetrics,
  CadenceMembersInData,
  CadenceMembersOutData,
  CadenceStep,
  MetricsPaginatedResponse,
} from '#src/libs/sequential_marketing/types';
import type { Member } from '#src/libs/member/types';
import CadenceMetricsMemberTable from './CadenceMetricsMemberTable';
import CadenceGlobalMetricsProgressList from './CadenceGlobalMetricsProgressList';
import CadenceGlobalMetricsCard, {
  CadenceMetricsVariant,
} from './CadenceGlobalMetricsCard';

type Props = {
  cadence?: Cadence;
  membersById: {
    [id: string]: Member<number, number>;
  };
  endDate: string;
  startDate: string;
  hasNotificationUpsell?: boolean;
  globalMetricsLoading?: boolean;
  membersHistoricLoading?: boolean;
  membersPresentLoading?: boolean;
  changeMembersHistoricPage: (cadenceId: number, page: number) => void;
  changePresentMembersPage: (cadenceId: number, page: number) => void;
  getCadenceStep: (stepId: number) => CadenceStep;
  getGlobalMetrics: (cadenceId: number) => CadenceGlobalMetrics;
  getMembersHistoric: (cadenceId: number) => {
    allData: MetricsPaginatedResponse<CadenceMembersOutData>;
    searchResult: MetricsPaginatedResponse<CadenceMembersOutData>;
  };
  getMembersPresent: (cadenceId: number) => {
    allData: MetricsPaginatedResponse<CadenceMembersInData>;
    searchResult: MetricsPaginatedResponse<CadenceMembersInData>;
  };
  goTagsPage: () => void;
  knowMoreOnNotifications: () => void;
  onOpen: (cadence: Cadence) => void;
  searchMembersHistoric: (
    cadenceId: number,
    text: string,
    page: number,
  ) => void;
  searchPresentMembers: (cadenceId: number, text: string, page: number) => void;
  updateFilterDates: (startDateFilter: string, endDateFilter: string) => void;
};

const CadenceMetrics: React.FC<Props> = ({
  cadence,
  endDate,
  membersById,
  startDate,
  hasNotificationUpsell,
  globalMetricsLoading,
  membersHistoricLoading,
  membersPresentLoading,
  changeMembersHistoricPage,
  changePresentMembersPage,
  getCadenceStep,
  getGlobalMetrics,
  getMembersHistoric,
  getMembersPresent,
  goTagsPage,
  knowMoreOnNotifications,
  onOpen,
  searchMembersHistoric,
  searchPresentMembers,
  updateFilterDates,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const [pagePresent, setPagePresent] = React.useState<number | null>(null);
  const [pageHistoric, setPageHistoric] = React.useState<number | null>(null);

  const [searchPresent, setSearchPresent] = React.useState('');
  const [searchHistoric, setSearchHistoric] = React.useState('');

  const handleOpen = React.useCallback(
    () => onOpen(cadence),
    [cadence, onOpen],
  );

  const handleSearchPresent = React.useCallback(
    (searchText: string) => {
      setSearchPresent(searchText);
      setPagePresent(1);
      searchText
        ? searchPresentMembers(cadence?.id, searchText, 1)
        : changePresentMembersPage(cadence?.id, 1);
    },
    [cadence?.id, changePresentMembersPage, searchPresentMembers],
  );

  const handleSearchHistoric = React.useCallback(
    (searchText: string) => {
      setSearchHistoric(searchText);
      setPageHistoric(1);
      searchText
        ? searchMembersHistoric(cadence?.id, searchText, 1)
        : changeMembersHistoricPage(cadence?.id, 1);
    },
    [cadence?.id, changeMembersHistoricPage, searchMembersHistoric],
  );

  const handleChangePresentMembersPage = React.useCallback(
    (page: number) => {
      setPagePresent(page);
      searchPresent
        ? searchPresentMembers(cadence?.id, searchPresent, page)
        : changePresentMembersPage(cadence?.id, page);
    },
    [
      cadence?.id,
      changePresentMembersPage,
      searchPresent,
      searchPresentMembers,
    ],
  );

  const handleChangeMembersHistoricPage = React.useCallback(
    (page: number) => {
      setPageHistoric(page);
      changeMembersHistoricPage(cadence?.id, page);
      searchHistoric
        ? searchMembersHistoric(cadence?.id, searchHistoric, page)
        : changeMembersHistoricPage(cadence?.id, page);
    },
    [
      cadence?.id,
      changeMembersHistoricPage,
      searchHistoric,
      searchMembersHistoric,
    ],
  );

  const globalMetrics = React.useMemo(
    () => getGlobalMetrics?.(cadence?.id),
    [cadence?.id, getGlobalMetrics],
  );

  const membersPresent = React.useMemo(() => {
    const present = getMembersPresent?.(cadence?.id);
    if (searchPresent) {
      return present.searchResult;
    }
    return present.allData;
  }, [cadence?.id, getMembersPresent, searchPresent]);

  const membersHistoric = React.useMemo(() => {
    const historic = getMembersHistoric?.(cadence?.id);
    if (searchHistoric) {
      return historic.searchResult;
    }
    return historic.allData;
  }, [cadence?.id, getMembersHistoric, searchHistoric]);

  const totalPagesPresentMembers = React.useMemo(
    () =>
      parseInt(
        (membersPresent?.count === 0
          ? 0
          : membersPresent?.count / membersPresent?.page_size +
            (membersPresent?.count % membersPresent?.page_size === 0 ? 0 : 1)
        ).toString(),
        10,
      ),
    [membersPresent?.count, membersPresent?.page_size],
  );

  const totalPagesMembersHistoric = React.useMemo(
    () =>
      parseInt(
        (membersHistoric?.count === 0
          ? 0
          : membersHistoric?.count / membersHistoric?.page_size +
            (membersHistoric?.count % membersHistoric?.page_size === 0 ? 0 : 1)
        ).toString(),
        10,
      ),
    [membersHistoric?.count, membersHistoric?.page_size],
  );

  React.useEffect(() => {
    setSearchPresent('');
    setSearchHistoric('');
  }, [cadence]);

  if (!cadence) return null;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.cadenceName}>
          <div className={classes.indexContainer}>
            <Typography color="primary" variant="h6">
              {cadence?.priority_index}
            </Typography>
          </div>
          <Typography noWrap className={classes.label} variant="h5">
            {cadence?.name}
          </Typography>
        </div>
        <Button
          className={classes.noWrapButton}
          color="primary"
          onClick={handleOpen}
          size="small"
          startIcon={<SwitchHorizontalIcon />}
          variant="contained"
        >
          {t('audience.workflowMetrics.openButton')}
        </Button>
      </div>
      <DateRangeSelector
        date_end={DateTime.fromISO(endDate).toUnixInteger()}
        date_start={DateTime.fromISO(startDate).toUnixInteger()}
        onSubmit={(values) => {
          updateFilterDates(
            values.dateStart.toISODate(),
            values.dateEnd.toISODate(),
          );
        }}
        timePeriod="custom"
      />
      {cadence?.has_disabled_finer_grained_items && (
        <Alert
          classes={{
            root: classes.alert,
          }}
          severity="error"
          variant="outlined"
        >
          {t('audience.workflow.finerGrainIssues')}
        </Alert>
      )}
      <div className={classes.metrics}>
        <div className={classes.members}>
          <CadenceGlobalMetricsCard
            count={globalMetrics?.count_members_that_entered}
            isLoading={globalMetricsLoading}
            variant={CadenceMetricsVariant.MEMBERS}
          />
        </div>
        <div className={classes.success}>
          <CadenceGlobalMetricsCard
            count={globalMetrics?.success_rate}
            isLoading={globalMetricsLoading}
            variant={CadenceMetricsVariant.SUCCESS}
          />
        </div>
        <div className={classes.time}>
          <CadenceGlobalMetricsCard
            count={globalMetrics?.average_success_time}
            isLoading={globalMetricsLoading}
            variant={CadenceMetricsVariant.AVERAGE_TIME}
          />
        </div>
        <div className={classes.tags}>
          <CadenceGlobalMetricsCard
            count={globalMetrics?.tags_count}
            handleTitleClick={goTagsPage}
            isLoading={globalMetricsLoading}
            variant={CadenceMetricsVariant.TAGS}
          />
        </div>
        <div className={classes.communications}>
          <CadenceGlobalMetricsProgressList
            emailCount={globalMetrics?.emails_count}
            hasNotificationUpsell={hasNotificationUpsell}
            isLoading={globalMetricsLoading}
            knowMoreOnNotifications={knowMoreOnNotifications}
            notificationCount={globalMetrics?.push_notif_count}
            smsCount={globalMetrics?.sms_count}
          />
        </div>
        <div className={classes.presentMembers}>
          <CadenceMetricsMemberTable
            getCadenceStep={getCadenceStep}
            loading={membersPresentLoading}
            membersById={membersById}
            membersInData={membersPresent?.results || []}
            page={pagePresent}
            searchText={searchPresent}
            setSearch={handleSearchPresent}
            totalMembers={membersPresent?.count || 0}
            totalPages={totalPagesPresentMembers}
            updatePageNumber={handleChangePresentMembersPage}
          />
        </div>
        <div className={classes.historic}>
          <CadenceMetricsMemberTable
            isHistoric
            getCadenceStep={getCadenceStep}
            loading={membersHistoricLoading}
            membersById={membersById}
            membersOutData={membersHistoric?.results || []}
            page={pageHistoric}
            searchText={searchHistoric}
            setSearch={handleSearchHistoric}
            totalMembers={membersHistoric?.count || 0}
            totalPages={totalPagesMembersHistoric}
            updatePageNumber={handleChangeMembersHistoricPage}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(7),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cadenceName: {
    display: 'flex',
    gap: theme.spacing(1),
    overflow: 'hidden',
    flex: 1,
  },
  label: {
    flex: 1,
  },
  indexContainer: {
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    verticalAlign: 'middle',
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.09).hex(),
  },
  noWrapButton: {
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(2),
  },
  metrics: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: `repeat(2, calc(50% - ${theme.spacing(1)}px))`,
    gridGap: theme.spacing(2),
  },
  members: {
    gridColumn: '1',
    gridRow: '1',
  },
  success: {
    gridColumn: '2',
    gridRow: '1',
  },
  time: {
    gridColumn: '1',
    gridRow: '2',
  },
  tags: {
    gridColumn: '2',
    gridRow: '2',
  },
  communications: {
    gridColumn: '1/3',
    gridRow: '3',
  },
  presentMembers: {
    gridColumn: '1/3',
    gridRow: '4',
  },
  historic: {
    gridColumn: '1/3',
    gridRow: '5',
  },
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(CadenceMetrics);
