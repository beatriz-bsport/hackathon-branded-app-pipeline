import React from 'react';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import { WithTranslation, useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '#components/Tooltip.component';
import { MaterialStyleType } from '../../../../utils/types';
import type { Coach } from '#libs/associated-coach/types';
import type {
  CoachPerformance,
  CoachPaymentRuleGroup,
  CoachPaymentRule,
} from '#libs/coach-payment-rules/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import CoachPerformanceTabs from '#libs/coach-payment-rules/components/performance/CoachPerformanceTabs.component';
import AllCoachPerformancePagination from '#libs/coach-payment-rules/components/performance/AllCoachPerformancePagination.component';

type CoachwithPerformance = Coach & {
  performanceLoading: boolean;
  performance: {
    [COACH_PERFORMANCE_FOR_SESSION]: Array<CoachPerformance>;
    [COACH_PERFORMANCE_FOR_APPOINTMENT]: Array<CoachPerformance>;
  };
};

interface HeadersProps {
  title: string;
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  colSpan?: number;
  className?: string;
}

type CoachPaymentRuleActions = {
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
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_group_id: number,
    associated_coach_id: number,
  ) => number;
  setCoachPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
  setCoachPrivatePaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
  setCoachWorkShopPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
    associated_coach_id: number,
  ) => void;
};

type CoachPaymentRuleObjects = {
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  coachPaymentRuleGroupsDict: { [groupId: number]: CoachPaymentRuleGroup };
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
};
export type CoachPerformanceTableRowProps = {
  previewMode?: boolean;
  coachWithPerformance: CoachwithPerformance;
} & CoachPaymentRuleObjects &
  CoachPaymentRuleActions;

export type CoachPerformanceTableRowState = {
  openCollapse: boolean;
};
export const CoachPerformanceTableRow = (
  props: CoachPerformanceTableRowProps,
) => {
  const {
    coachWithPerformance,
    coachPaymentRuleGroups,
    coachPaymentRuleGroupsDict,
    coachPaymentRulesByKind,
    setSessionCoachPaymentRule,
    updatePrivateBookingCoachPaymentRule,
    setCoachPaymentRule,
    setCoachPrivatePaymentRule,
    setCoachWorkShopPaymentRule,
    setCoachPaymentRuleGroup,
  } = props;
  const [openCollapse, setOpenCollapse] = React.useState<boolean>(false);
  const classes = useStyles();
  const nbSessions = coachWithPerformance.performance[
    COACH_PERFORMANCE_FOR_SESSION
  ]
    ? coachWithPerformance.performance[COACH_PERFORMANCE_FOR_SESSION].length
    : null;
  const nbPrivateServices = coachWithPerformance.performance[
    COACH_PERFORMANCE_FOR_APPOINTMENT
  ]
    ? coachWithPerformance.performance[COACH_PERFORMANCE_FOR_APPOINTMENT].length
    : null;
  const nbBookings = coachWithPerformance.performance[
    COACH_PERFORMANCE_FOR_SESSION
  ]
    ? coachWithPerformance.performance[COACH_PERFORMANCE_FOR_SESSION].reduce(
        (a, b) => a + (b.confirmed_bookings || 0),
        0,
      )
    : null;
  const nbPrivateServiceAttendants = coachWithPerformance.performance[
    COACH_PERFORMANCE_FOR_APPOINTMENT
  ]
    ? coachWithPerformance.performance[
        COACH_PERFORMANCE_FOR_APPOINTMENT
      ].reduce((a, b) => a + (b.confirmed_bookings || 0), 0)
    : null;
  const totalOnBookings = coachWithPerformance.performance[
    COACH_PERFORMANCE_FOR_SESSION
  ]
    ? coachWithPerformance.performance[COACH_PERFORMANCE_FOR_SESSION].reduce(
        (a, b) => a + (parseFloat(b.coach_total_payment) || 0),
        0,
      )
    : null;
  const totalOnPrivateServices = coachWithPerformance.performance[
    COACH_PERFORMANCE_FOR_APPOINTMENT
  ]
    ? coachWithPerformance.performance[
        COACH_PERFORMANCE_FOR_APPOINTMENT
      ].reduce((a, b) => a + (parseFloat(b.coach_total_payment) || 0), 0)
    : null;

  return (
    <>
      <TableRow>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenCollapse(!openCollapse)}
            disabled={props.previewMode}
          >
            {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{coachWithPerformance.name}</TableCell>
        <TableCell align="right" className={classes.sessionSection}>
          {nbSessions}
        </TableCell>
        <TableCell align="right" className={classes.sessionSection}>
          {nbBookings}
        </TableCell>
        <TableCell align="right" className={classes.sessionSection}>
          {totalOnBookings
            ? `${getCurrencyDisplayWithPrice(
                (totalOnBookings || 0).toFixed(2),
              )}`
            : '-'}
        </TableCell>
        <TableCell align="right">{nbPrivateServices}</TableCell>
        <TableCell align="right">{nbPrivateServiceAttendants}</TableCell>

        <TableCell align="right">
          {totalOnPrivateServices
            ? `${getCurrencyDisplayWithPrice(
                (totalOnPrivateServices || 0).toFixed(2),
              )}`
            : '-'}
        </TableCell>
        <TableCell align="right">
          {totalOnBookings || totalOnPrivateServices
            ? `${getCurrencyDisplayWithPrice(
                (
                  (totalOnBookings || 0) + (totalOnPrivateServices || 0)
                ).toFixed(2),
              )}`
            : '-'}
        </TableCell>
      </TableRow>
      <TableRow className={classes.root}>
        <TableCell className={classes.denseCell} />
        <TableCell className={classes.denseCell} colSpan={8}>
          <Collapse
            in={openCollapse && !props.previewMode}
            unmountOnExit
            timeout="auto"
          >
            <CoachPerformanceTabs
              coachWithPerformance={coachWithPerformance}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              setSessionCoachPaymentRule={setSessionCoachPaymentRule}
              updatePrivateBookingCoachPaymentRule={
                updatePrivateBookingCoachPaymentRule
              }
              setCoachPaymentRule={setCoachPaymentRule}
              setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
              setCoachWorkShopPaymentRule={setCoachWorkShopPaymentRule}
              coachPaymentRuleGroups={coachPaymentRuleGroups}
              coachPaymentRuleGroupsDict={coachPaymentRuleGroupsDict}
              setCoachPaymentRuleGroup={setCoachPaymentRuleGroup}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

type OwnProps = {
  associatedCoachWithPerformance: Array<CoachwithPerformance>;
  changePage: (page: number) => void;
  pagination: {
    page: number;
    count: number;
    next: number;
    previous: number;
  };
  loading: boolean;
  previewMode?: boolean;
  leavePreviewMode: () => void;
} & CoachPaymentRuleObjects &
  CoachPaymentRuleActions;
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof useStyles>> &
  WithTranslation;
export const CoachPerformanceTable = (props: Props) => {
  const {
    associatedCoachWithPerformance,
    coachPaymentRuleGroups,
    coachPaymentRuleGroupsDict,
    setSessionCoachPaymentRule,
    updatePrivateBookingCoachPaymentRule,
    setCoachPaymentRule,
    setCoachPrivatePaymentRule,
    setCoachWorkShopPaymentRule,
    setCoachPaymentRuleGroup,
  } = props;
  const { t } = useTranslation(['coachPerformance', 'coach', 'paymentRules']);
  const classes = useStyles();
  const tableHeaders: Array<HeadersProps> = [
    { title: '', align: 'center', colSpan: 1 },
    { title: '', align: 'center', colSpan: 1 },
    {
      title: t('paymentRules:tabs.session'),
      align: 'center',
      colSpan: 3,
    },
    {
      title: t('paymentRules:tabs.appointment'),
      align: 'center',
      colSpan: 3,
    },
    { title: '', align: 'center', colSpan: 1 },
  ];
  const tableSubHeaders: Array<HeadersProps> = [
    { title: '', align: 'left' },
    { title: t('coachPerformance:fields.coachName'), align: 'left' },
    { title: t('coachPerformance:fields.nb_sessions'), align: 'right' },
    { title: t('coachPerformance:fields.nb_bookings'), align: 'right' },
    { title: t('coachPerformance:fields.total_on_sessions'), align: 'right' },
    { title: t('coachPerformance:fields.nb_sessions'), align: 'right' },
    { title: t('coachPerformance:fields.nb_bookings'), align: 'right' },

    {
      title: t('coachPerformance:fields.total_on_appointments'),
      align: 'right',
    },
    {
      title: t('coachPerformance:fields.total'),
      align: 'right',
      className: classes.primarySubheader,
    },
  ];
  return (
    <TableContainer component={Paper}>
      {props.loading && <LinearProgress />}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={9}>
              <Collapse in={props.previewMode} unmountOnExit>
                <div className={classes.flexRow}>
                  <Typography variant="h6" color="primary">
                    {t('coachPerformance:cachedData.previewModeTitle')}
                  </Typography>
                  <Tooltip
                    title={t('coachPerformance:cachedData.leavePreviewMode')}
                  >
                    <IconButton onClick={() => props.leavePreviewMode()}>
                      <ExitToAppIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Collapse>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={9}>
              <AllCoachPerformancePagination
                pagination={props.pagination}
                changePage={props.changePage}
                loading={props.loading}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell colSpan={header.colSpan} align={header.align}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            {tableSubHeaders.map((header) => (
              <TableCell align={header.align} className={header.className}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {associatedCoachWithPerformance?.map((perf) => (
            <CoachPerformanceTableRow
              previewMode={props.previewMode}
              coachWithPerformance={perf}
              coachPaymentRulesByKind={props.coachPaymentRulesByKind}
              setSessionCoachPaymentRule={setSessionCoachPaymentRule}
              updatePrivateBookingCoachPaymentRule={
                updatePrivateBookingCoachPaymentRule
              }
              setCoachPaymentRule={setCoachPaymentRule}
              setCoachPrivatePaymentRule={setCoachPrivatePaymentRule}
              setCoachWorkShopPaymentRule={setCoachWorkShopPaymentRule}
              coachPaymentRuleGroups={coachPaymentRuleGroups}
              coachPaymentRuleGroupsDict={coachPaymentRuleGroupsDict}
              setCoachPaymentRuleGroup={setCoachPaymentRuleGroup}
            />
          ))}
        </TableBody>
      </Table>
      <TableRow>
        <AllCoachPerformancePagination
          pagination={props.pagination}
          changePage={props.changePage}
          loading={props.loading}
        />
      </TableRow>
    </TableContainer>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  denseCell: {
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: theme.palette.grey[100],
  },
  sessionSection: {
    backgroundColor: theme.palette.grey[50],
  },
  primarySubheader: {
    color: theme.palette.primary.main,
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
}));
export default CoachPerformanceTable;
