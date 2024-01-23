import React from 'react';
import moment from 'moment-timezone';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CadenceGlobalMetricsCard, {
  CadenceMetricsVariant,
} from './CadenceGlobalMetricsCard';
import CadenceGlobalMetricsProgressList from './CadenceGlobalMetricsProgressList';
import CadenceMetricsMemberTable from './CadenceMetricsMemberTable';
import DateRangeSelector from '#components/date/DateRangeSelector.component';
import SwitchHorizontalIcon from '#components/icons/SwitchHorizontalIcon.component';

import type {
  Cadence,
  CadenceGlobalMetrics,
  CadenceMembersInData,
  CadenceMembersOutData,
  CadenceStep,
  MetricsPaginatedResponse,
} from '#libs/sequential_marketing/types';
import type { Member } from '#libs/member/types';

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
  getMembersHistoric: (
    cadenceId: number,
  ) => MetricsPaginatedResponse<CadenceMembersOutData>;
  getMembersPresent: (
    cadenceId: number,
  ) => MetricsPaginatedResponse<CadenceMembersInData>;
  goTagsPage: () => void;
  knowMoreOnNotifications: () => void;
  onOpen: (cadence: Cadence) => void;
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
  updateFilterDates,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const [pagePresent, setPagePresent] = React.useState<number | null>(null);
  const [pageHistoric, setPageHistoric] = React.useState<number | null>(null);

  const handleOpen = React.useCallback(
    () => onOpen(cadence),
    [cadence, onOpen],
  );

  const handleChangePresentMembersPage = React.useCallback(
    (page: number) => {
      setPagePresent(page);
      changePresentMembersPage(cadence?.id, page);
    },
    [cadence?.id, changePresentMembersPage],
  );

  const handleChangeMembersHistoricPage = React.useCallback(
    (page: number) => {
      setPageHistoric(page);
      changeMembersHistoricPage(cadence?.id, page);
    },
    [cadence?.id, changeMembersHistoricPage],
  );

  const globalMetrics = React.useMemo(
    () => getGlobalMetrics?.(cadence?.id),
    [cadence?.id, getGlobalMetrics],
  );

  const membersPresent = React.useMemo(
    () => getMembersPresent?.(cadence?.id) ?? null,
    [cadence?.id, getMembersPresent],
  );

  const membersHistoric = React.useMemo(
    () => getMembersHistoric?.(cadence?.id) ?? null,
    [cadence?.id, getMembersHistoric],
  );

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
        date_end={moment(endDate).unix()}
        date_start={moment(startDate).unix()}
        onSubmit={(values) => {
          updateFilterDates(
            values.dateStart.format('YYYY-MM-DD'),
            values.dateEnd.format('YYYY-MM-DD'),
          );
        }}
        timePeriod="custom"
      />
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
        {!!membersPresent && (
          <div className={classes.presentMembers}>
            <CadenceMetricsMemberTable
              getCadenceStep={getCadenceStep}
              loading={membersPresentLoading}
              membersById={membersById}
              membersData={membersPresent.results}
              page={pagePresent}
              totalMembers={membersPresent.count}
              totalPages={totalPagesPresentMembers}
              updatePageNumber={handleChangePresentMembersPage}
            />
          </div>
        )}
        {!!membersHistoric && (
          <div className={classes.historic}>
            <CadenceMetricsMemberTable
              isHistoric
              getCadenceStep={getCadenceStep}
              loading={membersHistoricLoading}
              membersById={membersById}
              membersData={membersHistoric.results}
              page={pageHistoric}
              totalMembers={membersHistoric.count}
              totalPages={totalPagesMembersHistoric}
              updatePageNumber={handleChangeMembersHistoricPage}
            />
          </div>
        )}
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
}));

export default React.memo(CadenceMetrics);
